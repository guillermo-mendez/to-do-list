import * as path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition= {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nodejs-ts template API',
      description: 'Template para nodejs con typescript API',
      version: '1.0.0'
    }
  },
  apis: [`${path.join(__dirname, '../docs/swagger/**/*.yaml')}`],
}


export default swaggerJSDoc(swaggerDefinition);
