FROM node:8
MAINTAINER ivan.iovine@igd.fraunhofer.de

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm cache verify
RUN npm install
COPY . /usr/src/app
EXPOSE 4200
CMD ["npm","start"]