const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/register-driver",  authController.registerDriver);
router.get("/drivers",  authController.getAllDrivers);
router.get("/drivers/search",  authController.getDriversByName);
router.get("/drivers/:id",  authController.getDriverById);
router.put("/drivers/:id", authController.updateDriverInfo);
router.put("/drivers/:id/password", authController.updateDriverPassword);
router.delete("/drivers/:id", requireAuth, requireAdmin, authController.deleteDriver);

module.exports = router;
