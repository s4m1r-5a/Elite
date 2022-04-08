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
//const val = require('../navegacion.js');
const fetch = require('node-fetch');
const sms = require('./sms.js');
const { database } = require('./keys');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const config = require('./config.js');
const io = require('socket.io');
const events = require('events');
const cloudinary = require('./cloudinary');
const emitter = new events.EventEmitter();
const token = config.token,
  apiUrl = config.apiUrl;

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
});

cloudinary.init();

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  })
);
app.set('view engine', '.hbs');

// Multer Middlwares - Creates the folder if doesn't exists
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, cb) => {
    cb(null, ID(34) + (path.extname(file.originalname) || '.pdf'));
  }
});

app.use(
  multer({
    storage,
    dest: path.join(__dirname, 'public/uploads'),
    fileFilter: function (req, file, cb) {
      /*var filetypes =  /jpeg|jpg|png|gif|mkv|mp4|application\/pdf|x-matroska|video/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());*/
      //console.log(file, path.extname(file.originalname).toLowerCase())
      var filetypes = [
        'jpeg',
        'jpg',
        'png',
        'gif',
        'mkv',
        'mp4',
        'application/pdf',
        '',
        'x-matroska',
        'video'
      ];
      var mimetype = filetypes.indexOf(file.mimetype);
      var extname = filetypes.indexOf(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(
        'Error: File upload only supports the following filetypes - ' +
          filetypes +
          ' - ' +
          file.mimetype
      );
    }
    //limits: { fileSize: 2062191114 },
  }).any('image')
);

// Middlewares : significa cada ves que el usuario envia una peticion
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  })
);
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
//app.use(require('../navegacion'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
const server = app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

const socket = io(server);
require('./chats')(socket, emitter);

module.exports = (chat, msg) => {
  emitter.emit(chat, msg, 200);
};

function ID(lon) {
  let chars = 'a0b1c2d3-e4f5g6h7i8j9k0z-1l2m3n4o-5p6q7r8s9-t0u1v2w3x4y',
    code = '';
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}
