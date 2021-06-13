import Controller from "./Controller.js";
import utils from "../../utils/index.js";
import { AuthorizationHandler } from "../../middleware/AuthorizationHandler.js";
import * as Constants from "../../constants/index.js";

export const todoRoutes = (router) => {
  router.get("/todo/", AuthorizationHandler, (req, res, next) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    Controller.getTodoByUserid(userid, (err, todo) => {
      if (err) return next(err);
      return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });

  router.post("/todo", AuthorizationHandler, (req, res, next) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    const { title } = req.body;
    Controller.addTodo({ userid, title }, (err, todo) => {
      if (err) return next(err);
      return res.status(201).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });

  router.put("/todo/:_id", AuthorizationHandler, (req, res, next) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    const { _id } = req.params;
    const { isDone, title } = req.body;
    Controller.updateTodoByIdAndUserid(_id, userid, { isDone, finishDate: isDone ? Date.now() : null, title }, (err, todo) => {
      if (err) return next(err);
      if (!todo) return next(utils.customError("CustomError", "Data Not Found", 404));
      return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });

  router.delete("/todo/:_id", AuthorizationHandler, (req, res, next) => {
    const decodedJWT = utils.decodeJWT(req.header("Authorization"));
    const { userid } = decodedJWT;
    const { _id } = req.params;
    Controller.deleteTodoByIdAndUserid(_id, userid, (err, todo) => {
      if (err) return next(err);
      if (!todo) return next(utils.customError("CustomError", "Data Not Found", 404));
      return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS, todo });
    });
  });
};
