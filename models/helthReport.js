const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthReportSchema = new Schema(
   {
      symptoms: [
         {
            type: String,
            trim: true,
            required: true,
         },
      ],
      dayNumber: {
         type: Number,
         max: 7,
         required: true,
      },
      recordedAt: {
         type: String,
         trim: true,
         enum: ["day", "night"],
      },
   },
   {
      timestamps: true,
   }
);

exports.HealthReportModel = mongoose.model("Health", healthReportSchema);
exports.HealthReportSchema = healthReportSchema;
