FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY src/methods/telegram.js ./node_modules/node-telegram-bot-api/src/telegram.js
COPY . /usr/src/app
