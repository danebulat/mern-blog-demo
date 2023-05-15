import express from 'express';
import cors from 'cors';
import { db, connectToDb } from './db.js';

const app = express();

// -------------------------------------------------- 
// CORS Setup
// -------------------------------------------------- 

const whiteList = ['http://localhost:5174', 'http://localhost:8000'];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

// parse json payloads and make available on req.body
app.use(express.json());

// -------------------------------------------------- 
// GET /api/articles/:name
// -------------------------------------------------- 

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  const article = await db.collection('articles').findOne({ name });
  
  // make sure json headers sent in response (.json())
  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404).json('Article Not Found');
  }
});

// -------------------------------------------------- 
// PUT /api/articles/:name/upvote
// -------------------------------------------------- 

app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  // increment upvote by one (also $set operator)
  await db.collection('articles').updateOne({ name }, {
    $inc: { upvotes: 1 },
  });

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send(`That article doesn't exist`);
  }
});

// -------------------------------------------------- 
// POST /api/articles/:name/comments
// -------------------------------------------------- 

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  
  // update comments array for article
  await db.collection('articles').updateOne({ name }, {
    $push: { comments: { postedBy, text } }
  });
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send(`That article doesn't exist`);
  }
});

// connect to db before listening
connectToDb(() => {
  console.log('Successfully connected to database');
  app.listen(8000, () => {
    console.log('Server is listening on port 8000');
  })
});
