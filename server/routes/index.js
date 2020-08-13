const express = require('express');

const app = express();

app.use(require('./crud'));



module.exports = app;