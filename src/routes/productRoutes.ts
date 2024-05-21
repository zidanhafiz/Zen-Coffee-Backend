import { Router } from 'express';
import products from '@/controllers/productController';
import { uploadImages } from '@/utils/multer';
import { createProductValidator } from '@/middlewares/productValidator';

const router = Router();

router
  .route('/products')
  .get(products.getAll)
  .post(uploadImages, createProductValidator, products.createOne);

export default router;
