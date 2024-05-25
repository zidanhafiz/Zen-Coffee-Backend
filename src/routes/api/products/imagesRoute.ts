import { imagesParamsValidator } from '@/middlewares/products/imagesValidator';
import { Router } from 'express';
import imagesController from '@/controllers/products/imagesController';

const router = Router();

router.route('/:productId/images').get(imagesParamsValidator, imagesController.getAll);

export default router;
