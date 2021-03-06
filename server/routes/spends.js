const express = require('express');
const Spend = require('../models/spends');
const checkGoogleToken = require("../helpers/googleVerifyToken");
const moment = require('moment');
const { map } = require('underscore');

const app = express();

const _api = '/spend'

// app.post(`${_api}getlast`, async(req, res) => {
//     req.email = "gramirez@gmail.com"; //Para pruebas
//     req.username = "German Ramirez Gaviria"; //Para pruebas
app.post(`${_api}getlast`, checkGoogleToken, async(req, res) => {
    if (req.email) {
        try {
            Spend.find({ email: req.email }).exec((err, spendsDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                spendRes = spendsDB[spendsDB.length - 1];
                balanceResult = _balance(spendRes['amount'], spendRes.sd_spendDetail, spendRes.sd_homeDetail);
                spendRes.balance = balanceResult.balance;
                spendRes.balanceSpendDetail = balanceResult.balanceSD;
                spendRes.balanceHomeDetail = balanceResult.balanceHD;
                res.status(200).json({
                    ok: true,
                    msg: 'api get spend!!',
                    spendRes
                });
            })
        } catch {
            return res.status(204).json({
                ok: true,
                msg: 'no hay gastos registrados',
            });
        }
    } else return res.json({
        ok: true,
        msg: 'no hay email en la petición',
    });
});


// app.post(`${_api}getall`, async(req, res) => {
//     req.email = "gramirez@gmail.com"; //Para pruebas
//     req.username = "German Ramirez Gaviria"; //Para pruebas
app.post(`${_api}getall`, checkGoogleToken, async(req, res) => {
    Spend.find({ email: req.email }).exec((err, spendsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        for (let i = 0; i < spendsDB.length; i++) {
            let balance;
            balance = _balance(spendsDB[i].amount, spendsDB[i].sd_spendDetail, spendsDB[i].sd_homeDetail)
            spendsDB[i].balance = balance.balance;
            spendsDB[i].balanceSpendDetail = balance.balanceSD;
            spendsDB[i].balanceHomeDetail = balance.balanceHD;

        }
        res.status(200).json({
            ok: true,
            msg: 'api get spend!!',
            spendRes: spendsDB.reverse()
        });
    })
});


// app.post(_api, async(req, res) => { //Para pruebas
//     req.email = "gramirez@gmail.com"; //Para pruebas
//     req.username = "German Ramirez Gaviria"; //Para pruebas
// let query = req.body //para la app poner 'query', body es para probar con postman
app.post(_api, checkGoogleToken, async(req, res) => {
    let query = req.query
    console.log(query)

    // _details = _Map_sd_hd(body.sd_spendDetail, body.sd_homeDetail);
    let _date = query.date
    if (_date) {
        if (!moment(_date, 'DD/MM/YYYY', true).isValid())
            return res.status(400).json({
                ok: false,
                err: 'Fecha con formato inválido, debe ser DD/MM/YYYY'
            });
        else _date = _getDate()
    }
    let spend = Spend();
    spend.date = _date;
    spend.description = query.description;
    spend.amount = query.amount;
    spend.username = req.username;
    spend.email = req.email;
    if (query.sd_homeDetail) spend.sd_homeDetail = query.sd_homeDetail

    if (query.sd_spendDetail) spend.sd_spendDetail = query.sd_spendDetail

    console.log(spend);
    spend.save((err, spendDB) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                ok: false,
                msg: 'ERROR in api post spend!!'
            });
        }
        return res.json({
            ok: true,
            msg: 'spend created'
        });
    });
});


app.put(`${_api}/:id`, async(req, res) => {

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

        console.log(':::::::::::::::::::::::::::::::::::::::::::::');
        console.log(spendDB);
        console.log(':::::::::::::::::::::::::::::::::::::::::::::');

        // spendDB.description = body.description ? body.description : spendDB.description,
        //     spendDB.amount = body.amount ? body.amount : spendDB.amount,
        //     spendDB.homeDetail = body.homeDetail,
        spendDB.spendDetail = []; //body.spendDetail,
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

function _balance(amount, stringSD, stringHD) {
    let _total_balance = amount;
    let _total_sd_homeDetail = 0;
    let _total_sd_spendDetail = 0;
    let listSD = stringSD.split('//');
    let listHD = stringHD.split('//');
    // // SpendDetail
    if (listSD.length > 0) listSD.forEach(item => {
            item_detail_amount = item.split('||')[1];
            _total_sd_spendDetail = _total_sd_spendDetail + Number(item_detail_amount);
        })
        // HomeDetail
    if (listHD.length > 0) listHD.forEach(item => {
        item_detail_amount = item.split('||')[1];
        _total_sd_homeDetail = _total_sd_homeDetail + Number(item_detail_amount);
    });

    _total_balance = _total_balance - _total_sd_spendDetail - _total_sd_homeDetail
    return { 'balance': _total_balance, 'balanceSD': _total_sd_spendDetail, 'balanceHD': _total_sd_homeDetail };
}

// function _Map_sd_hd(strSD, strHD) {
//     let _finalListSD = [];
//     let _finalListHD = [];
//     if (strSD) {
//         let _listSD = strSD.replace('["', '').replace('","', ',').replace('"]', '').split(',');
//         _listSD.forEach((item) => {
//             let item2 = item.split('/')
//             if (item2.length = 2) _finalListSD.push({ 'SDDesc': item2[0], 'SDAmount': parseFloat(item2[1]) });
//         })
//     }
//     if (strHD) {
//         let _listHD = strHD.replace('["', '').replace('","', ',').replace('"]', '').split(',');
//         _listHD.forEach((item) => {
//             let item2 = item.split('/')
//             if (item2.length = 2) _finalListHD.push({ 'HDDesc': item2[0], 'HDAmount': parseFloat(item2[1]) });
//         })
//     }
//     // if (!_finalListHD[0]['HDDesc'] || _finalListHD[0]['HDDesc'].trim() == '' || _finalListHD[0]['HDDesc'].trim() == []) {
//     //     console.log('no tiene nada');
//     // }
//     return { 'SD': _finalListSD, 'HD': _finalListHD }
// }

module.exports = app;