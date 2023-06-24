import { TDigest } from "tdigest"

export class DBWriter {
    constructor(pool, batchSize = 100) {
        this.pool = pool
        this.percentiles = new TDigest()

        // Statically allocating the batch, so it is only allocated once.
        this.batch = []
        const jsonBlob = {
            "test": "mydata",
            value: 1
        }
        for (let i = 0; i < batchSize; i++) {
            this.batch.push(jsonBlob)
        }
    }

    async writeSingle() {
        const startTime = Date.now()
        await this.pool.query('INSERT INTO serial_no_partitions (data) VALUES ($1)', [this.batch[0]])
        const endTime = Date.now()

        this.percentiles.push(endTime - startTime)
    }

    async writeBatch() {

    }

    async startWriting() {
        this.shouldStop = false

        while(!this.shouldStop) {
            await this.writeSingle()
        }
    }

    stopWriting() {
        this.shouldStop = true
    }

    report() {
        console.log(this.percentiles.summary())
    }
}