# jiraclone/apis/Dockerfile

# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies first (caches this step)
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the port your Express server runs on
EXPOSE 5000

# Command to start the server
CMD ["node", "server.js"]