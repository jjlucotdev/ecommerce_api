const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: [true, 'Street is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    province: {
        type: String,
        required: [true, 'Province is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required']
    },
    isDefault: {
    	type: Boolean,
        default: true
    },
    pinLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }
});

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, 'First Name is required']
    },
    lastName:{
        type: String,
        required: [true, 'Last Name is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required']
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is required']
    },
    addresses: [addressSchema] // Array of addresses
});

module.exports = mongoose.model("User", userSchema);