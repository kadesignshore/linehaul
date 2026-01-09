const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    truck: { type: String, required: false, trim: true},
    rego: {type: String,required: false,trim: true},
    driver_name: { type: String, required: false, trim: true },
    trailer: { type: String, trim: true },
    start_time: { type: String, required: false, },
    instructions: { type: String, trim: true },
    boat: { type: String, required: false, trim: true },
    load: { type: String, required: false, trim: true },
    plan_date: { type: Date, required: true, },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending", },
    is_transportation_issue: { type: Boolean, default: false, },
    transportation_issue: { type: String, trim: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { _id: true }
);

const areaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, caseSensitive: true, trim: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assigned_driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: { type: String, enum: ["draft", "assigned", "completed"], default: "draft" },
    entries: [entrySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area", areaSchema);
