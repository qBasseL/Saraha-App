import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { getUser, rotateToken } from "./user.service.js";

const router = Router();

router.get('/', async(req, res, next) => {
    const result = await getUser(req.headers.authorization);
    return successResponse({res, status: 200, data: result})
})

router.post('/token-rotate', async(req, res, next) => {
    const result = await rotateToken(req.headers.authorization,);
    return successResponse({res, status: 201, data: result})
})

export default router