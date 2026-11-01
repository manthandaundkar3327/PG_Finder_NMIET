import express, { Express, Request, Response } from 'express';
import listingsRouter from './routes/listings.ts';
import authRouter from './routes/auth.ts';
import adminRouter from './routes/admin.ts';

const app: Express = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
app.use('/api/admin', adminRouter);

export default app;
