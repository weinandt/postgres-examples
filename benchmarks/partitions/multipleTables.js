import pg from 'pg'
const { Pool } = pg
import { BenchmarkSuite } from 'benchmarker'

const setUpFunctionCreator = (tableName) => {
    return async (pool) => {
        await pool.query(`
            DROP TABLE IF EXISTS ${tableName};

            CREATE TABLE ${tableName} (
                id BIGSERIAL PRIMARY KEY,
                time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                data JSONB NOT NULL
            );
            
            CREATE INDEX idx_${tableName} ON ${tableName}(time);
    `)
    }
}

const tearDownFunctionCreator = (tableName) => {
    return async pool => {
        await pool.query(`DROP TABLE IF EXISTS ${tableName};`)
    }
}

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
const executionFuncitonCreator = (tableName, rowCounterObj) => {
    return async pool => {
        await pool.query(
            `INSERT INTO ${tableName} (data) SELECT * FROM UNNEST ($1::jsonb[])`,
            [
                batch,
            ]
        )

        rowCounterObj.counter += batch.length
    }
}

const benchmarkCreator = (pool, tableName) => {
    const rowCounterObj = { counter: 0 }
    const setUp = setUpFunctionCreator(tableName)
    const tearDown = tearDownFunctionCreator(tableName)
    const execution = executionFuncitonCreator(tableName, rowCounterObj)
    const executionTimeMS = 100 * 1000
    const numWorkers = 50
    const shouldRunVacuum = false

    return [
        new BenchmarkSuite({
            pool: pool,
            executionTimeMS,
            setUpFunction: setUp,
            shouldRunVacuum,
            executionFunction: execution,
            numWorkers,
            tearDownFunction: tearDown,
        }),
        rowCounterObj
    ]
}

const poolConfig = {
    connectionString: 'postgres://postgres:postgres@localhost:5432',
    allowExitOnIdle: true,
    max: 90
}
const pool = new Pool(poolConfig)
const numTables = 4

const benchmarkPromiseList = []
const rowCounterList = []
for (let i = 0; i < numTables; i++) {
    const [benchmark, rowCounter] = benchmarkCreator(pool, `table${i}`)
    benchmarkPromiseList.push(benchmark.start())
    rowCounterList.push(rowCounter)
}

await Promise.all(benchmarkPromiseList)

let totalRows = 0
for (let i = 0; i < numTables; i++) {
    const rowsInserted = rowCounterList[i].counter
    console.log(`rows inserted: ${rowsInserted.toLocaleString()}`)

    totalRows += rowsInserted
}

console.log(`total rows inserted: ${totalRows.toLocaleString()}`)