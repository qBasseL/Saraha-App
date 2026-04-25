import { Router } from "express";
import {
  signup,
  login,
  signupWithGmail,
  loginWithGmail,
  confirmSignup,
  resendConfirmSignup,
  forgotPassword,
  verifyForgotPassword,
  resetPassword
} from "./auth.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { badRequestException } from "../../common/utils/index.js";
import * as validators from './auth.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
const router = Router();


router.post("/signup", validation(validators.signup), async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({ res, status: 201, data: result });
});

router.patch("/confirm-email", validation(validators.confirmEmail), async (req, res, next) => {
  const result = await confirmSignup(req.body);
  return successResponse({ res, status: 200, data: result });
});

router.patch("/resend-confirm-email", validation(validators.resendConfirmEmail), async (req, res, next) => {
  const result = await resendConfirmSignup(req.body);
  return successResponse({ res, status: 200, data: result });
});

router.post("/forgot-password", validation(validators.resendConfirmEmail), async (req, res, next) => {
  const result = await forgotPassword(req.body);
  return successResponse({ res, status: 200, data: result });
});

router.post("/confirm-forgot-password", validation(validators.confirmEmail), async (req, res, next) => {
  const result = await verifyForgotPassword(req.body);
  return successResponse({ res, status: 200, data: result });
});

router.patch("/reset-forgot-password", validation(validators.resetPassword), async (req, res, next) => {
  const result = await resetPassword(req.body);
  return successResponse({ res, status: 200, data: result });
});

router.post("/login", validation(validators.login), async (req, res, next) => {
  const result = await login(req.body);
  return successResponse({ res, status: 200, data: result });
});

router.post("/signup/gmail", async (req, res, next) => {
  const { status, credentials } = await signupWithGmail(
    req.body.idToken,
    `${req.protocol}://${req.host}`,
  );
  return successResponse({ res, status, data: credentials });
});

router.post("/login/gmail", async (req, res, next) => {
  const { status, credentials } = await loginWithGmail(req.body.idToken);
  return successResponse({ res, status, data: credentials });
});

export default router;
