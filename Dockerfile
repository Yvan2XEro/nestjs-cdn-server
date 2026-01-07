# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
WORKDIR /app
RUN corepack enable

# Install all deps (including dev) to build the app
FROM base AS build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production image that bundles only runtime deps and built sources
FROM base AS production
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
