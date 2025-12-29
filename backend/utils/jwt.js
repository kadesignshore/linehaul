const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES = "7d";

exports.signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
