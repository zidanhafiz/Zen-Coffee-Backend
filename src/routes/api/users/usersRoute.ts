import { Router } from 'express';
import usersController from '@/controllers/users/usersController';
import {
  createUserValidator,
  updateUserValidator,
  userIdParams,
} from '@/middlewares/users/usersValidator';
import { updateUserEmailValidator } from '@/middlewares/users/emailValidator';

const router = Router();

router
  .route('/')
  .get(usersController.getAll)
  .post(createUserValidator, usersController.createOne);

router
  .route('/:id')
  .get(userIdParams, usersController.getOneById)
  .patch(updateUserValidator, usersController.updateOneFullName)
  .delete(userIdParams, usersController.deleteOneById);

router
  .route('/:id/email')
  .patch(updateUserEmailValidator, usersController.updateOneEmail);

export default router;
