import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import { TokenModel, UserModel } from "./index.js"

export const authenticateDB = async () => {
  try {
    console.log(`Connecting to Database...`);
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 500 });
    await UserModel.syncIndexes()
    await TokenModel.syncIndexes()
    console.log(`Connected`);
  } catch (error) {
    console.error(`Couldn't Connect To Database`, error)
  }
};
