const { OAuth2Client } = require("google-auth-library");
const { Student } = require("../models/student");
const { customHttpError } = require("../helpers/customError");
const { validateLogin, validateSignup } = require("../helpers/auth_validator");
const { hashPasword, comparePasword } = require("../helpers/hash_password");

exports.authController = {
   async signup(req, res, next) {
      const { error } = validateSignup(req.body);
      if (error) {
         return customHttpError(res, next, 400, error.details[0].message);
      }

      const { name, email, password } = req.body;

      try {
         let student = await Student.findOne({ email });
         if (student) {
            return customHttpError(
               res,
               next,
               400,
               `User with provided email ${email} already exist`
            );
         }
         const hashedPassword = await hashPasword(password);
         student = new Student({
            name,
            email,
            password: hashedPassword,
            role: ["student"],
         });

         await student.save();
         const token = student.genarateAuthToken();
         return res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .status(201)
            .send({
               _id: student._id,
               name: student.name,
               email: student.email,
               role: student.role,
            });
      } catch (error) {
         res.status(500);
         return next(error);
      }
   },

   //login
   async login(req, res, next) {
      const { error } = validateLogin(req.body);
      if (error)
         return customHttpError(res, next, 400, error.details[0].message);

      const { email, password } = req.body;

      try {
         let student = await Student.findOne({ email });
         if (!student) {
            return customHttpError(
               res,
               next,
               400,
               `User not found you have not registered yet please SignUp`
            );
         }

         const isMatch = await comparePasword(password, student.password);
         if (!isMatch) {
            return customHttpError(
               res,
               next,
               400,
               "Incorrect email or password"
            );
         }
         const token = student.genarateAuthToken();
         return res.status(200).send({ token });
      } catch (error) {
         res.status(500);
         return next(error);
      }
   },
   //google login

   async googleLogin(req, res, next) {
      // console.log(req.headers);
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader) {
         const bearer = bearerHeader.split(" ");
         const bearerToken = bearer[1];
         // console.log(bearerToken);
         const googleClient = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRETE
         );
         try {
            const { payload } = await googleClient.verifyIdToken({
               idToken: bearerToken,
               audience: process.env.GOOGLE_CLIENT_ID,
            });
            const {
               sub: googleUserId,
               email,
               email_verified,
               picture,
               name,
            } = payload;
            if (email_verified) {
               try {
                  let student = await Student.findOne({ email });
                  if (!student) {
                     student = new Student({
                        name,
                        email,
                        gid: googleUserId,
                        picture,
                        role: "student",
                     });
                     await student.save();
                     const token = student.genarateAuthToken();
                     return res
                        .header("x-auth-token", token)
                        .header("access-control-expose-headers", "x-auth-token")
                        .status(201)
                        .send({});
                  } else {
                     const token = student.genarateAuthToken();
                     return res
                        .status(200)
                        .send({
                           token,
                           detailsSubmitted: student.detailsSubmitted,
                        });
                  }
               } catch (error) {
                  next(error);
               }
            } else {
               return customHttpError(
                  res,
                  next,
                  403,
                  "Please verify your google account"
               );
            }
            // console.log(googleUserId, email, email_verified, picture, name);
         } catch (error) {
            return customHttpError(res, next, 403, "Something Went wrong");
         }

         //next();
      } else {
         // Forbidden
         return customHttpError(res, next, 403, "Invalid Token Details");
      }
   },
};
