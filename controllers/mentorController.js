const { customHttpError } = require("../helpers/customError");
const { hashPasword } = require("../helpers/hash_password");
const { validateMentor } = require("../helpers/mentor_validator");
const { validateObjectId } = require("../helpers/validate_object_id");
const { MentorModel: Mentor } = require("../models/mentor");

exports.allMentors = async (req, res, next) => {
   try {
      const mentors = await Mentor.find({}).select("name role");
      res.send({ mentors });
      //console.log(mentors);
   } catch (error) {
      return next(error.message);
   }
};

exports.getAllMentors = async (req, res, next) => {
   try {
      const mentors = await Mentor.find({})
         .select("-password")
         .sort({ createdAt: -1 });
      res.send({
         mentors,
      });
      //console.log(mentors);
   } catch (error) {
      return next(error);
   }
};

exports.addNewMentor = async (req, res, next) => {
   const { error } = validateMentor(req.body);
   if (error) return customHttpError(res, next, 400, error.details[0].message);
   const { name, email, password, mobileNumber } = req.body;
   // console.log(req.body);
   const hashedPassword = await hashPasword(password);

   const mentor = new Mentor({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
   });
   try {
      await mentor.save();
      res.send({ message: "Mentor Added Successfully" });
   } catch (error) {
      return next(error);
   }
};

exports.addStudentToMentor = async (req, res, next) => {
   const studentId = "601ec519aee7481c4c8da903";
   const mentorId = "601fb16a1d6f802d189cfd34";
   try {
      const foundMentor = await Mentor.findByIdAndUpdate(
         { _id: mentorId },
         {
            $push: {
               assignedStudents: studentId,
            },
         },
         {
            new: true,
         }
      );
      console.log(foundMentor);
   } catch (error) {
      console.log(error);
   }
};

exports.getAllAssignedStudentForMentor = async (req, res, next) => {
   const { error } = validateObjectId(req.params);
   if (error) return customHttpError(res, next, 400, "Invalid Id");
   const mentorId = req.params.id;
   try {
      const student = await Mentor.findById({ _id: mentorId })
         .populate("assignedStudents", [
            "name",
            "email",
            "mobileNumber",
            "parentsContactNumber",
            "hostelName",
            "hostelRoomNo",
            "healthRecord",
         ])
         .select("assignedStudents");
      if (!student) return customHttpError(res, next, 404, "No student found");
      res.send({ student });
   } catch (error) {
      console.log(error);
   }
};

exports.removeStudentFromMentor = async (req, res, next) => {
   const studentId = "601ec519aee7481c4c8da903";
   const mentorId = "601fb16a1d6f802d189cfd34";
   try {
      const foundMentor = await Mentor.findByIdAndUpdate(
         {
            _id: mentorId,
         },
         {
            $pull: {
               assignedStudents: studentId,
            },
         },
         {
            new: true,
         }
      );
      console.log(foundMentor);
   } catch (error) {
      console.log(error);
   }
};
