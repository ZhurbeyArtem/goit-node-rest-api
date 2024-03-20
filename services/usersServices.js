import bcrypt from "bcryptjs";
import { User } from "../mongoose/schemas/users.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";

export async function registration({ email, password }) {
  try {
    await findUser(email, "registration");
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.salt)
    );
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return {
      email: newUser.email,
      subscription: newUser.subscription,
    };
  } catch (error) {
    throw {
      message: error.message || "Ops something happened wrong",
      status: error.status || 500,
    };
  }
}

export async function login({ email, password }) {
  try {
    const data = await findUser(email, "login");

    const comparePassword = bcrypt.compareSync(password, data.password);
    if (!comparePassword) {
      throw HttpError({
        status: "error",
        code: 401,
        message: "Password is wrong",
      });
    }
    const token = jwt.sign(
      { id: data.id, email: data.email },
      process.env.SECRET,
      {
        expiresIn: "24h",
      }
    );
    data.token = token;
    await data.save();
    return {
      token,
      user: {
        email: data.email,
        subscription: data.subscription,
      },
    };
  } catch (error) {
    throw {
      message:
        error.status.message || error.message || "Ops something happened wrong",
      status: error.status.code || error.status || 500,
    };
  }
}

export async function logout({ id }) {
  try {
    const user = await findUserById(id);
    user.token = null;
    await user.save();
  } catch (error) {
    throw {
      message: error.status.message || "Ops something happened wrong",
      status: error.status.code || 500,
    };
  }
}

async function findUser(email, method) {
  try {
    const user = await User.findOne({ email }).exec();
    if (user && method === "registration") {
      throw HttpError({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      });
    }
    if (!user && method === "login") {
      throw HttpError({
        status: "error",
        code: 401,
        message: "Email is wrong",
      });
    }
    return user;
  } catch (error) {
    throw {
      message: error.status.message || "Ops something happened wrong",
      status: error.status.code || 500,
    };
  }
}

export async function findUserById(id) {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      throw HttpError({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    return user;
  } catch (error) {
    throw {
      message: error.status.message || "Ops something happened wrong",
      status: error.status.code || 500,
    };
  }
}

export async function currentUser({ token }) {
  try {
    const user = await User.findOne({ token }).exec();
    if (!user) {
      throw HttpError({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    return {
      email: user.email,
      subscription: user.subscription,
    };
  } catch (error) {
    throw {
      message: error.status.message || "Ops something happened wrong",
      status: error.status.code || 500,
    };
  }
}
export async function updateSubscription( token, {subscription}) {
  try {
    const user = await User.findOne({ token }).exec();
    if (!user) {
      throw HttpError({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    user.subscription = subscription;
    await user.save();
    return {
      email: user.email,
      subscription: user.subscription,
    };
  } catch (error) {
    throw {
      message: error.status.message || "Ops something happened wrong",
      status: error.status.code || 500,
    };
  }
}
