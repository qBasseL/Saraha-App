import {
  conflictException,
  createLoginCredentials,
  decodeToken,
  errorException,
  generateDecryption,
  notFoundException,
} from "../../common/utils/index.js";
import { findByIdAndUpdate, findOne } from "../../DB/database.repository.js";
import { UserModel } from "../../DB/index.js";

export const getUser = async (user) => {
  // const decodeToken = jwt.decode(token);

  return user;
};

export const profileImage = async (user, file) => {
  user.profilePicture = file.finalPath
  // console.log(user);
  await user.save()
  return user
};

export const profileCoverImage = async (user, files) => {
  user.coverProfilePictures = files.map(file => file.finalPath)
  // console.log(user);
  await user.save()
  return user
}
export const rotateToken = async (user) => {
  // const decodeToken = jwt.decode(token);

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
