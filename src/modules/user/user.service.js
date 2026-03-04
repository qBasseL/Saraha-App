import { notFoundException } from "../../common/utils/index.js";
import { UserModel } from "../../DB/index.js";
import { findById } from "../../DB/index.js";

export const getUser = async (data) => {
  const user = await findById({
    model: UserModel,
    id: data,
    options: {
        lean: true
    }
  });
  if (!user) {
    return notFoundException({ Message: "Couldn't Find That User" });
  }
  return user;
};
