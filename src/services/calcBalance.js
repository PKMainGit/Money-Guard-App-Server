import { pool } from '../db/dbConnect.js';

export const recalculateUserBalance = async (userId) => {
  const result = await pool.query(
    'SELECT type, sum FROM transactions WHERE user_id = $1',
    [userId],
  );

  const transactions = result.rows;

  const newBalance = transactions.reduce((acc, tx) => {
    if (tx.type === 'INCOME') return acc + Number(tx.sum);
    if (tx.type === 'EXPENSE') return acc - Number(tx.sum);
    return acc;
  }, 0);

  await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [
    newBalance,
    userId,
  ]);

  return newBalance;
};
