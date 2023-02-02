require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");

mongoose.set("strictQuery", false);
const dbName = "YelpCampDB";
const mongoURL = `mongodb+srv://xcarter93:${process.env.DB_PASSWORD}@cluster0.jwhx2lt.mongodb.net/${dbName}`;
mongoose.connect(mongoURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 65 + 7);
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: "https://source.unsplash.com/collection/483251",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu cursus vitae congue mauris rhoncus aenean.",
			price,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
