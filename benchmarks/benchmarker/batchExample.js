import pg from 'pg'
const { Pool } = pg
import { BenchmarkSuite } from './benchmarkSuite.js'

const setUpFunction = async (pool) => {
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

let numInsertions = 0

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
const executionFunction = async (pool) => {
    await pool.query(
        "INSERT INTO serial_no_partitions (data) SELECT * FROM UNNEST ($1::jsonb[])",
        [
            batch,
        ]
    )

    numInsertions += batch.length
}

const poolConfig = {
    connectionString: 'postgres://postgres:postgres@localhost:5432',
    max: 100,
    allowExitOnIdle: true,
}
const pool = new Pool(poolConfig)
const benchmark = new BenchmarkSuite({
    pool: pool,
    executionTimeMS: 10 * 1000,
    setUpFunction,
    shouldRunVacuum: true,
    executionFunction,
    numWorkers: 50,
})

await benchmark.start()

console.log(`Inserted ${numInsertions} rows`)
