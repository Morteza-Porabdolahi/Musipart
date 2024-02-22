const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./utils/db");

const userRoutes = require("./routes/userRoutes");
const musicRoutes = require("./routes/musicRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const artistRoutes = require("./routes/artistRoutes");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/musics", musicRoutes);
app.use("/api/:userId", playlistRoutes);
app.use("/api/artists", artistRoutes);

connectDB();
app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});

module.exports = app;
