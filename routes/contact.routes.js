const contactController = require("../controllers/contactController");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const contactRouter = express.Router();

contactRouter.post("/", contactController.createContactMessage);

contactRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  contactController.getContactMessages
);

contactRouter.get("/search", contactController.searchBar);

contactRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  contactController.getSingleMessage
);

contactRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  contactController.deleteMessage
);

module.exports = { contactRouter };
