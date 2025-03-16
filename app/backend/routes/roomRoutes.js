const express = require("express");
const {
  fetchRooms,
  fetchRoomByName,
  fetchRoomByAnyName,
} = require("../controllers/roomController");

const router = express.Router();

router.get("/", fetchRooms);
router.get("/official-name/:name", fetchRoomByName);
router.get("/:name", fetchRoomByAnyName);

module.exports = router;
