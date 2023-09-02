# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /srv/app

CMD [ "npm", "run", "dev", "--", "-o", "--host" ]
