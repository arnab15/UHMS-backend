const express = require("express");
const router = express.Router();
const {
   createMentor,
   addStudentToMentor,
   getAllAssignedStudentForMentor,
   removeStudentFromMentor,
   allMentors,
} = require("../controllers/mentorController");
router.post("/mentor", createMentor);
router.get("/mentors", allMentors);
module.exports = router;
