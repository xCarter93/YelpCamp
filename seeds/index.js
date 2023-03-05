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
	for (let i = 0; i < 500; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 65 + 7);
		const camp = new Campground({
			author: "63fa94d17b2434928c213dc2",
			location: `${cities[random1000].city}, ${cities[random1000].country}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu cursus vitae congue mauris rhoncus aenean.",
			price,
			geometry: {
				type: "Point",
				coordinates: [cities[random1000].lng, cities[random1000].lat],
			},
			images: [
				{
					url: "https://res.cloudinary.com/dpiff2nvg/image/upload/v1677796764/YelpCamp/x1quvuphfdakmxn4nwei.jpg",
					filename: "YelpCamp/x1quvuphfdakmxn4nwei",
				},
				{
					url: "https://res.cloudinary.com/dpiff2nvg/image/upload/v1677796764/YelpCamp/sfb7szkk4avayraq75yo.jpg",
					filename: "YelpCamp/sfb7szkk4avayraq75yo",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
