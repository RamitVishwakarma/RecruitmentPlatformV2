Recruitment Platform

## API Documentation

The API documentation is available through **Swagger UI**.  
You can access it by navigating to the following URL in your browser:

[http://localhost:5000/api-docs/](http://localhost:5000/api-docs/)

Use this interface to explore and test the API endpoints interactively.

Remove .example from .env.example and populate the env file

Run
`docker pull postgres
docker run --name local-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pwd -e POSTGRES_DB=dbname -p 5432:5432 -d postgres 
`

Change the db url to postgresql://user:pwd@localhost:5432/dbname
