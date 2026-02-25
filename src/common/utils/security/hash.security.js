import { hash, genSalt, compare } from "bcrypt";
import { SALT_ROUND } from "../../../../config/config.service.js";
import * as argon2 from "argon2";
import { HashApproachEnums } from "../../enums/security.enum.js";

export const generateHash = async ({
  plaintext,
  salt = SALT_ROUND,
  minor = "b",
  approach = HashApproachEnums.bcrypt,
} = {}) => {
  let hashValue;
  switch (approach) {
    case "argon2":
      hashValue = await argon2.hash(plaintext);
      break;

    default:
      const generateSalt = await genSalt(salt, minor);
      hashValue = await hash(plaintext, generateSalt);
      break;
  }
  return hashValue;
};

export const compareHash = async ({
  plaintext,
  cipherText,
  approach = HashApproachEnums.bcrypt,
} = {}) => {
  let match = false;
  switch (approach) {
    case "argon2":
      match = await argon2.verify(cipherText, plaintext);
      break;

    default:
      match = await compare(plaintext, cipherText);
      break;
  }
  return match;
};
