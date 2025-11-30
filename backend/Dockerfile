# Backend Dockerfile for CoilFlow
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY --from=builder /app/node_modules ./node_modules

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
CMD [ "node", "dist/main.js" ]

# Expose port
EXPOSE 3010

