import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import helmet from 'helmet';

import productsRoute from '@/routes/productsRoute';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/products', productsRoute);

export default app;
