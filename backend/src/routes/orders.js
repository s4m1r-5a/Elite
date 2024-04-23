const express = require('express');
const router = express.Router();
const pool = require('../database');
const axios = require('axios');
const moment = require('moment');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');

const isNum = num => !isNaN(parseFloat(num)) && isFinite(num);

router.get('/table', noExterno, async (req, res) => {
  const orders = await pool.query(
    `SELECT o.*, p.*, c.nombre, c.nit, d.recibe, d.movil, d.direccion, d.latitud, d.longitud, d.estado, d.entregado, d.user domi 
    FROM ordenes AS o 
    INNER JOIN pedidos AS p ON p.orden = o.id 
    LEFT JOIN comercios AS c ON c.id = o.comercio 
    LEFT JOIN domicilios AS d ON d.orden = o.id
    ORDER BY o.id DESC`
  );
  console.log(orders);
  res.json({ data: orders });
});

router.get('/mesas', isLoggedIn, async (req, res) => {
  const mesas = await pool.query(
    `SELECT m.*, o.id orden, o.user, o.historial FROM mesas m LEFT JOIN ordenes o ON m.id = o.mesa`
  );

  res.json({ data: mesas });
});

router.get('/:type?/:id?', isLoggedIn, async (req, res) => {
  const { type, id } = req.params;
  res.render('orders', { type: type ?? null, idType: id ?? null });
});

router.post('/', isLoggedIn, async ({ user, body, headers }, res) => {
  const { id, code, tipo, total, type, mesa, ...rest } = body;
  const { di, comercio, recibe, movil, direccion, referencia, latitud, longitud, ...pedidos } =
    rest;

  let inset = null;
  let orden = { tipo, total, user: user?.id, empresa: 1 };

  if (type === 'mesa') orden.mesa = mesa;
  else if (type === 'domicilio' && isNum(comercio)) orden.comercio = comercio;

  console.log(body);
  // return res.send(true);

  if (id) {
    const data = Array.isArray(pedidos.producto) ? orden : { ...orden, ...pedidos, monto: total };

    await pool.query(
      'UPDATE ordenes o INNER JOIN pedidos p ON p.orden = o.id SET ? WHERE o.id = ?',
      [data, id]
    );

    await pool.query(`DELETE FROM pedidos WHERE orden = ? AND id NOT IN (?)`, [id, code]);
  } else inset = (await pool.query('INSERT INTO ordenes SET ? ', orden))?.insertId;

  if (Array.isArray(pedidos.producto)) {
    const items = pedidos.producto.map((e, i) => ({
      code: code[i],
      producto: e,
      cantidad: pedidos.cantidad[i],
      nota: pedidos.nota[i],
      monto: pedidos.unitario[i] * pedidos.cantidad[i],
      unitario: pedidos.unitario[i]
    }));

    items.forEach(async (e, i) => {
      const { code, ...data } = e;
      if (code) await pool.query(`UPDATE pedidos SET ? WHERE id = ?`, [data, code]);
      else await pool.query('INSERT INTO pedidos SET ? ', { ...data, orden: id || inset });
    });
  } else if (!id)
    await pool.query('INSERT INTO pedidos SET ? ', { ...pedidos, orden: inset, monto: total });

  if (type === 'domicilio') {
    const data = {
      orden: inset || id,
      recibe,
      movil,
      direccion,
      referencia,
      latitud: latitud ?? null,
      longitud: longitud ?? null
    };

    if (!di) await pool.query('INSERT INTO domicilios SET ? ', data);
    else await pool.query('UPDATE domicilios SET ? WHERE id = ?', [data, di]);
  }

  res.send(true);
});

router.delete('/:id', noExterno, async (req, res) => {
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
