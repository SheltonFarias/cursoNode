const express = require("express");
const router = express.Router();
const ToughtController = require("../controllers/ToughtController");

// helpers
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/dashboard", checkAuth, ToughtController.dashboard);
router.get("/", checkAuth, ToughtController.showToughts);

module.exports = router;
