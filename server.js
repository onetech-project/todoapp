import app from "./app.js";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

const { PORT, MONGODBURL } = process.env;

mongoose.connect(MONGODBURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
  if (err) throw err;
  console.log("Database Connected");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
