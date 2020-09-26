const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let customers = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
});

customers.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('customersModel', customers);