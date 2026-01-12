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
  return Area.findOneAndUpdate(
    { "entries._id": entryId },
    {
      $set: {
        "entries.$[entry].status": status
      }
    },
    {
      arrayFilters: [
        {
          "entry._id": entryId,
          "entry.driver": driverId
        }
      ],
      new: true
    }
  );
};

exports.updateIssueDriverEntry = async (driverId, entryId, issue) => {

  console.log("createing Issue",entryId, issue)
  return Area.findOneAndUpdate(
    { "entries._id":entryId },
    {
      $set: {
        "entries.$[entry].is_transportation_issue": true,
        "entries.$[entry].issue_type": issue.issueType,
        "entries.$[entry].transportation_issue": issue.message
      }
    },
    {
      arrayFilters: [
        {
          "entry._id": entryId,
          "entry.driver": driverId
        }
      ],
      new: true
    }
  );
}
