import Joi from "joi";

export const registerValidator = Joi.object({
  email: Joi.string().email().required(),
});
