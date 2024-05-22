import { imagesParamsValidator } from '@/middlewares/products/imagesValidator';
import { Router } from 'express';
import images from '@/controllers/products/imagesController';

const router = Router();

router.route('/:productId/images').get(imagesParamsValidator, images.getAll);

export default router;
