const express = require("express");

const productRouter = express.Router();
const productController = require("../controllers/productsController");
const { upload } = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

productRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  productController.createProduct
);

productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getSingleProduct);

productRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  productController.deleteProduct
);

productRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  productController.updateProduct
);

module.exports = { productRouter };
