const express = require("express");
const router = express.Router();
const {
   allMentors,
   getAllMentors,
   addNewMentor,
} = require("../controllers/mentorController");
const { isAdmin } = require("../middlewares/admin");

router.post("/mentor", isAdmin, addNewMentor);
router.get("/mentors", allMentors);
router.get("/allmentors", isAdmin, getAllMentors);

module.exports = router;
