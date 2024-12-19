# Use the official Alpine Linux base image
FROM alpine:latest

# Install basic dependencies
RUN apk update && apk add --no-cache \
    curl \
    bash \
    build-base \
    linux-headers

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Install GCC (for C++ development)
RUN apk add --no-cache g++

# Install OpenJDK (Java)
RUN apk add --no-cache openjdk11

# Verify installations (optional)
RUN node -v
RUN npm -v
RUN python3 --version
RUN g++ --version
RUN java -version

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if applicable
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the source code into the container
COPY src/ ./src/

# Copy tsconfig.json
COPY tsconfig.json ./

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the necessary port (if your application requires it)
EXPOSE 3000
CMD ["sh", "-c", "export REDIS_URL=redis://host.docker.internal:6379 && export BACKEND_URL=http://host.docker.internal:3000 && if [ \"$NODE_ENV\" = \"production\" ]; then node dist/index.js; else npm run dev; fi"]
