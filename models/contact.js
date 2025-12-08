const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },

    subject: {
      type: String,
      enum: ["technical", "orders", "billing", "else"],
      default: "else",
    },

    message: { type: String, required: true },

    city: { type: String, required: false },
    street: { type: String, required: false },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = { Contact };
