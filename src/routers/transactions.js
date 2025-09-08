// src/routers/transactions.js

import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateTransaction } from '../validation/transaction.js';

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

router.post(
  '/',
  validateBody(validateTransaction),
  ctrlWrapper(createTransactionController),
);

router.delete(
  '/:transactionId',
  ctrlWrapper(deleteTransactionController),
);

router.patch(
  '/:transactionId',
  validateBody(validateTransaction),
  ctrlWrapper(patchTransactionController),
);

export default router;
