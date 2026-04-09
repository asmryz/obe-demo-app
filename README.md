```sh
pg_dump -h localhost -U postgres -d postgres --create --clean --if-exists --inserts --rows-per-insert=1000 -f obe_full.sq
```
