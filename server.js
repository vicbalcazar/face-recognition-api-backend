const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'jon@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'jon@gmail.com'
        }
    ]
};


app.get('/', (req, res) => {
    res.send(db.users);
    
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    });
    if (!found) {
        res.status(400).json('not found');
    }
});

app.post('/signin', (req, res) => {

    //bcrypt.compare();

    if(req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
        res.json(db.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;

    bcrypt.hash(password, null, null, (err, hash) => {
        console.log(hash);
    });

    db.users.push( {
        id: '125',
        name: name,
        email: email,
        // password: password,
        entries: 0,
        joined: new Date()
    } );
    res.json(db.users[db.users.length-1]);
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++; 
            return res.json(user.entries);
        } 
    });
    if (!found) {
        res.status(400).json('not found');
    }
});

/*
 * /signin --> POST =success/fail
 * /register --> POST = return created user (new user obj)
 * /profile/:userId --> GET = user obj?
 * /image --> PUT --> updated user obj or updated part of user
 * 
 */

app.listen(5000, () => {
    console.log('app is running on port 5000');
}); 

