const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/auth");

exports.loginUser = async function (req, res) {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(404)
				.json({ message: `User with email ${email} not found !` });
		}

		const isPasswordsMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordsMatch) {
			return res
				.status(401)
				.json({ message: "Entered password is invalid !" });
		}

		const payload = {
			user: {
				userId: user._id,
				username: user.username,
				gender: user.gender,
				phone: user.phone,
				email,
				playlists: user.playlists,
			},
		};
		const token = generateToken(payload);

		res.status(200).send({ token });
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.registerUser = async function (req, res) {
	const { username, password, email, phone, gender } = req.body;

	try {
		const isUserExists = await User.findOne({ email });

		if (isUserExists) {
			return res
				.status(409)
				.json({ message: "User with that email is already exists !" });
		}
		const hash = await bcrypt.hash(password, 10);
		const user = new User({
			username,
			password: hash,
			email,
			phone,
			gender,
			playlists: [],
		});

		await user.save();
		res.status(201).send({ message: "You registered successfully !" });
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
};
