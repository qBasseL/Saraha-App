import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";
import { UserModel } from "./models/user.model.js";

export const authenticateDB = async () => {
  try {
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 2000 });
    await UserModel.syncIndexes()
    console.log(`Connected To Database`);
  } catch (error) {
    console.error(`Couldn't Connect To Database`, error)
  }
};
