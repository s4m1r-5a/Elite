const express = require('express');
const router = express.Router();
const pool = require('../database');
const { verifyToken } = require('../lib/auth');
const { wasb, registro, dataSet, Contactos } = require('../keys');
const axios = require('axios');
const moment = require('moment');
const { EstadoDeCuenta, Lista, ListaLotes, Montos } = require('../functions');

/* (async () => {
  const products = await pool.query(
    `SELECT JSON_OBJECT(
      'proyectId', p.id,
      'proyect', p.proyect,
      'minReservationDeposit', CONCAT('$', p.separaciones, ' cop.'),
      'minPaymentInstallmentAmount', CONCAT('$', p.cuotamin, ' cop.'),
      'maxInitialInstallmentPaymentPeriod', p.maxini,
      'maxFinancingInstallmentsPeriod', p.maxfnc,
      'availableProducts', IF(COUNT(l.id) > 0, true, false) ,
      'startingArea', CONCAT(MIN(ROUND(l.mtr2)), 'mt2'),
      'minPricePerSquareMeter', CONCAT('$', MIN(ROUND(l.mtr)), ' cop.'),
      'startingPrices', CONCAT('$', MIN(l.valor), ' cop.')        
    ) AS proyecto  
    
    FROM productos p
    INNER JOIN productosd l ON l.producto = p.id 
    WHERE l.estado = 9 AND p.id IN(27, 31, 75)
    GROUP BY p.id, p.proyect, p.separaciones, p.cuotamin, p.maxini, p.maxfnc`
  ); // , 33, 61, 80

  console.log(
    products.map(e => {
      const w = JSON.parse(e.proyecto);
      ListaLotes(w.proyectId);
      w.availableProducts = !!w.availableProducts;
      // w.priceListOfAvailableLots = `https://inmovili.com/uploads/listaprecio_${w.proyectId}.pdf`;
      w.priceListOfAvailableLots = `https://rnzs1973-4000.use2.devtunnels.ms/uploads/listaprecio_${w.proyectId}.pdf`;
      return w;
    }),
    'proyects'
  );
})(); */

