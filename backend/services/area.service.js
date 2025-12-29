const Area = require("../models/Area");

/**
 * Admin creates an area
 */
exports.createArea = async (data, adminId) => {
  return await Area.create({
    name: data.name,
    created_by: adminId,
    entries: data.entries || []
  });
};

/**
 * Assign driver to area
 */
exports.assignDriver = async (areaId, driverId) => {
  return await Area.findByIdAndUpdate(
    areaId,
    {
      assigned_driver: driverId,
      status: "assigned"
    },
    { new: true }
  );
};

/**
 * Admin: get all areas
 */
exports.getAllAreas = async () => {
  return await Area.find()
    .populate("created_by", "name role")
    .populate("assigned_driver", "name");
};

/**
 * Driver: get assigned areas
 */
exports.getDriverAreas = async (driverId) => {
  return await Area.find({ assigned_driver: driverId });
};

/**
  DELETE /areas/:id
  Admin only: delete area
 */
exports.deleteArea = async (areaId) => { 
  return await Area.findByIdAndDelete(areaId);
};

/**
 * Driver: create entries for area
 */
exports.createEntry = async (areaId, entryData) => {
  console.log("Creating entry:", areaId, entryData.entry);
  const area = await Area.findById(areaId);
  if (!area) {
    throw new Error("Area not found");
  }
  await area.entries.push(entryData.entry);
  
  return await area.save();
}


/**
 * Update entries (admin or driver)
 */
exports.updateEntries = async (areaId, entries) => {
  return await Area.findByIdAndUpdate(
    areaId,
    { entries },
    { new: true }
  );
};


exports.createEntriesBulk = async (areaId, entries, user) => {
  console.log("Creating entries bulk:", areaId, entries, user);
  const area = await Area.findById(areaId);
  if (!area) {
    throw new Error("Area not found");
  }

  // 🚫 Lock completed areas
  if (area.status === "completed") {
    throw new Error("Area is already completed");
  }

  // 🔐 Authorization
  const isAdmin = user.role === "admin";
  const isAssignedDriver =
    area.assigned_driver &&
    area.assigned_driver.toString() === user._id.toString();

  if (!isAdmin && !isAssignedDriver) {
    throw new Error("Not authorized to add entries to this area");
  }

  // ✅ Normalize + push
  const normalizedEntries = entries.map((entry) => ({
    truck: entry.truck,
    rego: entry.rego,
    driver_name: entry.driver_name,
    trailer: entry.trailer || "",
    start_time: entry.start_time || "",
    instructions: entry.instructions || "",
    boat: entry.boat || "",
    load: entry.load || "",
    plan_date: new Date(entry.plan_date)
  }));

  area.entries.push(...normalizedEntries);

  // 🔄 Auto status
  if (area.status === "draft" && area.assigned_driver) {
    area.status = "assigned";
  }

  return await area.save();
};


exports.deleteEntry = async (areaId, entryId) => { 
  const area = await Area.findById(areaId);
  if (!area) {
    throw new Error("Area not found");
  }
  const deletedentry = await area.entries.id(entryId).deleteOne();
  await area.save();
  return await deletedentry;
};