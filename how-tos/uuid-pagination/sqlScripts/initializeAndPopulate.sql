CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL DEFAULT substr(md5(random()::text), 0, 25), /* Generates a radom string */
    created_time timestamptz NOT NULL DEFAULT (now() at time zone 'utc'),
    CONSTRAINT user_pk PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS created_time_desc_idx ON users (created_time, id DESC NULLS LAST);

/*
Inserting rows spaced out over time.
*/
INSERT INTO users (created_time)
SELECT * from generate_series(
	'2000-01-01','2021-01-20', 
    INTERVAL '1 hour 25 minutes'
);

/*
Proving overlap can be handled by inserting same times
*/
INSERT INTO users (created_time)
SELECT * from generate_series(
	'2000-01-01','2021-01-20', 
    INTERVAL '1 hour 25 minutes'
);

