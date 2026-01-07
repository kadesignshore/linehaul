const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/register-driver",  authController.registerDriver);
router.get("/drivers",  authController.getAllDrivers);
module.exports = router;
