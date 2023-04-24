CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL DEFAULT substr(md5(random()::text), 0, 25), /* Generates a radom string */
    created_time timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
    CONSTRAINT user_pk PRIMARY KEY (id)
);

/*
Inserting 100 rows using defaults for all..
*/
INSERT INTO users
SELECT FROM generate_series(1,100);

/*
Making sure not ever time is the same
*/
SELECT pg_sleep(2);

/*
Inserting 100 rows using defaults for all..
*/
INSERT INTO users
SELECT FROM generate_series(1,100);
