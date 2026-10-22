import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import taskRoutes from './modules/tasks/tasks.routes.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/tasks', taskRoutes);

// These two must stay last: anything not matched above lands here
app.use(notFound);
app.use(errorHandler);