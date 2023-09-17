const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

const DB_URI = process.env.DB_URI;

// Decode Base64 encoded certificate
const certificate = Buffer.from(process.env.MONGO_CERT_BASE64, 'base64').toString('ascii');

// Write the certificate to a temporary file
const tmpCertificatePath = '/tmp/mongoCert.pem';
fs.writeFileSync(tmpCertificatePath, certificate);

let database = null;

async function connect() {
  const client = new MongoClient(DB_URI, {
    sslKey: tmpCertificatePath,     // Use tmpCertificatePath here
    sslCert: tmpCertificatePath,    // Use tmpCertificatePath here
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
