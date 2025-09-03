import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserCollection = mongoose.model('User', userSchema);

export default UserCollection;
