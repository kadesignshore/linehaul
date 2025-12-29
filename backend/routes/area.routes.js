const express = require("express");
const router = express.Router();

const areaController = require("../controllers/area.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");


// Area routes
router.post("/", requireAuth, requireAdmin, areaController.createArea);
router.get("/", requireAuth, requireAdmin, areaController.getAllAreas);
router.patch("/:id/assign-driver", requireAuth, requireAdmin, areaController.assignDriver);
router.delete("/:id", requireAuth, requireAdmin, areaController.deleteArea);



router.get("/my", requireAuth, areaController.getMyAreas);


// Entry routes
router.post("/:id/entry", requireAuth, areaController.createEntry);
router.post("/entries", requireAuth, areaController.createEntriesBulk);
router.delete("/:areaId/entries/:entryId", requireAuth, areaController.deleteEntry);

module.exports = router;
