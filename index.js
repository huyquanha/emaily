/*
    CommonJS module import syntax, because Node doesn't have simple support for "import express from 'express'" (ES6 import syntax) yet. Note that it's a different story on the front end

    To be able to use ES6 syntax, we need a transpiler like Babel to convert our ES6+-style code to ES5
*/
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
/**
 * We need to require User.js before passport.js so that at the time passport.js
 * gets executed, the users model class has already been defined
 */
require('./models/User');
/*
    we do this to ensure all configuration in passport.js gets executed
    Since passport.js doesn't export anything, we don't need to assign this require to anything
*/
require('./services/passport');

// connect to the remote MongoDB databasted hosted on Atlas
mongoose.connect(keys.mongoURI, {
  // these are to resolve some deprecation warning with how mongoose connecto Mongo
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();

// tell bodyParser middleware to parse json request body and attach it to req as req.body
app.use(bodyParser.json());
// enabling cookie in our application
app.use(
  cookieSession({
    // how long the cookie can exist inside the browser before it is automatically expired (ms)
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // keys for encrypting the cookie
    keys: [keys.cookieKey],
  })
);
// tell passport to use cookie for authentication
app.use(passport.initialize());
app.use(passport.session());

// get the function from authRoutes.js and call it immediately after requiring, passing in app
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets like our main.js or main.css file
  // the order of operation is important: checking the static asset need to be done first and then returning index.html
  // for all other requests that Express can't recognize
  app.use(express.static('client/build'));

  // Express will serve up the index.html if it doens't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
/*
    when deploying our code to Heroku, they will expect our app to listen on a specific port, which we don't know ahead of time. Heroku will instead specify the port in an environment variable, which we must read
    using process.env.PORT and instruct our app to listen on
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT);
