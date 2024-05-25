import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import helmet from 'helmet';

import usersRoute from '@/routes/api/users/usersRoute';
import banksRoute from '@/routes/api/users/banksRoute';
import productsRoute from '@/routes/api/products/productsRoute';
import productImagesRoute from '@/routes/api/products/imagesRoute';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// Products routes
app.use('/api/products', productsRoute);
app.use('/api/products', productImagesRoute);

// Users routes
app.use('/api/users', usersRoute);

// User's bank routes
app.use('/api/banks', banksRoute);

export default app;
