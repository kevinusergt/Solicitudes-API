FROM node:20-alpine

WORKDIR /solicitudes-api/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV APP_PORT=3000

EXPOSE $APP_PORT


CMD ["npm", "run", "start:prod"]