import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import UserCollection from '../models/userSchema.js';
import SessionCollection from '../models/sessionSchema.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import fs from "node:fs/promises";
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import handlebars from 'handlebars';
import { sendEmail } from '../utils/sendMail.js';



export const registerUser = async (payload) => {
  const existingUser = await UserCollection.findOne({ email: payload.email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    session,
  };
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(400, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    session,
  };
};

export const logoutUser = async (sessionId, refreshToken) => {
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
  return undefined;
};

export async function loginOrRegister(email, name) {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const user = await UserCollection.findOne({ email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(30).toString('base64'), 10);

    const newUser = await UserCollection.create({
      name,
      email,
      password,
    });

    return await SessionCollection.create({
      userId: newUser._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  await SessionCollection.deleteOne({ userId: user._id });
  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export const requestResetPassword = async (email) => {
  try {
    const user = await UserCollection.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
      {
        sub: user._id,
        email,
      },
      getEnvVar('JWT_SECRET'),
      {
        expiresIn: '5m',
      },
    );

    const templateSource = (await fs.readFile(TEMPLATES_DIR)).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
      name: user.name,
      link: `${getEnvVar('APP_DOMAIN')}/?token=${resetToken}`,
    });

    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      error.status || 500,
      error.message || 'Failed to send reset email',
    );
  }
};

export const resetPassword = async (payload) => {
  try {
    const entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    const user = await UserCollection.findOne({
      email: entries.email,
      _id: entries.sub,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await UserCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );

    await SessionCollection.deleteOne({ userId: user._id });
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createHttpError(401, 'Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Token is expired');
    }

    throw error;
  }
};