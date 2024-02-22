const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    musics : {
        type : Array,
        required : false,
    },
    name : String,
    image : {
        type : Object,
        required : false,
    },
    userId : String,
});

const Playlist = new mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
