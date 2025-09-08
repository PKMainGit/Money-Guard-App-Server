// src/controllers/transactions.js
import moment from 'moment';
import createHttpError from 'http-errors';
import {
  deleteTransaction,
  patchTransaction,
  getAllTransactions,
  getTransactionById,
  createTransaction,
} from '../services/transactions.js';

import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
// import mongoose from 'mongoose';
import { recalculateUserBalance } from '../services/calcBalance.js'; 

export const getTransactionsController = async (req, res, next) => {
  try {
    const { sortBy, sortOrder } = parseSortParams(req.query);
		const filter = parseFilterParams(req.query);
		
    const transactions = await getAllTransactions({
      userId: req.user.id,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found transactions!',
      data: transactions.data,
    });
	} catch (error) {
		next(error);
  }
};

export const getTransactionByIdController = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await getTransactionById(transactionId, userId);
    if (!transaction) {
      throw createHttpError(404, 'Transaction not found');
    }

    res.json({
      status: 200,
      message: `Successfully found transaction with id ${transactionId}!`,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransactionController = async (req, res, next) => {
	try {
		console.log('📩 Incoming body from client:', req.body);
    if (req.body.date) {
      const inputDate = moment(
        req.body.date,
        [
          moment.ISO_8601,
          'DD-MM-YYYY',
          'YYYY-MM-DD',
          'MM-DD-YYYY',
          'DD/MM/YYYY',
          'DD.MM.YYYY',
          'YYYY.MM.DD',
          'D.M.YYYY',
          'D.M.YY',
          'DD.MM.YY',
          'DD-MM-YY',
        ],
        true,
      );

      if (!inputDate.isValid()) {
        throw createHttpError(400, 'Invalid date format.');
      }

      req.body.date = inputDate.format('YYYY-MM-DD');
    }

    const transaction = await createTransaction({
      userId: req.user.id,
      ...req.body,
    });

		const updatedBalance = await recalculateUserBalance(req.user.id);

    res.status(201).json({
      status: 201,
      message: `Successfully created a transaction!`,
      data: {
        transaction,
        balance: updatedBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const patchTransactionController = async (req, res, next) => {
	try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const updatedTransaction = await patchTransaction(
      transactionId,
      userId,
      req.body,
    );

    if (!updatedTransaction) {
      return next(createHttpError(404, 'Transaction not found'));
    }

    const updatedBalance = await recalculateUserBalance(userId);

    res.json({
      status: 200,
      message: 'Successfully patched a transaction!',
      data: updatedTransaction,
      balance: updatedBalance,
    });
	} catch (error) {
    next(error);
  }
};

export const deleteTransactionController = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await deleteTransaction(transactionId, userId);

    if (!transaction) {
      return next(createHttpError(404, 'Transaction not found'));
    }

    await recalculateUserBalance(userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
