# -----------------------------
# Build stage
# -----------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Angular app
RUN ng build --configuration production

# -----------------------------
# Production stage
# -----------------------------
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
