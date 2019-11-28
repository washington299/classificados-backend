const User = require('../models/User');
const TokenList = require('../models/TokenList');

const bcrypt = require('bcrypt');
const jwt = require('../middlewares/AuthMiddleware');

const register = async (req, res) => {
  const { name, state, email, password } = req.body;

  if (!name || !state || !email || !password) {
    res.json({ error: 'Preencha todos os campos!!!' });
    return;
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    res.json({ error: 'E-mail já cadastrado!!' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    state,
    email,
    password: hash,
  });

  const token = jwt.generateToken(user._id);
  await TokenList.create({ token });

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
  await TokenList.create({ token });

  res.json({ token });
};

const show = async (req, res) => {
  const { token } = req.query;

  const info = jwt.decodeToken(token);
  const user = await User.findOne({ _id: info.id }).select('-password');

  res.json(user);
};

const update = async (req, res) => {
  const { name, email, state } = req.body;

  if (!name) {
    res.json({ error: 'Campo do nome obrigatório!!!' });
    return;
  }

  const user = await User.findOneAndUpdate(
    { email },
    {
      name,
      state,
    }
  );
  if (!user) {
    res.json({ error: 'Usuário inválido!!!' });
    return;
  }

  res.json({ message: 'Alterações feitas com sucesso' });
};

const logout = async (req, res) => {
  const { token } = req.query;

  const result = await TokenList.findOneAndDelete({ token });
  if (!result) {
    res.json({ error: 'Token inválido!!!' });
    return;
  }

  res.json({ message: 'Log out successful' });
};

module.exports = {
  register,
  login,
  show,
  update,
  logout,
};
