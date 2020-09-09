const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let spendSchema = Schema({
    date: {
        type: String,
        required: [true, 'Date is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    balance: {
        type: Number,
        default: 0
    },
    balanceHomeDetail: {
        type: Number,
        default: 0
    },
    sd_homeDetail: [{
        HDDesc: String,
        HDAmount: Number,
    }],
    balanceSpendDetail: {
        type: Number,
        default: 0
    },
    sd_spendDetail: [{
        SDDesc: String,
        SDAmount: Number,
    }],
    user: [{
        name: String,
        email: String
    }],
});




module.exports = mongoose.model('Spend', spendSchema);