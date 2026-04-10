import { Router } from "express";
import { localFileUpload, successResponse } from "../../common/utils/index.js";
import { getUser, profileImage, rotateToken, shareProfile } from "./user.service.js";
import {
  authenticate,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { TokenTypeEnums } from "../../common/enums/security.enum.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js";

const router = Router();

router.patch(
  "/profile-image",
  authenticate(),
  localFileUpload("profile picture").single("attachment"),
  async (req, res, next) => {
    const result = await profileImage(req.user, req.file)
    return successResponse({ res, status: 200, data: { result } });
  },
);

router.get(
  "/",
  authenticate(),
  authorization([RoleEnum.Admin, RoleEnum.User]),
  async (req, res, next) => {
    const result = await getUser(req.user);
    return successResponse({ res, status: 200, data: result });
  },
);

router.get(
  "/:userId/shared-profile",
  validation(validators.sharedProfile),
  async (req, res, next) => {
    const result = await shareProfile(req.params.userId);
    return successResponse({ res, status: 200, data: result });
  },
);

router.post(
  "/token-rotate",
  authenticate(TokenTypeEnums.Refresh),
  authorization([RoleEnum.Admin, RoleEnum.User]),
  async (req, res, next) => {
    const result = await rotateToken(req.user);
    return successResponse({ res, status: 201, data: result });
  },
);

export default router;
