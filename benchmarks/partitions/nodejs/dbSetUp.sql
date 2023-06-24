
DROP TABLE IF EXISTS serial_no_partitions;

CREATE TABLE serial_no_partitions (
  id BIGSERIAL PRIMARY KEY,
  time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data JSONB NOT NULL
);

CREATE INDEX idx_serial_no_partitions_time ON serial_no_partitions(time);
