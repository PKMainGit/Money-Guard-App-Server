// src/validation/transaction.js

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
}
