const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    truck: String,
    rego: String,
    driver_name: String,
    trailer: String,
    start_time: String, // "04:40"
    instructions: String,
    boat: String,
    load: String,
    plan_date: Date
  },
  { _id: true }
);

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assigned_driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    status: {
      type: String,
      enum: ["draft", "assigned", "completed"],
      default: "draft"
    },

    entries: [entrySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area", areaSchema);
