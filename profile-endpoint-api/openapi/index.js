import swaggerUi from "swagger-ui-express";
import YAML  from "yamljs";

const swaggerDocument = YAML.load('./openapi/moti-profile.yml');
export {swaggerDocument, swaggerUi};