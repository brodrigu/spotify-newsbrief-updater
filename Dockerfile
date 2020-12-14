FROM node:12 as base

WORKDIR /usr/src/app
ADD package.json ./
RUN npm install
ADD ./src /usr/src/app/src
ENTRYPOINT ["/bin/sh", "-c" , "exec npm start" ]