
DROP TABLE IF EXISTS serial_no_partitions;

CREATE TABLE serial_no_partitions (
  id BIGSERIAL PRIMARY KEY,
  time TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL
);