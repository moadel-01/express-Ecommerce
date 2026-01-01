const usersController = require("../controllers/usersController");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const usersRouter = express.Router();

usersRouter.post(
  "/createUser",
  authMiddleware,
  roleMiddleware("ADMIN"),
  usersController.createUser
);

usersRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  usersController.getUsers
);
usersRouter.get("/search", usersController.searchBar);
usersRouter.get("/:id", authMiddleware, usersController.getSingleUser);

usersRouter.delete("/:id", authMiddleware, usersController.deleteUser);

usersRouter.patch("/:id", authMiddleware, usersController.updateUser);

usersRouter.post("/signUp", usersController.Register);
usersRouter.post("/signIn", usersController.Login);

module.exports = { usersRouter };
