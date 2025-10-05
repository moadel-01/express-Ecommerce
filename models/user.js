const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, minlength: 3, unique: true },
    password: { type: String, required: true, minlength: 8 },
    age: { type: Number, required: true, min: 18 },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
