import jwt from "jsonwebtoken";
import {
  TOKEN_ACCESS_SECRET_KEY,
  TOKEN_REFRESH_SECRET_KEY,
} from "../../../../config/config.service.js";
import { notFoundException } from "../response/error.response.js";
import { findOne, UserModel } from "../../../DB/index.js";

export const generateToken = ({
  payload = {},
  secretKey = TOKEN_ACCESS_SECRET_KEY,
  options = {},
} = {}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey } = {}) => {
  return jwt.verify(token, secretKey);
};

export const decodeToken = async ({ token, tokenType = "access" } = {}) => {
  const secretKey =
    tokenType === "access" ? TOKEN_ACCESS_SECRET_KEY : TOKEN_REFRESH_SECRET_KEY;
  let verifiedData;

  try {
    verifiedData = verifyToken({
      token: token,
      secretKey: secretKey,
    });
  } catch (error) {
    return notFoundException({ Message: "Wrong Token" });
  }

  const user = await findOne({
    model: UserModel,
    filter: {
      _id: verifiedData.sub,
    },
  });

  if (!user) {
    return notFoundException({ Message: "Couldn't find that user" });
  }

  return user;
};

export const createLoginCredentials = (user) => {
  const access_token = generateToken({
    payload: { sub: user._id },
    secretKey: TOKEN_ACCESS_SECRET_KEY,
    options: {
      expiresIn: "15m",
      issuer: "bassel-api",
      audience: ["Web", "Mobile"],
    },
  });

  const refresh_token = generateToken({
    payload: { sub: user._id },
    secretKey: TOKEN_REFRESH_SECRET_KEY,
    options: {
      expiresIn: "1y",
      issuer: "bassel-api",
      audience: ["Web", "Mobile"],
    },
  });

  return { access_token, refresh_token };
};
