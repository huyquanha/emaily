const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// here, we get the users model class back from mongoose, and assign it to User
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  // this user is the same user retrieved from the google strategy callback
  // we use user.id as the cookie. Passport will take care of passing this cookie into "Set-Cookie" header
  // Note that this user.id is different from the google profile id. It's an auto-generated id given to our user by MongoDB
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      // the route user will be sent to after they grant us permission
      callbackURL: '/auth/google/callback'
    },
    // this callback function will be called after passport send the code back to Google and get the user profile in exchange
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // we already have a record with the given profile.id
          console.log('User already exists', profile.id);
          // the first argument is an error, in this case existingUser is found so everything fine => err = null
          done(null, existingUser);
        } else {
          // we don't have a user record with this id
          // create a new record and save it to the database
          new User({
            googleId: profile.id
          })
            .save()
            .then(newUser => done(null, newUser));
        }
      });
    }
  )
);
