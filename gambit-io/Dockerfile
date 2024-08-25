# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /srv/app

# install node deps
COPY --link ./package*.json .
RUN npm install

# copy over app files
COPY --link . .

# build ts
RUN npm run build

# start socket io app
CMD [ "npm", "run", "start" ]
