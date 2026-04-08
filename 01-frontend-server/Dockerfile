FROM node:latest AS build
WORKDIR /miniws-blog
RUN npm install -g pnpm@latest-10
COPY ./miniws-blog/package.json ./miniws-blog/pnpm-lock.yaml ./miniws-blog/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY ./miniws-blog .
RUN pnpm build

FROM nginx:stable-alpine
COPY --from=build /miniws-blog/out /var/www/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
