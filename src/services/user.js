import { pool } from '../db/dbConnect.js';

export const getCurrentUser = async (userId) => {
  const result = await pool.query(
    'SELECT id, name, email, balance, avatar FROM users WHERE id = $1',
    [userId],
  );

  if (!result.rows.length) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

