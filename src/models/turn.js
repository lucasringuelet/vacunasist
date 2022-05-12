const mongoose = require('mongoose');
const { Schema, Types } = mongoose; //solo de la parte mongoose quiero el objeto scheema

const turn = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'user'
    },

    vaccine: {
        type: String,
    },


    date: {
        type: Date
    },

    state: {
        type: Boolean
    }

})
module.exports = mongoose.model('turn', turn);