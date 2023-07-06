import pg from 'pg'
const { Pool } = pg

/**
 * @async
 * @callback setUp
 * @param {Pool} pool - Pool to be used for set up.
 */

/**
 * @async
 * @callback tearDown
 * @param {Pool} pool - Pool to be used for tear down.
 */

/**
 * Config definition for the benchmark.
 * @typedef {Object} BenchmarkConfig
 * @property {Pool} pool - Connection pool. Defined by the pg package.
 * @property {setUp} setUpFunction - Function to be executed once before the benchmark is run.
 * @property {tearDown} tearDownFunction - Function which runs after the execution function is done.
 * @property {boolean} shouldRunVacuum - If true, vacuum will be run before the test suite executes and after the setup function.
 * @property {number} executionTimeMS - Time interval for which the benchmarking function will be executed.
 * @property {executionFunction} executionFunction - Function which will be invoked in a loop until time expires. Users can compute their own metrics in this function.
 * @property {numWorkers} numWorkers - Number of concurrent workers which will execute the execution function. It probably doesn't make sense to allocate more workers than connections the pool allows.
*/


export class BenchmarkSuite {
    /**
     * 
     * @param {BenchmarkConfig} config 
     */
    constructor(config = {}) {
        if (config == null) {
            throw new Error("config cannot be null.")
        }

        this.pool = config.pool
        this.setUpFunction = config.setUpFunction ?? (pool => { })
        this.shouldRunVacuum = config.shouldRunVacuum ?? true
        this.executionTimeMS = config.executionTimeMS
        this.executionFunction = config.executionFunction
        this.numWorkers = config.numWorkers ?? 1
        this.tearDown = config.tearDownFunction ?? (pool => {})

        if (this.pool == null) {
            throw new Error("Pool must be supplied.")
        }

        if (this.executionTimeMS == null || this.executionTimeMS < 1) {
            throw new Error("Execution time must supplied and greater than 0.")
        }
    }

    async start() {
        await this.setUpFunction(this.pool)

        if (this.shouldRunVacuum) {
            await this.pool.query('VACUUM FULL;')
        }

        let shouldContinue = true
        setTimeout(() => {
            shouldContinue = false
        }, this.executionTimeMS);

        // Kicking off all the workers.
        let promises = []
        for (let i = 0; i < this.numWorkers; i++) {
            let looper = async () => {
                while(shouldContinue) {
                    await this.executionFunction(this.pool)
                }
            }

            promises.push(looper())
        }

        await Promise.all(promises)

        await this.tearDown(this.pool)
    }
}