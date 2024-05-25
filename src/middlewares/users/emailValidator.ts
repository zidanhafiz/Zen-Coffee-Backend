import { body, param } from 'express-validator';

export const updateUserEmailValidator = [
  param('id', 'user id is required').notEmpty().isString().trim().escape(),
  body('email', 'email is required').notEmpty().isEmail().trim().escape(),
]