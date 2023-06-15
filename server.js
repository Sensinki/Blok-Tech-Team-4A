/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const PORT = 3000;
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');

require('dotenv').config();

// -------------MONGO_DB-----------------------------------------//
const url = process.env.DB_CONNECTION_STRING;

let result;

async function connectToMongoDB(index) {
  try {
    const client = new MongoClient(url);
    await client.connect();

    console.log('Verbonden met de database.');

    const db = client.db('dataTeam');
    const collection = db.collection('gamesData');

    const likedUsers = [
      { name: 'Abdel', image: '/css/img/profiles/abdel.jpeg', game: 'Minecraft' },
      { name: 'Karen', image: '/css/img/profiles/Sang.cv.jpg', game: 'Valorand' },
      { name: 'Angelo', image: '/css/img/profiles/angelo.jpeg', game: 'LOL' },
    ];

    const selectedUser = likedUsers[index];
    await collection.insertOne(selectedUser);
    result = await collection.find({}).toArray();

    client.close();
    console.log('Verbinding met de database gesloten.');
  } catch (error) {
    console.error('Er is een fout opgetreden bij het verbinden met de database:', error);
  }
}

// Roep de functie aan om verbinding te maken met de database en een specifiek likedUser-object te sturen.
connectToMongoDB(1); // Stuurt het tweede likedUser-object naar MongoDB (index 1).

// --------------------------------------------------------------//

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.get('/match', match);
app.get('/like', like);

function match(req, res) {
  res.render('match');
}

function like(req, res) {
  res.render('like');
}

let likedUserProfile;

app.post('/like', (req, res) => {
  const likedUser = req.body.like;
  likedUserProfile = likedUser;
  res.render('like', { likedUser });
});

app.get('/like', (req, res) => {
  res.render('like', { likedUserProfile });
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
