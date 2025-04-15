#!/bin/bash

# Generate the Prisma client
echo "Generating Prisma Client..."
npx prisma generate

# Build and start the containers
echo "Starting Docker containers..."
docker-compose up -d

# Wait for the migration to complete
echo "Waiting for database migrations..."
docker-compose logs -f migration

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo "Migration completed successfully!"
    echo "Deployment completed!"
else
    echo "Migration failed! Check the logs above for errors."
    exit 1
fi 