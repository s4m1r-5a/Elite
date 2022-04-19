FROM node:16

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

ENV TZ=America/Bogota

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y tzdata

RUN npm install

# RUN npm install -g nodemon

COPY . .

CMD [ "npm", "start" ]