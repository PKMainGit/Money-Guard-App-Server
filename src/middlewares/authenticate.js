import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { pool } from "../db/dbConnect.js";
// import UserCollection from "../models/userSchema.js";
// import SessionCollection from "../models/sessionSchema.js";

export const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.get('Authorization');
		if (!authHeader) throw createHttpError(401, 'Please provide access token');

		const [bearer, token] = authHeader.split(' ');
		if (bearer !== 'Bearer' || !token) throw createHttpError(401, 'Invalid authorization format');

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const userId = decoded.user_id;

		const result = await pool.query(`SELECT id, name, email, balance, avatar FROM users WHERE id = $1`, [userId]);
		const user = result.rows[0];

		if (!user) throw createHttpError(401, "User not found");

		req.user = user;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return next(createHttpError(401, 'Access token is expired'))
		}
		next(error);
	}
}