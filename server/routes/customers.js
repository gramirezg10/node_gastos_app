const express = require('express');
const Customer = require('../models/testmodel');

const app = express();

const _api = '/testcus';

app.get(_api, async(req, res) => {
    Customer.find().exec((err, customersDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'api get customer!!',
            customersDB
        });
    })
});


app.post(_api, async(req, res) => {
    let body = req.body
    console.log(body)

    let customer = Customer(body);
    customer.save((err, cusDB) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                ok: false,
                msg: 'ERROR in api post customer!!',
                descError: err.message
            });
        }
        return res.json({
            ok: true,
            msg: 'customer created',
            cusDB
        });
    });
});

module.exports = app;