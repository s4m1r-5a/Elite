const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');

router.get('/', isLoggedIn, async (req, res) => {
  res.render('articles');
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

module.exports = router;
