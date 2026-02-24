import express from "express";
import { globalErrorHandler } from "./common/utils/response/error.response.js";
import { PORT } from "../config/config.service.js";
import { authenticateDB } from "./DB/db.connection.js";
import { authRouter } from "./modules/index.js";

const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  await authenticateDB();

  app.use('/auth', authRouter)

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
