# FROM node:20-alpine3.21 AS builder

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build

# # Step 2: Serve using NGINX
# FROM nginx:alpine

# RUN rm /etc/nginx/conf.d/default.conf

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/out /usr/share/nginx/html



# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

# EXPOSE 80


# ENTRYPOINT ["/entrypoint.sh"]

# Use the official Node.js image


FROM node:20-alpine3.21

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install @stripe/stripe-js

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Build the Next.js application
RUN npm run build

# Expose the port used by Next.js
EXPOSE 3000

# Start the Next.js app in production
CMD ["npm", "start"]
