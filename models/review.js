const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    comment: { type: String, required: true, minlength: 3 },
    rating: { type: Number, required: true, min: 1, max: 5 },

    reviewer: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      username: { type: String },
    },

    product: {
      prod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      title: { type: String },
      price: { type: Number },
      thumbnail: { type: String },
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review };
