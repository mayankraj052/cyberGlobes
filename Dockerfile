# Stage 1: Install dependencies
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Copy the package files for caching dependency installation
COPY package*.json ./

# Install only the dependencies
RUN npm install

# Stage 2: Run the app in development mode
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy previously installed node_modules
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Remove cache and temporary files (reduces image size)
RUN rm -rf /tmp/* ~/.npm 

# Expose the development port
EXPOSE 3000

# Add default development command
CMD ["npm", "run", "dev_docker"]