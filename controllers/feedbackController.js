const { customHttpError } = require("../helpers/customError");
const { Feedback, validateFeedbackSchema } = require("../models/feedback");

exports.addFeedback = async (req, res, next) => {
   const { error } = validateFeedbackSchema(req.body);
   if (error) {
      return customHttpError(res, next, 400, error.details[0].message);
   }
   const { name, email, feedback } = req.body;
   try {
      const newFeedback = new Feedback({
         name,
         email,
         feedback,
      });
      const feedb = await newFeedback.save();
      if (feedb)
         return res.send({
            message: "Feedback Submited Successfully",
         });
   } catch (error) {
      next(error);
   }
};
