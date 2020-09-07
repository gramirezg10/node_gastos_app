const express = require('express');
const jwt = require('jsonwebtoken');
const checkGoogleToken = require('../helpers/googleVerifyToken');
const UserModel = require('../models/users');

const app = express();

const _api = '/logingoogle'

app.post(_api, checkGoogleToken, async(req, res) => {
    let token = req.body.idToken;
    const user = req.user;
    if (!user)
        return res.status(400).json({
            ok: false,
            msg: 'Token inválido.'
        });

    UserModel.findOne({ email: user.email }, (err, usuarioDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (usuarioDB) {
            // let token = jwt.sign({
            //     usuario: usuarioDB
            // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token,
            });
        } else {

            // Si el usuario no existe en nuestra base de datos
            let usuario = new UserModel();
            usuario.name = user.name;
            usuario.email = user.email;
            usuario.google = true;

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                // let token = jwt.sign({
                //     usuario: usuarioDB
                // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            });
        }
    });

    // // TODO: Guardar en su base de datos


    // res.json({
    //     ok: true,
    //     user: req.user
    // })
});

module.exports = app;