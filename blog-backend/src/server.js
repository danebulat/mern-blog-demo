import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { db, connectToDb } from './db.js';
import credentials from '../config/firebase.js';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -------------------------------------------------- 
// Firebase Setup
// -------------------------------------------------- 

admin.initializeApp({ 
  credential: admin.credential.cert(credentials) 
});

// -------------------------------------------------- 
// CORS Setup (for development mode)
// -------------------------------------------------- 

const whiteList = ['http://localhost:5173', 'http://localhost:8000'];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

if (Number(process.env.DEVELOPMENT_MODE) === 1) {
  app.use(cors(corsOptions));
}

// -------------------------------------------------- 
// Middleware
// -------------------------------------------------- 

// set static directory storing the react app 
app.use(express.static(path.join(__dirname, '../dist')));

// parse json payloads and make available on req.body
app.use(express.json());

// set user if a user is logged in
app.use(async (req, res, next) => {
  const { authtoken } = req.headers;
  req.user = {};
  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  //req.user = req.user || {}; 
  next();
});

// -------------------------------------------------- 
// GET all routes outside of /api
// -------------------------------------------------- 

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// -------------------------------------------------- 
// GET /api/articles/:name
// -------------------------------------------------- 

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection('articles').findOne({ name });
  
  if (article) {
    // add canUpvote property to article
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);
    article.canUpvote = Boolean(canUpvote);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(article));
  } else {
    res.sendStatus(404).json('Article Not Found');
  }
});

// -------------------------------------------------- 
// PUT /api/articles/:name/upvote
// -------------------------------------------------- 

// Only apply middleware to following routes
app.use((req, res, next) => {
  if (req.user) {
    // logged in user can access this endpoint
    next();
  } else {
    res.sendStatus(401);
  }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection('articles').findOne({ name });
  
  if (article) {
    // check if user can upvote this article
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      // increment upvote by one (also $set operator)
      await db.collection('articles').updateOne({ name }, {
        $inc:  { upvotes: 1 },
        $push: { upvoteIds: uid }
      });
    }

    const updatedArticle = await db.collection('articles').findOne({ name });
    res.json(updatedArticle);
  } else {
    res.send(`That article doesn't exist`);
  }
});

// -------------------------------------------------- 
// POST /api/articles/:name/comments
// -------------------------------------------------- 

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user;
  
  // update comments array for article
  await db.collection('articles').updateOne({ name }, {
    $push: { comments: { postedBy: email, text } }
  });

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.json(article);
  } else {
    res.send(`That article doesn't exist`);
  }
});

const PORT = process.env.PORT || 8000;

// connect to db before listening
connectToDb(() => {
  console.log('Successfully connected to database');
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  })
});
