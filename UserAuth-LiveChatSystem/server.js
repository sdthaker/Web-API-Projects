'use strict';
require('dotenv').config({path: __dirname + '/sample.env'});
const routes = require('./routes/routes')
const auth = require('./auth/auth')

const express = require('express');
const app = express();

const http = require('http').createServer(app)
const io = require('socket.io')(http)

const myDB = require('./db/connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
fccTesting(app); //For FCC testing purposes
const session = require('express-session')
const passport = require('passport')
const passportSocketIo = require('passport.socketio')
const cookieParser = require('cookie-parser')

const MongoStore = require('connect-mongo')(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });

app.set('view engine', 'pug')

app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
  key: 'express.sid',
  store: store
}));

app.use(passport.initialize())
app.use(passport.session())

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
);

myDB(async client => {
  //MongoDB database instance  
  const myDataBase = await client.db('UserAuth').collection('UAuth');
  
  //routes
  routes(app, myDataBase)

  //auth methods
  auth(app, myDataBase)
  
  let currentUsers = 0
  io.on('connection', socket => {
    ++currentUsers
    io.emit('user', {
      name: socket.request.user.name,
      currentUsers,
      connected: true
    })

    socket.on('chat message', message =>{
      io.emit('chat message', {
        name: socket.request.user.name,
        message
      })
    })
    //console.log('user ' + socket.request.user.username + ' connected');

    socket.on('disconnect', () =>{
      console.log('User has disconnected')
      --currentUsers
      io.emit('user count', currentUsers)
    })

  })

}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
