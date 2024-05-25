import { bankIdParams, createBankValidator } from '@/middlewares/users/banksValidator';
import { Router } from 'express';
import bankController from '@/controllers/users/banksController';

const router = Router();

router
  .route('/')
  .get(bankController.getAll)
  .post(createBankValidator, bankController.createOne);

router
  .route('/:id')
  .all(bankIdParams)
  .get(bankController.getOneById)
  .delete(bankController.deleteOneById);

export default router;
