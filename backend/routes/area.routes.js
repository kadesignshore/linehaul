const express = require("express");
const router = express.Router();

const areaController = require("../controllers/area.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");


// Area routes
router.post("/", requireAuth, requireAdmin, areaController.createArea);
router.get("/", requireAuth, requireAdmin, areaController.getAllAreas);
router.get("/summary", areaController.getAllAreaSummary);
router.patch("/:id/assign-driver", requireAuth, requireAdmin, areaController.assignDriver);
router.delete("/:id", requireAuth, requireAdmin, areaController.deleteArea);

router.get("/my", requireAuth, areaController.getMyAreas);


// Entry routes
router.get("/entries", requireAuth, requireAdmin , areaController.getAllEntries); // get all entries
router.get("/:id/entries", requireAuth, areaController.getAreaEntries); // get entries by area id
router.post("/:id/entry", requireAuth, areaController.createEntry);
router.post("/entries", requireAuth, areaController.createEntriesBulk);
router.put("/:areaId/entry/:entryId", requireAuth, areaController.updateEntry);
router.delete("/:areaId/entry/:entryId", requireAuth, areaController.deleteEntry);

module.exports = router;
