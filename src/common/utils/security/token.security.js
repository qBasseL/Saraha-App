import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  SYSTEM_TOKEN_ACCESS_SECRET_KEY,
  SYSTEM_TOKEN_REFRESH_SECRET_KEY,
  TOKEN_ACCESS_SECRET_KEY,
  TOKEN_REFRESH_SECRET_KEY,
} from "../../../../config/config.service.js";
import { errorException, notFoundException, unauthorizedException } from "../response/index.js";
import { findOne, UserModel } from "../../../DB/index.js";
import { RoleEnum, TokenTypeEnums } from "../../enums/index.js";
import { randomUUID } from "node:crypto";
import { TokenModel } from "../../../DB/models/token.model.js";

export const generateToken = ({
  payload = {},
  secretKey,
  options = {},
} = {}) => {
  if (!secretKey) {
    return errorException({
      Message: "Token Secret Key Is Missing",
      status: 400,
    });
  }
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey, issuer, audience } = {}) => {
  return jwt.verify(token, secretKey, { issuer, audience });
};

export const detectSignatureLevels = (level) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };

  switch (level) {
    case RoleEnum.Admin:
      signature = {
        accessSignature: SYSTEM_TOKEN_ACCESS_SECRET_KEY,
        refreshSignature: SYSTEM_TOKEN_REFRESH_SECRET_KEY,
      };
      break;

    default:
      signature = {
        accessSignature: TOKEN_ACCESS_SECRET_KEY,
        refreshSignature: TOKEN_REFRESH_SECRET_KEY,
      };
      break;
  }

  return signature;
};

export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnums.Access,
} = {}) => {
  const decoded = jwt.decode(token);

  if (!decoded) {
    return notFoundException({ Message: "Invalid Token Payload" });
  }
  const { accessSignature, refreshSignature } = detectSignatureLevels(
    decoded.role,
  );

  const secretKey = tokenType === "access" ? accessSignature : refreshSignature;
  let verifiedData;

  try {
    verifiedData = verifyToken({
      token: token,
      secretKey: secretKey,
      issuer: "bassel-api",
      audience: decoded.role,
    });
  } catch (error) {
    return notFoundException({ Message: "Wrong Token" });
  }

  if (verifiedData.type !== tokenType) {
    return notFoundException({ Message: "Invalid Token Type" });
  }

  if (
    decoded.jti &&
    (await findOne({
      model: TokenModel,
      filter: {
        jti: decoded.jti,
      },
    }))
  ) {
    return unauthorizedException({ Message: "Invalid Login Session" });
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

  if (
    user.changeCredentialTime &&
    user.changeCredentialTime?.getTime() >= decoded.iat * 1000
  ) {
    return unauthorizedException({ Message: "Invalid Login Session" });
  }

  return { user, decoded };
};

export const createLoginCredentials = (user) => {
  const { accessSignature, refreshSignature } = detectSignatureLevels(
    user.role,
  );

  const jwtid = randomUUID();

  const access_token = generateToken({
    payload: { sub: user._id, role: user.role, type: "access" },
    secretKey: accessSignature,
    options: {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      issuer: "bassel-api",
      audience: [user.role],
      jwtid,
    },
  });

  const refresh_token = generateToken({
    payload: { sub: user._id, role: user.role, type: "refresh" },
    secretKey: refreshSignature,
    options: {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      issuer: "bassel-api",
      audience: [user.role],
      jwtid,
    },
  });

  return { access_token, refresh_token };
};
