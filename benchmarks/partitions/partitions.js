import pg from 'pg'
const { Pool } = pg
import { BenchmarkSuite } from 'benchmarker'

// Set up functions
const setUpNoPartitions = async (pool) => {
    await pool.query(`
        DROP TABLE IF EXISTS serial_no_partitions;

        CREATE TABLE serial_no_partitions (
            id BIGSERIAL PRIMARY KEY,
            time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            data JSONB NOT NULL
        );
        
        CREATE INDEX idx_serial_no_partitions_time ON serial_no_partitions(time);
    `)
}

const numPartitions = 4
const lastPartitionYear = new Date().getFullYear()
const setUpPartitions = async (pool) => {
    await pool.query(`
        DROP TABLE IF EXISTS serial_partitions;

        CREATE TABLE serial_partitions (
            id BIGSERIAL NOT NULL,
            time TIMESTAMPTZ NOT NULL,
            data JSONB NOT NULL,
            PRIMARY KEY(id, time)
        ) PARTITION BY RANGE (time);
        
        CREATE INDEX idx_serial_partitions_time ON serial_partitions(time);
    `)

    for(let i = 0; i < numPartitions; i++) {
        const curYear = lastPartitionYear - i
        await pool.query(`
            CREATE TABLE serial_partitions_${curYear} PARTITION OF serial_partitions
            FOR VALUES FROM ('${curYear}-01-01') TO ('${curYear + 1}-01-01');
        `)
    }
}

let numInsertionsNoPartitions = 0

// Statically allocating the batch, so it is only allocated once.
const batchSize = 100
const batch = []
const jsonBlob = {
    "test": "exampleString",
    value: 1
}
for (let i = 0; i < batchSize; i++) {
    batch.push(jsonBlob)
}
const executionFunctionNoPartitions = async (pool) => {
    await pool.query(
        "INSERT INTO serial_no_partitions (data) SELECT * FROM UNNEST ($1::jsonb[])",
        [
            batch,
        ]
    )

    numInsertionsNoPartitions += batch.length
}

let numInsertionsWithPartitions = 0
const executionFunctionPartitions = async (pool) => {
    let promises = []
    for(let i = 0; i < numPartitions; i++) {
        const curYear = lastPartitionYear - i
        const dateArray = new Array(batchSize).fill(`${curYear}-01-01`, 0, batchSize)
        const newQueryPromise = pool.query(
        "INSERT INTO serial_partitions (time, data) SELECT time,data FROM UNNEST ($1::timestamptz[], $2::jsonb[]) AS asdf(time, data)",
        [
            dateArray,
            batch,
        ])

        promises.push(newQueryPromise)

        numInsertionsWithPartitions += batch.length
    }

    await Promise.all(promises)
}

const executionTimeMS = 100 * 1000
const numWorkers = 50
const shouldRunVacuum = true
const poolConfig = {
    connectionString: 'postgres://postgres:postgres@localhost:5432',
    allowExitOnIdle: true,
    max: 500
}
const pool = new Pool(poolConfig)
const noPartitionsBenchmark = new BenchmarkSuite({
    pool: pool,
    executionTimeMS,
    setUpFunction: setUpNoPartitions,
    shouldRunVacuum,
    executionFunction: executionFunctionNoPartitions,
    numWorkers,
})
const partitionsBenchmark = new BenchmarkSuite({
    pool: pool,
    executionTimeMS,
    setUpFunction: setUpPartitions,
    shouldRunVacuum,
    executionFunction: executionFunctionPartitions,
    numWorkers,
})

await partitionsBenchmark.start()
await noPartitionsBenchmark.start()

console.log(`No partitions inserted ${numInsertionsNoPartitions.toLocaleString()} rows`)
console.log(`Partitions inserted ${numInsertionsWithPartitions.toLocaleString()} rows`)
