const HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    // if user don't hvae enough credits, we stop immediately by returning the response, don't bother going to "next"
    return res
      .status(HttpStatus.FORBIDDEN)
      .send({ error: 'Not enough credits!' });
  }
  next();
};
