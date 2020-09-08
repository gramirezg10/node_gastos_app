const express = require('express');
const Spend = require('../models/spends');
const checkGoogleToken = require("../helpers/googleVerifyToken");
const moment = require('moment');

const app = express();

const _api = '/spend'

app.post(`${_api}getlast`, checkGoogleToken, async(req, res) => {

    Spend.find().exec((err, spendsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        spendRes = spendsDB[spendsDB.length - 1]
        res.status(200).json({
            ok: true,
            msg: 'api get spend!!',
            spendRes
        });
    })
});


app.post(`${_api}getall`, checkGoogleToken, async(req, res) => {

    Spend.find().exec((err, spendsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'api get spend!!',
            spendsDB
        });
    })
});


app.post(_api, checkGoogleToken, async(req, res) => {

    let body = req.body;
    let _date = body.date
    if (_date)
        if (!moment(_date, 'DD/MM/YYYY', true).isValid())
            return res.status(400).json({
                ok: false,
                err: 'Fecha con formato inválido, debe ser DD/MM/YYYY'
            });
        else _date = _getDate()

        // let spend = new Spend(req.body);
    let spend = new Spend({
        date: _date,
        description: body.description,
        amount: body.amount,
        sd_homeDetail: body.sd_homeDetail,
        sd_spendDetail: body.sd_spendDetail,
        user: req.user
    });

    spend.save((err, spendDB) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                ok: false,
                msg: 'ERROR in api post spend!!',
                spend: spendDB
            });
        }
        return res.json({
            ok: true,
            msg: 'spend created',
            spend: spend
        });
    });
});


app.put(`${_api}/:id`, checkGoogleToken, async(req, res) => {

    let id = req.params.id;
    let body = req.body;

    Spend.findById(id, (err, spendDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!spendDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El ID ${id} no existe`
                }
            });
        }

        spendDB.description = body.description,
            spendDB.amount = body.amount,
            spendDB.homeDetail = body.homeDetail,
            spendDB.spendDetail = body.spendDetail,

            spendDB.save((err, spendSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.status(200).json({
                    ok: true,
                    spendSaved
                });
            });
    });
});


app.delete(`${_api}/:id`, checkGoogleToken, async(req, res) => {

    let id = req.params.id;

    Spend.findByIdAndDelete(id, (err, spendDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!spendDB) {
            return res.status(400).json({
                ok: false,
                err: { message: `ID ${id} no existe` }
            });
        }
        return res.status(200).json({
            ok: true,
            msg: `spend with id '${id}' has been deleted`
        });
    })

});

function _getDate() {
    let date = new Date()

    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    let month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    let year = date.getFullYear()

    return `${day}/${month}/${year}`;
}

module.exports = app;