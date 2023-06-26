import pg from 'pg'
const { Pool } = pg
import { DatabaseManager } from './databaseManager.js'
import { DBWriter } from './dbWriter.js'

const poolConfig = {
    connectionString: 'postgres://postgres:postgres@localhost:5432',
    max: 100,
    allowExitOnIdle: true,
}

const pool = new Pool(poolConfig)
const dbManager = new DatabaseManager(pool)
const dbWriter = new DBWriter(pool, 10000, 20)


await dbManager.setUp()
await dbManager.vacuum()


const startWritingPromise = dbWriter.startWriting()

setTimeout(async () => {
    dbWriter.stopWriting()
    await startWritingPromise
    dbWriter.report()
}, 20 * 1000)