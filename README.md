# Ping App REST API
[![Travis (.org)](https://img.shields.io/travis/ping-pong-app/rest-api)](https://travis-ci.org/github/ping-pong-app/rest-api)
> REST API for Ping App

## Usage

```bash
docker pull docker.mjamsek.com/ping-api:latest

docker run -d -p 3000:PORT \
-v /home/user/firebase-config.json:/config/firebase-credentials.json \
-e APP_LOG_LEVEL=info \
-e APP_SERVICE_VERSION=1.0.0-BETA \
-e APP_SERVICE_NAME=ping-api \
-e APP_SERVICE_ENV=stage \
--name ping-api \
ping-api:latest
```

## Cloud events

### Ping event

#### Ping send

Subscription on topic `PING.{groupId}`.

Message structure:
```json
{
    "pingId": "ping instance id",
    "username":  "username of pinger",
    "userId": "id of pinger",
    "groupId": "id of group being pinged",
    "groupName": "name of group being pinged"
}
```

#### Ping response

Subscription on topic `PING.REPLY.{groupId}`

Message structure:
```json
{
    "pingId": "ping instance id",
    "username":  "username of responder",
    "userId": "id of responded",
    "groupId": "id of group being pinged",
    "groupName": "name of group being pinged",
    "response": "user response (enum: PONG | REJECT)"
}
```


### Invite event

#### Invite send

Subscription on topic `INVITE.{userId}`

Message structure:
```json
{
    "invitationId": "invitation id",
    "groupId": "id of group being invited to",
    "groupName": "name of group being invited to"
}
```

#### Invite response

Subscription on topic `INVITE.GROUP.{groupId}`

Message structure:
```json
{
    "groupId": "id of group being invited to",
    "groupName": "name of group being invited to"
}
```
