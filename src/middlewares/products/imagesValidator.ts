import { param } from 'express-validator';
export const imagesParamsValidator = [
  param('productId').escape().trim(),
  param('imageId').escape().trim().optional(),
];
