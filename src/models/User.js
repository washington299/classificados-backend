const mongoose = require('mongoose');

const { Schema, model } = mongoose;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  name: String,
  state: String,
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
});

module.exports = model('User', UserSchema);
