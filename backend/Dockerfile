FROM node:18

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

CMD ["nodemon", "server.js"]

EXPOSE 5000
