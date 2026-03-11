import {
  conflictException,
  createLoginCredentials,
  forbiddenException,
  generateDecryption,
  generateEncryption,
  notFoundException,
} from "../../common/utils/index.js";
import { UserModel, findOne, insertOne } from "../../DB/index.js";
import { generateHash, compareHash } from "../../common/utils/index.js";
import jwt from "jsonwebtoken";
import {
  TOKEN_ACCESS_SECRET_KEY,
  TOKEN_REFRESH_SECRET_KEY,
} from "../../../config/config.service.js";

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
      phone: await generateEncryption(phone),
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
  checkUser.phone = await generateDecryption(checkUser.phone);
  const match = await compareHash({
    plaintext: password,
    cipherText: checkUser.password,
    // approach: HashApproachEnums.argon2
  });

  if (!match) {
    return notFoundException({ Message: "Email or password is wrong" });
  }

  return createLoginCredentials(checkUser)
};
