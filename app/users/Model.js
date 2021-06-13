// import Configs from "../../configs/index.js";
import mongoose from "mongoose";
import * as uuid from "uuid";

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  username: {
    type: String,
    required: [true, "username cannot be empty!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email cannot be empty!"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.\S{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    unique: true,
  },
  password: { type: String, required: [true, "password cannot be empty!"] },
  salt: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
  updatedDate: { type: Date, default: Date.now },
});

const user = mongoose.model("user", userSchema);

export default user;
