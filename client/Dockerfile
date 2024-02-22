FROM node:alpine as builder
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install --verbose
COPY . .
RUN npm run build --verbose

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

