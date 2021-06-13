import todoModel from "./Model.js";

const addTodo = (todo, callback) => todoModel.create({ ...todo, createdBy: todo.userid, updatedBy: todo.userid }, callback);
const getTodoByUserid = (userid, callback) => todoModel.find({ userid }, callback);
const deleteTodoByIdAndUserid = (_id, userid, callback) => todoModel.findOneAndDelete({ _id, userid }, callback);
const updateTodoByIdAndUserid = (_id, userid, updatedTodo, callback) =>
  todoModel.findOneAndUpdate({ _id, userid }, { ...updatedTodo, updatedBy: userid }, callback);

export default { addTodo, getTodoByUserid, deleteTodoByIdAndUserid, updateTodoByIdAndUserid };
