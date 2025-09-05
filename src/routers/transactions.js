// src/routers/transactions.js

import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createTransactionSchema } from '../validation/transaction.js';
import { updateTransactionSchema } from '../validation/transaction.js';

import {
  getTransactionsController,
  getTransactionByIdController,
  createTransactionController,
  deleteTransactionController,
  patchTransactionController,
} from '../controllers/transactions.js';

const router = Router();

router.use(authenticate)

router.get('/', getTransactionsController);
//isValidId,
router.get('/:transactionId', getTransactionByIdController);

router.post('/', ctrlWrapper(createTransactionController));

router.delete(
  '/:transactionId',
  validateBody(createTransactionSchema),
  ctrlWrapper(deleteTransactionController),
);

router.patch(
  '/:transactionId',
  // isValidId,
  validateBody(updateTransactionSchema),
  ctrlWrapper(patchTransactionController),
);

export default router;
