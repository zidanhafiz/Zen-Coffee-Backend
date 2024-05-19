import { Router } from 'express';
import products from '@/controllers/productController';

const router = Router();

router.route('/products').get(products.getAll);

export default router;
