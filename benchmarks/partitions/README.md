# Partitions

Collection of benchmarking of paritions for timeseries data.

## Results
8 cores, 8 gigs of memory postgres container.

- No partitioning, no batching: 50th percentile: ~1900 rows / sec

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