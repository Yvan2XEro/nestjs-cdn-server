# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
WORKDIR /app

# Install all deps (including dev) to build the app
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image that bundles only runtime deps and built sources
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
