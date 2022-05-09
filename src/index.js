const express = require('express'); // le pido a node el modulo express y lo guardo en la variable, lo unico que trae es una funcion, que en este caso la llamo abajo.
const morgan = require('morgan');
const path = require('path');
const { mongoose } = require('./database');
const app = express(); // porque no necesito hacer express.express() para crear el objeto app ?

//Settings
app.set('port', process.env.PORT || 3000);

//Midlewares
app.use(morgan('dev'));
app.use(express.json());
//app.use(mongoose);
//Routes

app.use('/users/paciente', require('../src/routes/users.routes'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Starting the server

app.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${app.get('port')}`);
})