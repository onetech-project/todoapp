import userModel from "./Model.js";

const addUser = (user, callback) => userModel.create({ ...user, createdBy: user.username, updatedBy: user.username }, callback);
const getUserByUsername = (username, callback) => userModel.findOne({ username }, callback);
const deleteUserByUsername = (username, callback) => userModel.findOneAndDelete({ username }, callback);
const updateUserByUsername = (username, updatedUser, callback) =>
  userModel.findOneAndUpdate({ username }, { ...updatedUser, updatedBy: user.username, updatedDate: Date.now }, callback);

export default {
  addUser,
  getUserByUsername,
  deleteUserByUsername,
  updateUserByUsername,
};
