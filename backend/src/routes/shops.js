const express = require('express');
const router = express.Router();
const pool = require('../database');
const axios = require('axios');
const moment = require('moment');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');

//ALTER TABLE medicamentos ADD `empresa` INT NULL

/////////////////////* MEDICAMENTOS *//////////////////////
router.get('/', isLoggedIn, async (req, res) => {
  res.render('shops');
});

router.get('/medicamentos', noExterno, async (req, res) => {
  const medicamentos = await pool.query(`SELECT * FROM medicamentos`);
  res.json({ data: medicamentos });
});

router.post('/medicamentos', isLoggedIn, async (req, res) => {
  const { id, nombre, laboratorio, clase, invima, tipo, medida, cantidad } = req.body;
  const data = {
    nombre: nombre.toUpperCase().trim(),
    laboratorio: laboratorio.toUpperCase().trim(),
    clase,
    invima,
    tipo,
    medida,
    cantidad
  };

  if (id) {
    await pool.query('UPDATE medicamentos SET ? WHERE id = ?', [data, id]);
    return res.send({ code: true });
  }

  const newProduct = await pool.query('INSERT INTO medicamentos SET ? ', data);
  res.send({ code: newProduct.insertId });
});

/////////////////////* PRECIOS *//////////////////////
router.get('/prices', isLoggedIn, async (req, res) => {
  res.render('market/prices');
});

router.get('/precios/:combo?', noExterno, async (req, res) => {
  const { combo } = req.params;
  console.log('precios', combo);
  const prices = await pool.query(
    `SELECT p.*, r.*, m.nombre, m.laboratorio, 
        m.clase, m.medida, p_combo.name As tipo, p_combo.precio As valor, 
        r_combo.cantidad As quantity, m_combo.nombre As nam,
        m_combo.laboratorio As laboratory, m_combo.clase As class
    FROM precios AS p 
        INNER JOIN recetas AS r ON p.id = r.grupo 
        LEFT JOIN medicamentos AS m ON m.id = r.articulo 
        LEFT JOIN precios AS p_combo ON p_combo.id = r.receta
        LEFT JOIN recetas AS r_combo ON p_combo.id = r_combo.grupo
        LEFT JOIN medicamentos AS m_combo ON m_combo.id = r_combo.articulo   
    WHERE p.combo = ? 
    ORDER BY p.name ASC`,
    combo ?? 0
  );
  // console.log(prices);
  res.json({ data: prices });
});

router.post('/precios', isLoggedIn, async ({ body, files, headers }, res) => {
  const { id, name, precio, descripcion, cantidad, nota, type, code, visible } = body;
  const field = body?.articulo ? 'articulo' : 'receta';
  const value = body?.articulo ?? body?.receta;
  let inset = null;

  console.log(body, body?.visible, files);
  // return res.send(true);

  const price = {
    name: name.toUpperCase().trim(),
    type,
    precio,
    descripcion,
    combo: Array.isArray(value)
  };

  if (files.length) price.imagen = headers.origin + '/uploads/' + files[0]?.filename;

  if (id) {
    if (files.length) {
      const [price] = (await pool.query(`SELECT imagen FROM precios WHERE id = ?`, id)) ?? [
        null
      ];
      if (price?.imagen) {
        DeleteFile(price?.imagen);
      }
    }
    const data = Array.isArray(value) ? price : { ...price, [field]: value, cantidad, nota };

    await pool.query(
      'UPDATE precios p INNER JOIN recetas r ON p.id = r.grupo SET ? WHERE p.id = ?',
      [data, id]
    );

    await pool.query(
      `DELETE FROM recetas WHERE grupo = ? AND (${field} NOT IN (?) OR ${field} IS NULL)`,
      [id, value]
    );
  } else inset = (await pool.query('INSERT INTO precios SET ? ', price))?.insertId;

  if (Array.isArray(value)) {
    const items = code.map((e, i) => ({
      [field]: value[i],
      cantidad: cantidad[i],
      nota: nota[i],
      code: e || null,
      visible: visible[i]
    }));

    items.forEach(async (e, i) => {
      if (e.code) await pool.query(`UPDATE recetas SET ? WHERE code = ?`, [e, e.code]);
      else await pool.query('INSERT INTO recetas SET ? ', { ...e, grupo: id || inset });
    });
  } else if (!id)
    await pool.query('INSERT INTO recetas SET ? ', {
      [field]: value,
      grupo: inset,
      cantidad,
      nota
    });

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
