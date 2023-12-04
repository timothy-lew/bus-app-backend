# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the .env file to the working directory
COPY .env ./

# Copy the entire application to the container
COPY . .

# Expose the port on which your application runs (if applicable)
EXPOSE 3000

# Command to run when the container starts locally
CMD ["npm", "run", "dev"]
