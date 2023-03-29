const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require("./db");

const notes = require("./routes/note");
const label = require("./routes/label");
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

connectDb();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/notes", notes);
app.use("/api/labels", label);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
