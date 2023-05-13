import express from 'express';
import { db, connectToDb } from './db.js';

const app = express();

// parse json payloads and make available on req.body
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  const article = await db.collection('articles').findOne({ name });
  
  // make sure json headers sent in response (.json())
  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  // increment upvote by one (also $set operator)
  await db.collection('articles').updateOne({ name }, {
    $inc: { upvotes: 1 },
  });

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.send(`The ${name} article now has ${article.upvotes} upvotes`);
  } else {
    res.send(`That article doesn't exist`);
  }
});

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  
  // update comments array for article
  await db.collection('articles').updateOne({ name }, {
    $push: { comments: { postedBy, text } }
  });
  const article = await db.collection('articles').findOne({ name });

  if (article) {
    res.send(article.comments);
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
