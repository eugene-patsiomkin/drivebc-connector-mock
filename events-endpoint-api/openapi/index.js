import swaggerUi from "swagger-ui-express";
import YAML  from "yamljs";

const swaggerDocument = YAML.load('./moti-events.yml');
export {swaggerDocument, swaggerUi};