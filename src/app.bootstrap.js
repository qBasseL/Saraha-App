import express from "express";
import { globalErrorHandler } from "./common/utils/response/error.response.js";
import { PORT } from "../config/config.service.js";
import { authenticateDB } from "./DB/db.connection.js";
import { authRouter, userRouter } from "./modules/index.js";
import helmet from "helmet";
import cors from "cors";
import { resolve } from "node:path";
import { connectRedis, redisClient } from "./DB/index.js";
import { get, set } from "./common/services/index.js";
import { sendEmail } from "./common/utils/index.js";

const bootstrap = async () => {
  const app = express();
  app.use(
    express.json(),
    helmet(),
    cors({
      origin: "http://localhost:4200",
    }),
  );
  app.use("/uploads", express.static(resolve(`../uploads`)));

  await authenticateDB();
  await connectRedis();
  
  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.use("{/*dummy}", (req, res, next) => {
    return res.status(404).json({
      Message: "Invalid Routing",
    });
  });

  app.use(globalErrorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default bootstrap;
