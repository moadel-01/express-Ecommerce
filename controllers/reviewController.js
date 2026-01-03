const { Product } = require("../models/product");
const { Review } = require("../models/review");
const {
  reviewValidation,
  updateReviewValidation,
} = require("../validations/reviewValidations");

async function createReview(req, res) {
  const { prod_id } = req.params;

  try {
    const productExist = await Product.findById(prod_id);
    if (!productExist) {
      return res.status(404).json({ message: "product not found" });
    }

    const { error, value } = reviewValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const reviewer = { id: req.user.id, username: req.user.username };

    const product = {
      prod_id: productExist._id,
      title: productExist.title,
      price: productExist.price,
      thumbnail: productExist.thumbnail,
    };

    const reviewerExist = await Review.findOne({
      "product.prod_id": prod_id,
      "reviewer.id": reviewer.id,
    });

    if (reviewerExist) {
      return res.status(403).json({ message: "you already left a review!" });
    }

    const review = { ...value, product, reviewer };
    console.log(review);

    const finReview = await Review.create(review);

    const allReviews = await Review.find({ "product.prod_id": prod_id });

    const rating =
      allReviews.reduce((acc, cur) => acc + cur.rating, 0) / allReviews.length;

    const upd_prod = await Product.findByIdAndUpdate(prod_id, {
      rating: rating.toFixed(1),
    });

    res.status(201).json({ message: "review added", data: finReview });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

async function getProductAllReviews(req, res) {
  const { prod_id } = req.params;

  try {
    const product = await Product.findById(prod_id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    const prodReviews = await Review.find(
      { prod_id: prod_id },
      "reviewer comment rating createdAt"
    );

    res
      .status(200)
      .json({ message: `all ${product.title} reviews`, data: prodReviews });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

async function deleteReview(req, res) {
  const { prod_id, rev_id } = req.params;

  try {
    const product = await Product.findById(prod_id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    // console.log(product);

    const review = await Review.findById(rev_id);
    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }

    if (req.user.id !== review.reviewer.id.toString()) {
      return res
        .status(403)
        .json({ message: "you do not have the access to delete this review" });
    }

    const del_rev = await Review.deleteOne({ _id: rev_id });

    const allReviews = await Review.find({ "product.prod_id": prod_id });

    const rating =
      allReviews.reduce((acc, cur) => acc + cur.rating, 0) / allReviews.length;

    const upd_prod = await Product.findByIdAndUpdate(prod_id, {
      rating: rating.toFixed(1),
    });

    res.status(200).json({ message: "review deleted" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

async function updateReview(req, res) {
  const { prod_id, rev_id } = req.params;

  try {
    const { error, value } = updateReviewValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const product = await Product.findById(prod_id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    const review = await Review.findById(rev_id);
    if (!review) {
      return res.status(404).json({ message: "review not found" });
    }

    if (req.user.id !== review.reviewer.id.toString()) {
      return res
        .status(403)
        .json({ message: "you do not have the access to update this review" });
    }

    const new_rev = await Review.findByIdAndUpdate(rev_id, value);

    const allReviews = await Review.find({ "product.prod_id": prod_id });

    const rating =
      allReviews.reduce((acc, cur) => acc + cur.rating, 0) / allReviews.length;

    const upd_prod = await Product.findByIdAndUpdate(prod_id, {
      rating: rating.toFixed(1),
    });

    res.status(200).json({ message: "review updated" });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

module.exports = {
  createReview,
  getProductAllReviews,
  deleteReview,
  updateReview,
};
