import jwt from "jsonwebtoken";
import { findUserById } from "../services/usersServices.js";

export const authMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw Error;
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await findUserById(decoded.id);
    if (user.token !== token || !user) {
      throw Error;
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "User doesn`t auth" });
  }
};
