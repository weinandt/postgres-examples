# UUID vs BigSerial

Compares query performance between using UUID as primary key and big serial for pagination cases.

# Set Up
1. Run 'docker-compose up' from root of repository
2. Run `createDbAndTableSchemas.sql`
3. Run `populateTables.sql`

# Experiments
## Random Pagination
2 types of queries:
1. Using sql's OFFSET
1. Using a where clause and limit.

Each executed against a uuid table and a bigserial table.

#### Results
1. No noticable difference between uuid and big serial performance
1. OFFSET quries ran slower than using the where clause and hit many more rows.
    - This is most likely due to: https://use-the-index-luke.com/no-offset
