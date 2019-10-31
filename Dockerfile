FROM node:10-alpine
RUN apk add yarn
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "yarn", "start" ]
