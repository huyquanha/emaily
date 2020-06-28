const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// here, we get the users model class back from mongoose, and assign it to User
const User = mongoose.model('users');

// this function is called after the user is either created/retrieved from mongoDB (in the passport callback function)
// extract the id from user and passport will take care of putting this in the "Set-Cookie" header sent back to browser
// Note that this user.id is different from the google profile id. It's an auto-generated id given to our user by MongoDB
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      // the route user will be sent to after they grant us permission
      callbackURL: '/auth/google/callback',
      // add this configuration so passport strategy trust requests coming from Heroku proxy
      // so it won't downgrade requests from https to http
      proxy: true,
    },
    // this callback function will be called after passport send the code to Google and get the user profile in exchange
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // we already have a record with the given profile.id
        console.log('User already exists', profile.id);
        // the first argument is an error, in this case existingUser is found so everything fine => err = null
        return done(null, existingUser);
      }
      // we don't have a user record with this id
      // create a new record and save it to the database
      const newUser = await new User({
        googleId: profile.id,
      }).save();
      done(null, newUser);
    }
  )
);
