const express = require("express");
const router = express.Router();
const fetch = require("../utils/interceptFetch");
const API_URL = "https://haji-api.ir/music";

router.get("/music/:id", async (req, res) => {
  try {
    const specificMusic = await fetch(`${API_URL}/?q=info&t=${req.params.id}`);

    res.send(specificMusic);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/artists/:artist/musics", async (req, res) => {
  try {
    const allArtistDatas = await fetch(
      `${API_URL}?q=search&t=${req.params.artist}`
    );

    const filterArtistMusics = allArtistDatas.results.filter(
      (item) => item.type === "song"
    );

    res.send(filterArtistMusics);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/artists", async (req, res) => {
  try {
    const allArtists = await fetch(
      `${API_URL}?q=search&t=${req.query.artist}`
    );
    console.log(allArtists);
    res.send(allArtists.results.filter(item => item.type === 'artist'));
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/musics", async (req, res) => {
  try {
    const getSearchedSongs = await fetch(
      `${API_URL}?q=search&t=${req.query.q}`
    );

    res.send(getSearchedSongs.results.filter(item => item.type === 'song'));
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/musics/new", async (_, res) => {
  try {
    const newMusics = await fetch(`${API_URL}?q=new`);

    res.send(newMusics.results);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/musics/daily", async (_, res) => {
  try {
    const dailyMusics = await fetch(`${API_URL}?q=day`);

    res.send(dailyMusics.results);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/musics/weekly", async (_, res) => {
  try {
    const weeklyMusics = await fetch(`${API_URL}?q=week`);

    res.send(weeklyMusics.results);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/topArtists", async (_, res) => {
  try {
    const topArtists = await fetch(`${API_URL}?q=trend`);

    res.send(topArtists.results);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

module.exports = router;
