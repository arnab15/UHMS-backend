if (!process.env.NODE_ENV) {
   require("dotenv").config();
}
const express = require("express");
const createError = require("http-errors");
const compression = require("compression");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const authRouter = require("./routes/auth");
const mentorRouter = require("./routes/mentor");
const studentRouter = require("./routes/student");
const feedbackController = require("./routes/feedback");

const cors = require("cors");
require("./helpers/db_connection")();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.use(
   compression({
      level: 6,
   })
);
app.use("/", authRouter);
app.use("/", mentorRouter);
app.use("/", studentRouter);
app.use("/", feedbackController);

app.use((req, res, next) => {
   next(createError(404, "Not found/Invalid url"));
});
app.use((err, req, res, next) => {
   res.send({
      error: {
         status: err.status || 500,
         message: err.message,
      },
   });
});
app.listen(port, () => {
   console.log(`Server is up on port ${process.env.PORT}`);
});
