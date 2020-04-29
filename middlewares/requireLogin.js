/*
    next is a function that will be called after our middleware is completed
*/
module.exports = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in, we stop immediately by returning the response, don't bother going to "next"
    return res.status(401).send({ error: 'You must log in!' });
  }
  // if user is logged in, we go the next middleware
  next();
};
