const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const axios = require('axios');
const moment = require('moment');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');
const { nanoid } = require('nanoid');

const isNum = num => !isNaN(parseFloat(num)) && isFinite(num);

router.get('/table', noExterno, async (req, res) => {
  const orders = await pool.query(
    `SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT('code', p.code, 'articulo', TRIM(BOTH '-' FROM CONCAT(IFNULL(p.articulo, ''), '-', IFNULL(p.referencia, ''))), 
          'producto', TRIM(BOTH '-' FROM CONCAT(IFNULL(p.producto, ''), '-', IFNULL(p.referencia, ''))), 'referencia', p.referencia,  
          'name', p.name, 'cantidad', p.cantidad, 'unitario', p.unitario, 'monto', p.monto, 'orden', p.orden, 
          'nota', p.nota, 'agente', p.agente, 'creado', p.creado, 'actualizado', p.actualizado, 'preparado', p.preparado 
        )
      ) AS items,
      JSON_OBJECT('nombre', c.nombre, 'nit', c.nit, 'movil', c.movil, 'email', c.email) AS negocio,
      JSON_OBJECT('name', m.name, 'numero', m.numero) AS meza,
      (SELECT JSON_OBJECT(
        'domi', d.domi, 'recibe', d.recibe, 'entregado', d.entregado, 'estado', d.estado, 'referencia', d.referencia,      
        'movil', d.movil, 'direccion', d.direccion, 'latitud', d.latitud, 'longitud', d.longitud
      ) FROM domicilios d WHERE d.orden = o.id ) AS domicilio
        
    FROM ordenes AS o 
    INNER JOIN pedidos AS p ON p.orden = o.id 
    LEFT JOIN comercios AS c ON c.id = o.comercio 
    LEFT JOIN mesas AS m ON m.id = o.mesa 
    GROUP BY o.id
    ORDER BY o.id DESC`
  );
  // console.log(orders);
  res.json({
    data: orders.map(e => ({
      ...e,
      items: JSON.parse(e.items),
      comercio: JSON.parse(e.comercio),
      domicilio: JSON.parse(e.domicilio)
    }))
  });
});

router.get('/table2', noExterno, async (req, res) => {
  const orders = await pool.query(
    `SELECT o.*, p.*, c.nombre, c.nit, d.recibe, d.movil, d.direccion, d.latitud, d.longitud, d.estado, d.entregado, d.user domi 
    FROM ordenes AS o 
    INNER JOIN pedidos AS p ON p.orden = o.id 
    LEFT JOIN comercios AS c ON c.id = o.comercio 
    LEFT JOIN domicilios AS d ON d.orden = o.id
    ORDER BY o.id DESC`
  );
  // console.log(orders);
  res.json({ data: orders });
});

router.get('/mesas', isLoggedIn, async (req, res) => {
  const mesas = await pool.query(
    `SELECT m.*, o.id orden, o.user, o.historial FROM mesas m LEFT JOIN ordenes o ON m.id = o.mesa 
     WHERE o.estado = 3 OR o.id IS NULL`
  );
  console.log(mesas, 'mesas');
  res.json({ data: mesas });
});

router.get('/:type?/:id?', isLoggedIn, async (req, res) => {
  const { type, id } = req.params;
  res.render('orders', { type: type ?? null, idType: id ?? null });
});

router.post('/', isLoggedIn, async ({ user, body }, res) => {
  let ref = [];
  const setRef = arr => {
    if (Array.isArray(arr))
      return arr.map(e => {
        if (e.indexOf('-')) {
          const ids = e.split('-');
          ref.push({ id: ids[0], ref: ids[1] });
          return ids[0];
        }
        return e;
      });
    else if (arr.indexOf('-')) {
      const ids = arr.split('-');
      ref = [{ id: ids[0], ref: ids[1] }];
      return ids[0];
    }

    return arr;
  };

  const diff = val => {
    let index = null;
    const reff =
      ref.find((e, i) => {
        if (e.id == val) index = i;
        return e.id == val;
      })?.ref ?? null;

    if (/[0-9]/.test(index)) ref.splice(index, 1);

    return reff;
  };

  const { id, code, tipo, total, type, mesa, ...rest } = body;
  const { domi, comercio, recibe, movil, direccion, referencia, latitud, longitud, ...pedidos } =
    rest;

  console.log(body);
  // return res.send(true);
  const ctnd = ctd => {
    const num = Array.isArray(ctd) ? ctd.length + '-' : '1-';
    return num === '1-'
      ? num + pedidos.cantidad
      : num + pedidos.cantidad.reduce((a, b) => a + parseInt(b), 0);
  };

  const field = pedidos?.producto ? 'producto' : 'articulo';
  const value = setRef(pedidos?.producto ?? pedidos?.articulo);
  const ctd_total = ctnd(value);

  let inset = null;
  let orden = { tipo, total, ctd_total, empresa: user.empresa };

  if (type === 'mesa') orden.mesa = mesa;
  else if (type === 'domicilio' && isNum(comercio)) orden.comercio = comercio;

  if (id) {
    const data = Array.isArray(value)
      ? orden
      : {
          ...orden,
          [field]: value,
          referencia: diff(value),
          cantidad: pedidos.cantidad,
          name: pedidos.name,
          nota: pedidos.nota,
          unitario: pedidos.unitario,
          monto: total
        };

    await pool.query(
      'UPDATE ordenes o INNER JOIN pedidos p ON p.orden = o.id SET ? WHERE o.id = ?',
      [data, id]
    );

    await pool.query(`DELETE FROM pedidos WHERE orden = ? AND code NOT IN (?)`, [id, code]);
  } else
    inset = (await pool.query('INSERT INTO ordenes SET ? ', { ...orden, user: user?.id }))
      ?.insertId;

  if (Array.isArray(value)) {
    const items = value.map((e, i) => ({
      [field]: e,
      referencia: diff(e),
      code: code[i] ?? null,
      cantidad: pedidos.cantidad[i],
      name: pedidos.name[i],
      nota: pedidos.nota[i],
      unitario: pedidos.unitario[i],
      monto: pedidos.unitario[i] * pedidos.cantidad[i]
    }));

    items.forEach(async (e, i) => {
      const { code, ...data } = e;
      if (code) await pool.query(`UPDATE pedidos SET ? WHERE code = ?`, [data, code]);
      else
        await pool.query('INSERT INTO pedidos SET ? ', {
          ...data,
          agente: user?.id,
          orden: id || inset
        });
    });
  } else if (!id)
    await pool.query('INSERT INTO pedidos SET ? ', {
      [field]: value,
      referencia: diff(value),
      cantidad: pedidos.cantidad,
      name: pedidos.name,
      nota: pedidos.nota,
      unitario: pedidos.unitario,

      orden: inset,
      agente: user?.id,
      monto: total
    });

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

    if (!domi) await pool.query('INSERT INTO domicilios SET ? ', data);
    else await pool.query('UPDATE domicilios SET ? WHERE domi = ?', [data, domi]);
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
