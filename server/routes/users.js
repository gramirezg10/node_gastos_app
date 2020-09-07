const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const UserModel = require('../models/users');
const { checkToken } = require('../middlewares/authentication');

const app = express();

const _api = '/user'

app.get(_api, checkToken, (req, res) => {
    // return res.json({
    //     ok: 'test',
    //     ussss: req.user
    // })

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    UserModel.find({ isActive: true }, 'name email role isActive google')
        .skip(desde)
        .limit(limite)
        .exec((err, userDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'ERROR in get user!!',
                    err
                });
            }
            UserModel.countDocuments({ isActive: true }, (err, count) => {
                return res.json({
                    ok: true,
                    msg: 'api get user!!',
                    userDB,
                    count
                });
            });

        })
});


app.post(_api, checkToken, (req, res) => {
    let body = req.body

    let user = new UserModel({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'ERROR in post user!!',
                err
            });
        }

        return res.json({
            ok: true,
            msg: 'api post spend!!',
            user: userDB
        });
    });
})

// app.post(_api, (req, res) => {

//     let data = req.body;

//     let usuario = new UserModel({
//         name: data.nombre,
//         email: data.email,
//         password: data.password,
//         role: data.role
//     });

//     usuario.save()
//         .then(usuarioDB => {
//             return res.json({
//                 ok: true,
//                 usuario: usuarioDB
//             });
//         })
//         .catch(err => {
//             return res.status(400).json({
//                 ok: true,
//                 err
//             });
//         });
// });


app.put(`${_api}/:id`, checkToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email']);

    UserModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                msg: 'error in api put user',
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: true,
                msg: 'user doesnt exist',
            });
        }
        return res.json({
            ok: true,
            msg: 'api put user, with param: ' + id,
            userDB
        })
    });

})


app.delete(`${_api}/:id`, checkToken, (req, res) => {
    let id = req.params.id;
    let changeStatus = { isActive: false };

    UserModel.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                msg: 'error in api delete user',
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: true,
                msg: 'user doesnt exist',
            });
        }
        return res.json({
            ok: true,
            msg: 'user deleted',
            userDB
        })
    });

})

module.exports = app;