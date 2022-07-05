const mongoose = require('mongoose');
const { Schema, Types } = mongoose; //solo de la parte mongoose quiero el objeto scheema

const vaccination = new Schema({
    name: {
        type: String
    },

    adress: {
        type: String,
    },



})
module.exports = mongoose.model('vaccination', vaccination);