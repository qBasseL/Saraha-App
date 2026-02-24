import { Router } from "express";
import { signup } from "./auth.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";
const router = Router();

router.post("/signup", async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({ res, status: 201, data: result });
});

router.post("/login", async (req, res, next) => {
  const result = await signup(req.body);
  return successResponse({ res, status: 200, data: result });
});


export default router;
