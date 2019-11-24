const jwt = require('jsonwebtoken');

const TokenList = require('../models/TokenList');

const generateToken = id => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY);

  return token;
};

const validateToken = async (req, res, next) => {
  let token;

  if (req.query.token) {
    token = req.query.token;
  }
  if (req.body.token) {
    token = req.body.token;
  }

  const result = await TokenList.findOne({ token });
  if (!result) {
    res.json({ notallowed: 'Token inválido' });
    return;
  }

  const validToken = jwt.verify(token, process.env.SECRET_KEY, err =>
    !err ? true : false
  );
  if (!validToken) {
    res.json({ notallowed: 'token inválido!!!' });
    return;
  }

  next();
};

const decodeToken = token => {
  const info = jwt.decode(token);

  return info;
};

const isLogged = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    res.json({ notallowed: 'Token inválido' });
    return;
  }

  const result = await TokenList.findOne({ token });
  if (!result) {
    res.json({ notallowed: 'Token inválido' });
    return;
  }

  res.json({ allowed: 'Token válido' });
};

module.exports = {
  generateToken,
  validateToken,
  decodeToken,
  isLogged,
};
