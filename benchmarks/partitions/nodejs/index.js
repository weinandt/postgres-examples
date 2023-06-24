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
const dbWriter = new DBWriter(pool, 10000)


await dbManager.setUp()
await dbManager.vacuum()


dbWriter.startWriting()

setTimeout(() => {
    dbWriter.stopWriting()
    dbWriter.report()
}, 10 * 1000)