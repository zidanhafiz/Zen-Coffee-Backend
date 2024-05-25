import { Router } from 'express';
import productsController from '@/controllers/products/productsController';
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
  .get(productsQueryValidator, productsController.getAll)
  .post(uploadImages, createProductsValidator, productsController.createOne);

router
  .route('/:id')
  .all(idParamsValidator)
  .get(productsController.getOneById)
  .delete(productsController.deleteOneById)
  .patch(uploadImages, updateProductsValidator, productsController.updateOneById);

export default router;
