export const ErrorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") handleValidationError(err, res);
  else if (err.code && err.code === 11000) handleDuplicateKeyError(err, res);
  else if (err.name === "JsonWebTokenError") handleAuthorizationError(err, res);
  else if (err.name === "TypeError") handleTypeError(err, res);
  else if (err.name === "CustomError") handleCustomError(err, res);
  else res.status(500).send({ code: 500, message: err.message });
};

const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  const message = errors.join(" ");
  res.status(code).send({ code, message, fields });
};

const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const message = `An account with that ${field} already exists.`;
  res.status(code).send({ code, message, field });
};

const handleAuthorizationError = (err, res) => {
  const code = 401;
  const message = "Please make sure you are logged in and have the active token";
  res.status(code).send({ code, message, error: err.message });
};

const handleTypeError = (err, res) => {
  const code = 400;
  const message = err.message;
  res.status(code).send({ code, message });
};

const handleCustomError = (err, res) => {
  const { message, code } = err;
  res.status(code).send({ code, message });
};
