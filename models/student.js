const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { HealthReportSchema } = require("./helthReport");
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         minlength: 3,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
         lowercase: true,
      },
      gid: {
         type: String,
         unique: true,
         trim: true,
      },
      picture: {
         type: String,
         trim: true,
      },
      parentsContactNumber: {
         type: String,
         length: 10,
         maxlength: 10,
         minlength: 10,
         trim: true,
      },
      mobileNumber: {
         type: String,
         length: 10,
         maxlength: 10,
         minlength: 10,
         trim: true,
      },
      assignedMentor: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Mentor",
      },
      state: {
         type: String,
         trim: true,
      },
      gender: {
         type: String,
         trim: true,
         enum: ["male", "female", "others"],
         lowercase: true,
      },
      hostelName: {
         type: String,
         trim: true,
      },
      hostelRoomNo: {
         type: String,
         trim: true,
      },
      role: {
         type: String,
         default: "student",
         lowercase: true,
      },
      foodService: {
         type: Boolean,
      },
      detailsSubmitted: {
         type: Boolean,
         default: false,
      },
      healthRecord: [HealthReportSchema],
   },
   {
      timestamps: true,
   }
);
StudentSchema.methods.genarateAuthToken = function () {
   const token = jwt.sign(
      {
         _id: this._id,
         name: this.name,
         role: this.role,
         picture: this.picture,
      },
      process.env.JWT_SECREAT,
      { expiresIn: "7 days" }
   );
   return token;
};
const Student = mongoose.model("Student", StudentSchema);

exports.Student = Student;
