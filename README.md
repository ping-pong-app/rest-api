# Ping App REST API
![Travis (.org)](https://img.shields.io/travis/ping-pong-app/rest-api)
> REST API for Ping App

## Usage

```bash
docker pull docker.mjamsek.com/ping-api:latest

docker run -d -p 3000:PORT \
-v /home/user/firebase-config.json:/config/firebase-credentials.json \
-e APP_SERVICE_VERSION=1.0.0-BETA \
-e APP_SERVICE_NAME=ping-api \
-e APP_SERVICE_ENV=stage \
--name ping-api \
ping-api:latest
```
