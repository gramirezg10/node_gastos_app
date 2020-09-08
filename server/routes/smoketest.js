const express = require('express');

const app = express();

const _api = '/smoketest'

app.get(_api, (req, res) => {
    res.json({
        'ok': true,
        'msg': 'server running'
    });
});


// app.get('/test', (req, res) => {
//     // res.json({
//     //     'ok': true,
//     //     'msg': 'server running',
//     //     result
//     // });
// });

module.exports = app;