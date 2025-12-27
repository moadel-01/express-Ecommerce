const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customer: {
      customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      email: { type: String },
      username: { type: String },
    },

    products: [
      {
        prod_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        title: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        thumbnail: { type: String },
      },
    ],

    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
