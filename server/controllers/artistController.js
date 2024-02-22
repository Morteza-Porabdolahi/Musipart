const fetch = require("../utils/interceptFetch");

exports.getArtistMusics = async (req, res) => {
	try {
		const allArtistDatas = await fetch(
			`${process.env.BACKEND_API_URL}?q=search&t=${req.params.artistName}`
		);

		const filterArtistMusics = allArtistDatas.results.filter(
			(item) => item.type === "song"
		);

		res.status(200).send(filterArtistMusics);
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.getArtists = async (req, res) => {
	try {
		const searchedArtists = await fetch(
			`${process.env.BACKEND_API_URL}?q=search&t=${req.params.artistName}`
		);

		res.status(200).send(searchedArtists.results.filter((item) => item.type === "artist"));
	} catch (e) {
		res.status(500).send(e);
	}
};

exports.getTopArtists = async (req, res) => {
	try {
		const topArtists = await fetch(`${process.env.BACKEND_API_URL}?q=trend`);

		res.status(200).send(topArtists.results);
	} catch (e) {
		res.status(500).send(e);
	}
};
