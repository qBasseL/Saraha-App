import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../../config/config.service.js";
import { LogoutEnums } from "../../common/enums/security.enum.js";
import {
  deletekey,
  revokeTokenKey,
  set,
  keys,
  baseRevokeTokenKey,
} from "../../common/services/redis.service.js";
import {
  compareHash,
  conflictException,
  createLoginCredentials,
  decodeToken,
  errorException,
  generateDecryption,
  generateHash,
  notFoundException,
} from "../../common/utils/index.js";
import {
  deleteMany,
  findByIdAndUpdate,
  findOne,
  insertOne,
} from "../../DB/database.repository.js";
import { UserModel } from "../../DB/index.js";
import { TokenModel } from "../../DB/models/token.model.js";

export const getUser = async (user) => {
  // const decodeToken = jwt.decode(token);

  return user;
};

export const profileImage = async (user, file) => {
  user.profilePicture = file.finalPath;
  // console.log(user);
  await user.save();
  return user;
};

export const profileCoverImage = async (user, files) => {
  user.coverProfilePictures = files.map((file) => file.finalPath);
  // console.log(user);
  await user.save();
  return user;
};

export const rotateToken = async (user, { jti, iat, sub }) => {
  if ((iat + ACCESS_TOKEN_EXPIRES_IN) * 1000 > Date.now() + 30000) {
    return conflictException({
      Message: "Current access token is still valid",
    });
  }
  await set({
    key: revokeTokenKey({ userId: sub, jti }),
    value: jti,
    ttl: iat + REFRESH_TOKEN_EXPIRES_IN,
  });
  return createLoginCredentials(user);
};

export const shareProfile = async (data) => {
  const profile = await findOne({
    model: UserModel,
    filter: { _id: data },
    select: "-password",
  });

  if (!profile) {
    throw notFoundException({ Message: "Sorry we couldn't find that user" });
  }

  if (profile.phone) {
    profile.phone = await generateDecryption(profile.phone);
  }

  return profile;
};

export const logout = async ({ flag }, user, { jti, iat, sub }) => {
  let status = 200;

  switch (flag) {
    case LogoutEnums.All:
      user.changeCredentialTime = new Date();
      await user.save();
      await deletekey({
        key: await keys({
          prefix: baseRevokeTokenKey({ userId: sub }),
        }),
      });
      break;

    default:
      await set({
        key: revokeTokenKey({ userId: sub, jti }),
        value: jti,
        ttl: iat + REFRESH_TOKEN_EXPIRES_IN,
      });
      status = 201;
      break;
  }

  return status;
};


export const updatePassword = async(user, data) => {
  const {oldPassword, password} = data

  if(! await compareHash({plaintext:oldPassword, cipherText:user.password})) {
    return conflictException({Message: "invalid password"})
  }

  user.password = await generateHash({plaintext: password})
  user.changeCredentialTime = new Date()
  await user.save()
  await deletekey({key: await keys({prefix: baseRevokeTokenKey({userId: user._id})})})

  return await createLoginCredentials(user)
}