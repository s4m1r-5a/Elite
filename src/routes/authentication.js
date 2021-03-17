const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', (req, res) => {
  const { id } = req.query;
  res.render('auth/signup', { id: id });
});
router.post('/signup', async (req, res, next) => {
  const { document, username, pin } = req.body;
  const rows = await pool.query(`SELECT * FROM users WHERE document = ? OR username = ?`, [document, username]);
  if (rows.length > 0) {
    req.flash('error', 'Usted ya se encuentra registrado en nuestro sitio, inicie sesion con su usuario ' + rows[0].username);
    res.redirect('/signin');
  } else {
    const row = await pool.query(`SELECT * FROM pines WHERE id = ? AND acreedor IS NULL`, pin);
    if (row.length > 0) {
      passport.authenticate('local.signup', {
        successRedirect: '/tablero',
        failureRedirect: '/signup',
        failureFlash: true
      })(req, res, next);
    } else {
      req.flash('error', 'Este pin ya fue usado por alguien mas, comuniquese con su patrocinador');
      res.redirect('/signup');
    }
  }
})
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

  /*const links = await pool.query(`SELECT MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, SUM(p.precio) venta, SUM(p.utilidad) utilidad, 
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
  res.render('tablero', { links });*/
  res.render('tablero')
});
router.post('/tablero/:a', isLoggedIn, async (req, res) => {
  const { a } = req.params;
  let linea = '', lDesc = '';
  var d = req.user.id === '15' ? '' : 'AND p.asesor =  ' + req.user.id; console.log(req.user.id)
  //var d = 'AND p.asesor =  ' + req.user.id;
  let indircet1;
  let indircet2;
  let indircet3;
  const dircet = await pool.query(`SELECT MONTH(p.fecha) mes, SUM(l.valor) total, 
  COUNT(*) ventas, SUM(if(MONTH(p.fecha) = MONTH(CURDATE()), l.valor, 0)) mesactual,
  (
    SELECT SUM(if(s.concepto IN('COMISION DIRECTA','BONO EXTRA'), s.total, 0)) 
      comision FROM preventa p INNER JOIN solicitudes s ON p.lote = s.lt 
      WHERE mes = MONTH(p.fecha) AND YEAR(p.fecha) = YEAR(CURDATE()) ${d}
  ) as comisiones  
  FROM preventa p INNER JOIN productosd l ON p.lote = l.id WHERE MONTH(p.fecha)
  BETWEEN 1 and 12 AND YEAR(p.fecha) = YEAR(CURDATE()) ${d} GROUP BY MONTH(p.fecha)
  ORDER BY 1;`);

  const lineaUno = await pool.query(`SELECT * FROM pines WHERE usuario = ? AND  acreedor IS NOT NULL AND usuario IS NOT NULL`, req.user.id);
  if (lineaUno.length > 0) {
    await lineaUno.map((p, x) => {
      lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
      linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
    });
    indircet1 = await pool.query(`SELECT MONTH(p.fecha) mes, SUM(l.valor) total, 
    COUNT(*) ventas, SUM(if(MONTH(p.fecha) = MONTH(CURDATE()), l.valor, 0)) mesactual,
    (
      SELECT SUM(if(s.descp = 'PRIMERA LINEA', s.total, 0)) 
        comision FROM preventa p INNER JOIN solicitudes s ON p.lote = s.lt 
        WHERE (${lDesc}) AND mes = MONTH(p.fecha) AND YEAR(p.fecha) = YEAR(CURDATE())
    ) as comisiones  
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id WHERE (${lDesc}) AND
    MONTH(p.fecha) BETWEEN 1 and 12 AND YEAR(p.fecha) = YEAR(CURDATE()) GROUP BY MONTH(p.fecha)
    ORDER BY 1;`);
  }

  const lineaDos = linea ? await pool.query(`SELECT * FROM pines WHERE acreedor IS NOT NULL AND ${linea}`) : '';
  lDesc = '', linea = '';
  if (lineaDos.length > 0) {
    await lineaDos.map((p, x) => {
      lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
      linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
    });
    indircet2 = await pool.query(`SELECT MONTH(p.fecha) mes, SUM(l.valor) total, 
    COUNT(*) ventas, SUM(if(MONTH(p.fecha) = MONTH(CURDATE()), l.valor, 0)) mesactual,
    (
      SELECT SUM(if(s.descp = 'SEGUNDA LINEA', s.total, 0)) 
        comision FROM preventa p INNER JOIN solicitudes s ON p.lote = s.lt 
        WHERE (${lDesc}) AND mes = MONTH(p.fecha) AND YEAR(p.fecha) = YEAR(CURDATE())
    ) as comisiones  
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id WHERE (${lDesc}) AND
    MONTH(p.fecha) BETWEEN 1 and 12 AND YEAR(p.fecha) = YEAR(CURDATE()) GROUP BY MONTH(p.fecha)
    ORDER BY 1;`);
  }

  const lineaTres = linea ? await pool.query(`SELECT * FROM pines WHERE acreedor IS NOT NULL AND ${linea}`) : '';
  lDesc = '', linea = '';
  if (lineaTres.length > 0) {
    await lineaTres.map((p, x) => {
      lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
    });
    indircet3 = await pool.query(`SELECT MONTH(p.fecha) mes, SUM(l.valor) total, 
    COUNT(*) ventas, SUM(if(MONTH(p.fecha) = MONTH(CURDATE()), l.valor, 0)) mesactual,
    (
      SELECT SUM(if(s.descp = 'TERCERA LINEA', s.total, 0)) 
        comision FROM preventa p INNER JOIN solicitudes s ON p.lote = s.lt 
        WHERE (${lDesc}) AND mes = MONTH(p.fecha) AND YEAR(p.fecha) = YEAR(CURDATE())
    ) as comisiones  
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id WHERE (${lDesc}) AND
    MONTH(p.fecha) BETWEEN 1 and 12 AND YEAR(p.fecha) = YEAR(CURDATE()) GROUP BY MONTH(p.fecha)
    ORDER BY 1;`);
  }

  ////// 5 MEJORES ASESORES DEL AÑO Y DEL MES //////////////
  asesoresA = await pool.query(`SELECT COUNT(DISTINCT p.id) ventas, u.fullname, u.imagen, r.rango, 
  COUNT(IF(s.descp = 'VENTA DIRECTA', 1, null)) iniciales FROM preventa p INNER JOIN users u ON p.asesor = u.id 
  INNER JOIN rangos r ON u.nrango = r.id LEFT JOIN solicitudes s ON p.lote = s.lt WHERE MONTH(p.fecha) BETWEEN 1 and 12 
  AND YEAR(p.fecha) = YEAR(CURDATE()) GROUP BY u.fullname, u.imagen, r.rango ORDER BY ventas DESC LIMIT 5`);

  asesoresM = await pool.query(`SELECT COUNT(DISTINCT p.id) ventas, u.fullname, u.imagen, r.rango, 
  COUNT(IF(s.descp = 'VENTA DIRECTA', 1, null)) iniciales FROM preventa p INNER JOIN users u ON p.asesor = u.id 
  INNER JOIN rangos r ON u.nrango = r.id LEFT JOIN solicitudes s ON p.lote = s.lt WHERE MONTH(p.fecha) = MONTH(CURDATE()) 
  GROUP BY u.fullname, u.imagen, r.rango ORDER BY ventas DESC LIMIT 5`);

  res.send({ d: dircet, one: indircet1, two: indircet2, thre: indircet3, asesoresA, asesoresM });



  /*if (a == 'table5') {

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
  }*/
});
module.exports = router;
