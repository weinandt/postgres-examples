# postgres-benchmarks
A set of benchmarking experiments in postgres.

## Start Postgres:
`docker-compose up`

## Bare-metal postgres installation for mac
This is usefull if you don't want the overhead of a VM.

1. Install the postgres.app: https://postgresapp.com/documentation/install.html
2. Start the app and initialize a server. A "postgres" named db should be created by default.

## Tuning Postgres
1. Copy alter system statements from: https://pgtune.leopard.in.ua/#/
2. `docker-compose up -d`
    - It is important to not use the `rm` flag as that will delete the config file after editing.
3. `docker exec -it postgres /bin/bash`
    - You are now in the container.
4. `su postgres`
5. `psql`
6. Paste the contents of all the alter system queries and run them.
7. Exit and restart the container so it can reload the settings.
8. New settings should be present.
    - Can be seen by: `select * from pg_settings where name = 'max_wal_size';`
