const mongoose = require("mongoose");
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
