import { Router } from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';
import transactionsRouter from './transactions.js';
import summaryRouter from './summary.js';
import categoriesRouter from '../routers/categories.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/transactions', transactionsRouter);
router.use('/summary', summaryRouter);
router.use('/categories', categoriesRouter);

export default router;
