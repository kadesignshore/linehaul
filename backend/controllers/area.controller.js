const areaService = require("../services/area.service");

/**
 * POST /areas
 */
exports.createArea = async (req, res) => {
  try {
    const area = await areaService.createArea(req.body, req.user._id);
    res.status(201).json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PATCH /areas/:id/assign-driver
 */
exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const area = await areaService.assignDriver(req.params.id, driverId);
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /areas
 */
exports.getAllAreas = async (req, res) => {
  try {
    const areas = await areaService.getAllAreas();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /areas/:id
 */
exports.deleteArea = async (req, res) => {
  try {
    const area = await areaService.deleteArea(req.params.id);
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /areas/my
 */
exports.getMyAreas = async (req, res) => {
  try {
    const areas = await areaService.getDriverAreas(req.user._id);
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createEntry = async (req, res) => {
  try {
    const area = await areaService.createEntry(
      req.params.id,
      req.body
    );
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /areas/:id/entries
 */
exports.updateEntries = async (req, res) => {
  try {
    const area = await areaService.updateEntries(
      req.params.id,
      req.body.entries
    );
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createEntriesBulk = async (req, res) => {
  try {
    const { areaId, entries } = req.body;

    if (!areaId || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        message: "areaId and entries array are required"
      });
    }

    const area = await areaService.createEntriesBulk(
      areaId,
      entries,
      req.user
    );

    res.status(201).json({
      message: "Entries added successfully",
      area
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteEntry = async (req, res) => { 
  try {
    const { areaId, entryId } = req.params;

    const area = await areaService.deleteEntry(areaId, entryId); 
    res.json({
      message: "Entry deleted successfully",
      area
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
