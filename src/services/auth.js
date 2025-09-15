import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import fs from "node:fs/promises";
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import handlebars from 'handlebars';
import { sendEmail } from '../utils/sendMail.js';
import { pool } from '../db/dbConnect.js';
import { generateTokens } from '../utils/generateTokens.js';

export const registerUser = async (payload) => {
  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [payload.email],
  );
  if (existingUser.rows.length > 0) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

	const { rows: newUser } = await pool.query(
    `INSERT INTO users (name, email, password, balance, avatar)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, email, name, balance, avatar`,
    [
      payload.name,
      payload.email,
      encryptedPassword,
      payload.balance || 0,
      payload.avatar || "",
    ],
  );

	const { accessToken, refreshToken } = generateTokens(newUser[0].id)
	const accessValidUntil = new Date(Date.now() + 30 * 60 * 1000);
	const refreshValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

	await pool.query(
    `INSERT INTO sessions (user_id, access_token, refresh_token, access_token_valid_until,refresh_token_valid_until)
		VALUES ($1, $2, $3, $4, $5)`,
    [
      newUser[0].id,
      accessToken,
      refreshToken,
      accessValidUntil,
      refreshValidUntil,
    ],
  );

  return {
    user: newUser[0],
    tokens: {accessToken, refreshToken}
  };
};

export const loginUser = async (payload) => {
  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [payload.email],
  );
  if (existingUser.rows.length === 0) {
    throw createHttpError(400, 'User not found');
  }

  const user = existingUser.rows[0];

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await pool.query(`DELETE FROM sessions WHERE user_id = $1`, [user.id]);

  const { accessToken, refreshToken } = generateTokens(user.id);
  const accessValidUntil = new Date(Date.now() + 1 * 60 * 1000);
  const refreshValidUntil = new Date(Date.now() + 15 * 60 * 1000);

	const sessionResult = await pool.query(
		`INSERT INTO sessions (user_id, access_token, refresh_token, access_token_valid_until, refresh_token_valid_until)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *`,
		[user.id, accessToken, refreshToken, accessValidUntil, refreshValidUntil]
	);

	const session = sessionResult.rows[0];

  return {
    user,
    session,
  };
};

export const logoutUser = async (sessionId) => {
  await pool.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
  return undefined;
};

export const requestResetPassword = async (email) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email],
    );
    const user = rows[0];

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
      {
        sub: user.id,
        email,
      },
      getEnvVar('RESET_TOKEN_SECRET'),
      {
        expiresIn: '5m',
      },
    );

    const templateSource = (await fs.readFile(TEMPLATES_DIR)).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
      name: user.name,
      link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      error.status || 500,
      error.message || 'Failed to send reset email',
    );
  }
};

export const resetPassword = async (payload) => {
  try {
    const entries = jwt.verify(payload.token, getEnvVar('RESET_TOKEN_SECRET'));
    const { rows } = await pool.query(
      'SELECT id, email FROM users WHERE id = $1 AND email = $2',
      [entries.sub, entries.email],
    );
    const user = rows[0];

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [
      encryptedPassword,
      user.id,
    ]);

    await pool.query('DELETE FROM sessions WHERE user_id = $1', [user.id]);
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Token is expired');
    }

    throw error;
  }
};