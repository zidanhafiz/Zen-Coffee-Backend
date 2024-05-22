import { body, query } from 'express-validator';

export const createProductsValidator = [
  body('name', 'Invalid does not Empty').notEmpty().isLength({ min: 3, max: 100 }),
  body('description', 'Invalid does not Empty').notEmpty().isLength({ min: 3 }),
  body('stock', 'Invalid does not Empty').notEmpty().isNumeric().default(1).toInt(),
  body('price', 'Invalid does not Empty').notEmpty().isNumeric().toInt(),
  body('category', 'Invalid does not Empty').notEmpty(),
  body('variants', 'Invalid does not Empty').notEmpty().isArray({ min: 1 }),
];

export const productsQueryValidator = [
  query('name').escape().trim(),
  query('category').escape().trim(),
  query('orderBy').escape().trim(),
  query('sort').escape().trim(),
];
