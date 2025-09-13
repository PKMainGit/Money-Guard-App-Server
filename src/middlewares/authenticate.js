// middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import { pool } from '../db/dbConnect.js';
import createHttpError from 'http-errors';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) throw createHttpError(401, 'Please provide access token');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw createHttpError(401, 'Invalid authorization format');

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.user_id;

    const session = await pool.query(
      `SELECT access_token_valid_until FROM sessions 
       WHERE user_id = $1 AND access_token = $2`,
      [userId, token],
    );

    const record = session.rows[0];
    if (!record) throw createHttpError(401, 'Session not found');

    if (new Date() > new Date(record.access_token_valid_until)) {
      throw createHttpError(401, 'Access token is expired');
    }

    const userResult = await pool.query(
      `SELECT id, name, email, balance, avatar FROM users WHERE id = $1`,
      [userId],
    );
    if (!userResult.rows.length) throw createHttpError(401, 'User not found');

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token is expired'));
    }
    next(error);
  }
};
