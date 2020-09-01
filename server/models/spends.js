const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let spendSchema = Schema({
    date: {
        type: String,
        default: Date.now()
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    homeDetail: [{
        HDId: Number,
        HDDesc: String,
        HDAmount: Number,
    }],
    spendDetail: [{
        SDId: Number,
        SDDesc: String,
        SDAmount: Number,
    }],
    username: {
        type: String,
        required: [true, 'Username is required']
    },
});

module.exports = mongoose.model('Spend', spendSchema);