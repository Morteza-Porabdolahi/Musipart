const fetch = require("../utils/interceptFetch");

exports.getMusics = async (req, res) => {
	try {
		const getSearchedSongs = await fetch(
			`${process.env.BACKEND_API_URL}?q=search&t=${req.params.q}`
		);

		res.status(200).send(getSearchedSongs.results.filter((item) => item.type === "song"));
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.getDailyMusics = async (req, res) => {
	try {
		const dailyMusics = await fetch(`${process.env.BACKEND_API_URL}?q=day`);

		res.status(200).send(dailyMusics.results);
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.getNewMusics = async (req, res) => {
	try {
		const newMusics = await fetch(`${process.env.BACKEND_API_URL}?q=new`);

		res.status(200).send(newMusics.results);
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.getWeeklyMusics = async (req, res) => {
	try {
		const weeklyMusics = await fetch(`${process.env.BACKEND_API_URL}?q=week`);

		res.status(200).send(weeklyMusics.results);
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.getSingleMusic = async (req, res) => {
	try {
		const specificMusic = await fetch(
			`${process.env.BACKEND_API_URL}/?q=info&t=${req.params.id}`
		);

		res.status(200).send(specificMusic);
	} catch (e) {
		res.status(500).send(e);
	}
};
