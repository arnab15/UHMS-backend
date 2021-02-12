const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const Joi = require("joi");
const mentorSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         default: "mentor",
         enum: ["mentor", "admin"],
         lowercase: true,
      },
      mobileNumber: {
         type: String,
         length: 10,
         minlength: 10,
         maxlength: 10,
         required: true,
      },
      assignedStudents: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
         },
      ],
   },
   {
      timestamps: true,
   }
);

mentorSchema.methods.genarateAuthToken = function () {
   const token = jwt.sign(
      {
         _id: this._id,
         name: this.name,
         role: this.role,
      },
      process.env.MENTORS_JWT_SECREAT,
      { expiresIn: "7 days" }
   );
   return token;
};

exports.MentorModel = mongoose.model("Mentor", mentorSchema);

exports.validateMentorSchema = (mentor) => {
   const schema = Joi.object({
      name: Joi.string().trim().min(3).required(),
      email: Joi.string().lowercase().trim().email().required().message,
      mobileNumber: Joi.string()
         .regex(/^[0-9]{10}$/)
         .messages({
            "string.pattern.base": `Phone number must have 10 digits.`,
         })
         .required(),
      assignedStudents: Joi.objectId().required(),
   });
   return schema.validate(mentor);
};
