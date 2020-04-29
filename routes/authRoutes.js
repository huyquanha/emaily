// nothing to do with our passport.js, we require the original npm module here
const passport = require('passport');

module.exports = (app) => {
  // when user tries to sign in, he/she will be first redirected here, and this route will try to retrieve
  // their profile details from Google
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'], // what details we want to have from users
    })
  );

  // even though the handler of this route (passport.authenticate) looks very similar to the previous one,
  // under the hood it does a different thing because it sees the code in the URL and will attempt to
  // exchange the code with the actual user profile

  // passport.authenticate('google') is actually a middleware as well, wich takes the code from the URL and
  // send it to google in exchange for the user profile, and then it calls the callback function we specify in passport.js
  // to either create a new user in mongodb if this is the first time they log in, or to return an existing user
  // after this middleware is done, it will pass the request to the next middleware
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      // tells the browser to go to /surveys
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    // this is another thing attached to req by passport, alongside req.user, to enable logging user out
    req.logout();
    // this should be Undefined/ No content/ nothing because req.logout() already deleted req.user
    // res.send(req.user);
    // redirect user to the root route (Landing page)
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
