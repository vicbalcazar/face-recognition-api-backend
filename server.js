const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

const database = {
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
    res.send(database.users);
    
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    db.select('*').from('users').where({ id: id })
        .then(user =>{
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not Found');
            }
        })
        .catch( err => {res.status(400).json('Error getting user')})
});

app.post('/signin', (req, res) => {

    //bcrypt.compare();

    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unnable to get user'))
            } else {
                res.status(400).json('wrong credentials');
            }

        })
        .catch(err => res.status(400).json('wrong credentials'))
    
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password)

    // bcrypt.hash(password, null, null, (err, hash) => {
    //     console.log(hash);
    // });
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then (user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        
        .catch(err => res.status(400).json('unable to register'))

    
});

app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
   
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

