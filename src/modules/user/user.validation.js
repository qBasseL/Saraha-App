import joi from "joi";
import {
  fileFieledValidation,
  generalValidationField,
} from "../../common/utils/index.js";

export const sharedProfile = {
  params: joi
    .object()
    .keys({
      userId: generalValidationField.id.required(),
    })
    .required(),
};

export const updatePassword = {
  body: joi.object().keys({
    oldPassword: generalValidationField.password.required(),
    password: generalValidationField.password.not(joi.ref('oldPassword')).required(),
    confirmPassword: generalValidationField.confirmPassword('password'),
  }).required()
}

export const fileValidation = {
  file: joi
    .object()
    .keys({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi
        .string()
        .valid(...Object.values(fileFieledValidation.Image))
        .required(),
      finalPath: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number().required(),
    })
    .required(),
};

export const filesValidation = {
  files: joi
    .array()
    .items(
      joi
        .object()
        .keys({
          fieldname: joi.string().required(),
          originalname: joi.string().required(),
          encoding: joi.string().required(),
          mimetype: joi
            .string()
            .valid(...Object.values(fileFieledValidation.Image))
            .required(),
          finalPath: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().required(),
        })
        .required(),
    )
    .min(1)
    .required(),
};
