const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");

router.get('/top',artistController.getTopArtists);
router.get('/:artistName',artistController.getArtists);
router.get('/:artistName/musics',artistController.getArtistMusics);

module.exports = router;