import {
  conflictException,
  createLoginCredentials,
  decodeToken,
  errorException,
  notFoundException,
} from "../../common/utils/index.js";

export const getUser = async (token) => {
  // const decodeToken = jwt.decode(token);
  const user = await decodeToken({ token, tokenType: "access" });
  return user;
};

export const rotateToken = async (token) => {
  // const decodeToken = jwt.decode(token);
  const user = await decodeToken({ token, tokenType: "refresh" });

  return createLoginCredentials(user);
};
