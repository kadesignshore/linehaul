const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Area = require("../models/Area");
const { signToken } = require("../utils/jwt");

//get entries which is areas which has a field [] entries and the driver is id
exports.driverGetDriverEntries = async (driverId) => {
    const areas = await Area.find({ assigned_driver: driverId }, { entries: 1, name: 1 });
    const driverEntries = areas.map(area => {
        return {
            areaName: area.name,
            entries: area.entries
        };
    });
    return driverEntries;
}