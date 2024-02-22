const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { uploadImage } = require("../middleware/uploadImage");
const { upload } = require("../services/uploadService");

const playlistController = require("../controllers/playlistController");

router.get("/playlists", verifyToken, playlistController.getPlaylists);
router.post(
	"/playlists",
	verifyToken,
	upload.single("image"),
	uploadImage,
	playlistController.createPlaylist
);
router.post(
	"/playlists/:playlistId",
	verifyToken,
	playlistController.addMusicToPlaylist
);
router.get(
	"/playlists/:playlistId",
	verifyToken,
	playlistController.getPlaylist
);
router.delete(
	"/playlists/:playlistId",
	verifyToken,
	playlistController.removePlaylist
);
router.delete(
	"/playlists/:playlistId/:musicId",
	verifyToken,
	playlistController.removeMusicFromPlaylist
);

module.exports = router;
