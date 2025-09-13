import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  validateRegistration,
  validateLogin,
  validateResetEmail,
  validateResetPassword
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  requestResetPasswordController,
  resetPasswordController,
  refreshTokenController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(validateRegistration),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(validateLogin),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(validateResetEmail),
  ctrlWrapper(requestResetPasswordController),
);

router.post(
  '/reset-pwd',
  validateBody(validateResetPassword),
  ctrlWrapper(resetPasswordController),
);

router.post('/refresh', refreshTokenController);

export default router;
