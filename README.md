# postgres-benchmarks
A set of benchmarking experiments in postgres.

# Pre-reqs
1. Have docker and docker-compose
1. Have psql installed

## Start Postgres:
`docker-compose up`

## To run scipts against the db:
1. `psql -U postgres -h localhost -f myscript.sql`
2. Use `postgres` as the password.
