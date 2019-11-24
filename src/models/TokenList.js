const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Schema, model } = mongoose;

const TokenListSchema = new Schema({
  token: String,
});

module.exports = model('Tokenlist', TokenListSchema);
