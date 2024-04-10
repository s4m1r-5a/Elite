const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifyToken } = require('../lib/auth');
const { wasb, registro, dataSet, Contactos } = require('../keys');
const axios = require('axios');
const moment = require('moment');
const { EstadoDeCuenta, Lista, ListaLotes } = require('../functions');

router.post('/bot/:event', verifyToken, async (req, res) => {
  const { event } = req.params;
  const data = req.body;
  const { company } = req;

  if (event === 'client') {
    const client = await pool.query(
      `SELECT JSON_OBJECT(
        'name', c.nombre,
        'docType', c.tipo,
        'docNumber', c.documento,
        'email', c.email,
        'phone', c.movil,
        'address', c.direccion,
        'birthday', c.fechanacimiento,
        'type', 'client',
        'products', JSON_ARRAYAGG(
          JSON_OBJECT(
            'order', p.id,
            'type', 'Terreno',
            'name', CONCAT(d.proyect, ' Lote: ', l.n, ' Mz: ', l.mz),
            'price', l.mtr2 * p.vrmt2,
            'quantity', 1,
            'description', l.descripcion
          )
        )
      ) AS usuario

      FROM preventa p 
      INNER JOIN productosd l ON p.lote = l.id 
      INNER JOIN productos d ON l.producto = d.id 
      INNER JOIN clientes c ON c.idc IN(p.cliente, p.cliente2, p.cliente3, p.cliente4) 
      WHERE p.tipobsevacion IS NULL AND ${
        data?.docNumber
          ? 'c.documento = ' + data.docNumber
          : data?.phone
          ? `REPLACE(c.movil, ' ', '') LIKE '%${data.phone}%'`
          : 'c.documento = 98435439593485934859345943'
      }
      GROUP BY c.nombre, c.tipo, c.documento, c.email, c.movil, c.direccion, c.fechanacimiento;`
    );
    console.log(
      client.map(e => JSON.parse(e.usuario)),
      'client'
    );

    if (client.length > 0) return res.json(client.map(e => JSON.parse(e.usuario)));
  } else if (event === 'state-account') {
    if (!data?.orden) return res.json({ type: 'error', msg: 'No se ha enviado la orden' });
    await EstadoDeCuenta(data?.orden);
    return res.json({ url: `https://inmovili.com/uploads/estadodecuenta-${data?.orden}.pdf` });
  }

  return res.json({
    type: 'error',
    msg: `Evento no encontrado: ${event}`
  });
});

router.get('/bot/state-account/:order', verifyToken, async (req, res) => {
  const { order } = req.params;
  if (!order) return res.json({ type: 'error', msg: 'No se ha enviado la orden' });
  await EstadoDeCuenta(order);
  return res.json({
    url: `https://inmovili.com/uploads/estadodecuenta-${order}.pdf`,
    urlDev: `https://rnzs1973-4000.use2.devtunnels.ms/uploads/estadodecuenta-${order}.pdf`
  });
});

router.get('/bot/price-list/:proyect', verifyToken, async (req, res) => {
  const { proyect } = req.params;
  if (!proyect) return res.json({ type: 'error', msg: 'No se ha enviado la orden' });
  const ruta = await ListaLotes(proyect);
  console.log({ ruta });
  return res.json({ url: `https://inmovili.com${ruta}`, urlDev: `https://rnzs1973-4000.use2.devtunnels.ms${ruta}` });
});

module.exports = router;
