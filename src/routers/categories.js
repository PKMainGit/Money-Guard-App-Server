import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getCategoriesController } from '../controllers/categories.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getCategoriesController));

export default router;
