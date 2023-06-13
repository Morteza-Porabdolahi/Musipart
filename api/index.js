const express = require("express");
const routes = require("./routes/routes");
const app = express();
const cors = require("cors");
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/api", routes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
