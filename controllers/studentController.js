const mongoose = require("mongoose");
const { Student } = require("../models/student");
const { MentorModel: Mentor, MentorModel } = require("../models/mentor");
const { validateStudent } = require("../helpers/student_validator");
const { customHttpError } = require("../helpers/customError");
const { validateObjectId } = require("../helpers/validate_object_id");
const { validateHealthRecord } = require("../helpers/health_record_validator");
const { HealthReportModel } = require("../models/helthReport");
const Fawn = require("fawn");
Fawn.init(mongoose);

exports.addStudent = async (req, res, next) => {
   const { error } = validateStudent(req.body);

   if (error) return customHttpError(res, next, 400, error.details[0].message);
   const {
      name,
      parentsContactNumber,
      mobileNumber,
      assignedMentor,
      state,
      gender,
      hostelName,
      hostelRoomNo,
      studentId,
   } = req.body;
   try {
      const student = await Student.findById({ _id: studentId }).select("-gid");
      if (!student) return customHttpError(res, next, 400, "Student not found");
      const mentor = await MentorModel.findById({ _id: assignedMentor });
      if (!mentor)
         return customHttpError(
            res,
            next,
            400,
            "Invslid Mentor or mentor not found"
         );

      student.name = name;
      student.parentsContactNumber = parentsContactNumber;
      student.mobileNumber = mobileNumber;
      student.assignedMentor = assignedMentor;
      student.state = state;
      student.hostelName = hostelName;
      student.hostelRoomNo = hostelRoomNo;
      student.gender = gender;
      student.detailsSubmitted = true;

      mentor.assignedStudents.push(student._id);

      await mentor.save();
      const updatedStudent = await student.save();
      res.send({ updatedStudent });
   } catch (error) {
      next(error);
   }
};

exports.getStudentById = async (req, res, next) => {
   const { error } = validateObjectId(req.params);

   if (error)
      return customHttpError(res, next, 400, "please provide a valid id");

   const studentId = req.params.id;
   try {
      const student = await Student.findById({ _id: studentId })
         .populate("assignedMentor", "name mobileNumber")
         .select("-gid");
      if (!student)
         return customHttpError(res, next, 400, "Student Not Found Invalid id");
      res.send({
         student,
      });
   } catch (error) {
      next(error);
   }
};

exports.addHealthRecord = async (req, res, next) => {
   const { error } = validateObjectId(req.params);
   if (error)
      return customHttpError(res, next, 400, "please provide a valid id");
   const studentId = req.params.id;

   const student = await Student.findById({ _id: studentId });

   const { error: healthrecordEroor } = validateHealthRecord(req.body);
   if (healthrecordEroor)
      return customHttpError(
         res,
         next,
         400,
         healthrecordEroor.details[0].message
      );
   // console.log(req.body);
   const { symptoms, dayNumber, recordedAt } = req.body;

   try {
      const healthrecord = new HealthReportModel({
         symptoms,
         dayNumber,
         recordedAt,
      });

      student.healthRecord.push(healthrecord);
      const updatedstudent = await student.save();
      res.send({ updatedstudent });
   } catch (error) {
      next(error);
   }

   // console.log(student);
};
