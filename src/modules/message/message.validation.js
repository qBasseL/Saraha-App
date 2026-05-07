import joi from "joi";
import { fileFieldValidation, generalValidationField } from "../../common/utils/index.js";

export const message = {
  params: joi
    .object()
    .keys({
      receiverId: generalValidationField.id.required(),
    })
    .required(),
  body: joi
    .object()
    .keys({
      content: joi.string().min(2).max(10000).required(),
    })
    .required(),
  files: joi
    .object()
    .keys({
      images: joi
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
                .valid(...Object.values(fileFieldValidation.Image))
                .required(),
              finalPath: joi.string().required(),
              destination: joi.string().required(),
              filename: joi.string().required(),
              path: joi.string().required(),
              size: joi.number().required(),
            })
            .required(),
        )
        .min(0)
        .max(2),
    })
    .required(),
};
