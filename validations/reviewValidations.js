const joi = require("joi");

const reviewValidation = joi.object({
  comment: joi.string().min(4).required(),
  rating: joi.number().min(1).max(5).required(),
});

const updateReviewValidation = joi.object({
  comment: joi.string().min(4),
  rating: joi.number().min(1).max(5),
});

module.exports = { reviewValidation, updateReviewValidation };
