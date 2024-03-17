FROM --platform=linux/amd64 node:18.16.1-alpine AS base

FROM base AS install-pnpm

RUN npm install -g pnpm

COPY ./ /app

FROM install-pnpm AS customer-service-api

WORKDIR /app/apps/customer-service-api

RUN pnpm install

EXPOSE 3020

CMD ["pnpm", "run", "start:dev"]