/*
This file basically acts as a request handler, associated with the roomModel.js
In this file all the res.x are essentially returns, with different kinds of returns 
*/
const {getAllRooms,getRoomByName,getRoomByAnyName,addRoom} = require("../models/roomModel");

//Handles a request for all rooms
async function fetchRooms(req,res){
    try{
        const rooms=await getAllRooms();
        res.json(rooms);
    }
    catch(err){
        res.status(500).json({error:"Error fetching all rooms."});
    }
}
//Handles a request asking for a room with the official name
async function fetchRoomByName(req,res){
    try{
        const room= await getRoomByName(req.params.name)
        res.json(room);
    }
    catch(err){
        res.status(500).json({error:"Error fetching room by official name."});
    }
}
//Handles a request asking for a room by either official name or one of its aliases
async function fetchRoomByAnyName(req,res){
    try{
        const room= await getRoomByAnyName(req.params.name)
        res.json(room);
    }
    catch(err){
        res.status(500).json({error:"Error fetching room by any name."});
    }
}


// Handles a request for adding a new room
async function createRoom(req, res) {
    try {
        // Extract room data from the request body
        const { name, aliases = [], capacity, buildingName, coordinates } = req.body;

        // Call the addRoom function to add the new room
        const roomId = await addRoom({ name, aliases, capacity, buildingName, coordinates });

        // Respond with the ID of the newly added room
        res.status(201).json({ message: "Room added successfully", roomId });
    } catch (err) {
        // Send error response
        if (err.message === "Alias already used.") {
            res.status(400).json({ error: "Alias already used." });
        } else if (err.message === "Room name already exists.") {
            res.status(400).json({ error: "Room name already exists." });
        } else if (err.message === "Alias Already used as a room name.") {
            res.status(400).json({ error: "Alias Already used as a room name." });
        } else if (err.message === "Room name already used as an alias.") {
            res.status(400).json({ error: "Room name is already used as an alias." });
        } else {
            res.status(500).json({ error: "Error adding room", details: err.message });
        }

    }
}


module.exports = {fetchRooms,fetchRoomByName,fetchRoomByAnyName, createRoom}