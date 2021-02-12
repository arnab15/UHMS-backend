const express = require("express");
const { addFeedback } = require("../controllers/feedbackController");
const router = express.Router();

router.post("/feedback", addFeedback);

module.exports = router;
