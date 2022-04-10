FROM node:16.11

 RUN mkdir -p /app

 WORKDIR /app

 COPY package*.json ./

 RUN npm install

 COPY . .

 CMD [ "npm", "run", "dev" ]