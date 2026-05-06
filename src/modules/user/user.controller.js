import { Router } from "express";
import { localFileUpload, successResponse } from "../../common/utils/index.js";
import { getUser, logout, profileCoverImage, profileImage, rotateToken, shareProfile, updatePassword } from "./user.service.js";
import {
  authenticate,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { TokenTypeEnums } from "../../common/enums/security.enum.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js";
import { fileFieledValidation } from "../../common/utils/index.js";

const router = Router();

router.post('/logout', authenticate(), async (req, res, next) => {
  const status = await logout(req.body, req.user, req.decoded)
  return successResponse({ res, status});
})

router.patch(
  "/profile-image",
  authenticate(),
  localFileUpload("profile picture" , fileFieledValidation.Image).single("attachment"),
  validation(validators.fileValidation),
  async (req, res, next) => {
    const result = await profileImage(req.user, req.file)
    return successResponse({ res, status: 200, data: { result } });
  },
);

router.patch(
  "/update-password",
  authenticate(),
  validation(validators.updatePassword),
  async (req, res, next) => {
    const result = await updatePassword(req.user, req.body)
    return successResponse({ res, status: 200, data: { result } });
  },
);

router.patch(
  "/profile-cover-image",
  authenticate(),
  localFileUpload("profile cover picture" , fileFieledValidation.Image).array("attachments", 3),
  validation(validators.filesValidation),
  async (req, res, next) => {
    const result = await profileCoverImage(req.user, req.files)
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
    const result = await rotateToken(req.user, req.decoded);
    return successResponse({ res, status: 201, data: result });
  },
);

export default router;
