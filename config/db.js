const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

let database = null;

async function connect() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    database = client.db("testDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw new Error("Database not initialized. Did you forget to call connect()?");
  }
  return database;
}

module.exports = {
  connect,
  getDB
};
