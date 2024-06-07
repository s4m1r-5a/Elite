const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../database');
const helpers = require('./helpers');
const psl = require('psl');
const { registro, Google, Facebook } = require('../keys');

const parseDomain = (data = []) => {
  try {
    return data[1];
  } catch (e) {
    return null;
  }
};

const isParseError = value => {
  return typeof value.error === 'string';
};

const analizarDominio = async origin => {
  try {
    // eslint-disable-next-line no-useless-escape
    const re = /^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/gi;
    const result = re.exec(origin);
    const rawDomain = parseDomain(result);
    const parsedDomain = psl.parse(rawDomain);

    if (isParseError(parsedDomain)) {
      throw new Error('Error al analizar el dominio');
    }

    const { sld: domain, subdomain } = parsedDomain;

    return { domain: domain || rawDomain, subdomain };
  } catch (error) {
    console.log(error);
  }
};

passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      const { domain, subdomain } = await analizarDominio(req.get('origin'));

      const rows = await pool.query(
        `SELECT p.id, u.password, u.fullname 
        FROM pines p 
        INNER JOIN users u ON p.acreedor = u.id 
        INNER JOIN empresas e ON p.empresa = e.id 
        WHERE u.username = ? AND (e.subdominio = ? OR e.dominio = ?)`,
        [username, subdomain, domain]
      );

      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
          done(null, user, req.flash('success', 'Bienvenido ' + user.fullname));
        } else {
          done(null, false, req.flash('error', 'Password incorrecto'));
        }
      } else {
        return done(null, false, req.flash('error', 'Este usuario no existe.'));
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: Facebook.client_id,
      clientSecret: Facebook.client_secret,
      callbackURL: Facebook.redirect_uris[1]
    },
    async (accessToken, refreshToken, profile, email, done) => {
      console.log(profile);
      const { id, displayName, username, _json } = email;
      let password = '12345678',
        //username = email.username,
        fullname = displayName;

      const usuario = await pool.query('SELECT * FROM users WHERE id = ?', id);
      if (usuario.length > 0) {
        const user = usuario[0];
        console.log(usuario[0]);
        return done(null, user, ('success', 'Bienvenido'));
      } else if (registro.pin != 'hola') {
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
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: Google.client_id,
      clientSecret: Google.client_secret,
      callbackURL: Google.redirect_uris[0]
    },
    async (accessToken, refreshToken, profile, email, done) => {
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
      } else if (registro.pin != 'hola') {
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
  )
);

passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      const { document, fullname, pin, movil } = req.body;
      let newUser = {
        id: regiId(),
        fullname: fullname.toUpperCase(),
        document,
        pin,
        cel: movil,
        username: username.toLowerCase(),
        password,
        imagen: '/img/avatars/avatar.svg',
        rutas:
          '[{"new":false,"link":"/tablero","name":"Tablero","icono":"sliders","activo":true},{"new":false,"link":"/links/productos","name":"Productos","todo":true,"icono":"bell","activo":true,"anular":true,"aprobar":true,"asociar":true,"ctaCobro":true,"declinar":true,"eliminar":true,"productos":[],"actualizar":true,"desasociar":true},{"new":false,"link":"/links/reportes","name":"Reportes","todo":true,"excel":false,"icono":"layers","activo":true,"anular":false,"editar":true,"estados":false,"acuerdos":false,"eliminar":true,"productos":[],"comisiones":false,"proyeccion":false,"estadodecuentas":false},{"new":false,"link":"/links/comisiones","name":"Comisiones","todo":true,"icono":"pocket","pagar":false,"activo":false,"anular":false,"asociar":false,"ctaCobro":false,"declinar":false,"eliminar":false,"productos":[],"actualizar":false,"desasociar":false},{"name":"Solicitudes","new":true,"link":"/links/solicitudes","activo":true,"todo":false,"aprobar":false,"eliminar":false,"extracto":true,"enviar":false,"actualizar":false,"anular":false,"declinar":false,"asociar":false,"desasociar":false,"desanular":false,"ctaCobro":false,"productos":[],"icono":"bell"},{"new":false,"link":"/links/pagos","name":"Pagos","icono":"dollar-sign","activo":true},{"new":false,"link":"/links/cupones","name":"Cupones","icono":"tag","activo":false},{"new":false,"link":"/links/clientes","name":"Clientes","todo":true,"icono":"users","activo":true,"anular":false,"aprobar":false,"asociar":false,"ctaCobro":false,"declinar":false,"eliminar":false,"productos":[],"actualizar":false,"desasociar":false},{"new":false,"link":"/links/asesores","name":"Asesores","todo":true,"icono":"users","activo":false,"anular":false,"aprobar":false,"asociar":false,"ctaCobro":false,"declinar":false,"eliminar":false,"productos":[],"actualizar":false,"desasociar":false},{"new":false,"link":"/links/red","name":"Red","icono":"users","activo":false},{"new":false,"link":"/links/cartera","name":"Cartera","icono":"file-text","activo":false}]'
      };
      newUser.password = await helpers.encryptPassword(password);
      // Saving in the Database
      const result = await pool.query('INSERT INTO users SET ?', newUser);
      newUser.id = pin;
      return done(null, newUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query(
    `SELECT u.*, r.rango, p.admin, p.subadmin, p.contador, p.financiero, p.auxicontbl, p.asistente, p.paths, p.empresa, 
    p.externo, e.nombre, e.tipodoc,	e.numdoc,	e.telefono,	e.email, e.direccion,	e.logo,	e.subdominio,	e.dominio
    FROM users u 
    INNER JOIN rangos r ON u.nrango = r.id 
    INNER JOIN pines p ON p.id = u.pin 
    INNER JOIN empresas e ON p.empresa = e.id 
    WHERE p.id = ?`,
    id
  );

  rows[0].rutas = JSON.parse(rows[0]?.paths);
  done(null, rows[0]);
});

function regiId(chars = '01234567890', lon = 20) {
  let code = '';
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}
