import { TDigest } from "tdigest"
import format from "pg-format"

export class DBWriter {
    constructor(pool, batchSize = 1) {
        this.pool = pool
        this.percentiles = new TDigest()
        this.numInsertions = 0

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

    async writeBatch() {
        const startTime = Date.now()
        await this.pool.query(
            "INSERT INTO serial_no_partitions (data) SELECT * FROM UNNEST ($1::jsonb[])",
            [
                this.batch,
            ]
        )
        const endTime = Date.now()

        this.percentiles.push(endTime - startTime)
        this.numInsertions += this.batch.length
    }

    async startWriting() {
        this.shouldStop = false

        while(!this.shouldStop) {
            await this.writeBatch()
        }
    }

    stopWriting() {
        this.shouldStop = true
    }

    report() {
        const median = this.percentiles.percentile(.5)
        console.log(`Inserted: ${this.numInsertions}`)
        console.log(`Median inserts per second: ${( 1000.0 / median) * this.batch.length}`)
    }
}