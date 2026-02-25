import {
  conflictException,
  forbiddenException,
  notFoundException,
} from "../../common/utils/index.js";
import { UserModel, findOne, insertOne } from "../../DB/index.js";
import { compare } from "bcrypt";
import { SALT_ROUND } from "../../../config/config.service.js";
import { generateHash } from "../../common/utils/index.js";

export const signup = async (data) => {
  const { username, email, password, phone } = data;
  const checkUser = await findOne({
    filter: { email },
    model: UserModel,
    options: {
      lean: true,
    },
  });
  if (checkUser) {
    return conflictException({ Message: "This Email Is Already Signed Up" });
  }
  const user = await insertOne({
    model: UserModel,
    data: {
      username,
      email,
      password: await generateHash({ plaintext: password }),
      phone,
    },
  });
  return user;
};

export const login = async (data) => {
  const { email, password } = data;
  const checkUser = await findOne({
    model: UserModel,
    filter: { email },
    // select:'firstName lastName email',
    options: {
      lean: true,
    },
  });
  if (!checkUser) {
    return notFoundException({ Message: "Couldn't Find This User" });
  }

  const match = await compare(password, checkUser.password);

  if (!match) {
    return notFoundException({ Message: "Email or password is wrong" });
  }

  return checkUser;
};
