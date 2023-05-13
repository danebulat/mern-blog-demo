import { MongoClient } from 'mongodb';

let db;

async function connectToDb(cb) {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();

  // use react-blog-db
  db = client.db('react-blog-db');
  cb();
}

export { 
  db,
  connectToDb,
};
