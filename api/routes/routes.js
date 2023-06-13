const express = require("express");
const router = express.Router();
const fetch = require("../utils/interceptFetch");
const API_URL = "https://haji-api.ir/music";

router.get("/musics", async (_, res) => {
  try {
    const allMusicsData = await Promise.all([
      fetch(`${API_URL}?q=day`),
      fetch(`${API_URL}?q=week`),
      fetch(`${API_URL}?q=new`),
      fetch(`${API_URL}?q=trend`),
    ]);
    const allMusics = allMusicsData.reduce((acc, curr) => {
      acc = [...acc, ...curr.results];
      return acc;
    }, []);

    res.send(allMusics);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

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
    const allMusicsData = await Promise.all([
      fetch(`${API_URL}?q=day`),
      fetch(`${API_URL}?q=week`),
      fetch(`${API_URL}?q=new`),
    ]);
    const filterArtistMusics = allMusicsData.reduce((acc, curr) => {
      acc = [...acc, ...curr.results];
      return acc;
    }, []).filter((music) => music.artists.find(artist => artist === req.params.artist));

    res.send(filterArtistMusics);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/artists", async (_, res) => {
  try {
    const allMusicsData = await fetch(`${API_URL}?q=trend`);
   
    res.send(allMusicsData.results);
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

router.get("/musics/:query", async (req, res) => {
  try {
    const getSearchedSongs = await fetch(`${API_URL}?q=search&t=${req.params.query}`);
   
    res.send(getSearchedSongs.results);
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

module.exports = router;
