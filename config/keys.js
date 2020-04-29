// key.js - figure out what set of credentials (prod or dev) to return
/*
  VERY IMPORTANT! These config keys are only used for the backend of our application
  The reason is because any file that is required from the front end side of our application
  will be public visible to anyone in the world => we obviously don't want to reveal the config keys
  in there
*/
if (process.env.NODE_ENV === 'production') {
  // we are in production - return the prod set of keys
  module.exports = require('./prod');
} else {
  // return the dev keys
  module.exports = require('./dev');
}
