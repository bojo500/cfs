# Frontend Dockerfile for CoilFlow
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build


# Production image with nginx
FROM node:20-alpine AS production

# Copy built files to nginx
COPY --from=builder /app/node_modules ./node_modules

# Copy nginx configuration
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
