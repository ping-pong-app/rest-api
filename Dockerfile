FROM node:alpine

# Install dependencies in separate layer
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install

RUN mkdir /app
WORKDIR /app

# Move installed dependencies to app directory
RUN cp -a /tmp/node_modules /app
# Copy executables to app directory
ADD . /app

ENV PORT=3000
ENV NODE_ENV=production
ENV APP_DB=ping-api
ENV APP_DB_HOST=localhost
ENV APP_DB_PORT=5432
ENV APP_DB_USER=postgres
ENV APP_DB_PASSWORD=postgres

ENV APP_AUTH_SERVER_URL=https://keycloak.mjamsek.com/auth
ENV APP_AUTH_REALM=ping-popng
ENV APP_AUTH_CLIENT_ID=ping-api
ENV APP_AUTH_CLIENT_SECRET=not_set

EXPOSE 3000

CMD ["node", "dist/server.js"]
