import { TokenTypeEnums } from "../common/enums/security.enum.js";
import { decodeToken, forbiddenException } from "../common/utils/index.js";

export const authenticate = (tokenType = TokenTypeEnums.Access) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return forbiddenException({ Message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    // console.log(token);
    const {user, decoded} = await decodeToken({ token, tokenType });
    req.user = user
    req.decoded = decoded
    next();
  };
};

export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!req.user) {
      return forbiddenException({ Message: "Not authenticated" });
    }
    if (!accessRoles.includes(req.user.role)) {
      return forbiddenException({ Message: "Can't Access This Page" });
    }
    next();
  };
};
