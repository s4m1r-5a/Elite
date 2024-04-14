const express = require('express');
const router = express.Router();
const pool = require('../database');
const axios = require('axios');
const moment = require('moment');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');

router.get('/', isLoggedIn, async (req, res) => {
  res.render('shops');
});

router.get('/table/:latitud?/:longitud?', noExterno, async (req, res) => {
  const params = req.params;
  let metros = `NULL AS metros`;
  let orderBy = `ORDER BY c.id DESC;`;

  if (params?.latitud && params?.longitud) {
    metros = `ROUND(ST_DISTANCE_Sphere(POINT(c.latitud, c.longitud), POINT('${params?.latitud}', '${params?.longitud}'))) AS metros`;
    orderBy = `ORDER BY SQRT(POW(c.latitud - '${params?.latitud}', 2) + POW(c.longitud - '${params?.longitud}', 2)) LIMIT 10;`;
  }

  const shops =
    await pool.query(`SELECT c.*, u.fullname, u.username, u.cel, p.docType, p.docNumber, p.fullName, ${metros} 
    FROM comercios c INNER JOIN users u ON c.asesor = u.id LEFT JOIN persons p ON c.person = p.id ${orderBy}`);

  res.json({ data: shops });
});

router.post('/', isLoggedIn, async ({ user, body, files, headers }, res) => {
  const { id, docType, docNumber, fullName, ...comercio } = body;

  console.log({ id, ...comercio }, files);
  // return res.send(true);

  if (!comercio.person && fullName && docNumber)
    await pool.query('INSERT INTO persons SET ?', { docType, docNumber, fullName });

  comercio.empresa = 1;
  comercio.asesor = user?.id;
  comercio.nombre = comercio.nombre.toUpperCase().trim();
  if (files.length) comercio.imagen = headers.origin + '/uploads/' + files[0]?.filename;

  for (let key in comercio) {
    if (!comercio[key]) delete comercio[key];
  }

  if (id) {
    if (files.length) {
      const [data] = (await pool.query(`SELECT imagen FROM comercios WHERE id = ?`, id)) ?? [null];
      if (data?.imagen) {
        DeleteFile(data?.imagen);
      }
    }

    await pool.query('UPDATE comercios SET ? WHERE id = ?', [comercio, id]);
  } else await pool.query('INSERT INTO comercios SET ? ', comercio);

  res.send(true);
});

router.delete('/precios/:id', noExterno, async (req, res) => {
  const { id } = req.params;
  const ids = req.body ?? [];
  try {
    await pool.query(`DELETE FROM precios WHERE id IN (?)`, [[...ids, id]]);
    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
