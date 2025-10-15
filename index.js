const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { usersRouter } = require("./routes/users.routes");
const { productRouter } = require("./routes/product.routes");
const { upload } = require("./middlewares/uploadMiddleware");
const { reviewRouter } = require("./routes/review.routes");
const path = require("path");

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/users", usersRouter);

app.use("/products", productRouter);

app.use("/products", reviewRouter);

app.post("/test", upload.array("images"), (req, res) => {
  // const thumbnail = req.file.filename;
  res.send("success!!");
  console.log(req.files);
  const images = req.files.map((item) => item.filename);
  console.log("this here:", images);
});

// app.post("/test", upload.single("thumbnail"), (req, res) => {
//   const thumbnail = req.file.filename;
//   res.send("success!!");
//   console.log("this here:", thumbnail);
// });

mongoose
  .connect(process.env.mongo_URI)
  .then(() => console.log("mongoDB CONNECTED..."))
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log("server is RUNNING...");
});
