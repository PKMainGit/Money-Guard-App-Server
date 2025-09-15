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