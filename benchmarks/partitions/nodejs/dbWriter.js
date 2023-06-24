import { TDigest } from "tdigest"

export class DBWriter {
    constructor(pool) {
        this.pool = pool
        this.percentiles = new TDigest()
    }

    async write() {
        const jsonBlob = {
            "test": "mydata",
            value: 1
        }

        const startTime = Date.now()
        await this.pool.query('INSERT INTO serial_no_partitions (data) VALUES ($1)', [jsonBlob])
        const endTime = Date.now()

        this.percentiles.push(endTime - startTime)
    }

    async startWriting() {
        this.shouldStop = false

        while(!this.shouldStop) {
            await this.write()
        }
    }

    stopWriting() {
        this.shouldStop = true
    }

    report() {
        console.log(this.percentiles.summary())
    }
}