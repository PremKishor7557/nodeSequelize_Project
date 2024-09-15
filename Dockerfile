# Use an official Node.js runtime as a parent image
FROM node:14

# Install git (required for some npm packages that depend on git repos)
RUN apt-get update && apt-get install -y git

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Ensure environment variables are available
COPY .env .env

# Expose the port your application runs on (adjust if your app uses a different port)
EXPOSE 3000

# Start the app by running the 'bin/www' file
ENTRYPOINT ["node", "bin/www"]
