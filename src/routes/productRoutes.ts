import { Router } from 'express';
import products from '@/controllers/productController';
import { uploadImages } from '@/utils/multer';
import { createProductValidator } from '@/middlewares/productValidator';
import { idParamsValidator } from '@/middlewares/paramsValidator';

const router = Router();

router
  .route('/')
  .get(products.getAll)
  .post(uploadImages, createProductValidator, products.createOne);

router
  .route('/:id')
  .all(idParamsValidator)
  .get(products.getOneById)
  .delete(products.deleteOneById)
  .patch(uploadImages, createProductValidator, products.updateOneById);

export default router;
