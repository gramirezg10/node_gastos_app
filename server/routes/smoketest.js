const express = require('express');

const app = express();

const _api = '/smoketest'

app.get(_api, (req, res) => {
    res.json({
        'ok': true,
        'msg': 'server running'
    });
});


app.post('/test', (req, res) => {
    let body = req.body;
    let query = req.query
    console.log('Query_____')
    console.log(query);
    console.log('sd_spendDetail_____')
    console.log(query.sd_spendDetail);
    console.log('sd_homeDetail_____')
    console.log(query.sd_homeDetail);
    res.json({
        'ok': true,
        'msg': 'server running'
    });
});

module.exports = app;