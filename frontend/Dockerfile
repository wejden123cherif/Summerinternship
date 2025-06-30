FROM node:20-alpine3.21 AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

# Step 2: Serve using NGINX
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

