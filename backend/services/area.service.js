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
 * Admin: get all areas summary
 */
exports.getAllAreaSummary = async () => {
  return await Area.aggregate([
    {
      $project: {
        city: "$name",

        total: {
          $size: "$entries"
        },

        completed: {
          $size: {
            $filter: {
              input: "$entries",
              as: "entry",
              cond: { $eq: ["$$entry.status", "completed"] }
            }
          }
        },

        transportIssues: {
          $size: {
             $filter: {
                input: "$entries",
                as: "entry",
                cond: { $eq: ["$$entry.transportation_issue", true] }
              }
          }
        }
      }
    }
  ]);
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
 * create a single entry for area
 */
exports.createEntry = async (areaId, entryData) => {
  const result = await Area.updateOne(
    { _id: areaId },
    { $push: { entries: entryData.entry }},
    { runValidators: true}
  );

  if(result.modifiedCount === 0){
    throw new Error("Area not found");
  }

  return { success: true };
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

// update a single entru
exports.updateEntry = async (areaId, entryId, entryData) => {
 const result = await Area.updateOne(
  {
    _id: areaId,
    "entries._id": entryId,
  },
  {
    $set: Object.fromEntries(
      Object.entries(entryData).map(([key,value]) => [
        `entries.$.${key}`,
        value,
      ])
    )
  },
  {
    runValidators: true
  }
 )

 if(result.matchedCount === 0){
  throw new Error("Area or Entry not found");
 }

 return { success: true };
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
  const result = await Area.updateOne(
    { _id: areaId },
    { $pull: { entries: { _id: entryId } } }
  );

  if (result.modifiedCount === 0) {
    throw new Error("Entry not found");
  }

  return { success: true };
};


/**
 * GET /:id/entries
 */
exports.getAreaById = async (areaId) => {
  return await Area.findById(areaId);
};

/** GET all entries
 */
exports.getAllEntries = async () => {
  const areas = await Area.find({}, { entries: 1, _id: 0 });
  return areas.flatMap(area => area.entries);
};