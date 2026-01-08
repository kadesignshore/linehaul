const driverService = require("../services/driver.service");

exports.getDriverEntries = async (req, res) => {
  try {
    const driverId = req.params.id;
    const entries = await driverService.getDriverEntries(driverId);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};