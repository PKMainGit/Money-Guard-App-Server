import UserCollection from '../models/userSchema.js';
import { recalculateUserBalance } from '../services/calcBalance.js';
import { getCurrentUser } from '../services/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getCurrentUserController = async (req, res) => {
  const updatedBalance = await recalculateUserBalance(req.user._id);

  const user = await getCurrentUser(req.user.id);

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
    });
  }

  res.status(200).json({
    status: 200,
    message: 'User data fetched successfully',
    data: user,
  });
};

export const addUserAvatarController = async (req, res) => {
  const userId = req.user._id;
  const avatar = req.file;

  let avatarUrl;
  if (avatar) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar);
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }

  const updatedUser = await UserCollection.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { new: true },
  );

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully',
    data: updatedUser,
  });
};

export const patchUserNameController = async (req, res) => {
  const userId = req.user._id;
  const userName = req.body.name;

  const updatedUser = await UserCollection.findByIdAndUpdate(
    userId,
    { name: userName },
    { new: true },
  );

  res.status(200).json({
    status: 200,
    message: 'Name updated successfully',
    data: updatedUser,
  });
};
