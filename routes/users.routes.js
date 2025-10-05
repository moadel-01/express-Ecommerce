const usersController = require("../controllers/usersController");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const usersRouter = express.Router();

usersRouter.post("/", usersController.createUser);

usersRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  usersController.getUsers
);
usersRouter.get("/:id", usersController.getSingleUser);

usersRouter.delete("/:id", usersController.deleteUser);

usersRouter.patch("/:id", usersController.updateUser);

usersRouter.post("/signUp", usersController.Register);
usersRouter.post("/signIn", usersController.Login);

module.exports = { usersRouter };
