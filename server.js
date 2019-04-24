const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'face-recog'
    }
  });

//   db.select('*').from('users').then(data => {
//       console.log(data);
//   });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("It's alive!!!");
    
});

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res, db) });

/*
 * /signin --> POST =success/fail
 * /register --> POST = return created user (new user obj)
 * /profile/:userId --> GET = user obj?
 * /image --> PUT --> updated user obj or updated part of user
 * 
 */

app.listen(process.env.PORT || 5000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
}); 

