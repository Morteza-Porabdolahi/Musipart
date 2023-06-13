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

    res.send(specificMusic)
  } catch (e) {
    if (e) console.log(e);
    res.send(e);
  }
});

module.exports = router;
