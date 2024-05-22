import { Router } from 'express';
import products from '@/controllers/products/productsController';
import { uploadImages } from '@/utils/multer';
import {
  createProductsValidator,
  productsQueryValidator,
  updateProductsValidator,
} from '@/middlewares/products/productsValidator';
import { idParamsValidator } from '@/middlewares/paramsValidator';

const router = Router();

router
  .route('/')
  .get(productsQueryValidator, products.getAll)
  .post(uploadImages, createProductsValidator, products.createOne);

router
  .route('/:id')
  .all(idParamsValidator)
  .get(products.getOneById)
  .delete(products.deleteOneById)
  .patch(uploadImages, updateProductsValidator, products.updateOneById);

export default router;