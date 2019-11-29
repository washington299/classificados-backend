const jwt = require('../middlewares/AuthMiddleware');
const Ad = require('../models/Ad');
const User = require('../models/User');

const index = async (req, res) => {
  const { q, cat, state } = req.query;
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
      state: { $regex: state, $options: 'i' },
    },
    null,
    {
      skip: offset,
      limit,
      sort: { createdAt: -1 },
    }
  );

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

  const { views, userInfo } = ad;
  await Ad.findOneAndUpdate({ _id: ad._id }, { views: views + 1 });
  const others = await Ad.find({ userInfo }, null, {
    sort: { createdAt: -1 },
  });

  res.json({ ad, others });
};

const store = async (req, res) => {
  const { title, priceneg, desc, token } = req.body;
  let { cat, price } = req.body;
  const filename = req.files.map(name => name.filename);

  if (!token) {
    res.json({ notallowed: 'Token inválido!!!' });
    return;
  }

  cat = cat
    .replace(/,/g, '')
    .replace(/ /g, '-')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace('ç', 'c')
    .replace('&', 'e');

  // formating the price, it´s coming as string and i changed to float.
  if (!price) {
    price = null;
  } else {
    price = price.replace(/[^\d]+/g, '');
    price = parseFloat(price);
  }

  const info = jwt.decodeToken(token);
  const user = await User.findOne({ _id: info.id }).select('-password');

  const ad = await Ad.create({
    photos: filename,
    title,
    price,
    priceNeg: priceneg,
    description: desc,
    category: cat,
    state: user.state,
    views: 0,
    userInfo: user,
  });

  res.json(ad);
};

module.exports = {
  index,
  store,
  show,
};
