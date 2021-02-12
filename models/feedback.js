const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const feedbackSchema = new Schema({
   name: {
      type: String,
      required: true,
      trim: true,
   },
   email: {
      type: String,
      required: true,
      trim: true,
   },
   feedback: {
      type: String,
      required: true,
      trim: true,
   },
});

exports.Feedback = mongoose.model("Feedback", feedbackSchema);

exports.validateFeedbackSchema = (feedback) => {
   const schema = Joi.object({
      name: Joi.string().trim().min(3).required(),
      email: Joi.string().lowercase().trim().email().required(),
      feedback: Joi.string().trim().required(),
   });
   return schema.validate(feedback);
};
