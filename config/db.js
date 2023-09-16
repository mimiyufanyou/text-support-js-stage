const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const DB_URI = process.env.DB_URI;
const CERT_PATH = process.env.CERT_PATH;

let database = null;

async function connect() {
  const client = new MongoClient(DB_URI, {
    sslKey: fs.readFileSync(CERT_PATH),
    sslCert: fs.readFileSync(CERT_PATH),
    serverApi: ServerApiVersion.v1
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