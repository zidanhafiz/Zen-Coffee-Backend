import { param } from 'express-validator';

export const idParamsValidator = param('id').escape().trim().notEmpty();
