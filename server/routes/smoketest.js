const express = require('express');

const app = express();

const _api = '/smoketest'

app.get(_api, (req, res) => {
    res.json({
        'ok': true,
        'msg': 'server running'
    });
});

module.exports = app;