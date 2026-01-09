const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");
const { requireAuth, requireAdmin, checkSelf } = require("../middlewares/auth.middleware");

// Driver routes
// get entry based on only the driver
router.get("/:driverId/entries", requireAuth, checkSelf, driverController.getDriverEntries);
router.post("/:driverId/entries/:entryId/status", requireAuth, checkSelf, driverController.updateStatusDriverEntry);

module.exports = router;