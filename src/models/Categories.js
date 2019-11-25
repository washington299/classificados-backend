const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Schema, model } = mongoose;

const CategoriesSchema = new Schema(
  {
    name: String,
    thumbnail: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

CategoriesSchema.virtual('thumbnail_url').get(function() {
  return `http://localhost:3003/images/${this.thumbnail}`;
});

module.exports = model('Categories', CategoriesSchema);
