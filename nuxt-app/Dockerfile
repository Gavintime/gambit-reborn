# syntax=docker/dockerfile:1

FROM node:20.5.1-alpine

WORKDIR /srv/app

# install node deps
COPY --link ./package.json package.json
COPY --link ./package-lock.json package-lock.json
RUN npm install

# copy over web app files
COPY --link . .

# start nuxt in dev mode
CMD [ "npm", "run", "dev", "--", "-o", "--host" ]
