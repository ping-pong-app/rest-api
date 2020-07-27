FROM node:alpine

# Install dependencies in separate layer
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install

RUN mkdir /app
RUN mkdir /config
WORKDIR /app

# Move installed dependencies to app directory
RUN cp -a /tmp/node_modules /app
# Copy executables to app directory
ADD . /app

ENV PORT=3000
ENV NODE_ENV=production

ENV APP_LOG_LEVEL=info
ENV APP_SERVICE_VERSION="1.0.0-SNAPSHOT"
ENV APP_SERVICE_NAME=ping-api
ENV APP_SERVICE_ENV=stage

ENV GOOGLE_APPLICATION_CREDENTIALS=/config/firebase-credentials.json

EXPOSE 3000

CMD ["node", "dist/server.js"]
