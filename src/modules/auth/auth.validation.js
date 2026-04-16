import joi from "joi";
import { generalValidationField } from "../../common/utils/validation.js";

export const login = {
  body: joi.object().keys({
      email: generalValidationField.email.required(),
      password: generalValidationField.password.required(),
    }).required(),
};

export const signup = {
  body: login.body
    .append()
    .keys({
      username: generalValidationField.username.required(),
      phone: generalValidationField.phone.required(),
      confirmPassword: generalValidationField.confirmPassword("password"),
    }).required(),
};

export const confirmEmail = {
  body: joi.object().keys({
    email: generalValidationField.email.required(),
    otp: generalValidationField.otp.required()
  }).required()
};

