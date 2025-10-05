const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "no token provided" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data;

    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorized" });
  }
}

module.exports = authMiddleware;
