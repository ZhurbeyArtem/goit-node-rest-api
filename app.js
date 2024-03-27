import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
dotenv.config();

import mainRouter from "./routes/index.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use('/avatars',express.static(join(__dirname, "public/avatars")));

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
app.use("/api", mainRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

main();
