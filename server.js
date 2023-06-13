/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const express = require('express');
const app = express();
const PORT = 3000;
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
const {engine} = require('express-handlebars');

require('dotenv').config();

// -------------MONGO_DB-----------------------------------------//
const url = process.env.DB_CONNECTION_STRING;

let result;


async function connectToMongoDB() {
  try {
    const client = new MongoClient(url);
    await client.connect();

    console.log('Verbonden met de database.');

    const db = client.db('dataTeam');
    const collection = db.collection('gamesData');
    result = await collection.find({}).toArray();

    client.close();
    console.log('Verbinding met de database');
  } catch (error) {
    console.error('Er is een fout opgetreden bij het verbinden met de database:', error
    );
  }
}


// Roep de functie aan om verbinding te maken met de database.
connectToMongoDB();


// --------------------------------------------------------------//

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));

// app.engine('handlebars', match());
app.engine('handlebars', engine({defaultLayout: 'main'}));
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

app.post('/like', (req, res) => {
    const likedUser = req.body.like;
    res.render('match', {likedUser});
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
