//This section is the real meat and potatoes of the backend. It has the all functions that are going to be called when dealing with rooms.
const {getDB} = require("../config/db");
//gets all rooms on the database
async function getAllRooms(){
    const db = getDB();
    return await db.collection("rooms").find().toArray();//gets all items in the collection rooms.
}
//gets a room by its Official Name, which is essentially an ID.
async function getRoomByName(officialName){
    const db = getDB();
    return await db.collection("rooms").findOne({name:officialName});
}
//gets a room by its Official Name or an alias.
async function getRoomByAnyName(someName){
    const db = getDB();
    query={
        $or:[
            {name:someName}, //checks if it is items name
            {aliases:{ $in: [someName] }} //checks if it is in items list of aliases
        ]
    };
    
    return await db.collection("rooms").findOne(query);
}

module.exports={getAllRooms,getRoomByName,getRoomByAnyName};