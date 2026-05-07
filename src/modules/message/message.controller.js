import { Router } from "express";
import {
  fileFieldValidation,
  localFileUpload,
  successResponse,
} from "../../common/utils/index.js";
import { sendMessage, getMessages } from "./message.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/authentication.middleware.js";
import * as validators from "./message.validation.js";

const router = Router();

router.post(
  "/:receiverId",
  authenticate(),
  localFileUpload("Message", fileFieldValidation.Image, 5).array("attachments", 2),
  validation(validators.message),
  async (req, res, next) => {
    const message = await sendMessage(req.params.receiverId, req.body, req.files, req.user._id);
    return successResponse({ res, status: 201, data: { message } });
  },
);

router.get(
  "/",
  authenticate(),
  async (req, res, next) => {
    const messages = await getMessages(req.user._id);
    return successResponse({ res, status: 200, data: { messages } });
  },
);

export default router;
