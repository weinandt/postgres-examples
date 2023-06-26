export class DBWriter {
    constructor(pool, batchSize = 1, writerCount = 1) {
        this.pool = pool
        this.numInsertions = 0
        this.writerCount = writerCount

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

        this.numInsertions += this.batch.length
    }

    async startWriting() {
        this.shouldStop = false
        this.startTime = Date.now()

        let promises = []
        for (let i = 0; i < this.writerCount; i++) {
            const looper = async () => {
                while(!this.shouldStop) {
                    await this.writeBatch()
                }
            }

            promises.push(looper())
        }
        
        await Promise.all(promises)
    }

    stopWriting() {
        this.shouldStop = true
    }

    report() {
        this.timeTaken = Date.now() - this.startTime
        console.log(`Inserted: ${this.numInsertions}`)
        console.log(`Average insertions rate per second: ${this.numInsertions / (this.timeTaken / 1000.0)}`)
    }
}