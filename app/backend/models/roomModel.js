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

    // Adds a new room to the database, ensuring name and aliases are unique and valid
    async function addRoom({ name, aliases = [], capacity, buildingName }) {
        if (!name || !capacity || !buildingName) {
            throw new Error("Name, capacity, and building name are required fields.");
        }
    
        const db = getDB();
    
        // Check if the name or aliases already exist as a name or an alias
        const existingConflict = await db.collection("rooms").findOne({
            $or: [
                { name: name }, // Check if the name already exists
                { aliases: { $in: aliases } }, // Check if any of the aliases already exist
                { name: { $in: aliases } }, // Check if any alias is used as a name
                { aliases: { $in: [name] } }, // Check if the name is already used as an alias

            ]
        });
    
        if (existingConflict) {
            throw new Error(
                "Room name, one of the aliases, or an alias being used as a name already exists in the database."
            );
        }
    
        // Construct the new room object
        const newRoom = {
            name,
            aliases,
            capacity,
            buildingName
        };
    
        // Insert the new room into the collection
        const result = await db.collection("rooms").insertOne(newRoom);
        return result.insertedId; // Return the ID of the newly inserted record
    }
  



module.exports={getAllRooms,getRoomByName,getRoomByAnyName,addRoom};