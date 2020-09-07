const express = require('express');
const Spend = require('../models/spends');
const checkGoogleToken = require("../helpers/googleVerifyToken");

const app = express();

const _api = '/spend'

app.post('/getspend', checkGoogleToken, async(req, res) => {
    // :::::::::::::::::::::: Validación del token
    // let idToken = req.body.idToken;
    // const googleUser = await checkGoogleToken(idToken);
    // if (!googleUser)
    //     return res.status(400).json({
    //         ok: false,
    //         err: 'token inválido'
    //     });
    // ::::::::::::::::::::::
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
    // let spend = new Spend(req.body);
    let spend = new Spend({
        description: body.description,
        amount: body.amount,
        homeDetail: body.homeDetail,
        spendDetail: body.spendDetail,
        user: body.username
    });

    console.log(spend);

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

module.exports = app;