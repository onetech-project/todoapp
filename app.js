import express from "express";
import routes from "./app/Routes.js";
import { ErrorHandler } from "./middleware/ErrorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", routes);

app.use(ErrorHandler);

export default app;
