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
  console.log(transactionId);

  const transaction = await TransactionsCollection.findById(
    transactionId,
    userId,
  );
  return transaction;
};

export const createTransaction = async (payload) => {
  const transaction = await TransactionsCollection.create(payload);
  return transaction;
};

export const deleteTransaction = async (transactionId, userId) => {
  const transaction = await TransactionsCollection.findOneAndDelete({
    _id: transactionId,
    userId,
  });
  return transaction;
};

export const patchTransaction = async (transactionId, userId, payload) => {
  const rawResult = await TransactionsCollection.findOneAndUpdate(
    { _id: transactionId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  return rawResult;
};
