import { Router } from "express";
import { userRoutes } from "./users/Routes.js";
import { todoRoutes } from "./todos/Routes.js";

const router = Router();

userRoutes(router);
todoRoutes(router);

export default router;
