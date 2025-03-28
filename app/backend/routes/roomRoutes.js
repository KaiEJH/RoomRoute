const express = require("express");
const {
  fetchRooms,
  fetchRoomByName,
  fetchRoomByAnyName,
  createRoom,
} = require("../controllers/roomController");

const router = express.Router();

router.get("/", fetchRooms);
router.get("/official-name/:name", fetchRoomByName);
router.get("/:name", fetchRoomByAnyName);

router.post("/add-room", createRoom);

module.exports = router;

