// import UserCollection from '../models/userSchema.js';
import { recalculateUserBalance } from '../services/calcBalance.js';
import { getCurrentUser } from '../services/user.js';
import fs from 'fs/promises';
import path from 'path';
import { pool } from '../db/dbConnect.js';
import { UPLOADS_DIR } from '../constants/index.js';

export const getCurrentUserController = async (req, res, next) => {
  try {
    await recalculateUserBalance(req.user.id);
    const user = await getCurrentUser(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'User data fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserAvatarController = async (req, res) => {
  const userId = req.user.id;
	const avatar = req.file;
	console.log(avatar);
	

  if (!avatar) {
    throw createHttpError(400, 'No file uploaded');
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const fileExt = path.extname(avatar.originalname);
  const fileName = `${userId}_${Date.now()}${fileExt}`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  await fs.rename(avatar.path, filePath);

  const avatarUrl = `http://localhost:3000/uploads/${fileName}`;

  const { rows } = await pool.query(
    'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING id, name, email, avatar',
    [avatarUrl, userId],
  );

  const updatedUser = rows[0];

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully',
    data: updatedUser,
  });
};

export const patchUserNameController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      throw createHttpError(400, 'Name is required and must be a string');
    }

    const { rows } = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, avatar',
      [name, userId],
    );

    const updatedUser = rows[0];

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Name updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Patch user name error:', error);
    throw error;
  }
};
