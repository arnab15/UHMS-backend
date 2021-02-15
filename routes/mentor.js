const express = require("express");
const router = express.Router();
const {
   allMentors,
   getAllMentors,
   addNewMentor,
   getAllAssignedStudentForMentor,
} = require("../controllers/mentorController");
const { isAdmin } = require("../middlewares/admin");

router.post("/mentor", isAdmin, addNewMentor);
router.get("/mentors", allMentors);
router.get("/allmentors", isAdmin, getAllMentors);
router.get("/assignedstudents/:id", getAllAssignedStudentForMentor);

module.exports = router;
