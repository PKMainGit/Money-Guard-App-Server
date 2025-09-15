import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const generateTokens = (user_id) => {
	const accessToken = jwt.sign(
		{ user_id },
		ACCESS_TOKEN_SECRET,
		{ expiresIn: "5m" }
	);

	const refreshToken = jwt.sign(
		{ user_id },
		REFRESH_TOKEN_SECRET,
		{ expiresIn: "10m" }
	);

	return {accessToken, refreshToken}
}