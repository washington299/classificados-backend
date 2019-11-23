const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../middlewares/AuthMiddleware');

const register = async (req, res) => {
  const { name, state, email, password, confirmedPassword } = req.body;

  if (!name || !state || !email || !password || !confirmedPassword) {
    res.json({ error: 'Preencha todos os campos!!!' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    res.json({ error: 'E-mail já cadastrado!!' });
    return;
  }

  const user = await User.create({
    name,
    state,
    email,
    password: hash,
  });

  const token = jwt.generateToken(user._id);

  res.json({ token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.json({ error: 'E-mail e/ou senha errados!!!' });
    return;
  }

  const validateHash = await bcrypt.compare(password, user.password);
  if (!validateHash) {
    res.json({ error: 'E-mail e/ou senha errados!!!' });
    return;
  }

  const token = jwt.generateToken(user._id);

  res.json({ token });
};

const show = async (req, res) => {
  const { token } = req.query;

  const info = jwt.decodeToken(token);

  const user = await User.findOne({ _id: info.id }).select('-password');

  res.json(user);
};

module.exports = {
  register,
  login,
  show,
};
