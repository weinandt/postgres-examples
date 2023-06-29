# Benchmarker

A nodejs utility for custom benchmarking of postgres. Allows function registration for set-up and execution which allows for more customizeable benchmarking.

## Features
1. Registration of setup function
2. Optional vacuum post set up
3. Full control over the function executing against the db.
4. Concurrent workers executing the same function against the db.

## Simple Example
1. Have postgres running with default login: `docker-compose up`
    - Compose file can be found in the benchmarks folder.
2. `npm install`
3. `node simpleExample.js`

````javascript
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
````

A more complicated example involving batching and more workers can be found in `batchExample.js`
