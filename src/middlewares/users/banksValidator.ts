import { body, param } from 'express-validator';

export const bankIdParams = param('id').notEmpty().trim().escape();

export const createBankValidator = [
  body('bank').notEmpty().isString().trim(),
  body('name').notEmpty().isLength({ min: 3 }).isString().trim(),
  body('account').notEmpty().isLength({ min: 3 }).isString().trim(),
  body('userId').notEmpty().isLength({ min: 3 }).isString().trim(),
];
