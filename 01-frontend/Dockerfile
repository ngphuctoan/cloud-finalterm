FROM node:24 AS builder
ARG VITE_BACKEND_URL
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
