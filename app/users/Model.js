import mongoose from "mongoose";
import * as uuid from "uuid";
import validator from "validator";
import utils from "../../utils/index.js";

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  username: {
    type: String,
    lowercase: true,
    unique: [true, "That Username is taken."],
    required: [true, "Username cannot be empty."],
    minLength: [8, "Username should be at least 8 characters."],
    validate: [validator.isAlphanumeric, "Username may only contain letters and numbers."],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email cannot be empty."],
    unique: [true, "That Email address is taken."],
    validate: [validator.isEmail, "Enter a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty."],
    minLength: [8, "Password should be at least 8 characters."],
  },
  salt: { type: String },
  createdBy: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
  updatedDate: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  if (this.isNew) {
    const { encrypted, salt } = utils.cipher(this.password);
    this.password = encrypted;
    this.salt = salt;
  }
  next();
});

const user = mongoose.model("user", userSchema);

export default user;
