const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Area = require("../models/Area");
const { signToken } = require("../utils/jwt");

//get entries which is areas which has a field [] entries and the driver is id
exports.driverGetDriverEntries = async (driverId) => {
    const areas = await Area.find(
    { "entries.driver": driverId },
    { name: 1, entries: 1 }
    );

    const driverEntries = [];

    areas.forEach(area => {
    area.entries.forEach(entry => {
        if (entry.driver?.toString() === driverId.toString()) {
        driverEntries.push({
            area: area.name,
            ...entry.toObject()
        });
        }
    });
    });


    return driverEntries;
}

exports.updateStatusDriverEntry = async (driverId, entryId, status) => {
    const result = await Area.findOneAndUpdate(
        { "entries._id": entryId, "entries.driver": driverId },
        { $set: { "entries.$.status": status } },
        { new: true }
    );

    return result;
}