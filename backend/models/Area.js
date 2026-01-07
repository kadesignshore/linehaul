const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    truck: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    rego: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    driver_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    trailer: {
      type: String,
      trim: true,
      minlength: 1,
    },
    start_time: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      trim: true,
      minlength: 1,
    },
    boat: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    load: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    plan_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    transportation_issue: {
      type: Boolean,
      default: false,
    },
    issueNote: {
      type: String,
      trim: true,
      minlength: 1,
    },
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
