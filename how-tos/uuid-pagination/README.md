# How to Do Pagination with UUID as primary key

## To Run
1. `docker-compose up -d`
2. Exec into the postgres container so you can use psql:
    1. `docker exec -it postgres /bin/bash`
    2. `su postgres`
    3. `psql -f /sqlScripts/initializeAndPopulate.sql`
    4. Exit the exec session back to your normal shell.
3. `npm install`
4. `node main.js`

## How it works
- Primariy key is a uuid
- Index is a composite index on created_time, id.
- Finding next rows uses a postgres row constructor: https://www.postgresql.org/docs/current/sql-expressions.html#SQL-SYNTAX-ROW-CONSTRUCTORS
    - This handles the case where the created_time of one record matches another record.
        - Works the same way as "Comparators" in many languages.

