const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: false, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "driver"],
      default: "driver"
    },

    phone: { type: String, default:'' },
    license_number: { type: String },
    

    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
