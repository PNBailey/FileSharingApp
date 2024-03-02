FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g @angular/cli

RUN npm install

RUN npm install node@20.11.1

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]