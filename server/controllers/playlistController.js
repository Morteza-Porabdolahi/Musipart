const User = require("../model/user.model");
const { removeFromCloudinary } = require("../services/uploadService");
const Playlist = require("../model/playlist.model");

exports.getPlaylists = async function (_, res) {
  const { userId } = res.locals;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    } else {
      const playlists = await Playlist.find().all("userId", [userId]);

      res.status(200).send(playlists);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.createPlaylist = async function (req, res) {
  const { playlistName } = req.body;
  const { image, userId } = res.locals;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    } else {
      const playlist = await Playlist.findOne({ name: playlistName });

      if (playlist) {
        return res.status(409).json({
          message: `a playlist with name ${playlistName} is already exist !`,
        });
      } else {
        const newPlaylist = new Playlist({
          name: playlistName,
          image,
          musics: [],
          userId,
        });

        await newPlaylist.save();
        res.status(201).send({
          message: `a playlist with name ${playlistName} created successfully !`,
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.getPlaylist = async function (req, res) {
  const { playlistId } = req.params;
  const { userId } = res.locals;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    } else {
      const playlist = await Playlist.findOne({ _id: playlistId });

      res.status(200).send(playlist);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.addMusicToPlaylist = async function (req, res) {
  const { playlistId } = req.params;
  const { userId } = res.locals;
  const { id, album, artists, audio, duration, title, lyrics, image } =
    req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    } else {
      const playlist = await Playlist.findById(playlistId);
      const copyPlaylist = JSON.parse(JSON.stringify(playlist));
      const playlistMusics = copyPlaylist.musics;

      if (playlistMusics.find((music) => music.id === id)) {
        res
          .status(409)
          .json({ message: "The song is already exist in your playlist !" });
      } else {
        const musicObj = {
          id,
          album,
          artists,
          audio,
          duration,
          title,
          lyrics,
          image,
        };

        playlistMusics.push(musicObj);
        await Playlist.updateOne(playlist, copyPlaylist);

        res.status(200).send({
          message: "Music added to playlist successfully !",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.removePlaylist = async function (req, res) {
  const { playlistId } = req.params;
  const { userId } = res.locals;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    } else {
      const playlist = await Playlist.findByIdAndRemove(playlistId);
      await removeFromCloudinary(playlist.image?.public_id);

      return res.status(200).send({
        message: "Playlist removed successfully !",
        playlists: await Playlist.find({ userId }),
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

exports.removeMusicFromPlaylist = async function (req, res) {
  const { playlistId, musicId } = req.params;
  const { userId } = res.locals;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    } else {
      const playlist = await Playlist.findById(playlistId);
      const copyPlaylist = JSON.parse(JSON.stringify(playlist));
      const filteredMusics = copyPlaylist.musics.filter(
        (music) => music.id !== musicId
      );

      await Playlist.updateOne(playlist, {
        ...copyPlaylist,
        musics: filteredMusics,
      });

      res
        .status(200)
        .send({ message: "Music deleted from playlist successfully !" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
