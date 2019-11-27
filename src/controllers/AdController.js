const jwt = require('../middlewares/AuthMiddleware');
const Ad = require('../models/Ad');
const User = require('../models/User');

const index = async (req, res) => {
  const { q, state, cat } = req.query;
  let { limit, offset } = req.query;
  // the variable limit is coming as a String so i have to convert to a number to use it on query.
  limit = parseInt(limit);

  offset = (offset * limit) / 2;

  if (!q && !state && !cat) {
    const ads = await Ad.find({}, null, {
      skip: offset,
      limit,
      sort: { createdAt: -1 },
    });
    res.json({ ads, total: ads.length });
    return;
  }
  // the $regex find some String in a field.
  const ads = await Ad.find(
    {
      title: { $regex: q, $options: 'i' },
      category: { $regex: cat, $options: 'i' },
    },
    null,
    {
      skip: offset,
      limit,
      sort: { createdAt: -1 },
    }
  );

  console.log(ads);

  res.json({ ads, total: ads.length });
};

const show = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.json({ notallowed: 'Id inválido!!!' });
    return;
  }

  const ad = await Ad.findOne({ _id: id });
  if (!ad) {
    res.json({ notallowed: 'Id inválido!!!' });
    return;
  }
  const others = await Ad.find({ user: ad.user }, null, {
    sort: { createdAt: -1 },
  });

  res.json({ ad, others });
};

const store = async (req, res) => {
  const { title, price, priceneg, desc, token } = req.body;
  let { cat } = req.body;
  const filename = req.files.map(name => name.filename);

  if (!token) {
    res.json({ notallowed: 'Token inválido!!!' });
    return;
  }

  cat = cat
    .replace(/,/g, '')
    .replace(/ /g, '-')
    .replace('á', 'a')
    .replace('ê', 'e')
    .replace('ç', 'c')
    .replace('í', 'i')
    .replace('&', 'e');

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
  show,
};
