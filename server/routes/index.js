const express = require('express');

const app = express();

app.use(require('./spends'));
app.use(require('./users'));
app.use(require('./login'));

module.exports = app;