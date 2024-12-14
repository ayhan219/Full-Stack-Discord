const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(400).json({ message: "user not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(400).json({ message: "token is not valid", error });
  }
};

module.exports = AuthMiddleware;