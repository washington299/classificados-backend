const express = require('express');
const routers = require('./routes');
const path = require('path');
const cors = require('cors');

require('dotenv').config({ path: '.env' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/images', express.static(path.resolve(__dirname, '..', 'images')));
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

require('./config/database');

app.use(routers);

module.exports = app;
