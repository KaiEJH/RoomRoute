const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomRoutes)

//connecting to DB and starting the server

const PORT = 5000;

connectDB().then(()=>{
    app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
}).catch(err=>console.log("Failed to connect to database.",err));