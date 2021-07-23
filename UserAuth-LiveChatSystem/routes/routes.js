const bcrypt = require('bcrypt')
const passport = require('passport')

module.exports = function(app, myDataBase){
    //route for home page, that renders the index.pug home page. 
  //The page allows user to login, register 
  app.route('/').get((req, res) => {
    res.render('../views/pug/index', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true
    });
  });

  //login route containing username and password, 
  //if the localStrategy logic fails, redirects the user back to home page
  app.route('/login').post(passport.authenticate('local', {failureRedirect:'/'}) ,(req, res) => {
    res.redirect('/profile')
  })

  //profile page of the verified user
  app.route('/profile').get(ensureAuthenticated, (req, res) => {
    res.render('../views/pug/profile', {
      username: req.user.username
    })
  })

  //logout route for the user
  app.route('/logout').get((req, res) => {
    req.logout()
    res.redirect('/')
  })

  //register a new user on POST /register
  //if the user is found, redirect them to the home page
  //else add user's data using html form's body data to database
  app.route('/register').post((req, res, next) => {
    myDataBase.findOne({username: req.body.username})
    .then(data => {
      if(data){
        res.redirect('/')
      }
      else{
        if(req.body.username && req.body.password) {
          const hash = bcrypt.hashSync(req.body.password, 12)
          myDataBase.insertOne({
            username: req.body.username,
            password: hash
          })
          .then(data => {
            if(data) next(null, doc.ops[0])
          })
          .catch(err => {
            res.redirect('/')
          })
        }
        else{
          res.send('You have not provided either the username or the password. Both are required')
        }
      }
    })
    .catch(e => {
      next(e)
    })
  }, passport.authenticate('local', {failureRedirect:'/'}), (req, res, next) => {
    res.redirect('/profile')
  })

  //route the user to the github app login and authenticate the user using passport 
  app.route('/auth/github').get(passport.authenticate('github'))

  //route the user back to the profile page after authenticating the user 
  app.route('/auth/github/callback').get(passport.authenticate('github', {failureRedirect:'/'}) , (req, res) => {
    req.session.user_id = req.user.id
    res.redirect('/chat')
  })

  app.route('/chat').get(ensureAuthenticated, (req, res) => {
    res.render('../views/pug/chat', {
      user: req.user
    })
  })

  //send back a 404 not found response 
  //if the user tries to access any of the routes
  //that are not defined in routes.js
  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

  //authenticate that the username is provided to prevent access to 'profile' page 
  function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/')
  }
}

