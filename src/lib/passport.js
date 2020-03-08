const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');
const { registro, Google, Facebook } = require('../keys');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query(`SELECT * FROM users u WHERE u.username = ?`, [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.fullname));
    } else {
      done(null, false, req.flash('error', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('error', 'The Username does not exists.'));
  }
}));

passport.use(new FacebookStrategy({
  clientID: Facebook.client_id,
  clientSecret: Facebook.client_secret,
  callbackURL: Facebook.redirect_uris[1]
}, async (accessToken, refreshToken, profile, email, done) => {
  console.log(profile)
  const { id, displayName, username, _json } = email;
  let password = '12345678',
    //username = email.username,
    fullname = displayName;

  const usuario = await pool.query('SELECT * FROM users WHERE id = ?', id);
  if (usuario.length > 0) {
    const user = usuario[0];
    console.log(usuario[0]);
    return done(null, user, ('success', 'Bienvenido'));
  } else if (registro.pin != "hola") {
    let newUser = {
      id,
      fullname,
      pin: registro.pin,
      username,
      password,
      imagen: _json.picture
    };
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    console.log(result);
    //newUser.id = result.insertId;
    return done(null, newUser, ('success', 'Bienvenido'));
  } else {
    return done(null, false, ('error', 'Debes Proporcionar el Pin de registro.'));
  }
}
));

passport.use(new GoogleStrategy({
  clientID: Google.client_id,
  clientSecret: Google.client_secret,
  callbackURL: Google.redirect_uris[0]
}, async (accessToken, refreshToken, profile, email, done) => {

  const { id, displayName, _json } = email;
  let password = '12345678',
    username = email.emails[0].value,
    fullname = displayName;

  const usuario = await pool.query('SELECT * FROM users WHERE id = ?', id);

  if (usuario.length > 0) {

    const user = usuario[0];
    if (_json.picture !== usuario[0].imagen) {
      await pool.query('UPDATE users SET ? WHERE id = ?', [{ imagen: _json.picture }, id]);
    }
    return done(null, user, ('success', `Bienvenido ${fullname}`));

  } else if (registro.pin != "hola") {

    let newUser = {
      id,
      fullname,
      pin: registro.pin,
      username,
      password,
      imagen: _json.picture
    };
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    //newUser.id = result.insertId;
    return done(null, newUser, ('success', `Bienvenido ${fullname}`));
  } else {
    return done(null, false, ('error', 'Debes Proporcionar el Pin de registro.'));
  }
}
));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const { document, fullname, pin, movil } = req.body;
  let newUser = {
    id: regiId(),
    document,
    fullname,
    pin,
    movil,
    username,
    password,
    imagen: '/img/avatars/avatar.jpg'
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  //console.log(newUser);
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  //console.log(result);
  //newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', id);
  done(null, rows[0]);
});

function regiId(chars = "01234567890", lon = 20) {
  let code = "";
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  };
  return code;
};
