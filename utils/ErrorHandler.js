export const ErrorHandler = (err) => {
  if (err.code === 11000 && err.name === "MongoError") return `${Object.keys(err.keyValue)[0]} already exist (unique) - ${err.code}`;
  else return err.message;
};
