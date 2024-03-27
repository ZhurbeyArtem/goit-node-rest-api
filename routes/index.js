import { Router } from "express";
import contactsRouter from "./contactsRouter.js";
import usersRouter from "./usersRouter.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const mainRouter = Router();

mainRouter.use("/contacts", authMiddleware, contactsRouter);
mainRouter.use("/users", usersRouter);

export default mainRouter;
