# Use official Node.js LTS base image
FROM node:18

# Set the working directory
WORKDIR /

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application source code
COPY . .

# Prisma generate (can also be done in postinstall)
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 5000

# Run migrations & start the server
CMD ["sh", "-c", "echo $DATABASE_URL && npx prisma migrate deploy && npm start"]
