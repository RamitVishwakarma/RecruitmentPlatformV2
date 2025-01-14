import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Slack-like Project API",
      version: "1.0.0",
      description: "API documentation for the Slack-like project",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["../controllers/**/*.js"],
  // apis: ['../routes/index,js', '../routes/**/*.js'],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
console.log(swaggerSpecs); // Add this line to inspect the specs

export default swaggerSpecs;
