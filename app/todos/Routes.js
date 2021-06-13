import Controller from "./Controller.js";
import utils from "../../utils/index.js";
import * as Constants from "../../constants/index.js";

export const todoRoutes = (router) => {
  router.get("/api/todo/", utils.verifyJWT, (req, res) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    Controller.getTodoByUserid(userid, (err, todo) => {
      if (err) return res.status(500).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: utils.ErrorHandler(err) });
      return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });

  router.post("/api/todo", utils.verifyJWT, (req, res) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    const { title } = req.body;
    Controller.addTodo({ userid, title }, (err, todo) => {
      if (err) return res.status(500).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: utils.ErrorHandler(err) });
      return res.status(201).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });

  router.put("/api/todo/:_id", utils.verifyJWT, (req, res) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    const { _id } = req.params;
    const { isDone, title } = req.body;
    Controller.updateTodoByIdAndUserid(_id, userid, { isDone, finishDate: isDone ? Date.now() : null, title }, (err, todo) => {
      if (err) return res.status(500).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: utils.ErrorHandler(err) });
      if (!todo) return res.status(200).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: "Data not found" });
      return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });

  router.delete("/api/todo/:_id", utils.verifyJWT, (req, res) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    const { _id } = req.params;
    Controller.deleteTodoByIdAndUserid(_id, userid, (err, todo) => {
      if (err) return res.status(500).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: utils.ErrorHandler(err) });
      if (!todo) return res.status(200).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: "Data not found" });
      return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });
};
