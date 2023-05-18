import { MongoClient } from 'mongodb';
import process from 'process';
import * as dotenv from 'dotenv';
dotenv.config();

let db;
const mongoUri = Number(process.env.DEVELOPMENT_MODE === 1) 
  ? 'mongodb://127.0.0.1:27017'
  : `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster.8cposo4.mongodb.net/?retryWrites=true&w=majority`;

async function connectToDb(cb) {
  const client = new MongoClient(mongoUri);
  await client.connect();

  // use react-blog-db
  db = client.db('react-blog-db');
  cb();
}

export { 
  db,
  connectToDb,
};
