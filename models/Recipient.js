const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
  email: String,
  // has this email address responded to survey yet
  responded: {
    type: Boolean,
    default: false,
  },
});

// instead of registering recipientSchema as a recipients collection like with User or Survey, we export it here
module.exports = recipientSchema;
