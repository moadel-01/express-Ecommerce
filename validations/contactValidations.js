const joi = require("joi");

const contactValidation = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),

  subject: joi
    .string()
    .valid("technical", "orders", "billing", "else")
    .default("else"),

  message: joi.string().required(),

  city: joi.string(),
  strret: joi.string(),
});

module.exports = { contactValidation };
