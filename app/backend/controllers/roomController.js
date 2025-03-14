/*
This file basically acts as a request handler, associated with the roomModel.js
In this file all the res.x are essentially returns, with different kinds of returns 
*/
const {getAllRooms,getRoomByName,getRoomByAnyName} = require("../models/roomModel");

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

module.exports = {fetchRooms,fetchRoomByName,fetchRoomByAnyName}