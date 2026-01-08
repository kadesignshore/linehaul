const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

// Driver routes
// get entry based on only the driver
router.get("/entries", requireAuth, driverController.getDriverEntries);

module.exports = router;