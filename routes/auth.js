const express = require("express");

const { authController } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/googlelogin", authController.googleLogin);

router.get("/test", (req, res, next) => {
  const bearerHeader = req.headers["x-auth-token"];
  console.log(bearerHeader);
  res.send("done");
});
module.exports = router;
