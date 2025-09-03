// src/db/models/transaction.js

import { model, Schema } from 'mongoose';

export const TransactionsSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
			required: true,
			enum: ['INCOME', 'EXPENSE']
    },
    category: {
      type: String,
      enum: [
        'Main expenses',
        'Products',
        'Car',
        'Self care',
        'Child care',
        'Household products',
        'Education',
        'Leisure',
        'Other expenses',
        'Entertainment',
        'Income',
      ],
      required: true,
      default: 'Main expenses',
    },
    comment: {
      type: String,
    },
    sum: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TransactionsCollection = model('transactions', TransactionsSchema);
