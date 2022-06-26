FROM node:18

COPY debian/sources.list /etc/apt/sources.list

RUN npm install -g nodemon
RUN apt-get update
RUN echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections
RUN apt-get install -y ttf-mscorefonts-installer
WORKDIR /dockerbot/code
COPY . /dockerbot
RUN npm install

CMD [ "nodemon", "app.js" ]
