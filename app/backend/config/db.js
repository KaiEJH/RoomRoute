/*
This file basically acts like a class for db, where the server begins by connecting to the database, and all
other setting up of the database is defined in here, to be used by other sections.
*/
const {MongoClient} = require("mongodb");//using to connect to mongo database
require("dotenv").config();//makes .env file accessible, which has sensitive information not stored in repository
const uri = process.env.MONGO_URI//pulls MONGO_URI from env file: Basically your unique access key that lets you connect to mongo

const client = new MongoClient(uri);

let db;

async function connectDB(){
    try{
        await client.connect();
        db = client.db('RoomRoute');
        console.log("Connected to MongoDB")
    } catch(err){
        console.error("DB connection error:", err);
    }
}

function getDB(){
    if (!db) throw new Error("Database not connected");
        return db;
}

module.exports = {connectDB,getDB}