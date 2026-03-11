import {
  conflictException,
  createLoginCredentials,
  decodeToken,
  errorException,
  notFoundException,
} from "../../common/utils/index.js";

export const getUser = async (user) => {
  // const decodeToken = jwt.decode(token);

  return user;
};

export const rotateToken = async (user) => {
  // const decodeToken = jwt.decode(token);

  return createLoginCredentials(user);
};
