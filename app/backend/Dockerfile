# This creates a docker image for the application's backend.
# 
# @file Dockerfile
# @author Carla da Silva Alves
FROM node:18.20.4

# Create app directory
WORKDIR /usr

# Install app dependencies
# A wildcard ("*") is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
# The first "." means local directory. For example in this case: "Dockerfile  node_modules  package.json  package-lock.json  server.js" (I can check this info using cmd "ls ."
# The second "." means where it will copy into. For example in this case: "/usr/src/node-api"
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./public ./public

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production



EXPOSE 8080

CMD [ "npm", "start" ]