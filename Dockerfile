# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /srv/app

# install node deps
COPY --link ./nuxt-app/package.json package.json
COPY --link ./nuxt-app/package-lock.json package-lock.json
RUN npm install

# copy over web app files
COPY --link ./nuxt-app .

# start nuxt in dev mode
CMD [ "npm", "run", "dev", "--", "-o", "--host" ]
