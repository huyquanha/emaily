const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose; // object destructuring. Equivalent to the above

/**
 * Although MongoDB is schema-less, when we use mongoose, it expects to know ahead of time every
 * property that we are going to have in a record => need the Schema
 *
 * We can easily add/subtract properties to schema
 */
const userSchema = new Schema({
  googleId: String
});

// create a new collection called users, specifying a schema userSchema
// if this collection already exists, mongoose will NOT overwrite existing collections
// this also loads the users model class into mongoose
mongoose.model('users', userSchema);
