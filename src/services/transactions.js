// import { TransactionsCollection } from '../models/transaction.js';
import { SORT_ORDER } from '../constants/index.js';
import { pool } from '../db/dbConnect.js';

export const getAllTransactions = async ({
  userId,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'id',
  filter = {},
}) => {
  // if (filter.date) {
  //   query.date = filter.date.trim();
  // }

	const transactions = await pool.query(
		` SELECT * FROM transactions WHERE user_id = $1`,
		[userId]
	)
  return {
    data: transactions.rows,
  };
};

export const getTransactionById = async (transactionId, userId) => {
  const query = `
    SELECT *
    FROM transactions
    WHERE id = $1 AND user_id = $2
  `;
  const values = [transactionId, userId];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const createTransaction = async (payload) => {
	const { userId, sum, type, category, date, comment } = payload;

  const result = await pool.query(
    `INSERT INTO transactions (user_id, sum, type, category, date, comment)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, sum, type, category, date, comment],
  );

  return result.rows[0];
};


export const deleteTransaction = async (transactionId, userId) => {
  const id = Number(transactionId);
  const query = `
    DELETE FROM transactions
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const values = [id, userId];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const patchTransaction = async (transactionId, userId, payload) => {
  const query = `
    UPDATE transactions
    SET 
      category = $1,
      date = $2,
      sum = $3,
      type = $4,
      comment = $5
    WHERE id = $6 AND user_id = $7
    RETURNING *
  `;
  const values = [
    payload.category,
    payload.date,
    payload.sum,
    payload.type,
    payload.comment,
    transactionId,
    userId,
  ];

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};
