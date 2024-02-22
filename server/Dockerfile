FROM node:alpine
WORKDIR /backend
COPY package.json package-lock.json .
RUN ["npm", "install", "--verbose"]
COPY . .
CMD ["node", "--env-file=./.env", "index.js"]
