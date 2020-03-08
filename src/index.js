const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
//const {Builder, By, Key, until} = require('selenium-webdriver');
const val = require('../navegacion.js');
const sms = require('./sms.js');
const { database } = require('./keys');
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const transpoter = nodemailer.createTransport({
    host: 'smtp.hostinger.co',
    port: 587,
    secure: false,
    auth: {
        user: 'suport@tqtravel.co',
        pass: '123456789'
    },
    tls: {
        rejectUnauthorized: false
    }
})

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares : significa cada ves que el usuario envia una peticion
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'faztmysqlnodemysql',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.info = req.flash('info');
  app.locals.warning = req.flash('warning');
  app.locals.error = req.flash('error');
  app.locals.regis = req.regis;
  app.locals.user = req.user;
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use(require('../navegacion'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
  
});
