# Node.js image as the base image
FROM node:20.11.1-alpine as build

# working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Serve the Angular app using Nginx
FROM nginx:alpine

# Copy built Angular artifacts to NGINX default public directory
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]