const { Student } = require("./models/student");

async function nameee(params) {
   const student = await Student.findById({ _id: "602046b2d63c3f0bdcb7f840" });
   const token = student.genarateAuthToken();
   console.log(token);
}
nameee();
