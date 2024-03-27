import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import Jimp from "jimp";

import { User } from "../mongoose/schemas/users.js";
import HttpError from "../helpers/HttpError.js";

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
      avatarURL: gravatar.url(email),
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
export async function updateSubscription(token, { subscription }) {
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

export async function updateAvatar(token, req) {
  try {
    const user = await User.findOne({ token }).exec();
    if (!user) {
      throw HttpError({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userUniqueName = decoded.email.split("@")[0];
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tmp = path.join(__dirname, "..", "tmp");
    const avatars = path.join(__dirname, "..", "public/avatars");
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, tmp);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, userUniqueName + "-" + uniqueSuffix + "-" + file.originalname);
      },
    });
    const upload = multer({ storage: storage }).single("avatar");

    const fileName = await new Promise((resolve, reject) => {
      upload(req, {}, function (err) {
        if (err instanceof multer.MulterError || err) {
          throw HttpError({
            status: "error",
            code: 500,
            message: err.message,
          });
        }
        const fileName = req.file.filename;
        resolve(fileName);
      });
    });

    const img = await Jimp.read(`${tmp}/${fileName}`);
    img.resize(250, 250);
    img.write(avatars + "/" + fileName);

    fs.unlink(`${tmp}/${fileName}`, (err) => {
      if (err) {
        throw HttpError({
          status: "error",
          code: 500,
          message: err.message,
        });
      }
    });
    user.avatarURL = `/avatars/${fileName}`;
    await user.save();
    return `/avatars/${fileName}`;
  } catch (error) {
    console.log(error);
    throw {
      message: error.status.message || "Ops something happened wrong",
      status: error.status.code || 500,
    };
  }
}
