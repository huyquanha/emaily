const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  // recipients will be an array of sub-documents that conform to RecipientSchema
  recipients: [RecipientSchema],
  yes: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    default: 0,
  },
  // reference to an instance of User
  // this will be the id of the user who owns this survey
  // the ref attribute tells Mongoose that the reference we are making is to the User collection
  // the _ prefix is not required, just a convention to make it obvious that this is a relationship field
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  // these 2 fields will help to determine how active the survey responses are. Not mandatory, just nice to have
  dateSent: Date,
  lastResponded: Date,
});

mongoose.model('surveys', surveySchema);
