# Partitions

Collection of benchmarking of paritions for timeseries data.

## Results
8 cores, 8 gigs of memory postgres container.

- No partitioning, no batching: ~1900 rows / sec
- No partitioning, batch size of 10,000, 20 concurrent writers 50th percentile: ~500,000 rows /sec

## Resources
- AWS Article about partitioning timeseries: https://aws.amazon.com/blogs/database/designing-high-performance-time-series-data-tables-on-amazon-rds-for-postgresql/
- AWS Docs about pg_partman and pg_cron: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL_Partitions.html#PostgreSQL_Partitions.pg_partman

## Set-Up

### Start Postgres Server
1. `cd benchmarks`
2. `docker-compose up`

### Run Test Client (in different terminal)
1. `cd nodejs`
2. `npm install`
3. `node index.js`

# TODO
- Make sure postgres container has enough memory/disk/cpu
- Add cancellation object to startWriting and stopWriting commands
- Fix "checkpoints occuring too frequently" issue set max_wal_size.
    - Add instructions for tuning postgres.
- Move nodejs load test to different folder and make it more generic.
- See if jsdoc as auto completion in vscode
- Try restarting postgres in a container after config updates have been applied.
- Add optional args to method signatures.