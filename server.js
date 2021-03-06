const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
	origin: "http://localhost:8081"
};

const db = require("./app/models");
db.sequelize.sync({ force: false }).then(() => {
	console.log("Drop and re-sync db.");
});

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
	res.json({ message: "Welcome to profiler API." });
});

require("./app/routes/note.routes")(app);

const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});