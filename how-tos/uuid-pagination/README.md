# How to Do Pagination with UUID as primary key

## To Run
1. `docker-compose up -d`
2. Exec into the postgres container so you can use psql:
    1. `docker exec -it postgres /bin/bash`
    2. `su postgres`
    3. `psql -f /sqlScripts/initializeAndPopulate.sql`
    4. Exit the exec session back to your normal shel.

