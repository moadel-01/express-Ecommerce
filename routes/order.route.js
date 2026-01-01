const orderController = require("../controllers/orderController");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const orderRouter = express.Router({ mergeParams: true });

orderRouter.post("/", authMiddleware, orderController.createOrder);

orderRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  orderController.getOrders
);
orderRouter.get("/search", orderController.searchBar);

orderRouter.get(
  "/:customer_id/orders",
  authMiddleware,
  orderController.getAllUserOrders
);

orderRouter.get(
  "/:customer_id/orders/:id",
  authMiddleware,
  orderController.getSingleOrder
);

module.exports = { orderRouter };
