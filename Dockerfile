FROM node:16.11

 RUN mkdir -p /usr/src/app

 WORKDIR /usr/src/app

 COPY package*.json ./

 RUN npm install

 COPY . .
 
 EXPOSE 5000

 CMD [ "npm", "run", "dev" ]