router.post('/bot/:event', verifyToken, async (req, res) => {
  const { event } = req.params;
  const data = req.body;
  const { company } = req;

  if (event === 'client') {
    /* ,
        'products', JSON_ARRAYAGG(
          JSON_OBJECT(
            'order', p.id,
            'type', 'Terreno',
            'name', CONCAT(d.proyect, ' Lote: ', l.n, ' Mz: ', l.mz),
            'price', l.mtr2 * p.vrmt2
          )
        ) */
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
        'clientId', c.idc
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
      GROUP BY c.idc, c.nombre, c.tipo, c.documento, c.email, c.movil, c.direccion, c.fechanacimiento;`
    );
    console.log(JSON.parse(client[0]?.usuario), 'client: ', data);

    if (client.length > 0) return res.json(JSON.parse(client[0]?.usuario));
  } else if (event === 'products') {
    const products = await pool.query(
      `SELECT 
            p.id As 'orderId',
            'Terreno' AS type,
            CONCAT(d.proyect, ' Lote: ', l.n, ' Mz: ', l.mz) AS name,
            l.mtr2 * p.vrmt2 AS price
    
          FROM preventa p 
          INNER JOIN productosd l ON p.lote = l.id 
          INNER JOIN productos d ON l.producto = d.id 
          INNER JOIN clientes c ON c.idc IN(p.cliente, p.cliente2, p.cliente3, p.cliente4) 
          WHERE p.tipobsevacion IS NULL AND c.idc = ?`,
      data?.clientId
    );
    console.log(products, 'products for client: ', { data });

    return res.json(products);
  } else if (event === 'proyects') {
    const products = await pool.query(
      `SELECT JSON_OBJECT(
        'proyectId', p.id,
        'proyect', p.proyect,
        'minReservationDeposit', CONCAT('$', p.separaciones, ' cop.'),
        'minPaymentInstallmentAmount', CONCAT('$', p.cuotamin, ' cop.'),
        'maxInitialInstallmentPaymentPeriod', p.maxini,
        'maxFinancingInstallmentsPeriod', p.maxfnc,
        'availableProducts', IF(COUNT(l.id) > 0, true, false) ,
        'startingArea', CONCAT(MIN(ROUND(l.mtr2)), 'mt2'),
        'minPricePerSquareMeter', CONCAT('$', MIN(ROUND(l.mtr)), ' cop.'),
        'startingPrices', CONCAT('$', MIN(l.valor), ' cop.')        
      ) AS proyecto  
      
      FROM productos p
      INNER JOIN productosd l ON l.producto = p.id 
      WHERE l.estado = 9 AND p.id IN(27, 31, 75)
      GROUP BY p.id, p.proyect, p.separaciones, p.cuotamin, p.maxini, p.maxfnc`
    ); // , 33, 61, 80

    console.log(
      products.map(e => {
        const w = JSON.parse(e.proyecto);
        ListaLotes(w.proyectId);
        w.availableProducts = !!w.availableProducts;
        // w.priceListOfAvailableLots = `https://inmovili.com/uploads/listaprecio_${w.proyectId}.pdf`;
        w.priceListOfAvailableLots = `https://rnzs1973-4000.use2.devtunnels.ms/uploads/listaprecio_${w.proyectId}.pdf`;
        return w;
      }),
      'proyects'
    );

    /* const products = await pool.query(
      `SELECT JSON_OBJECT(
        'proyectId', p.id,
        'proyect', p.proyect,
        'minSeparationValue', CONCAT('separa con $', p.separaciones, ' cop.'),
        'minFinancingFee', p.cuotamin,
        'maxInstallmentsInInitial', p.maxini,
        'maxFinancingInstallments', p.maxfnc,
        'paymethods', p.paymethods,
        'availableProducts', COUNT(l.id),
        'areas', CONCAT('desde ', MIN(ROUND(l.mtr2)), 'mt2'),
        'valuePerMt2', CONCAT('desde $', MIN(ROUND(l.mtr)), ' cop.'),
        'prices', CONCAT('desde $', MIN(l.valor), ' cop.'),
        'discountsForAvailableProducts', JSON_ARRAYAGG(
          JSON_OBJECT(
            'discountId', d.id,
            'discount', CONCAT(d.maxdto, '%'),
            'apply', CONCAT('en la', d.categoria),            
            'instructions', CONCAT(
              'Pagando el ', 
              d.pagar, 
              '% del valor total del producto, en un máximo de ', 
              d.maxcuotas, 
              ' cuotas diferidas, obtendrás hasta un ', 
              d.maxdto, 
              '% de descuento sobre el valor de la ', 
              d.categoria, 
              ' del producto.'
            )
          )
        )        
      ) AS proyecto  
      
      FROM productos p
      INNER JOIN productosd l ON l.producto = p.id 
      LEFT JOIN descuentos d ON p.id = d.producto
      WHERE l.estado = 9 AND p.id IN(27, 31)
      GROUP BY p.id, p.proyect, p.separaciones, p.cuotamin, p.maxini, p.maxfnc, p.paymethods`
    ); */

    return res.json(
      products.map(e => {
        const w = JSON.parse(e.proyecto);
        ListaLotes(w.proyectId);
        w.availableProducts = !!w.availableProducts;
        // w.priceListOfAvailableLots = `https://inmovili.com/uploads/listaprecio_${w.proyectId}.pdf`;
        w.priceListOfAvailableLots = `https://rnzs1973-4000.use2.devtunnels.ms/uploads/listaprecio_${w.proyectId}.pdf`;
        return w;
      })
    );
  } else if (event === 'available_products') {
  } else if (event === 'state_account') {
    if (!data?.orderId) return res.json({ type: 'error', msg: 'No se ha enviado la orden' });
    const stad = await EstadoDeCuenta(data?.orderId, true);
    const totals = await Montos(data?.orderId, true);

    // stad.link = `https://inmovili.com/uploads/estadodecuenta-${data?.orderId}.pdf`;
    stad.link = `https://rnzs1973-4000.use2.devtunnels.ms/uploads/estadodecuenta-${data?.orderId}.pdf`;
    console.log({ ...stad, ...totals }, 'state_account: ', data);

    return res.json({ ...stad, ...totals });
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
  return res.json({
    url: `https://inmovili.com${ruta}`,
    urlDev: `https://rnzs1973-4000.use2.devtunnels.ms${ruta}`
  });
});

module.exports = router;
