const express = require('express');
const app = express();

const routes = require('./dam')

app.use('/dam', routes)

module.exports = app