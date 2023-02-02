require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");

mongoose.set("strictQuery", false);
const dbName = "YelpCampDB";
const mongoURL = `mongodb+srv://xcarter93:${process.env.DB_PASSWORD}@cluster0.jwhx2lt.mongodb.net/${dbName}`;
mongoose.connect(mongoURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds: campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	});
	res.redirect(`/campgrounds/${campground._id}`);
});
app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
