FROM node:8

RUN apt-get update

RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN mkdir /app

WORKDIR /app

RUN chown -R node:node .

COPY package.json .

RUN npm i --silent

COPY src/ ./src

USER node

EXPOSE 3000

CMD ["npm", "start"]
