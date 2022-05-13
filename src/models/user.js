const mongoose = require('mongoose');
const { Schema, Types } = mongoose; //solo de la parte mongoose quiero el objeto scheema y Types

const user = new Schema({
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    dni: {
        type: Number,
    },
    dateBirth: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    risk: {
        type: Boolean,
    },
    doubleFactor: {
        type: String,
    },
    vaccination: {
        type: String
    },
    vaccinations: [{
        type: Types.ObjectId,
        ref: 'vaccine'
    }]


})

module.exports = mongoose.model('user', user);