import {
  badRequestException,
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
  WEB_CLIENT_ID,
} from "../../../config/config.service.js";
import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "../../common/enums/user.enum.js";

const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client(WEB_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: WEB_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email_verified) {
    return badRequestException({ Message: "Can't use this email" });
  }

  return payload;
};

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
    filter: { email, provider:ProviderEnum.System },
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

  return createLoginCredentials(checkUser);
};

export const signupWithGmail = async (idToken) => {
  const payload = await verifyGoogleAccount(idToken);

  const checkUser = await findOne({
    model: UserModel,
    filter: {
      email: payload.email,
    },
  });

  if (checkUser) {
    if (checkUser.provider !== ProviderEnum.Google) {
      return conflictException({ Message: "Try to login with Google" });
    }
    return await loginWithGmail(idToken) ;
  }

  const user = await insertOne({
    model: UserModel,
    data: {
      firstName: payload.given_name,
      lastName: payload.family_name || "empty",
      email: payload.email,
      profilePicture: payload.picture,
      confirmEmail: new Date(),
      provider: ProviderEnum.Google,
    },
  });

  return { status: 201, credentials: await createLoginCredentials(user) };
};

export const loginWithGmail = async (idToken) => {
  const payload = await verifyGoogleAccount(idToken);

  const checkUser = await findOne({
    model: UserModel,
    filter: {
      email: payload.email,
      provider: ProviderEnum.Google,
    },
    options: {
      lean: true,
    },
  });

  if (!checkUser) {
    return notFoundException({
      Message: "This Account is not found",
    });
  }

  if (checkUser.provider !== ProviderEnum.Google) {
    return conflictException({
      Message: "Try logging in with your normal credentials.",
    });
  }

   return {
    status: 200,
    credentials: await createLoginCredentials(checkUser),
  };
};
