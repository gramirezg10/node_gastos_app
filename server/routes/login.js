const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTID);

const UserModel = require('../models/users');

const app = express();

const _api = '/login';

app.post(_api, (req, res) => {
    let body = req.body;

    UserModel.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'ERROR in post login!!',
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: '(Email) or password incorrect!!'
            });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                msg: 'Email or (password) incorrect!!'
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD })
        res.json({
            ok: true,
            userDB,
            token
        });
    });

});


// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    UserModel.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (usuarioDB) {
            console.log(usuarioDB)
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        } else {
            // Si el usuario no existe en nuestra base de datos
            let usuario = new UserModel();
            usuario.name = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            });
        }
    });
});


module.exports = app;