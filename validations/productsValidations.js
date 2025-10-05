const joi = require("joi");

const productValidation = joi.object({
  title: joi.string().required().min(3),
  category: joi.string().required().min(3),
  price: joi.number().min(0).required(),
  description: joi.string().required(),
  stock: joi.number().min(0).required(),
});

const updateProductValidation = joi.object({
  title: joi.string().min(3),
  category: joi.string().min(3),
  price: joi.number().min(0),
  description: joi.string(),
  stock: joi.number().min(0),
});

module.exports = { productValidation, updateProductValidation };
