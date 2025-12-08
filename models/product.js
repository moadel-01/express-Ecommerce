const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    category: { type: String, required: true, minlength: 3 },
    price: { type: Number, min: 0, required: true },
    description: { type: String, required: true },
    stock: { type: Number, min: 0, required: true },
    rating: { type: Number, default: 0 },

    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },

    owner: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      email: { type: String },
      username: { type: String },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
