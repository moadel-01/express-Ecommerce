const joi = require("joi");

const userValidation = joi.object({
  email: joi.string().email().required(),
  username: joi.string().min(3).required(),
  password: joi.string().min(8).required(),
  age: joi.number().min(18).required(),

  role: joi.string().valid("USER", "ADMIN").default("USER"),
});

const updateValidation = joi.object({
  email: joi.string().email(),
  username: joi.string().min(3),
  oldPassword: joi.string(),
  password: joi.string().min(8),
  age: joi.number().min(18),

  role: joi.string().valid("USER", "ADMIN"),
})

const loginValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = { userValidation, loginValidation, updateValidation };
