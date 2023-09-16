const db = require('./db');

const collection = db.getDB().collection("testCol");
// Now you can use 'collection' to interact with your 'testCol' collection.