const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose; // object destructuring. Equivalent to the above

/**
 * Although MongoDB is schema-less, mongoose expects to know ahead of time all properties
 * we will have in a record
 * We can easily add/subtract properties to a schema
 */
const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number,
    default: 0,
  },
});

/**
 * create a new collection 'users' (if not exist) based on userSchema defined above
 * and loads the users model class into mongoose
 */
mongoose.model('users', userSchema);
