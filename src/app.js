const express = require('express');
const routers = require('./routes');
const path = require('path');

require('dotenv').config({ path: 'variables.env' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.resolve(__dirname, '..', 'images')));
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

require('./config/database');

app.use(routers);

module.exports = app;
