const jwt = require('../middlewares/AuthMiddleware');
const Ad = require('../models/Ad');

const store = async (req, res) => {
  const { title, price, priceneg, desc, cat, token } = req.body;
  const filename = req.files.map(name => name.filename);

  if (!token) {
    res.json({ notallowed: 'Token inválido!!!' });
    return;
  }

  const user = jwt.decodeToken(token);

  const ad = await Ad.create({
    photos: filename,
    title,
    price,
    priceNeg: priceneg ? true : false,
    description: desc,
    category: cat,
    user: user.id,
  });

  res.json(ad);
};

module.exports = {
  store,
};
