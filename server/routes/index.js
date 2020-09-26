const express = require('express');

const app = express();

app.use(require('./spends'));
app.use(require('./users'));
app.use(require('./login'));
app.use(require('./google_auth'));
app.use(require('./smoketest'));
app.use(require('./customers'));

module.exports = app;