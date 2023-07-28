# Alternatives to Postgres

- Elastic:
    - Can't scale primary shards without complete re-index (index being database in postgres parlance)
        - Reason: The number of shards is configured at index creation time and can't be changed without re-sharding the entire index.
- DynamoDB:
    - Schema is not flexible: https://www.youtube.com/watch?v=HaEPXoXVf2k&t=1762s