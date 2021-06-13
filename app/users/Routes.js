import Controller from "./Controller.js";
import utils from "../../utils/index.js";
import * as Constants from "../../constants/index.js";

export const userRoutes = (router) => {
  const parameterVerify = (email, username, password) => {
    const error = [];
    if (!email && !username) error.push("either email or username is prohibited to be empty");
    if (!password) error.push("password is prohibited to be empty");
    return error;
  };

  router.post("/api/login", async (req, res) => {
    const { email, username, password } = req.body;
    const isBadRequest = parameterVerify(email, username, password);
    if (isBadRequest.length) {
      return res.status(400).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: isBadRequest });
    }
    Controller.getUserByUsername(username, (err, auth) => {
      if (err) return res.status(500).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: err });
      if (!auth) return res.status(200).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: "Username or password does not match" });
      const { encrypted } = utils.cipher(password, auth.salt);
      if (encrypted !== auth.password) {
        return res.status(200).send({
          ...Constants.RESPONSE_OBJECT_FAILED,
          message: "Username or Password does not match",
        });
      }
      return res.status(200).send({
        ...Constants.RESPONSE_OBJECT_SUCCESS,
        token: utils.JWTGenerator({ userid: auth._id, username: auth.username }),
      });
    });
  });

  router.post("/api/signup", async (req, res) => {
    const { email, username, password } = req.body;
    const isBadRequest = parameterVerify(email, username, password);
    if (isBadRequest.length) {
      return res.status(400).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: isBadRequest });
    }
    const { encrypted, salt } = utils.cipher(password);
    Controller.addUser(
      {
        username,
        email,
        password: encrypted,
        salt,
      },
      (err, auth) => {
        if (err) return res.status(500).send({ ...Constants.RESPONSE_OBJECT_FAILED, message: utils.ErrorHandler(err) });
        return res.status(201).send({
          ...Constants.RESPONSE_OBJECT_SUCCESS,
          message: `${auth.username} has been successfully registered`,
        });
      }
    );
  });

  router.post("/api/logout", utils.verifyJWT, (req, res) => {
    return res.status(200).send({ ...Constants.RESPONSE_OBJECT_SUCCESS });
  });
};
