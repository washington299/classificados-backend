const jwt = require('jsonwebtoken');

const generateToken = id => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY);

  return token;
};

const validateToken = (req, res, next) => {
  const { token } = req.query || req.body;
  if (!token) {
    res.json({ notallowed: 'token inválido!!!' });
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

module.exports = {
  generateToken,
  validateToken,
  decodeToken,
};
