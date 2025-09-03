import UserCollection from "../models/userSchema.js";



export const getCurrentUser = (userId) => UserCollection.findById(userId);