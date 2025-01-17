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
        url: `http://localhost:${process.env.PORT}/`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;
