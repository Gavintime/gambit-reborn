# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /srv/app

# install node deps
# TODO: production?
COPY --link ./package*.json .
RUN npm install

# copy over socket app files
COPY --link . .

# build ts
RUN npm run build

# start api and socket io app
CMD [ "npm", "run", "dev" ]
