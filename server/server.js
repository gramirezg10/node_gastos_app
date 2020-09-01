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

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});