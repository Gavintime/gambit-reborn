# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /srv/app

# copy prisma schema, needed before dep install
COPY ./prisma .

# install node deps
COPY --link ./package*.json .
RUN npm install

# copy over app files
COPY --link . .

# build ts
RUN npm run build

# start api and socket io app
CMD [ "npm", "run", "start" ]
