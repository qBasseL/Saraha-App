import { TokenTypeEnums } from "../common/enums/security.enum.js"
import { decodeToken } from "../common/utils/index.js"

export const authenticate = (tokenType = TokenTypeEnums.Access) => {
    return async (req, res, next) => {
        req.user = await decodeToken({token: req.headers.authorization, tokenType})
        next()
    }
}