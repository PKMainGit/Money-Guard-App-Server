// src/validation/transaction.js

import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createTransactionSchema = Joi.object({
  _id: Joi.string(),
  date: Joi.string().required(),
  type: Joi.string().required(),
  category: Joi.string(),
  comment: Joi.string(),
  sum: Joi.number().integer().required(),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateTransactionSchema = Joi.object({
  _id: Joi.string(),
  date: Joi.string().required(),
  type: Joi.string().required(),
  category: Joi.string(),
  comment: Joi.string(),
  sum: Joi.number().integer().required(),
});
