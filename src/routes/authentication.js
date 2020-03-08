const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/tablero',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('error', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/tablero',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['profile', 'email']
  })
);
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/tablero',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router.get('/auth/google',
  passport.authenticate('google', {
    scope: [' profile ', 'email'],
    ancho: 240,
    altura: 50,
    theme: 'oscuro'
  }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/tablero',
    failureRedirect: '/signup',
    failureFlash: true
  })
);
router.get('/auth/soat/callback', (req, res) => {
  console.log(req.params)
  console.log('fghghshsdf')
  res.send('respuesta');
});
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});
router.get('/tablero', isLoggedIn, async (req, res) => {
  const links = await pool.query(`SELECT MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, SUM(p.precio) venta, SUM(p.utilidad) utilidad, 
  ((p.utilidad*r.comision/100)*100/p.utilidad) Porcentag, SUM((p.utilidad*r.comision/100)) Comision, ROUND(COUNT(*)/30) promediov
  FROM ventas v 
  INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id    
    WHERE v.vendedor = ?
      AND YEAR(v.fechadecompra) = YEAR(CURDATE()) 
      AND MONTH(v.fechadecompra) BETWEEN 1 and 12
  GROUP BY MONTH(v.fechadecompra)
  ORDER BY 1`, [req.user.id]);
  const link = await pool.query(`SELECT MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, SUM(p.precio) venta, SUM(p.utilidad) utilidad, 
  ((p.utilidad*r.comision/100)*100/p.utilidad) Porcentag, SUM((p.utilidad*r.comision/100)) Comision, ROUND(COUNT(*)/30) promediov
  FROM ventas v 
  INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id    
    WHERE v.vendedor = ?
      AND YEAR(v.fechadecompra) = YEAR(CURDATE()) 
      AND MONTH(v.fechadecompra) BETWEEN 1 and 12
  GROUP BY MONTH(v.fechadecompra)
  ORDER BY 1`, [req.user.id]);
  links.desendente = link;
  console.log(links);
  //console.log(ambos);
  res.render('tablero', { links });
  //res.render('tablero')
});
router.post('/tablero/:a', isLoggedIn, async (req, res) => {
  const { a } = req.params;

  if (a == 'table5') {

    const links = await pool.query(`SELECT YEAR(v.fechadecompra) Año, COUNT(*) CantMes, SUM(p.precio) venta, SUM(p.utilidad) utilidad, 
    ELT(MONTH(v.fechadecompra), "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre") Mes,
    ROUND(SUM(p.utilidad*r.comision/100)*100/SUM(p.utilidad), 1) Porcentag, SUM((p.utilidad*r.comision/100)) Comision, ROUND(COUNT(*)/30) promediov
    FROM ventas v 
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id    
    WHERE v.vendedor = ?
    AND MONTH(v.fechadecompra) BETWEEN 1 and 12
    GROUP BY YEAR(v.fechadecompra), MONTH(v.fechadecompra) ASC
    ORDER BY 1`, [req.user.id]);
    respuesta = { "data": links };
    res.send(respuesta);

  } else if (a == '1') {

    let reportes = new Array(4)
    let linea = '', lDesc = '';
    const lineaUno = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario = ?`, req.user.id);
    await lineaUno.map((primera) => { lDesc += ` OR pi.acreedor = ${primera.acreedor}`; linea += ` OR pines.usuario = ${primera.acreedor}` });
    const reporte = await pool.query(`SELECT YEAR(v.fechadecompra) Año, MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, 
    ROUND(SUM(p.utilidad*r.comision/100)*100/SUM(p.utilidad), 1) Porcentag, SUM((p.utilidad*r.comision/100)) Comision, SUM(p.precio) venta, 
    SUM(p.utilidad) utilidad FROM ventas v     
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id
    INNER JOIN pines pi ON u.pin = pi.id
    WHERE pi.acreedor = 1${lDesc}
    AND MONTH(v.fechadecompra) BETWEEN 1 and 12
    GROUP BY YEAR(v.fechadecompra), MONTH(v.fechadecompra) ASC
    ORDER BY 1`);
    res.send(reporte);

  } else if (a == '2') {

    let reportes = new Array(4)
    let linea = '', lDesc = '';
    const lineaUno = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario = ?`, req.user.id);
    await lineaUno.map((primera) => { linea += ` OR pines.usuario = ${primera.acreedor}` });

    const lineaDos = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario = 1${linea}`);
    await lineaDos.map((primera) => { lDesc += ` OR pi.acreedor = ${primera.acreedor}` });
    const reporte2 = await pool.query(`SELECT YEAR(v.fechadecompra) Año, MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, 
    ROUND(SUM(p.utilidad*r.comision/100)*100/SUM(p.utilidad), 1) Porcentag, SUM((p.utilidad*r.comision/100)) Comision, SUM(p.precio) venta, 
    SUM(p.utilidad) utilidad FROM ventas v
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id
    INNER JOIN pines pi ON u.pin = pi.id
    WHERE pi.acreedor = 1${lDesc}
    AND MONTH(v.fechadecompra) BETWEEN 1 and 12
    GROUP BY YEAR(v.fechadecompra), MONTH(v.fechadecompra) ASC
    ORDER BY 1`);
    res.send(reporte2);

  } else if (a == '3') {

    let reportes = new Array(4)
    let linea = '', lDesc = '';
    const lineaUno = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario = ?`, req.user.id);
    await lineaUno.map((primera) => { linea += ` OR pines.usuario = ${primera.acreedor}` });

    const lineaDos = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario = 1${linea}`);
    linea = '';
    await lineaDos.map((primera) => { linea += ` OR pines.usuario = ${primera.acreedor}` });
    const lineaTres = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario =  1${linea}`);
    await lineaTres.map((primera) => { lDesc += ` OR pi.acreedor = ${primera.acreedor}` });
    const reporte3 = await pool.query(`SELECT YEAR(v.fechadecompra) Año, MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, 
    ROUND(SUM(p.utilidad*r.comision/100)*100/SUM(p.utilidad), 1) Porcentag, SUM((p.utilidad*r.comision/100)) Comision, SUM(p.precio) venta, 
    SUM(p.utilidad) utilidad FROM ventas v 
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id
    INNER JOIN pines pi ON u.pin = pi.id
    WHERE pi.acreedor = 1${lDesc}
    AND MONTH(v.fechadecompra) BETWEEN 1 and 12
    GROUP BY YEAR(v.fechadecompra), MONTH(v.fechadecompra) ASC
    ORDER BY 1`);
    res.send(reporte3);
    //AND YEAR(v.fechadecompra) = YEAR(CURDATE())
  }
});

module.exports = router;
