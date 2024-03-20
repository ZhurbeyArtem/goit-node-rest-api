import { Router } from "express";
import contactsRouter from "./contactsRouter.js";
import usersRouter from "./usersRouter.js";
import { authMiddleware } from "../helpers/authMiddleware.js";

const mainRouter = Router();

mainRouter.use("/contacts", authMiddleware, contactsRouter);
mainRouter.use("/users", usersRouter);

export default mainRouter;
