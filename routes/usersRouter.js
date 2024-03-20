import express from "express";
import {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  updateSubscriptionController,
} from "../controllers/usersControllers.js";
import { validateBody } from "../helpers/validateBody.js";
import { authSchema, updateSubscriptionSchema } from "../schemas/usersSchemas.js";
import { authMiddleware } from "../helpers/authMiddleware.js";

const usersRouter = express.Router();

usersRouter.post(
  "/registration",
  validateBody(authSchema),
  registrationController
);
usersRouter.post("/login", validateBody(authSchema), loginController);
usersRouter.post("/logout", authMiddleware, logoutController);
usersRouter.get("/current", authMiddleware, currentUserController);
usersRouter.patch(
  "/",
  validateBody(updateSubscriptionSchema),
  authMiddleware,
  updateSubscriptionController
);

export default usersRouter;
