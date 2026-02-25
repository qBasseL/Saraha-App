import { conflictException, forbiddenException, notFoundException } from "../../common/utils/index.js"
import { UserModel, findOne } from "../../DB/index.js"


export const signup = async (data) => {
    const {username, email, password, phone, } = data
    const checkUser = await findOne({
        filter: {email},
        model: UserModel
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
        return notFoundException({Message:"Couldn't Find This User"})
    }
    return checkUser
}