# Use Node.js 20.11.1 base image
FROM node:20.11.1-alpine

WORKDIR /app

# Install global dependencies
RUN npm install -g pnpm
RUN npm install -g @nestjs/cli

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN pnpm dlx prisma generate

# Set the working directory to the core app
WORKDIR /app/apps/core

EXPOSE 3000 


# Build the application
RUN pnpm build

# Command to start the application
CMD ["pnpm", "start:dev"]
