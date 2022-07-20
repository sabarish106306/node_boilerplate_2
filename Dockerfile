FROM node:14.17.0-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./


RUN yarn

COPY source ./source
COPY gulpfile.ts ./gulpfile.ts
COPY server.ts ./server.ts
COPY tsconfig.json ./

RUN yarn build

EXPOSE 8000
CMD ["node",  "/app/dist/server.js"]
