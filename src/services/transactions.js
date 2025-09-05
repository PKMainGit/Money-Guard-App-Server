// import { TransactionsCollection } from '../models/transaction.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllTransactions = async ({
  userId,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const query = {};

  if (filter.date) {
    query.date = filter.date.trim();
  }

  const transactions = await TransactionsCollection.find({ userId, ...query })
    .sort({ [sortBy]: sortOrder })
    .exec();
  return {
    data: transactions,
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
