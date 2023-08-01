```
docker run --name some-keydb -p 6379:6379 -d eqalpha/keydb:alpine_x86_64_v6.3.1 keydb-server /etc/keydb/keydb.conf --server-threads 4 --protected-mode no
```
