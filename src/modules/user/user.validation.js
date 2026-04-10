import joi from "joi";
import { generalValidationField } from "../../common/utils/index.js";

export const sharedProfile = {
  params: joi.object().keys({
    userId: generalValidationField.id.required(),
  }).required(),
};
