FROM node:20-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build

FROM node:20-alpine3.21 AS runner

WORKDIR /app

COPY --from=builder /app .

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
