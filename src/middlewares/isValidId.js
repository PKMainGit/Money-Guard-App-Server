// src/middlewares/isValidId.js

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { transactionId } = req.params;
  if (!isValidObjectId(transactionId)) {
    throw createHttpError(
      400,
      'Bad Request. The ID in the URL seems invalid. Please double-check it.',
    );
  }

  next();
};
