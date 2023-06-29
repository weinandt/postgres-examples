# Benchmarker

A nodejs utility for custom benchmarking of postgres. Allows function registration for set-up and execution which allows for more customizeable benchmarking.

## Set Up
1. Have postgres running with default login: `docker-compose up`
    - Compose file can be found in the benchmarks folder.
2. `npm install`
3. `node index.js`

## TODO
- Try restarting postgres in a container after config updates have been applied.
- Document how to performance configure postgres.