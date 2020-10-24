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
    sd_homeDetail: {
        type: String,
    },
    // sd_homeDetail: [{
    //     HDDesc: String,
    //     HDAmount: Number,
    // }],
    balanceSpendDetail: {
        type: Number,
        default: 0
    },
    sd_spendDetail: {
        type: String,
    },
    // sd_spendDetail: [{
    //     SDDesc: String,
    //     SDAmount: Number,
    // }],
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
});




module.exports = mongoose.model('Spend', spendSchema);