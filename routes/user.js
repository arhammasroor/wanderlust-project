const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapasync = require("../utils/wrapasync.js");
const {saveredirectUrl}= require("../middleware.js");
const usercontroller = require("../controllers/users.js");

router.route("/signup")
.get(usercontroller.signupform)
.post(wrapasync(usercontroller.signup));

router.route("/login")
.get(usercontroller.loginform)
.post(saveredirectUrl,passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }),usercontroller.login)
router.get("/logout",usercontroller.logout);

module.exports= router;