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
    async function addRoom({ name, aliases = [], capacity, buildingName, coordinates  }) {
        if (!name || !capacity || !buildingName || !coordinates) {
            throw new Error("Name, capacity, building name and Coordinates are required fields.");
        }
    
        const db = getDB();
    

        // Check if the room name already exists
        const existingRoom = await db.collection("rooms").findOne({ name: name },{ collation: { locale: "en", strength: 2 } });
            if (existingRoom) {
                throw new Error("Room name already exists.");
            }

        // Check if the alias name already exists if it is not empty
        if ( aliases != "None" && aliases.length > 0 && aliases != "") { 
        const existingAliases = await db.collection("rooms").findOne({ aliases: { $in: aliases }},{ collation: { locale: "en", strength: 2 } });
            if (existingAliases) {
                throw new Error("Alias already used.");
            }
        }
            // Check if the alias name already exists as room name
        const existingNameAsAlias = await db.collection("rooms").findOne({ name: { $in: aliases } },{ collation: { locale: "en", strength: 2 } });
        if (existingNameAsAlias) {
            throw new Error("Alias Already used as a room name.");
        }
            // Check if the room name already exists as alias name
        const existingAliasAsName = await db.collection("rooms").findOne({ aliases: { $in: [name] } },{ collation: { locale: "en", strength: 2 } });
        if (existingAliasAsName) {
            throw new Error("Room name already used as an alias.");
        }
    
        // Construct the new room object
        const newRoom = {
            name,
            aliases,
            capacity,
            buildingName,
            coordinates
        };
    
        // Insert the new room into the collection
        const result = await db.collection("rooms").insertOne(newRoom);
        return result.insertedId; // Return the ID of the newly inserted record
    }
  



module.exports={getAllRooms,getRoomByName,getRoomByAnyName,addRoom};