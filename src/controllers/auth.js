import { registerUser, loginUser, logoutUser, requestResetPassword, resetPassword } from '../services/auth.js';
import { recalculateUserBalance } from '../services/calcBalance.js'; 
import jwt from 'jsonwebtoken';
import { pool } from '../db/dbConnect.js';
import createHttpError from 'http-errors';

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

  res.cookie('refreshToken', session.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: session.refresh_token_valid_until,
  });
  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refresh_token_valid_until,
  });
	
	await recalculateUserBalance(user.id);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      user,
      accessToken: session.access_token,
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

export const refreshTokenController = async (req, res, next) => {
  try {
    // 1. Дістаємо refresh-token з HttpOnly cookie
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(createHttpError(401, 'No refresh token'));
    }

    // 2. Перевіряємо підпис токена
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return next(createHttpError(401, 'Invalid refresh token'));
    }

    // 3. Переконуємось, що така сесія існує
    const { rows } = await pool.query(
      `SELECT * FROM sessions
         WHERE user_id = $1
           AND refresh_token = $2
         LIMIT 1`,
      [decoded.user_id, refreshToken],
    );
    const record = rows[0];
    if (!record) return next(createHttpError(401, 'Session not found'));

    // 4. Перевіряємо строк дії refresh-токена
    if (new Date() > new Date(record.refresh_token_valid_until)) {
      return next(createHttpError(401, 'Refresh token expired'));
    }

    // 5. Генеруємо новий access-токен на 30 хв
    const newAccessToken = jwt.sign(
      { user_id: decoded.user_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' },
    );

    // 6. Оновлюємо запис сесії (новий access і дата його закінчення)
    await pool.query(
      `UPDATE sessions
         SET access_token = $1,
             access_token_valid_until = $2,
             updated_at = NOW()
       WHERE id = $3`,
      [newAccessToken, new Date(Date.now() + 5 * 60 * 1000), record.id],
    );

    // 7. Віддаємо клієнту новий access-токен
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    return next(createHttpError(401, 'Unable to refresh token'));
  }
};

export const requestResetPasswordController = async (req, res) => {
  const { email } = req.body;
  requestResetPassword(email);

  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

