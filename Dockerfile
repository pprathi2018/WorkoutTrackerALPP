FROM node:latest

LABEL maintainer="pprathi2018@gmail.com"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]