FROM node:14.15.3

ENV NODE_ENV=production

# set a directory for the app
WORKDIR /usr/src/app

# COPY ["package.json", "package-lock.json*", "./"]

# install dependencies
RUN npm install --production

# copy all the files to the container
COPY . .

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["node", "server.js"]
