const driverService = require("../services/driver.service");
const { sendUpdate } = require("../routes/sseRoutes.routes")

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
    console.log("This is a driver and entry", driverId, entryId)
    const updatedEntry = await driverService.updateStatusDriverEntry(driverId, entryId, status);

    sendUpdate({
      type: "ENTRY_UPDATED",
      entryId,
      driverId,
      status,
      at: Date.now(),
    });

    res.json(updatedEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateIssueDriverEntry = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const entryId = req.params.entryId;
    const { issue } = req.body

    const updateEntry = await driverService.updateIssueDriverEntry(driverId, entryId, issue);

    sendUpdate({
      type: "ENTRY_ISSUE_UPDATED",
      entryId,
      driverId,
      issue,
      at: Date.now(),
    });

    res.json(updateEntry)

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

