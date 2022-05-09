const mongoose = require('mongoose');

const URL = 'mongodb+srv://vacunasist:1234@cluster0.hl7ou.mongodb.net/vacunasist-database?retryWrites=true&w=majority'
mongoose.connect(URL)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;