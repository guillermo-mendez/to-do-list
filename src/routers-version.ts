import express, { Request, Response } from 'express';
import routes from './lib/routers';
import path from 'path';
const app = express();

app.use('/api', [routes]);
app.use('/api/archivos', express.static(path.join(__dirname, '../../archivos')));

app.get('/health', (req: Request, res: Response) => {
  const message = res.__('health');
  res.status(200).send({message: message})
});


export default app;


