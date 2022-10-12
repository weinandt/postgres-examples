\c test_db

INSERT INTO users_uuid(name)
SELECT 'testName' 
FROM generate_series(1,10000000);

INSERT INTO users_bigserial(name)
SELECT 'testName' 
FROM generate_series(1,10000000);