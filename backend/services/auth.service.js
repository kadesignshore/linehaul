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
    username: data.username,
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    license_number: data.license_number || '',
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

exports.getDriversByName = async (name) => {
  const query = { role: "driver" };

  // Apply name filter only if provided
  if (name && name.trim()) {
    query.name = new RegExp(name.trim(), "i");
  }

  return await User.find(query).select("_id name");
};

exports.getDriverById = async (driverId) => {
  const driver = await User.findById(driverId).select('-password');
  if (!driver || driver.role !== "driver") {
    throw new Error("Driver not found");
  }
  return driver;
}

exports.updateDriverInfo = async (driverId, updateData) => {
  const driver = await User.findById(driverId);
  if (!driver || driver.role !== "driver") {
    throw new Error("Driver not found");
  }
  console.log(updateData);
  // update 
  driver.name = updateData.name || driver.name;
  driver.email = updateData.email || driver.email;
  driver.phone = updateData.phone || driver.phone;
  driver.license_number = updateData.license_number || driver.license_number;

  await driver.save();
  return driver;
}

exports.deleteDriver = async (driverId) => {
  const driver = await User.findById(driverId);
  if (!driver || driver.role !== "driver") {
    throw new Error("Driver not found");
  }
  await User.deleteOne({ _id: driverId });
  return;
}

exports.updateDriverPassword = async (driverId, newPassword) => {
  console.log("Updating password for driver:", driverId, newPassword);
  const driver = await User.findById(driverId);
  if (!driver || driver.role !== "driver") {
    throw new Error("Driver not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  driver.password = hashedPassword;
  await driver.save();
  return driver;
};