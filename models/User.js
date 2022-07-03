var mongoose = require('mongoose');

const validator = require('validator');

/**********RegistrationSchema**********/
var RegistrationSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} Entered Invalid Email'
        }
    },
    mobileNo: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient'],
        required: true
    },
    email_verify_status: {
        type: String,
        default: 'Pending'
    },
    address: {
        type: String,
        default: null
    },
    dob: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: null
    },
    bloodType: {
        type: String,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    adminVerification: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'blocked', 'deleted'],
        default: 'pending'
    }
}, { timestamps: true });

var User = mongoose.model('User', RegistrationSchema);

module.exports = {
    User
};