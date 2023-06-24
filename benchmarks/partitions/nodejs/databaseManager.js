import fs from "node:fs"

export class DatabaseManager {
    constructor(dbPool) {
        this.dbPool = dbPool
    }

    async setUp(){
        const setUpSQL = fs.readFileSync('dbSetUp.sql').toString()
        await this.dbPool.query(setUpSQL)
    }
}