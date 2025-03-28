const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const pathRoutes = require('./routes/pathRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomRoutes);
app.use("/api", pathRoutes);

//connecting to DB and starting the server

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log("Failed to connect to database.", err));
