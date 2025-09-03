import { Router } from 'express';
import { upload } from '../middlewares/multer.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getCurrentUserController,
  addUserAvatarController,
  patchUserNameController,
} from '../controllers/user.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/current', ctrlWrapper(getCurrentUserController));

router.patch(
  '/current/avatar',
  upload.single('avatar'),
  ctrlWrapper(addUserAvatarController),
);
router.patch('/current', ctrlWrapper(patchUserNameController));

export default router;
