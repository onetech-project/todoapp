import crypto from "crypto";

export const RESPONSE_CODE = { SUCCESS: "01", FAILED: "00" };
export const RESPONSE_MESSAGE = { SUCCESS: "SUCCESS", FAILED: "FAILED" };
export const RESPONSE_OBJECT_SUCCESS = {
  code: RESPONSE_CODE.SUCCESS,
  message: RESPONSE_MESSAGE.SUCCESS,
};
export const RESPONSE_OBJECT_FAILED = {
  code: RESPONSE_CODE.FAILED,
  message: RESPONSE_MESSAGE.FAILED,
};
export const JWTKEY = crypto.randomBytes(64).toString("base64");
