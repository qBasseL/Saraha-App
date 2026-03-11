import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { getUser, rotateToken } from "./user.service.js";
import { authenticate } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnums } from "../../common/enums/security.enum.js";

const router = Router();

router.get('/', authenticate(), async(req, res, next) => {
    const result = await getUser(req.user);
    return successResponse({res, status: 200, data: result})
})

router.post('/token-rotate', authenticate(TokenTypeEnums.Refresh), async(req, res, next) => {
    const result = await rotateToken(req.user);
    return successResponse({res, status: 201, data: result})
})

export default router