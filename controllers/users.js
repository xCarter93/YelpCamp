const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
	res.render("users/register");
};

module.exports.renderLoginForm = (req, res) => {
	res.render("users/login");
};

module.exports.registerUser = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "Welcome to Yelp Camp!");
			res.redirect("/campgrounds");
		});
	} catch (error) {
		req.flash("error", error.message);
		res.redirect("register");
	}
};

module.exports.loginUser = (req, res) => {
	req.flash("success", "Welcome back!");
	const redirectUrl = req.session.returnTo || "/campgrounds";
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logoutUser = async (req, res) => {
	req.logout((err) => {
		if (!err) {
			req.flash("success", "Goodbye!");
			res.redirect("/campgrounds");
		}
	});
};
