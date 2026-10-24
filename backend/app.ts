import express, { Express, Request, Response } from 'express';
import listingsRouter from './routes/listings.ts';
import authRouter from './routes/auth.ts';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend API health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PG Finder NMIET Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/listings', listingsRouter);
app.use('/api/auth', authRouter);

export default app;
