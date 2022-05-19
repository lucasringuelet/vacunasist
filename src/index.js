const express = require('express'); // le pido a node el modulo express y lo guardo en la variable, lo unico que trae es una funcion, que en este caso la llamo abajo.
const morgan = require('morgan');
const path = require('path');
const { mongoose } = require('./database');
const exphbs = require('express-handlebars');
const app = express(); // porque no necesito hacer express.express() para crear el objeto app ?
const session = require('express-session');

//Settings
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.set('port', process.env.PORT || 3000);
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs');

//Midlewares
app.use(morgan('dev')); //muestra info en consola
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(mongoose);

//Routes
app.get("/", (req, res) => {
    res.render('home');
})
app.get("/register", (req, res) => {
    res.render('register')
})
app.get("/login", (req, res) => {
    res.render('login')
})
app.get("/user", (req, res) => {
    var userId = req.session.userId;
    console.log(userId);
    res.render('user', { userId });
})
app.use('/users/patient', require('../src/routes/users.routes'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Starting the server

app.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${app.get('port')}`);
})