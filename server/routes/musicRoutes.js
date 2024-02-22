const express = require("express");
const router = express.Router();
const musicController = require("../controllers/musicController");

router.get('/:id',musicController.getSingleMusic);
router.get('/search/:q',musicController.getMusics);
router.get('/categories/weekly',musicController.getWeeklyMusics);
router.get('/categories/daily',musicController.getDailyMusics);
router.get('/categories/new',musicController.getNewMusics);

module.exports = router;