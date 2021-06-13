import Controller from "./Controller.js";
import utils from "../../utils/index.js";
import { AuthorizationHandler } from "../../middleware/AuthorizationHandler.js";
import * as Constants from "../../constants/index.js";

export const userRoutes = (router) => {
  router.post("/auth/login", (req, res, next) => {
    const { email, username, password } = req.body;
    Controller.getUserByUsername(username, (err, auth) => {
      if (err) return next(err);
      if (!auth) return next(utils.customError("CustomError", "Username and password does not match", 400));
      const { encrypted } = utils.cipher(password, auth.salt);
      if (encrypted !== auth.password) {
        return next(utils.customError("CustomError", "Username and password does not match", 400));
      }
      return res.status(200).send({
        ...Constants.RESPONSE_OBJECT_SUCCESS,
        token: utils.JWTGenerator({ userid: auth._id, username: auth.username }),
      });
    });
  });

  router.post("/auth/signup", (req, res, next) => {
    const { email, username, password } = req.body;
    Controller.addUser(
      {
        username,
        email,
        password,
      },
      (err, auth) => {
        if (err) return next(err);
        return res.status(201).send({
          ...Constants.RESPONSE_OBJECT_SUCCESS,
          message: `${auth.username} has been successfully registered`,
        });
      }
    );
  });

  router.post("/auth/logout", AuthorizationHandler, (req, res) => {
    return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS });
  });
};
