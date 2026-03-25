const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const notesRoutes = require("./routes/notes");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Backend aktif. Buka frontend di http://localhost:5501");
});

app.use("/notes", notesRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
