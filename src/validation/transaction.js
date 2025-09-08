// src/validation/transaction.js

// import Joi, { number } from 'joi';
// import { isValidObjectId } from 'mongoose';

// export const createTransactionSchema = Joi.object({
//   id: Joi.string(),
//   date: Joi.string().required(),
//   type: Joi.string().required(),
//   category: Joi.string(),
//   comment: Joi.string(),
//   sum: Joi.number().integer().required(),
//   userId: Joi.string().custom((value, helper) => {
//     if (value && !isValidObjectId(value)) {
//       return helper.message('User id should be a valid mongo id');
//     }
//     return true;
//   }),
// });

// export const updateTransactionSchema = Joi.object({
//   id: Joi.string(),
//   date: Joi.string().required(),
//   type: Joi.string().required(),
//   category: Joi.string(),
//   comment: Joi.string(),
//   sum: Joi.number().integer().required(),
// });

export function validateTransaction(body) {

	if (!body.date || typeof body.date !== 'string')
		return "Date is required and must be a string"
	
	if (!body.type || typeof body.type !== 'string')
		return 'Type is required and must be a string';

	if (!body.category || typeof body.category !== 'string')
		return 'Category is required and must be a string';

	if (typeof body.comment !== 'string')
		return 'Comment must be a string';

	if (!body.sum || typeof body.sum !== 'number')
		return 'Sum is required and must be a number';

	// if (!body.user_id || typeof body.sum !== 'number')
	// 	return 'User id is required and must be a number';
}
