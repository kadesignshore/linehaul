const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { request } = require("express");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

exports.checkDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Driver only" });
  }
  next();
};

// check if he is requesting his own data
exports.checkSelf = (req, res, next) => {
  const userId = req.user._id.toString();
  console.log("This is a userid and driverid",userId,req.params.driverId)
  if (userId !== req.params.driverId) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

