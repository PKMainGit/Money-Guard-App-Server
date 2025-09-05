import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  validateRegistration,
  validateLogin,
  // confirmOAuthSchema,
  // requestResetEmailSchema,
  // resetEmailSchema
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  // getGoogleOAuthUrlController,
  // confirmOAuthController,
  requestResetPasswordController,
  resetEmailController,
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

// router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

// router.post(
//   '/confirm-oauth',
//   // validateBody(confirmOAuthSchema),
//   ctrlWrapper(confirmOAuthController),
// );

router.post(
  '/send-reset-email',
  // validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetPasswordController),
);

router.post(
  '/reset-pwd',
  // validateBody(resetEmailSchema),
  ctrlWrapper(resetEmailController),
);

export default router;
