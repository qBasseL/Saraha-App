import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { getUser } from "./user.service.js";

const router = Router();

router.get('/:userId', async(req, res, next) => {
    const result = await getUser(req.params.userId);
    return successResponse({res, status: 200, data: result})
})

export default router