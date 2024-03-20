import {
  login,
  logout,
  registration,
  currentUser,
  updateSubscription,
} from "../services/usersServices.js";

export const registrationController = async (req, res) => {
  try {
    const user = await registration(req.body);
    res.json(user);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const user = await login(req.body);
    res.json(user);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    await logout(req.user);
    res.status(204).json({ message: "No Content" });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

export const currentUserController = async (req, res) => {
  try {
    const user = await currentUser(req.headers.authorization.split(" ")[1]);
    res.json(user);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

export const updateSubscriptionController = async (req, res) => {
  try {
    const user = await updateSubscription(
      req.headers.authorization.split(" ")[1],
      req.body
    );
    res.json(user);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};
