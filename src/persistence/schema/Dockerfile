FROM postgres:12

RUN mkdir -p /docker-entrypoint-initdb.d
ADD setup.sql /docker-entrypoint-initdb.d
