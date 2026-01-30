# Use the official Node.js runtime as a parent image
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npx ng build --configuration=production

# Debug: Show what's in dist directory
RUN ls -la /app/dist/ || echo "No dist directory found"
RUN ls -la /app/ | grep dist || echo "No dist found in app root"

# Production stage
FROM nginx:alpine

# Copy built Angular app to nginx
COPY --from=build /app/dist/blogger-frontend /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
