const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: false,
	},
	password: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	gender: {
		type: String,
		required: false,
		unique: false,
	},
	phone: {
		type: String,
		required: true,
		unique: false,
	},
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
