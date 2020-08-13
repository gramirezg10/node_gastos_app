const express = require('express');

const app = express();


app.get('/all', (req, res) => {
    return res.json({
        ok:true,
        msg: 'api get!!'
    })
})
app.post('/all', (req, res) => {
    let body = req.body
    return res.json({
        ok:true,
        msg: 'api post!!',
        person: body
    })
})
app.put('/all/:id', (req, res) => {
    let id = req.params.id;
    return res.json({
        ok:true,
        msg: 'api put, with param: ' + id
    })
})
app.delete('/all/:id', (req, res) => {
    let id = req.params.id;
    return res.json({
        ok:true,
        msg: 'api delete, with param: ' + id
    })
})

module.exports = app;