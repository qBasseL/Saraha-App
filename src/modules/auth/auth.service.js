import { conflictException, forbiddenException, notFoundException } from "../../common/utils/response/error.response.js"
import { UserModel } from "../../DB/models/index.js"

export const signup = async (data) => {
    const {username, email, password, phone, } = data
    const checkUser = await UserModel.findOne({
        email, password
    })
    if (checkUser) {
        return conflictException({Message:"This Email Is Already Signed Up"})
    }
    const user = await UserModel.insertOne({
        username, email, password, phone
    })
    return user
}

export const login = async (data) => {
    const {email, password} = data
    const checkUser = await UserModel.findOne({
        email, password
    })
    if (!checkUser) {
        return notFoundException({Message:"This Email Is Already Signed Up"})
    }
    return checkUser
}