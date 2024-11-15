# Frontend Dockerfile

# Use the official Node.js 20 image as the base image
FROM node:20

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# # Build the frontend
# RUN npm run build

# # Install serve to serve the build directory
# RUN npm install -g serve

# Expose the frontend port
# EXPOSE 3000:3000

# # Serve the build directory
# CMD ["serve", "-s", "build"]

# Start the application
CMD ["npm", "start"]
