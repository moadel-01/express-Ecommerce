const { User } = require("../models/user");
const {
  userValidation,
  loginValidation,
  updateValidation,
} = require("../validations/usersValidations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  const { error, value } = userValidation.validate(req.body);

  if (error) {
    return res.json({ message: error.details[0].message });
  }

  try {
    const userExist = await User.findOne({ email: value.email });

    if (userExist) {
      return res.status(400).json({ message: "user already exist!" });
    }

    const usernameCheck = await User.findOne({ username: value.username });

    if (usernameCheck) {
      return res.status(400).json({ message: "username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    const user = await User.create({ ...value, password: hashedPassword });

    res.status(201).json({ message: "user created" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
}

async function getUsers(req, res) {
  const users = await User.find();
  res.status(200).json({ message: "all users data", data: users });
}
async function getSingleUser(req, res) {
  const { id } = req.params;

  try {
    const singleUser = await User.findById(id);
    if (!singleUser) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "user found", data: singleUser });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user_token = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    if (user._id.toString() != user_token.id && user_token.role != "ADMIN") {
      return res
        .status(403)
        .json({ message: "you do not have the access to delete this user" });
    }

    const removedUser = await User.findByIdAndDelete(id);

    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;

  try {
    const user_token = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user._id.toString() != user_token.id && user_token.role != "ADMIN") {
      return res
        .status(403)
        .json({
          message: "you do not have the access to update this user data",
        });
    }

    const { error, value } = updateValidation.validate(req.body);

    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    if (value.password) {
      value.password = await bcrypt.hash(value.password, 10);
    }

    const updtdUser = await User.findByIdAndUpdate(id, value);

    res.status(200).json({ message: "user updated" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID", data: error.message });
  }
}

async function Register(req, res) {
  const { error, value } = userValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const userExist = await User.findOne({ email: value.email });

    if (userExist) {
      res.status(400).json({ message: "Invalid Data" });
    }

    const usernameCheck = await User.findOne({ username: value.username });

    if (usernameCheck) {
      return res.status(400).json({ message: "username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    const user = await User.create({ ...value, password: hashedPassword });

    const token = jwt.sign(
      {
        id: user._id,
        email: value.email,
        role: value.role,
        username: value.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    );

    res
      .status(201)
      .json({ message: "account created successfully", data: { token } });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
}

async function Login(req, res) {
  const { error, value } = loginValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const userExist = await User.findOne({ email: value.email });

    if (!userExist) {
      res.status(400).json({ message: "Wrong Email or Password" });
    }

    const checkPassword = await bcrypt.compare(
      value.password,
      userExist.password
    );

    if (!checkPassword) {
      res.status(400).json({ message: "Wrong Email or Password" });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        email: value.email,
        role: userExist.role,
        username: userExist.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    );

    res
      .status(200)
      .json({ message: "Logged in Successfully", data: { token } });
  } catch (error) {
    res.status(500).json({ message: "Intenal server error" });
  }
}

module.exports = {
  createUser,
  getUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  Register,
  Login,
};
