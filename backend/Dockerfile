FROM node:16

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD [ "npm", "run", "dev" ]