const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} isnt a valid role'
};

let userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    isActive: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//delete response data
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('UserModel', userSchema);