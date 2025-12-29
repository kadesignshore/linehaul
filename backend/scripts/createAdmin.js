require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@linehaul.com";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("40Sfs$Y#8!", 10);

    await User.create({
      name: "admin",
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
