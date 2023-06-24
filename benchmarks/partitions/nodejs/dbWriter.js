export class DBWriter {
    constructor(pool) {
        this.pool = pool
    }

    async write() {
        const jsonBlob = {
            "test": "mydata",
            value: 1
        }

        await this.pool.query('INSERT INTO serial_no_partitions (data) VALUES ($1)', [jsonBlob])
    }
}