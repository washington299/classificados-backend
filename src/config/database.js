const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', error => {
  console.log(error);
});

module.exports = mongoose;
