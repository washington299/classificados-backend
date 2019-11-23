const Categories = require('../models/Categories');

const state = (_req, res) => {
  const states = [
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espírito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso',
    'Mato Grosso do Sul',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins',
  ];

  res.json({ states });
};

const categoriesGet = async (_req, res) => {
  const categories = await Categories.find();

  res.json({ categories });
};

const categoriesPost = async (req, res) => {
  const { filename } = req.file;
  const { name } = req.body;

  const category = await Categories.create({
    name,
    thumbnail: filename,
  });

  res.json(category);
};

module.exports = {
  state,
  categoriesGet,
  categoriesPost,
};
