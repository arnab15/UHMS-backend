const { MentorModel: Mentor } = require("../models/mentor");

exports.allMentors = async (req, res, next) => {
   try {
      const mentors = await Mentor.find({}).select("name");
      res.send({ mentors });
      //console.log(mentors);
   } catch (error) {
      next(error.message);
   }
};

exports.createMentor = async (req, res, next) => {
   const mentor = new Mentor({
      name: "Sayak Pramanik",
      email: "sayak@gmail.com",
      mobileNumber: "9589586389",
      password: "123456",
   });
   try {
      const m = await mentor.save();
      console.log(m);
      res.send({ mentor: m });
   } catch (error) {
      console.log(error.message);
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
   const mentorId = "601f9ad06c9ef4204829ffcd";
   try {
      const students = await Mentor.findById({ _id: mentorId })
         .populate("assignedStudents", ["name", "email"])
         .select("assignedStudents");
      console.log(students);
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
