import { Router } from "express";
import {
  signup,
  login,
  signupWithGmail,
  loginWithGmail,
} from "./auth.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";
const router = Router();

router.post("/signup", async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({ res, status: 201, data: result });
});

router.post("/login", async (req, res, next) => {
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
