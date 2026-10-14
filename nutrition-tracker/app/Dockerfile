# نخودچی — single container: builds the PWA and serves it with the API.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8787 DB_FILE=/data/nokhodchi.db STATIC_DIR=/app/dist
COPY --from=build /app/dist ./dist
COPY server ./server
COPY package.json ./
VOLUME /data
EXPOSE 8787
CMD ["node", "--disable-warning=ExperimentalWarning", "server/index.js"]
