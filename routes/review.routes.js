const express = require("express");

const reviewRouter = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

reviewRouter.post(
  "/:prod_id/reviews",
  authMiddleware,
  reviewController.createReview
);

reviewRouter.get("/:prod_id/reviews", reviewController.getProductAllReviews);
reviewRouter.get("/:prod_id/reviews/:rev_id", reviewController.getSingleReview);

reviewRouter.delete(
  "/:prod_id/reviews/:rev_id",
  authMiddleware,
  reviewController.deleteReview
);

reviewRouter.patch(
  "/:prod_id/reviews/:rev_id",
  authMiddleware,
  reviewController.updateReview
);

module.exports = { reviewRouter };
