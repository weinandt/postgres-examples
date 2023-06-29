import pg from 'pg'
const { Pool } = pg
import { BenchmarkSuite } from './benchmarkSuite.js'

const setUpFunction = async (pool) => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS test (
            id BIGSERIAL PRIMARY KEY
        );
    `)
}

let numInsertions = 0
const executionFunction = async (pool) => {
    await pool.query(
        "INSERT INTO test DEFAULT VALUES;"
    )

    numInsertions++
}

const benchmarkSuite = new BenchmarkSuite({
    pool: new Pool({connectionString: 'postgres://postgres:postgres@localhost:5432', max: 10, allowExitOnIdle: true}),
    setUpFunction,
    executionFunction,
    executionTimeMS: 10 * 1000
})

await benchmarkSuite.start()

console.log(`Inserted ${numInsertions} rows`)