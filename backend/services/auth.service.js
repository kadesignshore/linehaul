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

exports.registerDriver = async (data) => {
  data.role = "driver";
  return await this.register(data);
}

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

exports.logout = async (userId) => {
  // For JWT, logout is typically handled on the client side by deleting the token.
  // However, if you want to implement server-side logout (e.g., token blacklisting),
  // you would add the token to a blacklist here.



  return;
}

exports.getAllDrivers = async () => {
  const drivers = await User.find({ role: "driver" }).select('-password');
  return drivers;
};