import pg from 'pg'
const { Pool } = pg
import { DatabaseManager } from './databaseManager.js'

const poolConfig = {
    connectionString: 'postgres://postgres:postgres@localhost:5432',
    max: 100,
    allowExitOnIdle: true,
}

const pool = new Pool(poolConfig)
const dbManager = new DatabaseManager(pool)
await dbManager.setUp()