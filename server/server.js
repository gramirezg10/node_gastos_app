require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json, con esto, aparecen las opciones para los request
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

//habilitar la ruta del front
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect('mongodb://localhost:27017/DB_PAGOS', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if (err) throw err;
    console.log('DB connected!!');
});



// ______________________________
// get ip add
// var os = require('os');
// var ifaces = os.networkInterfaces();
// Object.keys(ifaces).forEach(function(ifname) {
//     var alias = 0;
//     ifaces[ifname].forEach(function(iface) {
//         if ('IPv4' !== iface.family || iface.internal !== false) return; // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//         if (alias >= 1) console.log(ifname + ':' + alias, iface.address); // this single interface has multiple ipv4 addresses
//         else console.log(ifname, iface.address); // this interface has only one ipv4 adress
//         ++alias;
//     });
// });
// ______________________________




app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});