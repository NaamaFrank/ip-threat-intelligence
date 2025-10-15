import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import intelRouter from './routes/intel.routes';

export function createApp() {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api', intelRouter);

  // inline 404
  app.use((_, res) => res.status(404).json({ error: 'not_found' }));

  // rely on Express default error handler (no custom middleware)
  return app;
}
