const express = require("express");

const { authController } = require("../controllers/authController");

const router = express.Router();

router.post("/mlogin", authController.mentorLogin);

router.post("/googlelogin", authController.googleLogin);

module.exports = router;
