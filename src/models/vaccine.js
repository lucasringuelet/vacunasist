const mongoose = require('mongoose');
const { Schema, Types } = mongoose; //solo de la parte mongoose quiero el objeto scheema

const vaccine = new Schema ({
    type: {
        type: String
    },
    date: {
        type: Date
    }
})
module.exports = mongoose.model('vaccine',vaccine);