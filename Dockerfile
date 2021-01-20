FROM node:latest

LABEL maintainer="pprathi2018@gmail.com"

RUN mkdir -p /usr/src/app

ARG mongodb_string

WORKDIR /usr/src/app

ENV mongodb_string=$mongodb_string

COPY package.json /usr/src/app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
