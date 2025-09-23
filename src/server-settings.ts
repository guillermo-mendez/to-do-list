import express from 'express';
import {createServer} from 'http';
import cors from 'cors';
import compression from 'compression';
import logger from 'morgan';
import helmet from 'helmet';
import {config} from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import {errorHandlerMiddleware} from 'error-handler-express-ts';
import {testConnection} from './database/connection';
 import swaggerSpec from './docs/configuration';
import authentication from './middlewares/authentication'
import routers from './routers-version';


const app = express();
const httpServer = createServer(app);
config();

class ServerSettings {

  mountServer() {
    this.corsOrigin();
    this.settings();
    this.middlewares();
    this.testDatabaseConnection();
    this.docs();
  }

  private corsOrigin() {
    const corsOrigin: string = process.env.CORS_ORIGIN || '*';
    const corsOptions = {
      origin: [corsOrigin],
      methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 200
    };

     app.use(cors(corsOptions));
  };

  private settings() {

    app.use(compression());
    // Parse application/json request body
    app.use(express.json());

    // Parse application/x-www-form-urlencoded request body
    app.use(express.urlencoded({extended: false}));

    app.use(logger('dev'));

    // Parse application/json request body
    app.use(express.json({limit: '50mb'}));

    // Parse application/x-www-form-urlencoded request body
    app.use(express.urlencoded({limit: '50mb', extended: false, parameterLimit: 500000}));
  };

  private middlewares() {
    app.use(helmet()); // Helmet para seguridad
    app.use(authentication); // Middleware de autenticación
  }

  private docs() {
    app.use('/swagger-api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  };

  async testDatabaseConnection(): Promise<void> {
   // await testConnection();
    this.routes();
  };

  private routes() {
    const port = process.env.PORT || 3001;
    app.set('port', port);
    app.use('/', routers);
    console.log(`✔ rutas cargadas...`);
    app.use(errorHandlerMiddleware);
    httpServer.listen(port, () => {
      console.log(`Servidor Corriendo en http://localhost:${port}`);
      console.log(`Documentación swagger corriendo en http://localhost:${port}/swagger-api-docs/`);
    });
  };

}

export default new ServerSettings();


