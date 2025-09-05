// import { TransactionsSchema } from '../models/transaction.js';

export const getCategories = async () => {
  // let allTransactions = [];
  // let userCategory = [];

  // allTransactions = await TransactionsCollection.find({
  //   userId,
  //   type: '-',
  // });

  // allTransactions.map((transaction) => {
  //   if (!userCategory.includes(transaction.category)) {
  //     userCategory.push(transaction.category);
  //   }
  // });
  // return userCategory;

  const categories = TransactionsSchema.obj.category.enum;
  return categories;
};
