// import Configs from "../../configs/index.js";
import mongoose from "mongoose";
import * as uuid from "uuid";

const todoSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  title: { type: String, required: [true, "title cannot be empty"] },
  isDone: { type: Boolean, default: false },
  userid: { type: String, required: [true, "userid cannot be empty"] },
  startDate: { type: Date, default: Date.now },
  finishDate: Date,
  createdBy: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
  updatedDate: { type: Date, default: Date.now },
});

const todo = mongoose.model("todo", todoSchema);

export default todo;
