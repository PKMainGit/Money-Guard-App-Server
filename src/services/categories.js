// import { TransactionsSchema } from '../models/transaction.js';
export const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Salary',
  'Other',
];
export const getCategories = async () => {
  return categories;
};
// export const getCategories = async () => {
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

//   const categories = TransactionsSchema.obj.category.enum;
//   return categories;
// };
