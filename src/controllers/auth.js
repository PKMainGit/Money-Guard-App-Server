import { registerUser, loginUser, logoutUser, requestResetPassword, resetPassword } from '../services/auth.js';
import { loginOrRegister } from '../services/auth.js';
import { getOAuthURL, validateCode } from '../utils/googleOAuth2.js';
import { recalculateUserBalance } from '../services/calcBalance.js'; 

export const registerUserController = async (req, res) => {
  const { user, tokens } = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      user,
      accessToken: tokens.accessToken,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { user, session } = await loginUser(req.body);
	
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
	
	// await recalculateUserBalance(user.id);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      user,
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

	res.status(204).send();
};

// export const getGoogleOAuthUrlController = async (_req, res) => {
//   const url = getOAuthURL();
//   res.json({
//     status: 200,
//     message: 'Successfully get Google OAuth url!',
//     data: {
//       oauth_url: url,
//     },
//   });
// };

// export async function confirmOAuthController(req, res) {
//   const ticket = await validateCode(req.body.code);

//   const session = await loginOrRegister(
//     ticket.payload.email,
//     ticket.payload.name,
//   );

//   const setSessionCookies = (res, session) => {
//     res.cookie('refreshToken', session.refreshToken, {
//       httpOnly: true,
//       expires: session.refreshTokenValidUntil,
//     });
//     res.cookie('sessionId', session._id, {
//       httpOnly: true,
//       expires: session.refreshTokenValidUntil,
//     });
//   };

//   setSessionCookies(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully logged in an user!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// }

export const requestResetPasswordController = async (req, res) => {
  const { email } = req.body;
  requestResetPassword(email);

  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetEmailController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

