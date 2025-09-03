import createHttpError from "http-errors";
import UserCollection from "../models/userSchema.js";
import SessionCollection from "../models/sessionSchema.js";

export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
  
    if (!authHeader) {
      next(createHttpError(401, 'Please provide access token'));
      return;
    }

    const [bearer, token] = authHeader.split(' ');

if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Invalid authorization format'));
}

      const session = await SessionCollection.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError.Unauthorized('Session not found'));
  }

  if (new Date(session.accessTokenValidUntil) < new Date()) {
    return next(createHttpError.Unauthorized('Access token is expired'));
  }

  const user = await UserCollection.findById(session.userId);

  if (!user) {
    return next(createHttpError.Unauthorized('User not found'));
  }

  req.user = user;

  next();
}