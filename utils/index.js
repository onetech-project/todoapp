import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as Constants from "../constants/index.js";

const cleanEmpty = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => (v && typeof v === "object" ? cleanEmpty(v) : v)).filter((v) => !(v == null));
  } else {
    return Object.entries(obj)
      .map(([k, v]) => [k, v && typeof v === "object" ? cleanEmpty(v) : v])
      .reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
  }
};

const cipher = (text, salt = crypto.randomBytes(64).toString("hex")) => {
  const encrypted = crypto.pbkdf2Sync(text, salt, 10000, 64, "sha512").toString("base64");
  return { salt, encrypted };
};

const JWTGenerator = (userInfo = { id, role }, expiresIn = 86400) => {
  return `Bearer ${jwt.sign(cleanEmpty(userInfo), Constants.JWTKEY, {
    expiresIn,
  })}`;
};

const decodeJWT = (token) => {
  return jwt.decode(token.split(" ")[1], Constants.JWTKEY);
};

const customError = (name, message, code) => {
  const errorObject = new Error(message);
  errorObject.name = name;
  errorObject.code = code;
  return errorObject;
};

export default {
  cleanEmpty,
  cipher,
  JWTGenerator,
  decodeJWT,
  customError,
};
