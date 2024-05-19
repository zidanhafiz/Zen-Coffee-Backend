import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import productsRoutes from '@/routes/productRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api', productsRoutes);

export default app;
