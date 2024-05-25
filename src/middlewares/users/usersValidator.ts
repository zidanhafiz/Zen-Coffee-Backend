import { body, param } from 'express-validator';

export const createUserValidator = [
  body('id', 'id is required')
    .notEmpty()
    .isLength({ min: 3, max: 255 })
    .isString()
    .trim()
    .escape(),
  body('firstName', 'First Name is required')
    .notEmpty()
    .isLength({ min: 3, max: 60 })
    .isString()
    .trim()
    .escape(),
  body('lastName', 'Last Name is required')
    .notEmpty()
    .isLength({ min: 3, max: 60 })
    .isString()
    .trim()
    .escape(),
  body('username', 'username is required')
    .notEmpty()
    .isLength({ min: 8, max: 60 })
    .isString()
    .trim()
    .escape(),
  body('email', 'email is required').notEmpty().isEmail().trim().escape(),
];

export const updateUserValidator = [
  param('id', 'user id is required').notEmpty().isString().trim().escape(),
  body('firstName', 'First Name is required')
    .notEmpty()
    .isLength({ min: 3, max: 60 })
    .isString()
    .trim()
    .escape(),
  body('lastName', 'Last Name is required')
    .notEmpty()
    .isLength({ min: 3, max: 60 })
    .isString()
    .trim()
    .escape(),
];

export const userIdParams = param('id', 'user id is required')
  .notEmpty()
  .isString()
  .trim()
  .escape();
