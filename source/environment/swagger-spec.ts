import swaggerJsDocs from "swagger-jsdoc";

const swaggerDefinition = {
  info: {
    title: "Manam Media Micro Service",
    version: "1.0.0",
    description: "All the APIs are listed here",
  },
  // basepath: "http://localhost:8000/",
};
const options = {
  swaggerDefinition,
  apis: ["./dist/source/api/routes/*.js"],
};
const swaggerSpec = swaggerJsDocs(options);

export default swaggerSpec;
