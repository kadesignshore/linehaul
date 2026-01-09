const driverService = require("../services/driver.service");

exports.getDriverEntries = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const entries = await driverService.driverGetDriverEntries(driverId);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatusDriverEntry = async (req, res) => {
    try {
        const driverId = req.params.driverId;
        const entryId = req.params.entryId;
        const { status } = req.body;
        const updatedEntry = await driverService.updateStatusDriverEntry(driverId, entryId, status);
        res.json(updatedEntry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

