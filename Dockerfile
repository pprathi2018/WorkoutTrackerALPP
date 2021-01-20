FROM node:latest

LABEL maintainer="pprathi2018@gmail.com"

RUN mkdir -p /usr/src/app

ARG mongodb_user

ARG mongodb_pass

WORKDIR /usr/src/app

ENV mongodb_user=$mongodb_user

ENV mongodb_pass=$mongodb_pass

COPY package.json /usr/src/app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
