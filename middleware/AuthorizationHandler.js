import jwt from "jsonwebtoken";
import * as Constants from "../constants/index.js";

export const AuthorizationHandler = (req, res, next) => {
  let token = req.header("Authorization");
  try {
    jwt.verify(token ? token.split(" ")[1] : token, Constants.JWTKEY);
    next();
  } catch (error) {
    next(error);
  }
};
