import express, { Request, Response } from 'express';
import routes from './lib/routers';
const app = express();

app.use('/api', [routes]);

app.get('/health', (req: Request, res: Response) => {
  const message = res.__('health');
  res.status(200).send({message: message})
});


export default app;


