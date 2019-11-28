const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Schema, model } = mongoose;

const AdSchema = new Schema(
  {
    photos: [String],
    title: {
      type: String,
      trim: true,
    },
    category: String,
    price: Number,
    priceNeg: Boolean,
    description: String,
    state: String,
    views: Number,
    userInfo: {},
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

AdSchema.virtual('photos_url').get(function() {
  let imgs = [];
  for (let i = 0; i < this.photos.length; i++) {
    imgs.push(`http://localhost:3003/files/${this.photos[i]}`);
  }
  return imgs;
});

module.exports = model('Ad', AdSchema);
