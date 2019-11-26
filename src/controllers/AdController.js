const jwt = require('../middlewares/AuthMiddleware');
const Ad = require('../models/Ad');
const User = require('../models/User');

const index = async (req, res) => {
  const { q, state, cat, offset } = req.query;
  let { limit } = req.query;
  // the variable limit is coming as a String so i have to convert to a number to use it on query.
  limit = parseInt(limit);

  if (!q && !state && !cat) {
    const ads = await Ad.find({}, null, { limit, sort: { createdAt: -1 } });
    res.json(ads);
    return;
  }

  // the $regex find some String in a field.
  const ads = await Ad.find(
    {
      title: { $regex: q, $options: 'i' },
      category: { $regex: cat, $options: 'i' },
      state: { $regex: state, $options: 'i' },
    },
    null,
    {
      limit,
      sort: { createdAt: -1 },
    }
  );

  res.json(ads);
};

const store = async (req, res) => {
  const { title, price, priceneg, desc, cat, token } = req.body;
  const filename = req.files.map(name => name.filename);

  if (!token) {
    res.json({ notallowed: 'Token inválido!!!' });
    return;
  }

  const info = jwt.decodeToken(token);
  const user = await User.findOne({ _id: info.id });

  const ad = await Ad.create({
    photos: filename,
    title,
    price,
    priceNeg: priceneg ? true : false,
    description: desc,
    category: cat,
    state: user.state,
    user: user._id,
  });

  res.json(ad);
};

module.exports = {
  index,
  store,
};
