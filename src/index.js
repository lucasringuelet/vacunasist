const express = require('express'); // le pido a node el modulo express y lo guardo en la variable, lo unico que trae es una funcion, que en este caso la llamo abajo.
const morgan = require('morgan');
const path = require('path');
const cookieParser = require("cookie-parser");
const { mongoose } = require("./database");
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

var hbs = exphbs.create({});

hbs.handlebars.registerHelper("json", function(string) {
    return JSON.parse(string);
});

//Midlewares
app.use(morgan('dev')); //muestra info en consola
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(mongoose);

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    if (req.session && req.session.userId)
        return next();
    else
        return res.sendStatus(401);
};



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
app.get("/loginVacunador", (req, res) => {
    res.render('loginVacunador')
})
app.get("/user", auth, (req, res) => {

    var userId = req.session.userId;
    res.render('user', { userId });
})
app.get("/loginAdmin", (req, res) => {
    res.render('loginAdmin')
})

app.use('/users/patient', require('../src/routes/users.routes'));
app.use('/users/vacunador',require('../src/routes/vacunador.routes'));
app.use('/users/admin',require('../src/routes/admin.routes'));
app.get('/userTurn', auth, (req, res) => {
    res.render('userTurn');
})



app.get("/logout", auth, (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Starting the server

app.listen(app.get('port'), () => {
    console.log(`Server Listening on port ${app.get('port')}`);
})