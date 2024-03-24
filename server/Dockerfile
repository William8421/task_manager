# Node.js image as the base image
FROM node:latest

# working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Rebuild bcrypt inside Docker container
RUN npm rebuild bcrypt --build-from-source

# Expose port 8000
EXPOSE 8000

# Command to run the application
CMD ["npm", "run", "dev"]
