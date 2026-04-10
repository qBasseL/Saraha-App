import joi from "joi";
import { Types } from "mongoose";

export const generalValidationField = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "any.required": "email is a required field",
      "string.empty": "email cant be empty",
      "string.base": "email must be a string",
    }),
  password: joi
    .string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
      ),
    )

    .messages({
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must be 8-32 chars, include upper, lower, number & special char",
    }),

  username: joi.string().min(3).max(50).messages({
    "any.required": "username is a required field",
    "string.empty": "username cant be empty",
    "string.base": "username must be a string",
  }),
  phone: joi.string().pattern(new RegExp(/^(00201|01|\+201)(0|1|2|5)\d{8}$/)),

  confirmPassword: (path = "password") =>
    joi
      .string()
      .valid(joi.ref(path))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "confirmPassword is required",
      })
      .strip(),

  id: joi.string().custom((value, helper) => {
    if (!Types.ObjectId.isValid(value)) {
      return helper.message("Invalid MongoDB ObjectId");
    }
    return value;
  }),
};
