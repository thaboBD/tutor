FROM node:latest

WORKDIR /app

RUN npm install -g sequelize-cli
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000