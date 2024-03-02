FROM node:alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the specific version of Node.js specified in package.json
RUN npm install node@20.11.1 --quiet

COPY . .

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200

CMD ["ng", "build", "--host", "0.0.0.0"]