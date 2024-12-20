# This creates a docker image for the application's frontend.
# 
# @file Dockerfile
# @author Carla da Silva Alves
FROM node:18.20.4 AS build

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
COPY ./public ./public
COPY ./tsconfig.json ./tsconfig.json
COPY ./src/global.d.ts ./src/global.d.ts
COPY ./.env.production.local ./.env.production.local
COPY ./.env.development.local ./.env.development.local

# Install app dependencies
RUN npm install

# Build the React app
RUN npm run build

# Stage 2: Serve the React app using nginx
FROM nginx:alpine

# Copy the build output to the nginx html directory
COPY --from=build /usr/build /usr/share/nginx/html

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]