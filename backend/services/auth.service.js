const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

exports.register = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || "driver"
  });

  const token = signToken(user);

  return { user, token };
};

exports.login = async (username, password) => {
  console.log(username, password);
  const user = await User.findOne({
    $or: [
      { email: username.toLowerCase() },
      { name: username.toLowerCase() }
    ]
  });

  if (!user) throw new Error("Invalid credentials");

  if (!user.is_active) throw new Error("Account disabled");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = signToken(user);

  return { user, token };
};