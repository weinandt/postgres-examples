\c test_db

INSERT INTO users_uuid(name, unix_time)
SELECT 'testName', generated_time
FROM generate_series(1,10000000) generated_time;

INSERT INTO users_bigserial(name, unix_time)
SELECT 'testName', generated_time
FROM generate_series(1,10000000) generated_time;