import { body } from 'express-validator';

export const createProductValidator = [
  body('name', 'Invalid does not Empty').notEmpty().isLength({ min: 3, max: 100 }),
  body('description', 'Invalid does not Empty').notEmpty().isLength({ min: 3 }),
  body('stock', 'Invalid does not Empty').notEmpty().isNumeric().default(1).toInt(),
  body('price', 'Invalid does not Empty').notEmpty().isNumeric().toInt(),
  body('category', 'Invalid does not Empty').notEmpty(),
  body('variants', 'Invalid does not Empty').notEmpty().isArray({ min: 1 }),
];
