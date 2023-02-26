const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");

router
	.route("/register")
	.get(users.renderRegisterForm)
	.post(catchAsync(users.registerUser));

router
	.route("/login")
	.get(users.renderLoginForm)
	.post(
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
			keepSessionInfo: true,
		}),
		users.loginUser
	);

router.get("/logout", catchAsync(users.logoutUser));

module.exports = router;
