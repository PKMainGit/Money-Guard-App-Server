// src/routers/summary.js

import { Router } from 'express';
import { getSummaryController } from '../controllers/summary.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate)

router.get('/', getSummaryController);

export default router;