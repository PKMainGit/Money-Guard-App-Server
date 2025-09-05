// src/service/summary.js
// import { TransactionsCollection } from '../models/transaction.js';

export const getSummary = async ({ userId, filter }) => {
  const query = {
    userId,
    ...filter,
  };

  const summary = await TransactionsCollection.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$sum' },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        total: 1,
      },
    },
  ]);
  return summary;
};

