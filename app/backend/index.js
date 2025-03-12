const {MongoClient} = require("mongodb");//using to connect to mongo database
require("dotenv").config();//makes .env file accessible, which has sensitive information not stored in repository
const uri = process.env.MONGO_URI//pulls MONGO_URI from env file: Basically your unique access key that lets you connect to mongo

const client = new MongoClient(uri);

async function run(){
    try{
        const database=client.db('RoomRoute');
        const rooms = database.collection('samples');

        const query = {name:'SLT'};
        const room = await rooms.findOne(query);

        console.log(room);
    } finally{
        await client.close();
    }
}

run().catch(console.dir);
