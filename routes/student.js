const express = require("express");
const {
   addStudent,
   getStudentById,
   addHealthRecord,
} = require("../controllers/studentController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/student", isAuthenticated, addStudent);
router.get("/student/:id", isAuthenticated, getStudentById);
router.post("/student/:id/healthrecord", isAuthenticated, addHealthRecord);

module.exports = router;
