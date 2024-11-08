const express = require('express');
//const {Builder, By, Key, until} = require('selenium-webdriver');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../database');
const { isLoggedIn, noExterno, isLogged, Admins } = require('../lib/auth');
const sms = require('../sms.js');
const { wasb, registro, dataSet, Contactos } = require('../keys');
const request = require('request');
const cron = require('node-cron');
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');
const { google, containeranalysis_v1alpha1 } = require('googleapis');
const moment = require('moment');
const nodemailer = require('nodemailer');
const path = require('path');
const mysqldump = require('mysqldump');
//const XLSX = require('xlsx')
const XLSX = require('xlsx-js-style');
const PdfPrinter = require('pdfmake');
const Roboto = require('../public/fonts/Roboto');
const imageDownloader = require('../download').download;
const noCifra = valor => {
  if (!valor) return 0;
  const num = /[^0-9.-]/g.test(valor)
    ? parseFloat(valor.replace(/[^0-9.]/g, ''))
    : parseFloat(valor);
  if (typeof num != 'number') throw TypeError('El argumento no puede ser de tipo string');
  return num;
};
const {
  FacturaDeCobro,
  EstadoDeCuenta,
  informes,
  Facturar,
  consultCompany,
  consultDocument,
  Lista,
  Montos,
  currency
} = require('../functions.js');
const helpers = require('../lib/helpers');
//DELETE
const tokenWtsp =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFkZSI6IlNhbXlyIiwid2ViaG9vayI6Imh0dHBzOi8vYzE4YS0yODAwLTQ4NC1hYzgyLTFhMGMtMjk5Ni1iZGUyLTI4NWUtMzgyYS5uZ3Jvay5pby93dHNwL3dlYmhvb2siLCJpYXQiOjE2NDg4MjYxNTR9.o-aWCOLCowGoJdqnUQnKpNrtJFWYrNqZ8LpPycQH7U0';
const transpoter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 80,
  secure: false,
  auth: {
    user: 'info@grupoelitefincaraiz.co',
    pass: 'C0l0mb1@1q2w3e4r5t*'
  },
  tls: {
    rejectUnauthorized: false
  }
});
const SCOPES = [
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.photos.readonly'
];
const TOKEN_PATH = ['token-drive.json', 'token-people.json'];
moment.locale('es');
var desarrollo = false;
var url = 'https://bin.chat-api.com/1bd03zz1'; // •	v2HD9b0f^K

//////////////////////////////////////BUSCAR COMISIONES DUPLICADAS ////////////////////////////////////
`SELECT p.id, p.comision, p.blockcomi, d.proyect, l.mz, l.n, l.directa, s.descp, s.porciento, 
COUNT(s.ids) repetidas, u.sucursal, u.nrango FROM preventa p INNER JOIN productosd l ON p.lote = l.id 
INNER JOIN productos d ON l.producto = d.id INNER JOIN users u ON p.asesor = u.id LEFT JOIN solicitudes s 
ON s.orden = p.id AND s.descp = 'VENTA DIRECTA' AND s.concepto = 'COMISION DIRECTA' 
GROUP BY p.id, s.porciento HAVING repetidas > 1 ORDER BY p.id;`;

`SELECT s.ids, s.concepto, s.descp, s.orden, (SELECT COUNT(*) FROM solicitudes s2 
WHERE s2.concepto = s.concepto AND s2.descp = s.descp AND s2.orden = s.orden) repit
FROM solicitudes s 
WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONO EXTRA')
GROUP BY s.ids
HAVING repit > 1
ORDER BY s.orden;`;

//////////////////////////////////////////////////////////// REPLACE INTO cuotas SELECT * FROM elite.cuotas; /////////////////////////////////////

// REPORTE DE ESTADO ACTUAL DE LA EMPRESA
/* SELECT s.ids IdPago, p.id Orden, d.proyect Proyecto, l.mz Mz, l.n Lt, p.fecha Separacion, p.separar ValorSpr, l.valor ValorLote, p.ahorro Ahorro, l.valor + p.ahorro TotaLote, MAX(DATE(k.fechs)) FechaCuotaInicial, TIMESTAMP(s.fech) PagoCuotaInicial, s.fecharcb FechaRecibo, TIMESTAMPDIFF(DAY, MAX(TIMESTAMP(k.fechs)), TIMESTAMP(p.fecha)) DifDias, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id 
        AND ids <= s.ids AND stado = 4
     ) - s.monto as PagoAnterior, s.monto PagoCuotaInicial, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id AND ids <= s.ids
     ) as Total, 
     ROUND((l.valor - p.ahorro) * p.iniciar /100, 2) CuotaInicial, p.obsevacion, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto = 'COMISION DIRECTA' AND descp = 'SEPARACION' 
        AND orden = p.id
     ) as Insentivos, 
    ( 
        SELECT SUM(porciento) FROM solicitudes 
        WHERE concepto = 'COMISION DIRECTA' AND descp = 'VENTA DIRECTA' 
        AND orden = p.id
     ) as Porcentage, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto = 'COMISION DIRECTA' AND descp = 'VENTA DIRECTA' 
        AND orden = p.id
     ) as Directas, 
    ( 
        SELECT SUM(porciento) FROM solicitudes 
        WHERE concepto = 'COMISION INDIRECTA' AND descp = 'PRIMERA LINEA' 
        AND orden = p.id
     ) as Porcentage_1, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto = 'COMISION INDIRECTA' AND descp = 'PRIMERA LINEA' 
        AND orden = p.id
     ) as Nivel_1, 
    ( 
        SELECT SUM(porciento) FROM solicitudes 
        WHERE concepto = 'COMISION INDIRECTA' AND descp = 'SEGUNDA LINEA' 
        AND orden = p.id
     ) as Porcentage_2, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto = 'COMISION INDIRECTA' AND descp = 'SEGUNDA LINEA' 
        AND orden = p.id
     ) as Nivel_2, 
    ( 
        SELECT SUM(porciento) FROM solicitudes 
        WHERE concepto = 'COMISION INDIRECTA' AND descp = 'TERCERA LINEA' 
        AND orden = p.id
     ) as Porcentage_3, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto = 'COMISION INDIRECTA' AND descp = 'TERCERA LINEA' 
        AND orden = p.id
     ) as Nivel_3, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto IN('COMISION INDIRECTA', 'COMISION DIRECTA') 
        AND descp IN('VENTA DIRECTA', 'PRIMERA LINEA', 'SEGUNDA LINEA', 'TERCERA LINEA') 
        AND orden = p.id
     ) as TotalPagado, 
    ( 
        SELECT SUM(porciento) FROM solicitudes 
        WHERE concepto = 'GESTION VENTAS' AND orden = p.id
     ) as GestionEmpresa, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto = 'GESTION VENTAS' AND orden = p.id
     ) as GestionEmpresaComi, 
    ( 
        SELECT SUM(porciento) FROM solicitudes 
        WHERE concepto = 'GESTION ADMINISTRATIVA' AND orden = p.id
     ) as GestionAdmin, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto = 'GESTION ADMINISTRATIVA' AND orden = p.id
     ) as GestionAdminComi, 
    ( 
        SELECT SUM(monto) FROM solicitudes 
        WHERE concepto IN('GESTION VENTAS', 'GESTION ADMINISTRATIVA') 
        AND orden = p.id
     ) as TotalGestion       
  FROM preventa p 
  INNER JOIN solicitudes s ON p.id = s.orden 
  INNER JOIN productosd l ON p.lote = l.id 
  INNER JOIN productos d ON l.producto = d.id 
  INNER JOIN clientes c ON p.cliente = c.idc 
  INNER JOIN users u ON p.asesor = u.id
  INNER JOIN cuotas k ON p.id = k.separacion
  WHERE p.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO') AND s.stado = 4     AND k.tipo = 'INICIAL'
  GROUP BY s.ids
  HAVING Total >= CuotaInicial AND (Total - s.monto) < CuotaInicial
  ORDER BY d.proyect, l.mz, l.n; */

// ELIMINAR ASESORES QUE NO TIENEN VENTAS EN EL SISTEMA
// DELETE u FROM users u LEFT JOIN preventa p ON u.id = p.asesor WHERE p.asesor IS NULL

////////////////* RELACION DE PAGOS Y EXTRACTOS */////////////////////////
/* `SELECT s.ids id, s.fech fechadepago, d.proyect proyecto, l.mz mz, l.n lt, c.nombre cliente, 
c.documento, s.monto, s.recibo, s.descp, e.id, e.date fechaRecibo, e.description, e.lugar, 
e.consignado FROM solicitudes s INNER JOIN extrabanco e ON s.extrato = e.id 
INNER JOIN preventa p ON s.orden = p.id INNER JOIN productosd l ON p.lote = l.id 
INNER JOIN productos d ON l.producto = d.id INNER JOIN clientes c ON p.cliente = c.idc 
WHERE e.date >= '2020-05-01' ORDER BY e.date` */

/////////////////////* LISTA DE CLIENTES *////////////////////////////////
`SELECT p.id, o.proyect, l.n lt, c.nombre, c.movil, c.email FROM clientes c 
INNER JOIN preventa p ON p.cliente = c.idc INNER JOIN productosd l ON p.lote = l.id 
INNER JOIN productos o ON l.producto = o.id WHERE o.id = 27 ORDER BY l.n`;

////////////////* COMISIONES DE GRUPO ELITE *////////////////////////////
var lm = `SELECT p.id, d.proyect proyecto, p.fecha, l.mz, l.n lt, l.mtr2, l.mtr, l.valor, e.pin, e.descuento, p.ahorro, l.valor - p.ahorro Total, p.status, l.estado,

(SELECT SUM(cuota) FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3 ORDER BY fechs ASC) as deuda, 
(SELECT COUNT(*) FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3 ORDER BY fechs ASC) as meses,
(SELECT MAX(TIMESTAMP(fech)) FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id) as ultimoabono, 
(SELECT SUM(monto) FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id AND stado = 4) as abonos, d.maxcomis * 100 as comi, (l.valor - p.ahorro) * d.maxcomis as comision, c.nombre, c.documento, u.fullname

        FROM preventa p 
        INNER JOIN productosd l ON p.lote = l.id 
        INNER JOIN productos d ON l.producto = d.id 
        INNER JOIN clientes c ON p.cliente = c.idc 
        INNER JOIN users u ON p.asesor = u.id 
        LEFT JOIN cupones e ON p.id = e.producto 
        WHERE p.tipobsevacion IS NULL
        GROUP BY p.id, e.id
        ORDER BY p.fecha;`;

router.post('/desarrollo', async (req, res) => {
  desarrollo = req.headers.origin;
  console.log('paso siempre por aqui', desarrollo);
});

cron.schedule('0 10 13,15,27,30,31 * *', async () => {
  const sql = `SELECT l.mz, l.n, d.proyect, c.nombre, c.movil, c.email    
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id 
    INNER JOIN productos d ON l.producto = d.id 
    INNER JOIN clientes c ON p.cliente = c.idc 
    WHERE p.tipobsevacion IS NULL AND d.proyect 
    IN('ALTOS DE CAÑAVERAL', 'CAÑAVERAL CAMPESTRE')`;
  const yt = await pool.query(sql);

  for (i = 0; i < yt.length; i++) {
    let data = yt[i]; //'57 3012673944',
    let body = `_Estimado *${data.nombre}* es un placer para nosotros saludarle, y a la vez recordarle el pago de su cuota del lote *${data.n}* en *${data.proyect}*_\n\n_*RED ELITE S.A.S*_\n_Nit : *901.394.949*_\n_Cuenta : **08522647013**_\n_tipo : *AHORROS*_\n_Banco : *Bancolombia*_`;
    const tt = await EnviarWTSAP(data.movil, body);
  }
});

cron.schedule('0 15 * * 1,3,5', async () => {
  const sql = `SELECT p.id, l.mz, l.n, d.id idp, d.proyect, c.nombre, c.movil, c.email, d.empresa, 
      SUM(q.cuota) as deuda,  
      COUNT(q.id) as meses
    FROM preventa p 
     INNER JOIN cuotas q ON q.separacion = p.id
     INNER JOIN productosd l ON p.lote = l.id 
     INNER JOIN productos d ON l.producto = d.id 
     INNER JOIN clientes c ON p.cliente = c.idc 
    WHERE 
     p.pys = 0 AND p.tipobsevacion IS NULL AND d.proyect IN('ALTOS DE CAÑAVERAL', 'CAÑAVERAL CAMPESTRE') 
     AND q.fechs <= CURDATE() AND q.estado = 3  
    GROUP BY p.id
    HAVING meses > 1 AND deuda > 0 
    ORDER BY meses DESC`; // LIMIT 5
  const deudores = await pool.query(sql);

  let deuda = 0;
  let mora = 0;
  let cuotasAtrasadas = 0;
  for (const data of deudores) {
    const totals = await Montos(data.id, true);
    const messagge = `_*${data.nombre}*._ 
    \n_Queremos informarle que, a la fecha, nuestro sistema registra un retraso en el pago de sus cuotas correspondientes a la orden de compra *${
      data.id
    }* de *${data.proyect} Lt-${
      data.n
    }* según el cronograma pactado inicialmente. Le recordamos que este saldo en mora está generando intereses moratorios._
    \n_*Desglose de la obligación:*_
    _Cuotas Atrasadas: *${totals?.totalOverdueInstallments}*_
    _Cuotas Pendientes: *${totals?.totalOutstandingInstallments}*_
    _Cuotas Financiacion: *${totals?.totalInstallments}*_
    _Deuda: *${currency(data?.deuda, true)}*_
    _Mora: *${currency(totals?.totalInterestAmount, true)}*_
    _Abonos: *${currency(totals?.totalPayMade, true)}*_
    _Saldo Capital: *${currency(totals?.capitalBalance, true)}*_
    _Total Saldo: *${currency(totals?.totalBalance, true)}*_
    \n_Para ponerse al día con su obligación, comuníquese al *300 2851046*_
    \n_Ahora puede subir sus constancias de pago, de transferencia o consignación bancaria al siguiente enlace: https://inmovili.com/links/pagos. Solo debe ingresar su número de documento y listo._
    \n_*RED ELITE S.A.S*_`;

    console.log({ messagge, totals });
    deuda += data.deuda;
    mora += totals?.totalInterestAmount ?? 0;
    cuotasAtrasadas += totals?.totalOverdueInstallments ?? 0;

    await WspNewUser(data.empresa, data.movil, messagge);
  }

  const movilesAdmin = ['57 3012673944', '57 3002851046', '57 3024312253'];

  for (const movil of movilesAdmin) {
    await WspNewUser(
      1,
      movil,
      `_Hoy *${moment().format('llll')}*, el sistema envio a *${
        deudores.length
      } Deudores* morosos un mensajes de cobro._ 
    _Total Mora: *$ ${currency(mora, true)}*_
    _Total Deuda: *$ ${currency(deuda, true)}*_
    _Total Cuotas Atrasadas: *${cuotasAtrasadas}*_`
    );
  }
});

// cron.schedule('46 22 * * *', async () => {
//   const sql = `SELECT c.movil, d.empresa
//     FROM preventa p
//      INNER JOIN productosd l ON p.lote = l.id
//      INNER JOIN productos d ON l.producto = d.id
//      INNER JOIN clientes c ON p.cliente = c.idc
//     WHERE
//      p.tipobsevacion IS NULL AND d.proyect IN('ALTOS DE CAÑAVERAL', 'CAÑAVERAL CAMPESTRE')
//     GROUP BY p.id`;
//   const deudores = await pool.query(sql);

//   for (const data of deudores) {
//     const messagge = `COMUNICADO URGENTE: Estimado cliente proyectos Cañaveral Campestre y Altos de Cañaveral, la presente es con el fin de informarles, que debido a una circunstancia ajena a nuestra empresa, en estos momentos no podemos recibir dineros en las cuentas de ahorro número 085-226470-13 y 085-333552-94, por esta razón les informamos que los pagos por concepto de administración y pago de lotes, se estarán recibiendo en la cuenta de ahorros Bancolombia numero 085-386413-33  a nombre de David Saldarriaga Vanegas, identificado con C.C 1043641960, si tiene dudas acerca de este mensaje, puede comunicarse al número  de WhatsApp 3002851046 con el señor Habib Saldarriaga, para que corrobore la información.`;
//     await WspNewUser(data.empresa, data.movil, messagge);
//   }
//   console.log('se enviaron los mensaes');
// });

const usuras = async fecha => {
  const options = {
    method: 'POST',
    url: 'https://querys.inmovili.com/api/query/usury',
    headers: { 'x-access-token': tokenWtsp },
    data: { date: fecha }
  };

  if (!fecha) return (await axios(options)).data;

  const {
    data: { id, annualRate, date }
  } = await axios(options);

  if (annualRate) {
    const newT = { id, teano: annualRate, fecha: moment(date).endOf('month').format('YYYY-MM-DD') };
    const tabla = await pool.query(`INSERT IGNORE intereses SET ? `, newT);
    if (tabla.insertId) {
      var bod = `_Se establecio la tasa de usura de este mes en *${annualRate}%*_`;
      await EnviarWTSAP('57 3012673944', bod);
    }
  }
  const tasa = { id, annualRate, date };
  return tasa;
};

cron.schedule('0 2 * * *', async () => {
  const finmes = moment().endOf('month').format('DD');
  const dia = moment().format('DD');
  const fecha = moment().format('YYYY-MM-DD');
  const tasa = await usuras(fecha);

  ////////////////////* DIAS DE MORA *//////////////////////////////////////////////// •	v2HD9b0f^K
  await pool.query(`UPDATE cuotas c INNER JOIN preventa p ON c.separacion = p.id 
  INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id 
  INNER JOIN intereses i ON i.teano SET c.diasmora = DATEDIFF(CURDATE(), c.fechs), c.mora = 
  ROUND(c.cuota * DATEDIFF(CURDATE(), c.fechs) * i.teano / 365, 2), c.tasa = i.teano WHERE 
  c.fechs < CURDATE() AND c.estado = 3 AND d.moras = 1 AND i.teano = 
  (SELECT MIN(i.teano) FROM intereses i WHERE i.fecha BETWEEN c.fechs AND LAST_DAY(CURDATE()));`);

  await pool.query(`    
  UPDATE cuotas c INNER JOIN preventa p ON c.separacion = p.id INNER JOIN productosd l 
  ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id INNER JOIN intereses i 
  ON i.teano INNER JOIN acuerdos a ON a.orden SET c.diasmora = CASE WHEN a.type = 'REMOVE' 
  AND a.limite > c.fechs THEN 0 WHEN a.type = 'STOP' AND c.fechs BETWEEN a.limite 
  AND a.datestop THEN 0 ELSE DATEDIFF(CURDATE(), c.fechs) END, c.mora = CASE WHEN a.type = 
  'REMOVE' THEN 0 WHEN a.type = 'STOP' AND c.fechs BETWEEN a.limite AND a.datestop THEN 0 
  ELSE ROUND(c.cuota * DATEDIFF(CURDATE(), c.fechs) * i.teano / 365 * IF(a.dcto, 1 - a.dcto, 1), 2) 
  END, c.tasa = i.teano, c.acuerdo = IF(a.id, a.id, NULL), c.dto = IF(a.dcto, a.dcto, 0) WHERE 
  c.fechs < CURDATE() AND c.estado = 3 AND d.moras = 1 AND i.teano = 
  (SELECT MIN(i.teano) FROM intereses i WHERE i.fecha BETWEEN c.fechs AND CURDATE()) AND a.id = 
  (SELECT MIN(id) FROM acuerdos WHERE orden = p.id AND estado IN(7, 9) AND limite > c.fechs);`);

  ////////////////* RESTABLECER LOS ID DE LAS RELACIONES DE CUOTAS ELIMINADOS *///////////////////
  await pool.query(`SET  @num := 0`);
  await pool.query(`UPDATE relacioncuotas SET id = @num := (@num+1)`);
  await pool.query(`ALTER TABLE relacioncuotas AUTO_INCREMENT =1`);
  await pool.query(`ALTER TABLE relacioncuotas MODIFY COLUMN id INT(11) UNSIGNED`);
  await pool.query(`ALTER TABLE relacioncuotas MODIFY COLUMN id INT(11) UNSIGNED AUTO_INCREMENT`);

  const comi = await pool.query(`SELECT p.id ordn, l.valor - p.ahorro Total, 
    (l.valor - p.ahorro) * d.cobrosistema Inicial, ( SELECT SUM(monto) 
    FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND stado = 4 AND orden = p.id ) as abonos 
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id 
    WHERE p.tipobsevacion IS NULL AND d.external IS NOT NULL AND d.cobrosistema > 0 AND p.status > 1 
    GROUP BY p.id HAVING abonos >= Inicial ORDER BY p.id`);

  if (comi.length) {
    let ids = null;
    await comi.map(e => (ids += ids ? ', ' + e.ordn : e.ordn));
    await pool.query(`UPDATE solicitudes s SET s.fech = NOW(), 
        s.stado = 9 WHERE s.concepto = 'GESTION ADMINISTRATIVA' AND s.stado = 8 AND s.orden IN(${ids})`);
  }
});

cron.schedule('7 10 * * *', async () => {
  if (desarrollo && desarrollo !== 'http://localhost:5000') {
    var Dia = moment().subtract(1, 'days').endOf('days').format('YYYY-MM-DD HH:mm');
    const f =
      await pool.query(`SELECT p.id, l.mz, l.n, DATE_FORMAT(p.fecha, "%e de %b") fecha FROM productosd l 
        INNER JOIN preventa p ON l.id = p.lote WHERE TIMESTAMP(p.fecha) < '${Dia}' AND p.tipobsevacion IS NULL AND l.estado = 1`);
    var body = `_*${Dia}*_\n_Existen *${f.length}* productos a liberar el dia de mañana_\n_Si alguno de estos es tuyo, diligencia el pago lo antes posible de lo contrario estara disponible mañana a las *23:59*_\n_A continuacion se describen los *productos* a liberar_\n\n`; //${JSON.stringify(f)} ${f.length} _*registros en total ${req.body.sitio}*
    f.map(x => {
      body += `_ID: *${x.id}* MZ: *${x.mz}* LT: *${x.n}* - ${x.fecha}_\n`;
    });
    //await EnviarWTSAP(0, body, 0, '573002851046-1593217257@g.us');
  }
});

cron.schedule('0 0 * * *', async () => {
  mysqldump({
    connection: {
      host: process.env.BD_HOST,
      user: process.env.BD_USER,
      password: process.env.BD_PASSWORD,
      database: process.env.DATABASE,
      port: process.env.BD_PORT
    },
    dumpToFile: './src/public/uploads/elite.sql'
  });

  //var Dia = moment().subtract(3, 'days').endOf('days').format('YYYY-MM-DD HH:mm');

  const ordenes = await pool.query(`SELECT p.id, d.proyect, l.mz, l.n, p.fecha, COUNT(s.ids) pagos 
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id
    LEFT JOIN solicitudes s ON p.id = s.orden WHERE p.tipobsevacion IS NULL GROUP BY p.id, d.proyect, l.mz, l.n  
    HAVING pagos = 0 AND p.fecha <= DATE_SUB(NOW(),INTERVAL 3 DAY) ORDER BY p.fecha DESC`);

  if (ordenes.length) {
    let IDS = null;
    let productos = `_Productos *eliminados* por falta de pagos en un periodo de *72 horas*_\n`;
    await ordenes.map(e => {
      IDS += IDS ? ', ' + e.id : e.id;
      productos += `_*${e.proyect}* -${e.mz !== 'no' && ' Mz: *' + e.mz + '* -'} Lt: *${e.n}*_\n`;
    });

    await pool.query(`UPDATE productosd l INNER JOIN preventa p ON l.id = p.lote 
    SET l.estado = 9, l.tramitando = NULL WHERE p.id IN(${IDS})`);

    await pool.query(`DELETE FROM preventa WHERE id IN(${IDS})`);

    // await EnviarWTSAP('57 3012673944', productos);
  }

  /////////////////////////////////////////* QUITAR QUPONES *//////////////////////////////////////////
  const separaciones = await pool.query(`SELECT p.id, d.proyect, l.mz, l.n, p.fecha, l.estado, 
    l.mtr2 * l.mtr * p.iniciar / 100 - p.ahorro as ini, (SELECT SUM(monto) FROM solicitudes 
    WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id ) as abonos FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id 
    WHERE p.tipobsevacion IS NULL AND p.cupon != 1 AND p.fecha <= DATE_SUB(NOW(),INTERVAL 3 DAY) 
    AND d.proyect != 'PRADOS DE PONTEVEDRA' GROUP BY p.id, d.proyect, l.mz HAVING abonos < ini
    ORDER BY p.fecha DESC`);

  if (separaciones.length) {
    let IDS = null;
    let productos = `_Productos con *cupones* con un periodo de *72 horas* sin completar el pago al que se comprometieron_\n`;
    await separaciones.map(e => {
      IDS += IDS ? ', ' + e.id : e.id;
      productos += `_*${e.proyect}* -${e.mz !== 'no' && ' Mz: *' + e.mz + '* -'} Lt: *${e.n}*_\n`;
    });

    await EnviarWTSAP('57 3012673944', productos);
  }
});

cron.schedule('0 0 1 * *', async () => {
  let m = new Date();
  var mes = m.getMonth() + 1;
  var hoy = moment().format('YYYY-MM-DD');
  const asesor = await pool.query(`SELECT u.*, r.venta, r.bono FROM users u 
        INNER JOIN rangos r ON u.nrango = r.id WHERE u.sucursal IS NULL`);
  if (asesor.length > 0) {
    await asesor.map(async (j, x) => {
      var porcentual = Math.sign(j.bono - j.rangoabajo) > 0 ? Math.abs(j.bono - j.rangoabajo) : 0;

      if (j.nrango === 4 && j.cortep >= j.venta && !j.pagobono) {
        var monto = j.cortep * porcentual;
        var retefuente = monto * 0.1;
        var reteica = (monto * 8) / 1000;
        var f = {
          fech: hoy,
          monto,
          concepto: 'BONOS',
          stado: 15,
          porciento: porcentual,
          descp: 'BONO GERENCIAL',
          asesor: j.id,
          total: j.cortep,
          retefuente,
          reteica,
          pagar: monto - (retefuente + reteica)
        };
        await pool.query(`INSERT INTO solicitudes SET ?`, f);
      } else if (
        (j.nrango === 3 || j.nrango === 2 || j.nrango === 1) &&
        j.cortep >= j.venta &&
        !j.pagobono
      ) {
        var corte;
        switch (mes) {
          case 1:
            corte = 1;
            break;
          case 2:
            corte = 2;
            break;
          case 3:
            corte = 3;
            break;
          case 4:
            corte1 = 1;
            break;
          case 5:
            corte = 2;
            break;
          case 6:
            corte = 3;
            break;
          case 7:
            corte = 1;
            break;
          case 8:
            corte = 2;
            break;
          case 9:
            corte = 3;
            break;
          case 10:
            corte = 1;
            break;
          case 11:
            corte = 2;
            break;
          case 12:
            corte = 3;
            break;
        }
        var acumulado =
          corte === 1 ? j.corte1 : corte === 2 ? j.corte2 : corte === 3 ? j.corte3 : '';
        var monto = (acumulado + j.cortep) * porcentual;
        var retefuente = monto * 0.1;
        var reteica = (monto * 8) / 1000;
        var descp =
          j.nrango === 1
            ? 'BONO PRESIDENCIAL'
            : j.nrango === 2
            ? 'BONO VICEPRESIDENCIAL'
            : 'BONO GERENCIAL ELITE';
        var f = {
          fech: hoy,
          monto,
          concepto: 'BONOS',
          stado: 15,
          porciento: porcentual,
          descp,
          asesor: j.id,
          total: acumulado + j.cortep,
          retefuente,
          reteica,
          pagar: monto - (retefuente + reteica)
        };
        await pool.query(`INSERT INTO solicitudes SET ?`, f);
      }
    });
  }
  var bod = `_Hemos procesado todos los *BONOS* de este mes *${hoy}* _\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
  await EnviarWTSAP('57 3007753983', bod);
});

cron.schedule('0 0 2,17 * *', async () => {
  await pool.query(
    `UPDATE solicitudes SET stado = 9 WHERE concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'PREMIACION', 'BONO EXTRA') AND stado = 15`
  );
  var bod = `_Hemos *Desbloqueado* todas las *COMISIONES O BONOS Y PREMIOS*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
  await EnviarWTSAP('57 3007753983', bod);
});

router.get('/cobros', async (req, res) => {
  const sql = `SELECT p.id, l.mz, l.n, d.id idp, d.proyect, c.nombre, c.movil, c.email, d.empresa, 
      SUM(q.cuota) as deuda,  
      COUNT(q.id) as meses
    FROM preventa p 
     INNER JOIN cuotas q ON q.separacion = p.id
     INNER JOIN productosd l ON p.lote = l.id 
     INNER JOIN productos d ON l.producto = d.id 
     INNER JOIN clientes c ON p.cliente = c.idc 
    WHERE 
     p.pys = 0 AND p.tipobsevacion IS NULL AND d.proyect IN('ALTOS DE CAÑAVERAL', 'CAÑAVERAL CAMPESTRE') 
     AND q.fechs <= CURDATE() AND q.estado = 3  
    GROUP BY p.id
    HAVING meses > 1 AND deuda > 0 
    ORDER BY meses DESC`; // LIMIT 5
  const deudores = await pool.query(sql);

  let deuda = 0;
  let mora = 0;
  let cuotasAtrasadas = 0;
  for (const data of deudores) {
    const totals = await Montos(data.id, true);
    const messagge = `_*${data.nombre}*._ 
    \n_Queremos informarle que, a la fecha, nuestro sistema registra un retraso en el pago de sus cuotas correspondientes a la orden de compra *${
      data.id
    }* de *${data.proyect} Lt-${
      data.n
    }* según el cronograma pactado inicialmente. Le recordamos que este saldo en mora está generando intereses moratorios._
    \n_*Desglose de la obligación:*_
    _Cuotas Atrasadas: *${totals?.totalOverdueInstallments}*_
    _Cuotas Pendientes: *${totals?.totalOutstandingInstallments}*_
    _Cuotas Financiacion: *${totals?.totalInstallments}*_
    _Deuda: *${currency(data?.deuda, true)}*_
    _Mora: *${currency(totals?.totalInterestAmount, true)}*_
    _Abonos: *${currency(totals?.totalPayMade, true)}*_
    _Saldo Capital: *${currency(totals?.capitalBalance, true)}*_
    _Total Saldo: *${currency(totals?.totalBalance, true)}*_
    \n_Para ponerse al día con su obligación, comuníquese al *300 2851046*_
    \n_Ahora puede subir sus constancias de pago, de transferencia o consignación bancaria al siguiente enlace: https://inmovili.com/links/pagos. Solo debe ingresar su número de documento y listo._
    \n_*RED ELITE S.A.S*_`;

    // console.log({ messagge, totals });
    deuda += data.deuda;
    mora += totals?.totalInterestAmount ?? 0;
    cuotasAtrasadas += totals?.totalOverdueInstallments ?? 0;

    await WspNewUser(data.empresa, data.movil, messagge);
  }

  const movilesAdmin = ['57 3012673944', '57 3002851046', '57 3024312253'];

  for (const movil of movilesAdmin) {
    await WspNewUser(
      1,
      movil,
      `_Hoy *${moment().format('llll')}*, el sistema envio a *${
        deudores.length
      } Deudores* morosos un mensajes de cobro._ 
    _Total Mora: *$ ${currency(mora, true)}*_
    _Total Deuda: *$ ${currency(deuda, true)}*_
    _Total Cuotas Atrasadas: *${cuotasAtrasadas}*_`
    );
  }

  res.json({
    messges: `_Hoy *${moment().format('llll')}*, el sistema envio a *${
      deudores.length
    } Deudores* morosos un mensajes de cobro._ 
    _Total Mora: *$ ${currency(mora, true)}*_
    _Total Deuda: *$ ${currency(deuda, true)}*_
    _Total Cuotas Atrasadas: *${cuotasAtrasadas}*_`
  });
});

router.get('/msg', async (req, res) => {
  ////////////////////////* CREAR PDF *//////////////////////////////
  const printer = new PdfPrinter(Roboto);
  let docDefinition = {
    content: [
      { text: 'Tables', style: 'header' },
      'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
      {
        text: 'A simple table (no headers, no width specified, no spans, no styling)',
        style: 'subheader'
      },
      'The following table has nothing more than a body array',
      {
        style: 'tableExample',
        table: {
          body: [
            ['Column 1', 'Column 2', 'Column 3'],
            ['One value goes here', 'Another one here', 'OK?']
          ]
        }
      },
      { text: 'A simple table with nested elements', style: 'subheader' },
      'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
      {
        style: 'tableExample',
        table: {
          body: [
            ['Column 1', 'Column 2', 'Column 3'],
            [
              {
                stack: [
                  "Let's try an unordered list",
                  {
                    ul: ['item 1', 'item 2']
                  }
                ]
              },
              [
                'or a nested table',
                {
                  table: {
                    body: [
                      ['Col1', 'Col2', 'Col3'],
                      ['1', '2', '3'],
                      ['1', '2', '3']
                    ]
                  }
                }
              ],
              {
                text: [
                  'Inlines can be ',
                  { text: 'styled\n', italics: true },
                  { text: 'easily as everywhere else', fontSize: 10 }
                ]
              }
            ]
          ]
        }
      },
      { text: 'Defining column widths', style: 'subheader' },
      'Tables support the same width definitions as standard columns:',
      {
        bold: true,
        ul: ['auto', 'star', 'fixed value']
      },
      {
        style: 'tableExample',
        table: {
          widths: [100, '*', 200, '*'],
          body: [
            ['width=100', 'star-sized', 'width=200', 'star-sized'],
            [
              'fixed-width cells have exactly the specified width',
              {
                text: 'nothing interesting here',
                italics: true,
                color: 'gray'
              },
              {
                text: 'nothing interesting here',
                italics: true,
                color: 'gray'
              },
              {
                text: 'nothing interesting here',
                italics: true,
                color: 'gray'
              }
            ]
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              'This is a star-sized column. The next column over, an auto-sized column, will wrap to accomodate all the text in this cell.',
              'I am auto sized.'
            ]
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              'This is a star-sized column. The next column over, an auto-sized column, will not wrap to accomodate all the text in this cell, because it has been given the noWrap style.',
              { text: 'I am auto sized.', noWrap: true }
            ]
          ]
        }
      },
      { text: 'Defining row heights', style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          heights: [20, 50, 70],
          body: [
            ['row 1 with height 20', 'column B'],
            ['row 2 with height 50', 'column B'],
            ['row 3 with height 70', 'column B']
          ]
        }
      },
      'With same height:',
      {
        style: 'tableExample',
        table: {
          heights: 40,
          body: [
            ['row 1', 'column B'],
            ['row 2', 'column B'],
            ['row 3', 'column B']
          ]
        }
      },
      'With height from function:',
      {
        style: 'tableExample',
        table: {
          heights: function (row) {
            return (row + 1) * 25;
          },
          body: [
            ['row 1', 'column B'],
            ['row 2', 'column B'],
            ['row 3', 'column B']
          ]
        }
      },
      { text: 'Column/row spans', pageBreak: 'before', style: 'subheader' },
      'Each cell-element can set a rowSpan or colSpan',
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [200, 'auto', 'auto'],
          headerRows: 2,
          // keepWithHeaderRows: 1,
          body: [
            [
              {
                text: 'Header with Colspan = 2',
                style: 'tableHeader',
                colSpan: 2,
                alignment: 'center'
              },
              {},
              { text: 'Header 3', style: 'tableHeader', alignment: 'center' }
            ],
            [
              { text: 'Header 1', style: 'tableHeader', alignment: 'center' },
              { text: 'Header 2', style: 'tableHeader', alignment: 'center' },
              { text: 'Header 3', style: 'tableHeader', alignment: 'center' }
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            [
              {
                rowSpan: 3,
                text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor'
              },
              'Sample value 2',
              'Sample value 3'
            ],
            ['', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            [
              'Sample value 1',
              {
                colSpan: 2,
                rowSpan: 2,
                text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time'
              },
              ''
            ],
            ['Sample value 1', '', '']
          ]
        }
      },
      { text: 'Headers', pageBreak: 'before', style: 'subheader' },
      'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
      {
        text: [
          "It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there's not enough space for the first row to be rendered here"
        ],
        color: 'gray',
        italics: true
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          // dontBreakRows: true,
          // keepWithHeaderRows: 1,
          body: [
            [
              { text: 'Header 1', style: 'tableHeader' },
              { text: 'Header 2', style: 'tableHeader' },
              { text: 'Header 3', style: 'tableHeader' }
            ],
            [
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            ]
          ]
        }
      },
      { text: 'Styling tables', style: 'subheader' },
      'You can provide a custom styler for the table. Currently it supports:',
      {
        ul: ['line widths', 'line colors', 'cell paddings']
      },
      'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
      {
        text: 'noBorders:',
        fontSize: 14,
        bold: true,
        pageBreak: 'before',
        margin: [0, 0, 0, 8]
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [
              { text: 'Header 1', style: 'tableHeader' },
              { text: 'Header 2', style: 'tableHeader' },
              { text: 'Header 3', style: 'tableHeader' }
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
        layout: 'noBorders'
      },
      {
        text: 'headerLineOnly:',
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 8]
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [
              { text: 'Header 1', style: 'tableHeader' },
              { text: 'Header 2', style: 'tableHeader' },
              { text: 'Header 3', style: 'tableHeader' }
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
        layout: 'headerLineOnly'
      },
      {
        text: 'lightHorizontalLines:',
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 8]
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [
              { text: 'Header 1', style: 'tableHeader' },
              { text: 'Header 2', style: 'tableHeader' },
              { text: 'Header 3', style: 'tableHeader' }
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
        layout: 'lightHorizontalLines'
      },
      {
        text: 'but you can provide a custom styler as well',
        margin: [0, 20, 0, 8]
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [
              { text: 'Header 1', style: 'tableHeader' },
              { text: 'Header 2', style: 'tableHeader' },
              { text: 'Header 3', style: 'tableHeader' }
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? 'black' : 'gray';
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 'black' : 'gray';
          }
          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        }
      },
      { text: 'zebra style', margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          body: [
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex % 2 === 0 ? '#CCCCCC' : null;
          }
        }
      },
      { text: 'and can be used dash border', margin: [0, 20, 0, 8] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [
              { text: 'Header 1', style: 'tableHeader' },
              { text: 'Header 2', style: 'tableHeader' },
              { text: 'Header 3', style: 'tableHeader' }
            ],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3'],
            ['Sample value 1', 'Sample value 2', 'Sample value 3']
          ]
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 2 : 1;
          },
          hLineColor: function (i, node) {
            return 'black';
          },
          vLineColor: function (i, node) {
            return 'black';
          },
          hLineStyle: function (i, node) {
            if (i === 0 || i === node.table.body.length) {
              return null;
            }
            return { dash: { length: 10, space: 4 } };
          },
          vLineStyle: function (i, node) {
            if (i === 0 || i === node.table.widths.length) {
              return null;
            }
            return { dash: { length: 4 } };
          }
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (i, node) { return null; }
        }
      },
      {
        text: 'Optional border',
        fontSize: 14,
        bold: true,
        pageBreak: 'before',
        margin: [0, 0, 0, 8]
      },
      'Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.',
      {
        style: 'tableExample',
        table: {
          body: [
            [
              {
                border: [false, true, false, false],
                fillColor: '#eeeeee',
                text: 'border:\n[false, true, false, false]'
              },
              {
                border: [false, false, false, false],
                fillColor: '#dddddd',
                text: 'border:\n[false, false, false, false]'
              },
              {
                border: [true, true, true, true],
                fillColor: '#eeeeee',
                text: 'border:\n[true, true, true, true]'
              }
            ],
            [
              {
                rowSpan: 3,
                border: [true, true, true, true],
                fillColor: '#eeeeff',
                text: 'rowSpan: 3\n\nborder:\n[true, true, true, true]'
              },
              {
                border: undefined,
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              },
              {
                border: [true, false, false, false],
                fillColor: '#dddddd',
                text: 'border:\n[true, false, false, false]'
              }
            ],
            [
              '',
              {
                colSpan: 2,
                border: [true, true, true, true],
                fillColor: '#eeffee',
                text: 'colSpan: 2\n\nborder:\n[true, true, true, true]'
              },
              ''
            ],
            [
              '',
              {
                border: undefined,
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              },
              {
                border: [false, false, true, true],
                fillColor: '#dddddd',
                text: 'border:\n[false, false, true, true]'
              }
            ]
          ]
        },
        layout: {
          defaultBorder: false
        }
      },
      'For every cell without a border property, whether it has all borders or not is determined by layout.defaultBorder, which is false in the table above and true (by default) in the table below.',
      {
        style: 'tableExample',
        table: {
          body: [
            [
              {
                border: [false, false, false, false],
                fillColor: '#eeeeee',
                text: 'border:\n[false, false, false, false]'
              },
              {
                fillColor: '#dddddd',
                text: 'border:\nundefined'
              },
              {
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              }
            ],
            [
              {
                fillColor: '#dddddd',
                text: 'border:\nundefined'
              },
              {
                fillColor: '#eeeeee',
                text: 'border:\nundefined'
              },
              {
                border: [true, true, false, false],
                fillColor: '#dddddd',
                text: 'border:\n[true, true, false, false]'
              }
            ]
          ]
        }
      },
      'And some other examples with rowSpan/colSpan...',
      {
        style: 'tableExample',
        table: {
          body: [
            ['', 'column 1', 'column 2', 'column 3'],
            [
              'row 1',
              {
                rowSpan: 3,
                colSpan: 3,
                border: [true, true, true, true],
                fillColor: '#cccccc',
                text: 'rowSpan: 3\ncolSpan: 3\n\nborder:\n[true, true, true, true]'
              },
              '',
              ''
            ],
            ['row 2', '', '', ''],
            ['row 3', '', '', '']
          ]
        },
        layout: {
          defaultBorder: false
        }
      },
      {
        style: 'tableExample',
        table: {
          body: [
            [
              {
                colSpan: 3,
                text: 'colSpan: 3\n\nborder:\n[false, false, false, false]',
                fillColor: '#eeeeee',
                border: [false, false, false, false]
              },
              '',
              ''
            ],
            ['border:\nundefined', 'border:\nundefined', 'border:\nundefined']
          ]
        }
      },
      {
        style: 'tableExample',
        table: {
          body: [
            [
              {
                rowSpan: 3,
                text: 'rowSpan: 3\n\nborder:\n[false, false, false, false]',
                fillColor: '#eeeeee',
                border: [false, false, false, false]
              },
              'border:\nundefined',
              'border:\nundefined'
            ],
            ['', 'border:\nundefined', 'border:\nundefined'],
            ['', 'border:\nundefined', 'border:\nundefined']
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  };
  let ruta = path.join(__dirname);
  let pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(ruta + '/tables.pdf'));
  pdfDoc.end();
  ///////////////////////* PDF END *////////////////////////////////

  /* const sql = `SELECT c.email FROM preventa p INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos d ON l.producto = d.id INNER JOIN clientes c ON p.cliente = c.idc 
    WHERE d.id IN(38,35,14) AND p.tipobsevacion IS NULL`;
    const yt = await pool.query(sql);
    let correos = '', cont = 1;
    let tr = await yt.map((x) => {
        correos += x.email + ',';
        if (cont === 100) {
            cont = 1;
            gt = correos.slice(0, -1);
            correos = '';
            return gt;
        } else {
            cont++;
            return 0;
        }
    })
    tr.push('samirsaldarriaga@hotmail.com,9rupoelite@gmail.com');
    rt = await tr.filter((e) => {
        return e !== 0;
    })
    console.log(rt.length); */

  res.send(true);
});

router.get('/roles', isLoggedIn, async (req, res) => {
  /* const tasa = await tasaUsura();
  const newTasa = { teano: tasa / 100, fecha: "2021-10-01" };
  await pool.query(`INSERT INTO intereses SET ? `, newTasa);
  var bod = `_Se establecio la tasa de usura de este mes en *${tasa}%*_`;
  await EnviarWTSAP("57 3004880579", bod);
  console.log(bod); */
  //console.log(req.user);
  res.send(req.user);
});

router.get('/add', isLoggedIn, (req, res) => {
  res.render('links/add');
});

router.get('/authorize', isLoggedIn, async (req, res) => {
  /*
        var data = JSON.stringify({
            "data": [
                {
                    "commerceTransferButtonId": "h4ShG3NER1C",
                    "transferReference": "10009824679",
                    "transferAmount": 3458.33,
                    "commerceUrl": "https://gateway.com/payment/route?commerce=Telovendo",
                    "transferDescription": "Compra en Telovendo",
                    "confirmationURL": "https://pagos-api-dev.tigocloud.net/bancolombia/callback"
                }
            ]
        });
    
        var config = {
            method: 'post',
            url: 'https://sbapi.bancolombia.com/v2/operations/cross-product/payments/payment-order/transfer/action/registry',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer AAIkMzdlYjEyNjctNmMzMy00NmIxLWE3NmYtMzNhNTUzZmQ4MTJm1oK9pPzuhMx8Izra6EPMwRgpnTMNXlkmuRhqe1iLTaP17WuwNHhh160vS_AYkkqtDrO7th67tRJD1WZ592Vx-TYPnY-Cy--JyTlpZfW22bBvEaYPOcCqmlIjxuwZsErj52uVNltVd6SFedjAPzvIJRrIDVblpSz_SVslJoneD8Y'
            },
            data: data
        };
    
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });*/

  var config = {
    method: 'GET',
    url: 'https://sbapi.bancolombia.com/v1/security/oauth-otp-pymes/oauth2/authorize',
    headers: { accept: 'text/html' },
    qs: {
      client_id: '37eb1267-6c33-46b1-a76f-33a553fd812f',
      response_type: 'code',
      scope: 'Transfer-Intention:write:app',
      redirect_uri: 'http://localhost:5000/links/authorize',
      state: 'samirsa'
    }
  };
  var datos;
  request(config, function (error, response, body) {
    if (error) throw new Error(error);
    res.send(body);
    //console.log(body);
  });

  //res.send(datos);
});

router.get('/download-imgs-documents', async (req, res) => {
  const resi = await pool.query(`SELECT imags  FROM clientes WHERE imags IS NOT NULL`);
  const urls = [];
  const u = 'http://96.43.143.58:5000';

  if (resi.length) {
    resi.map(e => {
      if (e.imags.indexOf(',')) {
        const imgs = e.imags.split(',');
        imgs.map(e => {
          if (!e) return;
          //console.log(url, name);
          urls.push({ imageUrl: u + e, filename: `./public${e}` });
        });
      } else urls.push({ imageUrl: u + e.imags, filename: `./public${e.imags}` });
    });
    console.log(urls.length);
    for (i = 0; i < urls.length; i++) {
      const e = urls[i];
      //if (i === 3) { continue; }

      // Función para descargar las imágenes
      await imageDownloader(e.imageUrl, e.filename, dat =>
        console.log(`${e.imageUrl} image download!!`, dat)
      );
    }
  }
});

router.get('/download-imgs-solicitudes', async (req, res) => {
  const resi = await pool.query(
    `SELECT pdf, img  FROM solicitudes WHERE img IS NOT NULL ORDER BY fech`
  );
  const urls = [];
  const u = 'http://96.43.143.58:5000';
  const u2 = new RegExp(
    'https://grupoelitefincaraiz.com.co|https://grupoelitefincaraiz.com|https://grupoelitefincaraiz.co'
  );
  const uL = 'http://localhost:5000';

  if (resi.length) {
    resi.map(e => {
      const noPdf = !e.pdf ? true : e.pdf.indexOf(uL) > -1 ? true : false;

      if (e.img.indexOf(',')) {
        const imgs = e.img.split(',');
        imgs.map(e => {
          if (!e) return;
          //console.log(url, name);
          if (e !== '/img/payu.png') urls.push({ imageUrl: u + e, filename: `./public${e}` });
        });
      } else {
        if (!e.img) return;
        //console.log(url, name);
        if (e.img !== '/img/payu.png')
          urls.push({ imageUrl: u + e.img, filename: `./public${e.img}` });
      }

      if (noPdf) return;
      const url = u2.test(e.pdf) ? e.pdf.replace(u2, u) : u + e.pdf;
      const name = u2.test(e.pdf) ? e.pdf.replace(u2, './public') : `./public${e.pdf}`;
      //console.log(url, name, u2.test(e.pdf));
      if (e.pdf) urls.push({ imageUrl: url, filename: name });
    });
    console.log(urls.length);
    for (i = 0; i < urls.length; i++) {
      const e = urls[i];
      //if (i === 3) { continue; }

      // Función para descargar las imágenes
      await imageDownloader(e.imageUrl, e.filename, dat =>
        console.log(`${e.imageUrl} image download!!`, dat)
      );
    }
  }
});

router.get('/download-imgs-cuentas-de-cobro', async (req, res) => {
  const pdfs = await pool.query(`SELECT cuentacobro, rcbs  FROM pagos`);
  const urls = [];
  const url = 'http://96.43.143.58:5000';

  if (pdfs.length) {
    pdfs.map(e => {
      if (e.cuentacobro)
        urls.push({ imageUrl: url + e.cuentacobro, filename: `./public${e.cuentacobro}` });

      if (e.rcbs) urls.push({ imageUrl: url + e.rcbs, filename: `./public${e.rcbs}` });
    });
    console.log(urls.length);
    for (i = 0; i < urls.length; i++) {
      const e = urls[i];
      //if (i === 3) { continue; }

      // Función para descargar las imágenes
      await imageDownloader(e.imageUrl, e.filename, dat =>
        console.log(`${e.imageUrl} image download!!`, dat)
      );
    }
  }
});

router.get('/prueba2', async (req, res) => {
  const ruta = path.join(__dirname, '../public/uploads/libroej.json');
  const ruta2 = path.join(__dirname, '../public/uploads/lista de clientes.xlsx');

  /* fs.exists(ruta2, function (exists) {
        console.log('Archivo ' + exists, ' ruta ' + ruta, ' html ' + req.headers.origin);
        if (exists) {
            fs.unlink(ruta2, function (err) {
                if (err) console.log(err);
                console.log('Archivo eliminado'); 
                return 'Archivo eliminado';
            });
        } else {
            console.log('El archivo no exise');
            return 'El archivo no exise';
        }
    }) */
  /* const content = await pool.query(`SELECT d.proyect, l.mz, l.n lt, c.nombre, c.documento, 
    c.movil, s.fech fecha, s.concepto, s.descp, s.stado, s.monto, s.recibo, 
    REPLACE(s.img, "/uploads", "https://grupoelitefincaraiz.com/uploads") img 
    FROM solicitudes s INNER JOIN preventa p ON p.id = s.orden 
    INNER JOIN productosd l ON l.id = p.lote INNER JOIN productos d ON d.id = l.producto 
    INNER JOIN clientes c ON c.idc = p.cliente WHERE s.concepto IN('PAGO', 'ABONO') 
    AND d.proyect IN('PRADOS DE PONTEVEDRA', 'COLINAS DE PONTEVEDRA') 
    ORDER BY d.proyect, l.mz, l.n, s.fech`); */
  //const content = await pool.query(`SELECT * FROM productos ORDER BY id`);
  //console.log(datos)

  const content = await pool.query(`SELECT p.id, d.proyect, l.mz, l.n lt, c.nombre, 
    c.documento, c.movil, SUM(s.monto) monto, COUNT(s.ids) pagos    
    FROM preventa p INNER JOIN solicitudes s ON p.id = s.orden 
    INNER JOIN productosd l ON l.id = p.lote INNER JOIN productos d ON d.id = l.producto 
    INNER JOIN clientes c ON c.idc = p.cliente 
    WHERE s.concepto IN('PAGO', 'ABONO') AND d.proyect IN('CAÑAVERAL CAMPESTRE') AND p.tipobsevacion IS NULL 
    GROUP BY p.id
    ORDER BY l.n`);

  //let content = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  //console.log(content)

  let newWB = XLSX.utils.book_new();
  let newWS = XLSX.utils.json_to_sheet(content);
  XLSX.utils.book_append_sheet(newWB, newWS, 'samir');
  XLSX.writeFile(newWB, ruta2);
  res.redirect('/uploads/lista de clientes.xlsx');
  /* const excel = XLSX.readFile(ruta2);
    const hojas = excel.SheetNames;
    const hoja = hojas[0], productos = hojas[1], proyecto = hojas[2];
    console.log(hojas, hoja, productos, proyecto)
    //const datos = XLSX.utils.sheet_to_json(excel.Sheets[hoja]);
    const proyectoJson = await XLSX.utils.sheet_to_json(excel.Sheets[proyecto], {
        cellDates: true
    });
    const productosJson = await XLSX.utils.sheet_to_json(excel.Sheets[productos]);
    if (!proyectoJson[0].id) {
        delete proyectoJson[0].id;
        proyectoJson[0] = {
            ...proyectoJson[0],
            fechaini: new Date((proyectoJson[0].fechaini - (25567 + 2)) * 86400 * 1000),
            fechafin: new Date((proyectoJson[0].fechafin - (25567 + 2)) * 86400 * 1000)
        }
        const proyectoAdd = await pool.query('INSERT INTO productos SET ? ', proyectoJson);
        const datos = await productosJson.filter(e => e.mz).map(async (e, i) => {
            const das = await pool.query('INSERT INTO productosd SET ? ', {
                ...e,
                producto: proyectoAdd.insertId
            });
            return das.insertId;
        });
    }
    res.send(true) */

  /* var data = JSON.stringify({
        "data": [
            {
                "commerceTransferButtonId": "h4ShG3NER1C",
                "transferReference": "10009824679",
                "transferAmount": 3458.33,
                "commerceUrl": "https://gateway.com/payment/route?commerce=Telovendo",
                "transferDescription": "Compra en Telovendo",
                "confirmationURL": "https://pagos-api-dev.tigocloud.net/bancolombia/callback"
            }
        ]
    });

    var config = {
        method: 'post',
        url: 'https://sbapi.bancolombia.com/v2/operations/cross-product/payments/payment-order/transfer/action/registry?access_token=AAIkMzdlYjEyNjctNmMzMy00NmIxLWE3NmYtMzNhNTUzZmQ4MTJmuxZgRYnX5hscdkLBx4N3CWvTC6-T2nqywJ_NgBjW7PxADMSUvuuAxyGTeFLNA9IEYQMBfroZ3Yt0h9ikvOzJYMOqPmk-1hHCnADOqhUzvGKWx30QAksyFchSUv7eUbFOsZzWxmz_-WgDuOkNkfQ_GH6hNZC9Cye10TmjB3CWqPY',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        }); */
});

router.get('/prueba3', async (req, res) => {
  const ruta = path.join(__dirname, '../public/uploads/extractos.xlsx');

  const content = await pool.query(`SELECT e.*, s.ids FROM extrabanco e 
  LEFT JOIN solicitudes s ON s.extrato = e.id 
  WHERE e.otro = 'GRUPO ELITE' ORDER BY e.date ASC`);
  let newWB = XLSX.utils.book_new();
  let newWS = XLSX.utils.json_to_sheet(content);
  XLSX.utils.book_append_sheet(newWB, newWS, 'Extractos');
  XLSX.writeFile(newWB, ruta);
  res.redirect('/uploads/extractos.xlsx');
});

router.post('/callback', async (req, res) => {
  console.log(req.body);
});

router.get('/whatsapp', async (req, res) => {
  /* const ruta = path.join(__dirname, '../../screenshot.png');
  console.log(ruta);
  var dataurl = fs.readFileSync(ruta); */
  const url = 'https://inmovili.com.co/api/wtsp/qr';
  const headers = { 'x-access-token': tokenWtsp };
  axios
    .post(url, {}, { headers })
    .then(result => {
      console.log(result.data);
      res.render('links/whatsapp', result.data);
    })
    .catch(err => console.error(err));
});

router.post('/conection', async (req, res) => {
  const url = 'https://inmovili.com.co/api/wtsp/conection';
  const url2 = 'https://inmovili.com.co/api/wtsp/qr';
  const headers = { 'x-access-token': tokenWtsp };
  const conect = await axios.post(url, {}, { headers, timeout: 300000 });
  console.log(conect.data);
  const img = await axios.post(url2, {}, { headers, timeout: 300000 });
  console.log(img.data);
  res.json(img.data);
});

router.post('/prueba2', async (req, res) => {
  console.log(req.body);
});

router.post('/authorize', isLoggedIn, async (req, res) => {
  console.log(req.body);
  const options = {
    method: 'POST',
    url: 'https://sbapi.bancolombia.com/v1/security/oauth-otp-pymes/oauth2/authorize',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'text/html'
    },
    form: {
      client_id: '37eb1267-6c33-46b1-a76f-33a553fd812f',
      scope: 'Transfer-Intention:write:app',
      'resource-owner': 'Samir Saldarriaga',
      redirect_uri: 'http://localhost:5000/links/prueba2',
      'original-url':
        '/bancolombiabluemix-dev/sandbox/v1/security/oauth-otp-pymes/oauth2/authorize?client_id=37eb1267-6c33-46b1-a76f-33a553fd812f&response_type=code&scope=Transfer-Intention%3Awrite%3Aapp&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Flinks%2Fauthorize&state=samirsa',
      'dp-state': 'VA',
      'dp-data': 'jabuna'
    }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.send(body);
    //console.log(body);
  });

  /*
        var qs = require('qs');
        var data = qs.stringify({
            'client_id': '37eb1267-6c33-46b1-a76f-33a553fd812f',
            'scope': 'Transfer-Intention:write:app',
            'resource-owner': 'RedFLix',
            'redirect_uri': 'http://localhost:5000/links/prueba2',
            'original-url': '/bancolombiabluemix-dev/sandbox/v1/security/oauth-otp-pymes/oauth2/authorize?response_type=code&scope=Transfer-Intention:write:app&redirect_uri=http://localhost:5000/links/authorize&state=sami&client_id=37eb1267-6c33-46b1-a76f-33a553fd812f',
            'dp-state': 'samirdgh',
            'dp-data': 'sami'
        });
        var config = {
            method: 'post',
            url: 'https://sbapi.bancolombia.com/v1/security/oauth-otp-pymes/oauth2/authorize',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };
    
        axios(config)
            .then(function (response) {
                //console.log(JSON.stringify(response.data));
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });*/
});

router.get('/proyecciones', async (req, res) => {
  var W = await pool.query(`SELECT c.id, p.numerocuotaspryecto, p.extraordinariameses,
    p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida,
    p.ahorro, p.fecha, p.obsevacion, p.cuot, c.separacion, c.tipo, c.ncuota, c.fechs,
    c.cuota, c.estado, l.mtr2 FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id
    INNER JOIN productosd l ON p.lote = l.id WHERE p.tipobsevacion IS NULL 
    ORDER BY TIMESTAMP(c.fechs) ASC, p.id ASC`); // p.proyect DESC
  //console.log(W)
  var separa = 0;
  var total = 0;
  var inicial = 0;
  var extraordinarias = 0;
  var financiacion = 0;
  var nfnc = 0;
  var cuotaordi = 0;
  var cuotaini = 0;
  var cuotafnc = 0; //x.tipo
  var cf = 0;
  var mes6 = 0;
  var mes12 = 0;
  W.map(x => {
    separa = x.separar;
    total = Math.round(x.vrmt2 * x.mtr2);
    inicial = Math.round((total * x.iniciar) / 100 - x.separar);
    extraordinarias = Math.round(x.cuotaextraordinaria * x.extran);
    financiacion = Math.round(total - inicial - extraordinarias);
    cuotaordi = x.cuotaextraordinaria;
    cuotaini = Math.round(inicial / x.inicialdiferida);
    nfnc = x.numerocuotaspryecto - x.inicialdiferida - x.extran;
    cuotafnc = Math.round(financiacion / nfnc);
    cf = x.extraordinariameses;
    x.obsevacion;
  });
  mes6 = cuotafnc;
  mes12 = cuotafnc;
  if (cuotaordi) {
    cf == 1 ? (mes6 = cuotaordi) : cf == 2 ? (mes12 = cuotaordi) : (mes6 = cuotaordi),
      (mes12 = cuotaordi);
  }
  await pool.query(
    `UPDATE cuotas SET 
    estado = 3, cuota = CASE 
    WHEN tipo = 'SEPARACION' THEN ${separa} 
    WHEN tipo = 'INICIAL' THEN ${cuotaini}
    WHEN tipo = 'FINANCIACION' AND 
    MONTH(fechs) = 6 THEN ${mes6}
    WHEN tipo = 'FINANCIACION' AND 
    MONTH(fechs) = 12 THEN ${mes12}
    ELSE ${cuotafnc} END 
    WHERE c.separacion = ?`,
    orden
  );

  cuataa = ', cuota = CASE tipo WHEN ' + x.tipo + ' THEN ' + montocuotas + ' END';
  var sql = 'UPDATE cuotas SET mora = 0, estado = CASE id';
  var ID = '',
    montocuotas = pagos,
    cuotaa = '';

  Cuots.map(c => {
    if (montocuotas >= c.cuota) {
      ID += c.id.toString() + ', ';
      sql += ' WHEN ' + c.id + ' THEN ' + 13;
      montocuotas = montocuotas - c.cuota;
    } else if (montocuotas > 0) {
      montocuotas = c.cuota - montocuotas;
      ID += c.id.toString() + ', ';
      sql += ' WHEN ' + c.id + ' THEN ' + 3;
      cuataa = ', cuota = CASE id WHEN ' + c.id + ' THEN ' + montocuotas + ' END';
      montocuotas = 0;
    }
  });
  ID = ID.slice(0, -2);
  sql += ' END' + cuotaa + ' WHERE id IN(' + ID + ')';
  await pool.query(sql);
  res.send(true);
});

//////////////////* CHATS */////////////////////
router.get('/chats', isLoggedIn, async (req, res) => {
  const cliente = await pool.query(`SELECT movil FROM clientes`);
  var moviles = cliente.map(x => {
    return x.movil.replace(/ /g, '').length === 10
      ? '57' + x.movil.replace(/ /g, '') + '@c.us'
      : x.movil.replace(/ /g, '') + '@c.us';
  });
  async function chats() {
    const options = { method: 'GET' };
    const url =
      'https://api.chat-api.com/instance107218/dialogs?token=5jn3c5dxvcj27fm0&limit=50&page=0';

    const apiRes = await fetch(url, options);
    const jsonResponse = await apiRes.json();
    //console.log(jsonResponse)
    return jsonResponse;
  }

  var b = await chats();
  /*  var a = await b.dialogs.map((x) => {
         if (moviles.indexOf(x.id) != -1) {
             return x
         }
     }) */
  //res.send({ dialogs: a.filter(Boolean) });
  res.send({ dialogs: 0 });
});
router.get('/chats/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (id === 'bank') {
  } else {
    async function chats() {
      const options = { method: 'GET' };
      const url = `https://api.chat-api.com/instance107218/messagesHistory?token=5jn3c5dxvcj27fm0&page=0&count=50&chatId=${id}`;

      const apiRes = await fetch(url, options);
      const jsonR = await apiRes.json();
      return jsonR;
    }
    var b = await chats();
    res.send(b);
  }
});

//////////////////* BANCO */////////////////////
router.post('/extrabank', async (req, res) => {
  const { date, description, lugar, concpt1, concpt2, otro, consignado, cont } = req.body;
  //var f = moment(Date(date)).format('YYYY-MM-DD');
  const b = {
    date,
    description,
    lugar: lugar ? lugar : null,
    concpt1: concpt1 ? concpt1 : null,
    concpt2: concpt2 ? concpt2 : null,
    otro: otro ? otro : null,
    consignado: consignado ? consignado.replace(/[\$,]/g, '') * 1 : 0
  };
  await pool.query('INSERT INTO extrabanco SET ? ', b);
  //console.log(b, cont) //, bank.insertId              uniddadenlinea@unidadvictimas.gov.co
  //res.send(cont);                                     Actualizar estado fallecido - bogota 031- 4261111
  res.send(consignado);
});

router.post('/extractos', async (req, res) => {
  console.log(req.body);
  const solicitudes =
    await pool.query(`SELECT e.*, s.ids, s.fech, s.monto, s.concepto, cl.nombre, p.proyect, pd.mz, pd.n, s.excdnt, x.xtrabank, x.pagos
        FROM extrabanco e LEFT JOIN extratos x ON x.xtrabank = e.id LEFT JOIN solicitudes s ON x.pagos = s.ids LEFT JOIN productosd pd ON s.lt = pd.id 
        LEFT JOIN preventa pr ON pr.lote = pd.id LEFT JOIN productos p ON pd.producto = p.id LEFT JOIN clientes cl ON pr.cliente = cl.idc`);
  //console.log(solicitudes)
  //respuesta = { "data": solicitudes };
  //[{"id":64,"date":"2020-01-02T05:00:00.000Z","description":"PAGO INTERBANC ERASMO HERRER","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":2000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":65,"date":"2020-01-02T05:00:00.000Z","description":"TRANSFERENCIA CTA CAJERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":700000,"xcdnt":0,"ids":1579,"fech":"2021-01-06 10:42","monto":7276000,"concepto":"PAGO","nombre":"MAYRA ALEXANDRA MEDINA PALACIOS","proyect":"ALTOS DE CAÑAVERAL","mz":"no","n":1,"excdnt":0,"xtrabank":65,"pagos":1579},{"id":66,"date":"2020-01-02T05:00:00.000Z","description":"INTERESES DE SOBREGIRO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-31,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":67,"date":"2020-01-03T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1200000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":68,"date":"2020-01-03T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":0,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":69,"date":"2020-01-04T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"PASEO LA CASTELLA","concpt1":null,"concpt2":null,"otro":null,"consignado":1115000,"xcdnt":0,"ids":1579,"fech":"2021-01-06 10:42","monto":7276000,"concepto":"PAGO","nombre":"MAYRA ALEXANDRA MEDINA PALACIOS","proyect":"ALTOS DE CAÑAVERAL","mz":"no","n":1,"excdnt":0,"xtrabank":69,"pagos":1579},{"id":70,"date":"2020-01-04T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"PASEO LA CASTELLA","concpt1":null,"concpt2":null,"otro":null,"consignado":400000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":71,"date":"2020-01-04T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":72,"date":"2020-01-04T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":1731,"fech":"2021-01-18 12:02","monto":2573000,"concepto":"PAGO","nombre":"WILLIE ALBERTO TORRES CARDONA","proyect":"PRADOS DE PONTEVEDRA","mz":"9","n":13,"excdnt":0,"xtrabank":72,"pagos":1731},{"id":73,"date":"2020-01-07T05:00:00.000Z","description":"CONSIG LOC CAJER MULTIFUNCIONA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":74,"date":"2020-01-07T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"SANTA LUCIA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":75,"date":"2020-01-07T05:00:00.000Z","description":"CONS. NAL EFEC","lugar":"ABREGO","concpt1":null,"concpt2":null,"otro":null,"consignado":1450000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":76,"date":"2020-01-07T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-52,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":77,"date":"2020-01-07T05:00:00.000Z","description":"COMIS CONSIG NAL EFECTIVO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-11000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":78,"date":"2020-01-07T05:00:00.000Z","description":"VALOR IVA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-2090,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":79,"date":"2020-01-08T05:00:00.000Z","description":"PAGO INTERBANC DORA MARIA CAMP","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1800000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":80,"date":"2020-01-08T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":81,"date":"2020-01-08T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1247000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":82,"date":"2020-01-08T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":2000000,"xcdnt":0,"ids":1579,"fech":"2021-01-06 10:42","monto":7276000,"concepto":"PAGO","nombre":"MAYRA ALEXANDRA MEDINA PALACIOS","proyect":"ALTOS DE CAÑAVERAL","mz":"no","n":1,"excdnt":0,"xtrabank":82,"pagos":1579},{"id":83,"date":"2020-01-09T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"CARTAGENA","concpt1":null,"concpt2":null,"otro":null,"consignado":400000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":84,"date":"2020-01-09T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"SANTA LUCIA","concpt1":null,"concpt2":null,"otro":null,"consignado":3500000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":85,"date":"2020-01-09T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":86,"date":"2020-01-09T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":3000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":87,"date":"2020-01-10T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":526000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":88,"date":"2020-01-10T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":2207240,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":89,"date":"2020-01-10T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-84000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":90,"date":"2020-01-10T05:00:00.000Z","description":"PAGO A PROV JUANA TERESA BRAY","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-20000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":91,"date":"2020-01-10T05:00:00.000Z","description":"PAGO A PROV Tierra Linda Condo","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":92,"date":"2020-01-11T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":93,"date":"2020-01-11T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-24475,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":94,"date":"2020-01-11T05:00:00.000Z","description":"PAGO A PROV JUANA TERESA BRAY","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-5000000,"xcdnt":0,"ids":1009,"fech":"2020-11-25 09:52","monto":1139242,"concepto":"PAGO","nombre":"CAROLINA PONTON SUAREZ","proyect":"PRADOS DE PONTEVEDRA","mz":"15","n":3,"excdnt":4,"xtrabank":94,"pagos":1009},{"id":95,"date":"2020-01-11T05:00:00.000Z","description":"PAGO A PROV GEOVANYS SILVA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-223800,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":96,"date":"2020-01-11T05:00:00.000Z","description":"PAGO A PROV MIGUEL PATERNINA J","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-895000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":97,"date":"2020-01-12T05:00:00.000Z","description":"CONSIG LOC CAJER MULTIFUNCIONA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":3000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":98,"date":"2020-01-12T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":99,"date":"2020-01-13T05:00:00.000Z","description":"PAGO INTERBANC MAYRA MARAYA CO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":4670715,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":100,"date":"2020-01-13T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":101,"date":"2020-01-13T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":102,"date":"2020-01-14T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"EL AMPARO","concpt1":null,"concpt2":null,"otro":null,"consignado":6000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":103,"date":"2020-01-14T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":35000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":104,"date":"2020-01-14T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-52,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":105,"date":"2020-01-14T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-51,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":106,"date":"2020-01-14T05:00:00.000Z","description":"CUOTA MANEJO TARJETA DEBITO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-12670,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":107,"date":"2020-01-14T05:00:00.000Z","description":"COMISION CONSIGNACION LOCAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-11000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":108,"date":"2020-01-14T05:00:00.000Z","description":"VALOR IVA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-2090,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":109,"date":"2020-01-15T05:00:00.000Z","description":"CONSIG LOC CAJER MULTIFUNCIONA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1350000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":110,"date":"2020-01-15T05:00:00.000Z","description":"CONSIG LOC CAJER MULTIFUNCIONA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1810000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":111,"date":"2020-01-15T05:00:00.000Z","description":"CONSIG LOC CAJER MULTIFUNCIONA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":3000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":112,"date":"2020-01-15T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"ARJONA","concpt1":null,"concpt2":null,"otro":null,"consignado":8800000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":113,"date":"2020-01-15T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":114,"date":"2020-01-15T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":115,"date":"2020-01-15T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":4701950,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":116,"date":"2020-01-15T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-77132,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":117,"date":"2020-01-15T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-52,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":118,"date":"2020-01-15T05:00:00.000Z","description":"RETIRO SUCURSAL CON TARJETA","lugar":"ARJONA","concpt1":null,"concpt2":null,"otro":null,"consignado":-11283000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":119,"date":"2020-01-15T05:00:00.000Z","description":"PAGO A PROV ANA MILENA SANJULI","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-2000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":120,"date":"2020-01-15T05:00:00.000Z","description":"PAGO A PROV GABRIEL OLIVERA BA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-3000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":121,"date":"2020-01-15T05:00:00.000Z","description":"PAGO A PROV S Y D INVERSIONES","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-3000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":122,"date":"2020-01-15T05:00:00.000Z","description":"COMISION CONSIGNACION LOCAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-11000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":123,"date":"2020-01-15T05:00:00.000Z","description":"VALOR IVA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-2090,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":124,"date":"2020-01-16T05:00:00.000Z","description":"REV COMISION CONSIGNAC LOCAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":22000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":125,"date":"2020-01-16T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"PASEO LA CASTELLA","concpt1":null,"concpt2":null,"otro":null,"consignado":2000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":126,"date":"2020-01-16T05:00:00.000Z","description":"REVERSION VALOR IVA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":4180,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":127,"date":"2020-01-16T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-45376,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":128,"date":"2020-01-16T05:00:00.000Z","description":"PAGO A PROV GEOVANYS SILVA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-1320160,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":129,"date":"2020-01-16T05:00:00.000Z","description":"PAGO A PROV GUSTAVO RIVERA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-8050000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":130,"date":"2020-01-16T05:00:00.000Z","description":"PAGO A PROV S Y D INVERSIONES","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-2000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":131,"date":"2020-01-17T05:00:00.000Z","description":"CONSIG LOC CAJER MULTIFUNCIONA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1200000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":132,"date":"2020-01-17T05:00:00.000Z","description":"COBRO COMISION ACH COLOMBIA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-17850,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":133,"date":"2020-01-17T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-5648,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":134,"date":"2020-01-17T05:00:00.000Z","description":"PAGO PSE SEGUROS DEL ESTADO S","lugar":"ARJONA","concpt1":null,"concpt2":null,"otro":null,"consignado":-390800,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":135,"date":"2020-01-17T05:00:00.000Z","description":"PAGO A PROV ARNOLDO SALCEDO MA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":136,"date":"2020-01-17T05:00:00.000Z","description":"COBRO IVA PAGOS AUTOMATICOS","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-3392,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":137,"date":"2020-01-18T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"PASEO LA CASTELLA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":138,"date":"2020-01-18T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-6080,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":139,"date":"2020-01-18T05:00:00.000Z","description":"PAGO A PROV ILCEBEK GONZALEZ","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-20000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":140,"date":"2020-01-18T05:00:00.000Z","description":"PAGO A PROV MIGUEL PATERNINA J","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-300000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":141,"date":"2020-01-18T05:00:00.000Z","description":"PAGO A PROV COMPULAGO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-1200000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":142,"date":"2020-01-20T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-1835,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":143,"date":"2020-01-20T05:00:00.000Z","description":"PAGO PSE Fiduciaria Corficolo","lugar":"ARJONA","concpt1":null,"concpt2":null,"otro":null,"consignado":-458730,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":144,"date":"2020-01-21T05:00:00.000Z","description":"PAGO DE PROV PROMOTORA MANACA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":10000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":145,"date":"2020-01-21T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-7709,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":146,"date":"2020-01-21T05:00:00.000Z","description":"COMPRA EN EDS LA GIR","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-94831,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":147,"date":"2020-01-21T05:00:00.000Z","description":"PAGO A PROV JULI PALACIO ROBLE","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-1118800,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":148,"date":"2020-01-21T05:00:00.000Z","description":"PAGO A PROV PEDRO ROMERO RINCO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-713600,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":149,"date":"2020-01-22T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":2626000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":150,"date":"2020-01-22T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":151,"date":"2020-01-22T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-20000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":152,"date":"2020-01-22T05:00:00.000Z","description":"PAGO A PROV JUANA TERESA BRAY","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-5000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":153,"date":"2020-01-23T05:00:00.000Z","description":"CONSIGNACION CORRESPONSAL CB","lugar":"CANAL CORRESPONSA","concpt1":null,"concpt2":null,"otro":null,"consignado":500000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":154,"date":"2020-01-23T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":500000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":155,"date":"2020-01-23T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-36966,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":156,"date":"2020-01-23T05:00:00.000Z","description":"PAGO A PROV S Y D INVERSIONES","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-500000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":157,"date":"2020-01-23T05:00:00.000Z","description":"PAGO A PROV ILCEBEK GONZALEZ","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-8741600,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":158,"date":"2020-01-24T05:00:00.000Z","description":"CONSIGNACION LOCAL EFECTIVO","lugar":"SANTA LUCIA","concpt1":null,"concpt2":null,"otro":null,"consignado":5242000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":159,"date":"2020-01-24T05:00:00.000Z","description":"4XMIL GRAVAMEN MVTO FINANCIERO","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-231,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":160,"date":"2020-01-24T05:00:00.000Z","description":"CUOTA MANEJO SUC VIRT EMPRESA","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-48440,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":161,"date":"2020-01-24T05:00:00.000Z","description":"IVA CUOTA MANEJO SUC VIRT EMP","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":-9203,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":162,"date":"2020-01-25T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":1000000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":163,"date":"2020-01-25T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":500000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":164,"date":"2020-01-25T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC VIRTUAL","lugar":null,"concpt1":null,"concpt2":null,"otro":null,"consignado":500000,"xcdnt":0,"ids":null,"fech":null,"monto":null,"concepto":null,"nombre":null,"proyect":null,"mz":null,"n":null,"excdnt":null,"xtrabank":null,"pagos":null},{"id":165,"date":"2020-01-25T05:00:00.000Z","description":"TRANSFERENCIA CTA SUC
  let e = solicitudes.map(x => {
    return [x.id, x.data, x.description];
  });
  //res.json(e);
  res.send(e);
});

////////////////////* PRODUCTOS */////////////////////
router.get('/productos', isLoggedIn, async (req, res) => {
  res.render('links/productos');
});

router.post('/productos', isLoggedIn, async (req, res) => {
  const pdo = await usuario(req.user, req.user.pin);
  const params = pdo ? `AND p.id IN(${pdo})` : '';
  const fila = await pool.query(
    'SELECT * FROM productos p WHERE p.estados NOT IN(15, 16) ' + params
  );
  respuesta = { data: fila };
  res.send(respuesta);
});

router.post('/products/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const fi = await pool.query(
    'SELECT l.*, p.maxfnc, p.maxini FROM productosd l INNER JOIN productos p ON l.producto = p.id WHERE l.estado = 9 AND l.producto = ?',
    id
  );
  respuesta = { data: fi };
  res.send(respuesta);
});

router.post('/productos/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (id === 'eliminar') {
    const { id } = req.body;
    await pool.query('DELETE FROM productosd WHERE producto = ?', id);
    await pool.query('DELETE FROM productos WHERE id = ?', id);
    res.send(true);
  } else if (id === 'editar') {
    const { id } = req.body;
    await pool.query(`UPDATE productosd l INNER JOIN productos d ON l.producto  = d.id 
        LEFT JOIN preventa p ON p.lote = l.id SET l.valor = CASE WHEN p.id IS NOT NULL THEN p.vrmt2 * l.mtr2 
        WHEN d.valmtr2 > 0 THEN d.valmtr2 * l.mtr2 ELSE l.mtr * l.mtr2 END, l.inicial = CASE WHEN p.id IS NOT NULL 
        THEN (p.vrmt2 * l.mtr2) * p.iniciar / 100 WHEN d.valmtr2 > 0 THEN (d.valmtr2 * l.mtr2) * d.porcentage / 100 
        ELSE (l.mtr * l.mtr2) * d.porcentage / 100 END, l.mtr = CASE WHEN p.id IS NOT NULL THEN p.vrmt2 
        WHEN d.valmtr2 > 0 THEN d.valmtr2 ELSE l.mtr END, l.estado = CASE WHEN p.id IS NOT NULL THEN l.estado
        WHEN l.estado NOT IN(9, 15, 16) THEN 15 ELSE l.estado END WHERE l.producto = ${id} AND p.tipobsevacion IS NULL`);

    await pool.query(`UPDATE productosd l INNER JOIN productos d ON l.producto  = d.id 
        INNER JOIN preventa p ON p.lote = l.id SET l.valor = CASE WHEN d.valmtr2 > 0 THEN d.valmtr2 * l.mtr2 
        ELSE l.mtr * l.mtr2 END, l.inicial = CASE WHEN d.valmtr2 > 0 THEN (d.valmtr2 * l.mtr2) * d.porcentage / 100 
        ELSE (l.mtr * l.mtr2) * d.porcentage / 100 END, l.mtr = CASE WHEN d.valmtr2 > 0 THEN d.valmtr2 ELSE l.mtr END 
        WHERE l.producto = ${id} AND p.tipobsevacion IS NOT NULL AND l.estado IN(9, 15)`);

    const fila = await pool.query('SELECT * FROM productos WHERE id = ?', id);
    res.send(fila[0]);
  } else if (id === 'nuevo') {
    const { producto, mz, n, mtr2, estado, valor, inicial, descripcion } = req.body;
    const nuevo = {
      producto,
      mz: mz ? mz.toUpperCase() : 'no',
      n,
      mtr2,
      estado,
      valor,
      inicial,
      descripcion
    };
    const fila = await pool.query('INSERT INTO productosd SET ? ', nuevo);
    await pool.query(`UPDATE productos SET cantidad = cantidad + 1 WHERE id = ${producto}`);
    res.send(true);
  } else if (id === 'emili') {
    const { id, prod } = req.body;
    await pool.query('DELETE FROM productosd WHERE id = ?', id);
    await pool.query(`UPDATE productos SET cantidad = cantidad - 1 WHERE id = ${prod}`);
    res.send(true);
  } else if (id === 'update') {
    const {
      alterable,
      editar,
      categoria,
      title,
      totalmtr2,
      separacion,
      incentivo,
      mzs,
      lts,
      porcentage,
      fecha,
      fechafin,
      comision,
      maxcomis,
      linea1,
      linea2,
      linea3,
      idlote,
      mtr,
      mz,
      n,
      mtr2,
      estado,
      valor,
      inicial,
      descripcion,
      valorproyect
    } = req.body;

    if (idlote === undefined) {
      const produc = {
        categoria,
        proyect: title.toUpperCase(),
        porcentage,
        totalmtr2,
        valproyect: valorproyect,
        mzs,
        cantidad: lts,
        estados: 7,
        fechaini: fecha,
        fechafin,
        separaciones: separacion.length > 3 ? separacion.replace(/\./g, '') : separacion,
        incentivo: incentivo.length > 3 ? incentivo.replace(/\./g, '') : 0,
        comision,
        maxcomis,
        linea1,
        linea2,
        linea3
      };
      await pool.query('UPDATE productos SET ? WHERE id = ?', [produc, editar]);
      await pool.query(`UPDATE productosd l INNER JOIN productos d ON l.producto  = d.id 
            LEFT JOIN preventa p ON p.lote = l.id SET l.valor = CASE WHEN p.id IS NOT NULL THEN p.vrmt2 * l.mtr2 
            WHEN d.valmtr2 > 0 THEN d.valmtr2 * l.mtr2 ELSE l.mtr * l.mtr2 END, l.inicial = CASE WHEN p.id IS NOT NULL 
            THEN (p.vrmt2 * l.mtr2) * p.iniciar / 100 WHEN d.valmtr2 > 0 THEN (d.valmtr2 * l.mtr2) * d.porcentage / 100 
            ELSE (l.mtr * l.mtr2) * d.porcentage / 100 END, l.mtr = CASE WHEN p.id IS NOT NULL THEN p.vrmt2 
            WHEN d.valmtr2 > 0 THEN d.valmtr2 ELSE l.mtr END WHERE l.producto = ${editar} AND p.tipobsevacion IS NULL`);

      res.send(true);
    } else {
      await pool.query(
        `UPDATE productosd l INNER JOIN productos p ON l.producto = p.id 
            SET ? WHERE l.id = ?`,
        [
          {
            'l.mz': mz,
            'l.n': n,
            'l.mtr': mtr.replace(/\./g, ''),
            'l.mtr2': mtr2,
            'l.estado': estado,
            'l.valor': valor,
            'l.inicial': inicial,
            'l.descripcion': descripcion,
            'p.categoria': categoria,
            'p.proyect': title.toUpperCase(),
            'p.porcentage': porcentage,
            'p.totalmtr2': totalmtr2,
            'p.valproyect': valorproyect,
            'p.mzs': mzs,
            'p.cantidad': lts,
            'p.estados': 7,
            'p.fechaini': fecha,
            'p.fechafin': fechafin,
            'p.separaciones': separacion.length > 3 ? separacion.replace(/\./g, '') : separacion,
            'p.incentivo': incentivo.length > 3 ? incentivo.replace(/\./g, '') : 0,
            'p.comision': comision,
            'p.maxcomis': maxcomis,
            'p.linea1': linea1,
            'p.linea2': linea2,
            'p.linea3': linea3,
            'l.ediitado': req.user.fullname
          },
          idlote
        ]
      );
      res.send(true);
    }
  } else {
    const fi = await pool.query('SELECT * FROM productosd WHERE estado != 16 AND producto = ?', id);
    respuesta = { data: fi };
    res.send(respuesta);
  }
});

router.put('/produc/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;
  await pool.query(`UPDATE productosd pd INNER JOIN productos p ON pd.producto = p.id 
    SET pd.inicial = pd.valor * ${valor} /100, p.porcentage = ${valor} 
    WHERE pd.producto = ${id} AND pd.estado = 9`);
  res.send(true);
});

router.put('/productos/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { valor } = req.body;
  await pool.query(`UPDATE productosd pd INNER JOIN productos p ON pd.producto = p.id 
    SET pd.valor = pd.mtr2 * ${valor}, pd.inicial = (pd.mtr2 * ${valor}) * p.porcentage /100, p.valmtr2 = ${valor}, 
    p.valproyect = p.totalmtr2 * ${valor}, pd.mtr = ${valor} WHERE pd.producto = ${id} AND pd.estado IN(9, 15)`);
  res.send(respuesta);
});

router.post('/regispro', isLoggedIn, async (req, res) => {
  const {
    categoria,
    title,
    porcentage,
    totalmtr2,
    valmtr2,
    valproyect,
    mzs,
    lts,
    std,
    mz,
    n,
    mtr2,
    vrlt,
    vri,
    vmtr2,
    separacion,
    incentivo,
    fecha,
    fechafin,
    descripcion,
    comision,
    maxcomis,
    linea1,
    linea2,
    linea3
  } = req.body;
  const produc = {
    //mzs cantidad
    categoria,
    proyect: title.toUpperCase(),
    porcentage,
    totalmtr2,
    valmtr2: valmtr2.length > 3 ? valmtr2.replace(/\./g, '') : valmtr2,
    valproyect,
    mzs,
    cantidad: lts,
    estados: 7,
    fechaini: fecha,
    fechafin,
    separaciones: separacion.length > 3 ? separacion.replace(/\./g, '') : separacion,
    incentivo: incentivo.length > 3 ? incentivo.replace(/\./g, '') : 0,
    comision,
    maxcomis,
    linea1,
    linea2,
    linea3
  };
  console.log(req.body, produc);
  const datos = await pool.query('INSERT INTO productos SET ? ', produc);
  var producdata =
    'INSERT INTO productosd (producto, mz, n, mtr2, descripcion, estado, mtr, valor, inicial) VALUES ';
  if (Array.isArray(n)) {
    await n.map((t, i) => {
      producdata += `(${datos.insertId}, '${mz[i]}', ${t}, ${mtr2[i]}, '${descripcion[i]}', ${
        std[i]
      }, ${vmtr2[i].replace(/\./g, '')}, ${vrlt[i].replace(/\./g, '')}, ${vri[i].replace(
        /\./g,
        ''
      )}),`;
    });
  } else {
    producdata += `(${
      datos.insertId
    }, '${mz}', ${n}, ${mtr2}, '${descripcion}', ${std}, ${vmtr2.replace(
      /\./g,
      ''
    )}, ${vrlt.replace(/\./g, '')}, ${vri.replace(/\./g, '')}),`;
  }
  await pool.query(producdata.slice(0, -1));
  req.flash('success', 'Producto registrado exitosamente');
  res.redirect('/links/productos');
});

router.post('/regisubpro', async (req, res) => {
  pool.query('INSERT INTO productosd SET ? ', req.body);
  res.send(true);
});

router.post('/excelprod', async (req, res) => {
  const pro = await pool.query(`SELECT * FROM productos`);
  let e = pro.map(x => {
    return x.id + '-' + x.proyect;
  });
  //res.json(e);
  res.send(e);
});

router.get('/excelformato', async (req, res) => {
  //res.redirect('/uploads/Libro de ejemplo.xlsx')
  res.send('/uploads/Libro de ejemplo.xlsx');

  const { k, h, proyecto, nombre, mz, n } = req.body;
  const ruta = path.join(__dirname, '../public/uploads/CUOTAS.xlsx');

  fs.exists(ruta, function (exists) {
    console.log('Archivo ' + exists, ' ruta ' + ruta, ' html ' + req.headers.origin);
    if (exists) {
      fs.unlink(ruta, function (err) {
        if (err) console.log(err);
        console.log('Archivo eliminado');
        return 'Archivo eliminado';
      });
    } else {
      console.log('El archivo no exise');
      return 'El archivo no exise';
    }
  });

  /* `SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, s.descp, s.lt, s.orden, c.id, c.separacion, c.tipo, c.ncuota, c.fechs, c.estado, c.mora, c.diasmora FROM solicitudes s INNER JOIN cuotas c ON c.separacion = s.orden WHERE c.separacion = 46 AND s.concepto IN('PAGO', 'ABONO') 
    GROUP BY s.ids, c.id 
    ORDER BY c.fechs, s.fech;` */

  let content = await pool.query(
    `SELECT c.id ID, c.fechs FECHA, c.tipo TIPO, c.ncuota N, c.proyeccion CUOTA, 
        MAX(CASE WHEN MONTH(s.fech) = MONTH(c.fechs) AND YEAR(s.fech) = YEAR(c.fechs) THEN s.fech END) FECHAPAGO, 
        SUM(CASE WHEN MONTH(s.fech) = MONTH(c.fechs) AND YEAR(s.fech) = YEAR(c.fechs) THEN s.monto END) MONTO,
        MAX(CASE WHEN MONTH(s.fech) = MONTH(c.fechs) AND YEAR(s.fech) = YEAR(c.fechs) THEN s.ids END) IDS, 
        c.cuota CUOT, e.estado ESTADO, c.diasmora DIASMORA, i.teano TEA, c.mora MORA, c.descuentomora DTO, 
        c.totaldiasmora TOTALDIASM, c.totalmora TOTALMORA
        FROM cuotas c INNER JOIN solicitudes s ON s.orden = c.separacion 
        INNER JOIN estados e ON c.estado = e.id LEFT JOIN intereses i ON c.tasa = i.id
        WHERE c.separacion = 46 AND s.concepto IN('PAGO', 'ABONO')
        GROUP BY c.id
        ORDER BY c.fechs`,
    k
  );

  let newWB = XLSX.utils.book_new();
  let newWS = XLSX.utils.json_to_sheet([
    { Orden: k, Fecha: h, Proyecto: proyecto, Mz: mz, Lt: n, Cliente: nombre }
  ]);
  let Ws = await Object.assign(newWS, {
    A4: {
      t: 's',
      v: 'ID',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    B4: {
      t: 's',
      v: 'FECHA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    C4: {
      t: 's',
      v: 'TIPO',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    D4: {
      t: 's',
      v: 'N',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    E4: {
      t: 's',
      v: 'CUOTA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    F4: {
      t: 's',
      v: 'FECHAPAGO',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    G4: {
      t: 's',
      v: 'MONTO',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    H4: {
      t: 's',
      v: 'IDS',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    I4: {
      t: 's',
      v: 'CUOT',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    J4: {
      t: 's',
      v: 'ESTADO',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    K4: {
      t: 's',
      v: 'DIASM',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    L4: {
      t: 's',
      v: 'TEA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    M4: {
      t: 's',
      v: 'MORA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    N4: {
      t: 's',
      v: 'DTO',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    O4: {
      t: 's',
      v: 'TLDIASM',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    },
    P4: {
      t: 's',
      v: 'TOTALMORA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          //sz: 24,
          bold: true,
          color: { rgb: 'FFFFAA00' }
          /* underline: true, // Subrayado
                    italic: true,
                    strike: true, // Tachado
                    outline: false,
                    shadow: false, */
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    }
  });
  Ws['A1'].s = {
    // Establecer un estilo separado para una celda
    font: {
      name: 'MV Boli',
      bold: true,
      color: { rgb: 'FFFFAA00' }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { bgColor: { rgb: 'ffff00' } }
  };
  Ws['B1'].s = {
    // Establecer un estilo separado para una celda
    font: {
      name: 'MV Boli',
      bold: true,
      color: { rgb: 'FFFFAA00' }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { bgColor: { rgb: 'ffff00' } }
  };
  Ws['C1'].s = {
    // Establecer un estilo separado para una celda
    font: {
      name: 'MV Boli',
      bold: true,
      color: { rgb: 'FFFFAA00' }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { bgColor: { rgb: 'ffff00' } }
  };
  Ws['D1'].s = {
    // Establecer un estilo separado para una celda
    font: {
      name: 'MV Boli',
      bold: true,
      color: { rgb: 'FFFFAA00' }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { bgColor: { rgb: 'ffff00' } }
  };
  Ws['E1'].s = {
    // Establecer un estilo separado para una celda
    font: {
      name: 'MV Boli',
      bold: true,
      color: { rgb: 'FFFFAA00' }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { bgColor: { rgb: 'ffff00' } }
  };
  Ws['F1'].s = {
    // Establecer un estilo separado para una celda
    font: {
      name: 'MV Boli',
      bold: true,
      color: { rgb: 'FFFFAA00' }
    },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
    fill: { bgColor: { rgb: 'ffff00' } }
  };

  let cont = 5;
  await content.map(e => {
    Ws['A' + cont] = { t: 'n', v: e.ID };
    Ws['B' + cont] = { t: 's', v: e.FECHA };
    Ws['C' + cont] = { t: 's', v: e.TIPO };
    Ws['D' + cont] = { t: 'n', v: e.N };
    Ws['E' + cont] = { t: 'n', v: e.CUOTA, z: '$#,##0.00' };
    Ws['F' + cont] = { t: 's', v: e.FECHAPAGO ? e.FECHAPAGO : '' };
    Ws['G' + cont] = { t: 'n', v: e.MONTO ? e.MONTO : 0, z: '$#,##0.00' };
    Ws['H' + cont] = { t: 'n', v: e.IDS ? e.IDS : 0 };
    Ws['I' + cont] = { t: 'n', v: e.CUOT, z: '$#,##0.00' };
    Ws['J' + cont] = { t: 's', v: e.ESTADO };
    Ws['K' + cont] = { t: 'n', v: e.DIASMORA };
    Ws['L' + cont] = { t: 'n', v: e.TEA ? e.TEA : 0, z: '0.00%' };
    Ws['M' + cont] = { t: 'n', v: e.MORA ? e.MORA : 0, z: '$#,##0.00' };
    Ws['N' + cont] = { t: 'n', v: e.DTO, z: '0.00%' };
    Ws['O' + cont] = { t: 'n', v: e.TOTALDIASM, z: '0%' };
    Ws['P' + cont] = { t: 'n', v: e.TOTALMORA, z: '$#,##0.00' };
    cont++;
  });
  Ws['A' + cont] = {
    t: 's',
    v: '.',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['B' + cont] = {
    t: 's',
    v: '.',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['C' + cont] = {
    t: 's',
    v: '.',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['D' + cont] = {
    t: 's',
    v: 'TOTAL',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['E' + cont] = {
    t: 'n',
    f: `SUM(E5:E${cont - 1})`,
    z: '$#,##0.00',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['F' + cont] = {
    t: 's',
    v: 'ABONADO',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['G' + cont] = {
    t: 'n',
    f: `SUM(G5:G${cont - 1})`,
    z: '$#,##0.00',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['H' + cont] = {
    t: 's',
    v: 'DEUDA',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['I' + cont] = {
    t: 'n',
    f: `SUM(I5:I${cont - 1})`,
    z: '$#,##0.00',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['J' + cont] = {
    t: 's',
    v: 'DIAS',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['K' + cont] = {
    t: 'n',
    f: `SUM(K5:K${cont - 1})`,
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['L' + cont] = {
    t: 's',
    v: 'MORA',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['M' + cont] = {
    t: 'n',
    f: `SUM(M5:M${cont - 1})`,
    z: '$#,##0.00',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['N' + cont] = {
    t: 's',
    v: '.',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['O' + cont] = {
    t: 's',
    v: 'TOTALMORA',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['P' + cont] = {
    t: 'n',
    f: `SUM(P5:P${cont - 1})`,
    z: '$#,##0.00',
    s: {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    }
  };
  Ws['!ref'] = 'A1:P' + cont;
  //XLSX.utils.book_append_sheet(newWB, newWS, 'FINANCIACION');
  //XLSX.writeFile(newWB, ruta)
  //res.send('/uploads/CUOTAS.xlsx');
});

router.post('/excelcrearproducto', async (req, res) => {
  //console.log(req.files)
  const fil = req.files[0];
  let resp = {};
  let subProductos = null;

  /* const ruta = path.join(__dirname, '../public/uploads/libroej.json');
    const ruta2 = path.join(__dirname, '../public/uploads/CREACION DE PRODUCTOS.xlsx'); */

  const excel = XLSX.readFile(fil.path);
  const hojas = excel.SheetNames;
  const productos = hojas[1];
  const proyecto = hojas[2];

  const proyectoJson = await XLSX.utils.sheet_to_json(excel.Sheets[proyecto]);
  const productosJson = await XLSX.utils.sheet_to_json(excel.Sheets[productos]);

  if (!proyectoJson[0].id) {
    delete proyectoJson[0].id;
    proyectoJson[0] = {
      ...proyectoJson[0],
      porcentage: proyectoJson[0].porcentage * 100,
      fechaini: new Date((proyectoJson[0].fechaini - (25567 + 2)) * 86400 * 1000),
      fechafin: new Date((proyectoJson[0].fechafin - (25567 + 2)) * 86400 * 1000),
      totalmtr2: proyectoJson[0]?.totalmtr2 || 0,
      linea1: proyectoJson[0]?.linea1 || 0,
      linea2: proyectoJson[0]?.linea2 || 0,
      linea3: proyectoJson[0]?.linea3 || 0
    };
    console.log(proyectoJson);
    const proyectoAdd = await pool.query('INSERT INTO productos SET ? ', proyectoJson);

    subProductos = await productosJson
      .filter(e => e.n)
      .map(e => {
        const r = [
          e.mz ? e.mz : 'no',
          e.n,
          !e.mtr2 ? 0 : e.mtr2.replace(',', '.') * 1,
          !e.mtr ? 0 : e.mtr,
          !e.valor ? 0 : e.valor,
          !e.inicial ? 0 : e.inicial,
          e.estado,
          proyectoAdd.insertId,
          e.descripcion
        ];
        return r;
      });
    console.log(subProductos);
    await pool.query(
      `INSERT INTO productosd
    (mz, n, mtr2, mtr, valor, inicial, estado, producto, descripcion) VALUES ?`,
      [subProductos]
    );
    resp = { res: true, msg: 'El producto fue creado con exito.' };
  } else {
    const prood = proyectoJson[0].id;
    subProductos = await productosJson
      .filter(e => e.n)
      .map(e => {
        const r = [
          e.mz ? e.mz : 'no',
          e.n,
          !e.mtr2 ? 0 : e.mtr2,
          !e.mtr ? 0 : e.mtr,
          !e.valor ? 0 : e.valor,
          !e.inicial ? 0 : e.inicial,
          e.estado,
          prood,
          e.descripcion
        ];
        return r;
      });
    await pool.query(
      `INSERT INTO productosd
    (mz, n, mtr2, mtr, valor, inicial, estado, producto, descripcion) VALUES ?`,
      [subProductos]
    );
    resp = { res: true, msg: 'Los lotes del producto fueron agregados con exito.' };
  }
  fs.exists(fil.path, function (exists) {
    if (exists) {
      fs.unlink(fil.path, function (err) {
        if (err) console.log(err);
        //console.log('Archivo eliminado');
        return true;
      });
    } else {
      //resp.msg += '\nEl archivo no se elimino por que no exise';
      //console.log('El archivo no exise');
      return false;
    }
  });
  //console.log('quien va primero')
  res.send(resp);
});

/////////////////////* RED *////////////////////////
router.get('/red', noExterno, async (req, res) => {
  res.render('links/red');
});

router.post('/red', noExterno, async (req, res) => {
  /*SELECT p.acreedor , p.usuario, p1.acreedor, p1.usuario, p2.acreedor, p2.usuario 
    FROM pines p LEFT JOIN pines p1 ON p.usuario = p1.acreedor LEFT JOIN pines p2 ON p1.usuario = p2.acreedor;*/

  const red = await pool.query(`SELECT u.fullname, u.nrango, u1.fullname nombre1, 
  u1.nrango rango1, u2.fullname nombre2, u2.nrango rango2, u3.fullname nombre3, 
  u3.nrango rango3 FROM pines p LEFT JOIN users u ON u.pin = p.id 
  LEFT JOIN pines p1 ON p1.usuario = u.id LEFT JOIN users u1 ON u1.pin = p1.id 
  LEFT JOIN pines p2 ON p2.usuario = u1.id LEFT JOIN users u2 ON u2.pin = p2.id 
  LEFT JOIN pines p3 ON p3.usuario = u2.id LEFT JOIN users u3 ON u3.pin = p3.id 
  ${req.user.admin != 1 ? 'WHERE u.id = ' + req.user.id : 'WHERE u.id is NOT NULL'} 
  ORDER BY u.fullname, nombre1, nombre2, nombre3`);
  respuesta = { data: red };
  res.send(respuesta);
});

router.post('/reds', noExterno, async (req, res) => {
  if (req.user.admin == 1) {
    const red = await pool.query(`SELECT u.*, r.*, p.acreedor , p.usuario idpapa, 
        up.fullname namepapa, rp.rango rangopapa, p1.usuario idabuelo, ua.fullname nameabuelo, 
        ra.rango rangoabuelo, p2.usuario idbisabuelo, ub.fullname namebisabuelo, rb.rango rangobisabuelo          
        FROM pines p LEFT JOIN pines p1 ON p1.acreedor = p.usuario LEFT JOIN pines p2 ON p2.acreedor = p1.usuario        
        INNER JOIN users u ON u.id = p.acreedor INNER JOIN rangos r ON r.id = u.nrango        
        LEFT JOIN users up ON up.id = p.usuario LEFT JOIN rangos rp ON rp.id = up.nrango        
        LEFT JOIN users ua ON ua.id = p1.usuario LEFT JOIN rangos ra ON ra.id = ua.nrango        
        LEFT JOIN users ub ON ub.id = p2.usuario LEFT JOIN rangos rb ON rb.id = ub.nrango
        ORDER BY u.fullname`);
    /*const red = await pool.query(`SELECT * FROM users u 
            INNER JOIN rangos r ON u.nrango = r.id`);*/
    respuesta = { data: red };
    res.send(respuesta);
  }
});

router.put('/red', noExterno, async (req, res) => {
  if (req.user.admin == 1) {
    const { S, U, F } = req.body;
    console.log(S, U, F);
    if (!S) {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [
        { nrango: U == 0 ? 5 : 7, sucursal: U == 0 ? null : U },
        F
      ]);
    } else {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [{ nrango: U }, F]);
    }
    res.send(true);
  }
});

router.put('/reds', noExterno, async (req, res) => {
  if (req.user.admin == 1) {
    const { S, U, F } = req.body;
    console.log(S, U, F);
    if (!S) {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [
        { nrango: U == 0 ? 5 : 7, sucursal: U == 0 ? null : U },
        F
      ]);
    } else {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [{ nrango: U }, F]);
    }
    res.send(true);
  }
});

/////////////////////* ASESORES *////////////////////////
router.get('/asesores', noExterno, async (req, res) => {
  res.render('links/asesores');
});

router.post('/asesores', noExterno, async (req, res) => {
  if (req.user.subadmin == 1) {
    const red = await pool.query(`SELECT u.id, u.pin, u.fullname, u.document, u.cel, u.username, 
    u.password, u.cli, u.sucursal, u.bonoextra, p.fecha, p.fechactivacion, p.celular, p.admin, 
    p.subadmin, p.contador, p.financiero, p.auxicontbl, p.asistente, p.externo FROM users u 
    INNER JOIN pines p ON u.pin = p.id ORDER BY u.fullname`);
    respuesta = { data: red };
    res.send(respuesta);
  }
});

router.post('/asesores/:accion', noExterno, async (req, res) => {
  if (req.user.subadmin == 1) {
    const { accion } = req.params;
    if (accion === 'generarcomision') {
      const { id, user, producto, comi } = req.body;
      console.log(id, user, producto, comi);
      const data = { asesor: user, producto, comision: parseFloat(comi) / 100 };
      if (!id) await pool.query('INSERT INTO comisiones SET ? ', data);
      else await pool.query(`UPDATE comisiones SET ? WHERE id = ?`, [data, id]);
    } else if (accion === 'actualizaruser') {
      const { id } = req.body;
      const data = {};
      if (req.body.fullname) data['u.fullname'] = req.body.fullname.toUpperCase();
      if (req.body.document) data['u.document'] = req.body.document;
      if (req.body.cel) data['u.cel'] = req.body.cel;
      if (req.body.username) data['u.username'] = req.body.username;
      if (req.body.admin) data['p.admin'] = req.body.admin == 0 ? null : 1;
      if (req.body.subadmin) data['p.subadmin'] = req.body.subadmin == 0 ? null : 1;
      if (req.body.contador) data['p.contador'] = req.body.contador == 0 ? null : 1;
      if (req.body.financiero) data['p.financiero'] = req.body.financiero == 0 ? null : 1;
      if (req.body.auxicontbl) data['p.auxicontbl'] = req.body.auxicontbl == 0 ? null : 1;
      if (req.body.asistente) data['p.asistente'] = req.body.asistente == 0 ? null : 1;
      if (req.body.externo) data['p.externo'] = req.body.externo == 0 ? null : 1;
      if (req.body.newpass) data['u.password'] = await helpers.encryptPassword(req.body.newpass);
      const sql = `UPDATE users u INNER JOIN pines p ON u.pin = p.id SET ? WHERE u.id = ?`;
      await pool.query(sql, [data, id]);
    }
    res.send(true);
  }
});

router.post('/asignarcomiproductos/:user', noExterno, async (req, res) => {
  if (req.user.subadmin == 1) {
    const { user } = req.params;
    const productos = await pool.query(`SELECT  p.id producto, p.proyect, p.maxcomis, c.id, 
    c.asesor, c.comision, c.date FROM productos p LEFT JOIN comisiones c ON c.producto = p.id 
    AND c.asesor = ${user == 0 ? 1 : user} ORDER BY p.id`);
    respuesta = { data: productos };
    res.send(respuesta);
  }
});

router.put('/red', noExterno, async (req, res) => {
  if (req.user.admin == 1) {
    const { S, U, F } = req.body;
    console.log(S, U, F);
    if (!S) {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [
        { nrango: U == 0 ? 5 : 7, sucursal: U == 0 ? null : U },
        F
      ]);
    } else {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [{ nrango: U }, F]);
    }
    res.send(true);
  }
});

router.put('/reds', noExterno, async (req, res) => {
  if (req.user.admin == 1) {
    const { S, U, F } = req.body;
    console.log(S, U, F);
    if (!S) {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [
        { nrango: U == 0 ? 5 : 7, sucursal: U == 0 ? null : U },
        F
      ]);
    } else {
      await pool.query(`UPDATE users SET ? WHERE pin = ?`, [{ nrango: U }, F]);
    }
    res.send(true);
  }
});

///////////////////* PREVENTAS *///////////////////////////
router.get('/preventas', noExterno, (req, res) => {
  res.render('links/preventas');
});

router.post('/preventas', noExterno, async (req, res) => {
  let { id, date, type, doc, name, adreess, phone, comercio, articles } = req.body;
  comercio = comercio.toUpperCase();
  const agente = req.user.fullname;

  if (id) {
    await pool.query('UPDATE preventas SET ? WHERE id = ?', [
      { date, type, doc, name, adreess, phone, comercio, articles, agente },
      id
    ]);
    return res.send({ code: true });
  }

  const newPreventa = await pool.query('INSERT INTO preventas SET ? ', [
    { date, type, doc, name, adreess, phone, comercio, articles, agente }
  ]);

  res.send({ code: newPreventa.insertId });
});

router.post('/comercios/table', noExterno, async (req, res) => {
  const comercios = await pool.query(`SELECT * FROM preventas`);
  respuesta = { data: comercios };
  res.send(respuesta);
});

///////////////////* PASTILLEROS *///////////////////////////
router.get('/pastilleros', noExterno, (req, res) => {
  res.render('links/pastilleros');
});

router.post('/listadeprecio', noExterno, async (req, res) => {
  await Lista();
  res.send(`/uploads/listaprecio.pdf`);
});

router.post('/medicamentos/table2', noExterno, async (req, res) => {
  const productos = await pool.query(`SELECT * FROM medicamentos`);
  respuesta = { data: productos };
  res.send(respuesta);
});

router.post('/medicamentos/table', noExterno, async (req, res) => {
  const medicamentos = await pool.query(
    `SELECT m.*, 
    (SELECT precioVenta FROM compras k WHERE k.droga = m.id ORDER BY k.id DESC LIMIT 1) precio,
    COALESCE((SELECT SUM(c.cantidad) FROM compras c WHERE c.droga = m.id), 0) - 
    COALESCE((SELECT SUM(v.cantidad) FROM ventas v WHERE v.producto = m.id), 0) stock   
    FROM medicamentos m`
  );
  respuesta = { data: medicamentos };
  res.send(respuesta);
});

router.post('/medicamentos', isLoggedIn, async (req, res) => {
  const { id, nombre, laboratorio, clase, invima } = req.body;
  const data = {
    nombre: nombre.toUpperCase(),
    laboratorio: laboratorio.toUpperCase(),
    clase,
    invima
  };

  if (id) {
    await pool.query('UPDATE medicamentos SET ? WHERE id = ?', [data, id]);
    return res.send({ code: true });
  }

  const newProduct = await pool.query('INSERT INTO medicamentos SET ? ', data);
  res.send({ code: newProduct.insertId });
});

router.delete('/medicamentos/:id', noExterno, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM medicamentos WHERE id = ?`, id);
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

router.post('/compras/table', noExterno, async (req, res) => {
  const compras = await pool.query(
    `SELECT c.*, m.nombre, m.laboratorio, m.clase FROM compras c INNER JOIN medicamentos m ON c.droga = m.id `
  );
  respuesta = { data: compras };
  res.send(respuesta);
});

router.post('/compras', isLoggedIn, async (req, res) => {
  const { id } = req.body;
  const compra = req.body;

  delete compra.id;
  console.log(compra, id, 'id que se actualizara');
  if (id) {
    await pool.query('UPDATE compras SET ? WHERE id = ?', [compra, id]);
    return res.send({ code: true });
  }
  const newCompra = await pool.query('INSERT INTO compras SET ? ', compra);
  res.send({ code: newCompra.insertId });
});

router.delete('/compras/:id', noExterno, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM compras WHERE id = ?`, id);
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

router.post('/consult', isLoggedIn, async (req, res) => {
  const { type, num } = req.body;

  const [data] = await pool.query(
    `SELECT * FROM facturas WHERE type = ? AND doc = ? ORDER BY id DESC LIMIT 1`,
    [type, num]
  );

  if (data) {
    const { name, phone, adreess } = data;
    return res.json({ name, phone, adreess });
  }
  if (type === 'CC') return res.json(await consultDocument(num));
  return res.json(await consultCompany(num));
});

router.post('/facturas/table', noExterno, async (req, res) => {
  const facturas = await pool.query(
    `SELECT f.*, SUM(IF(r.id, r.monto, 0)) abono FROM facturas f LEFT JOIN recibos r ON r.factura = f.id GROUP BY f.id`
  );
  respuesta = { data: facturas };
  res.send(respuesta);
});

router.delete('/facturas/:id', noExterno, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM facturas WHERE id = ?`, id);
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

router.post('/generarfactura', isLoggedIn, async (req, res) => {
  const factura = req.body;

  const { insertId } = await pool.query('INSERT INTO facturas SET ? ', factura);
  const articles = JSON.parse(factura.articles).map(e => [...e, insertId]);

  pool.query(
    `INSERT INTO ventas (producto, name, expiry, cantidad, precio, total, factura) VALUES ?`,
    [articles]
  );

  const ruta = await Facturar(insertId);

  res.send(ruta);
});

///////////////////* CLIENTES *///////////////////////////
router.get('/clientes', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render('links/clientes');
});

router.post('/clientes', isLoggedIn, async (req, res) => {
  //console.log(req.user)
  const cliente = await pool.query(`SELECT * FROM clientes c 
    LEFT JOIN users u ON c.acsor = u.id     
    ${
      req.user.externo
        ? 'WHERE c.acsor = ' + req.user.id
        : req.user.asistente
        ? ''
        : 'WHERE c.acsor = ' + req.user.id
    }`);
  respuesta = { data: cliente };
  res.send(respuesta);
});

router.put('/clientes/:id', isLoggedIn, async (req, res) => {
  const {
    ahora,
    nombres,
    documento,
    lugarexpedicion,
    fechaexpedicion,
    tipo,
    fechanacimiento,
    estadocivil,
    email,
    movil,
    direccion,
    asesors,
    id
  } = req.body;
  var imagenes = '';
  req.files.map(e => {
    imagenes += `/uploads/${e.filename},`;
  });
  var indic = movil.indexOf(' ');
  var movl = indic != -1 ? movil.replace(/-/g, '') : '57 ' + movil.replace(/-/g, '');

  const clit = {
    nombre: nombres.toUpperCase(),
    documento: documento.replace(/\./g, ''),
    fechanacimiento,
    lugarexpedicion,
    fechaexpedicion,
    estadocivil,
    movil: movl,
    agendado: 1,
    email: email.toLowerCase(),
    direccion: direccion.toLowerCase(),
    tipo,
    acsor: req.user.id,
    tiempo: ahora,
    google: '',
    imags: imagenes
  };
  if (req.params.id === 'agregar') {
    const cliente = await pool.query(`SELECT * FROM clientes WHERE documento = ?`, documento);

    if (!cliente.length) {
      var person = {
        resource: {
          names: [{ familyName: nombres.toUpperCase() }],
          emailAddresses: [{ value: email.toLowerCase() }],
          phoneNumbers: [{ value: '+' + movl, type: 'Personal' }],
          organizations: [{ name: 'Red Elite', title: 'Cliente' }]
        }
      };
      await fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content), crearcontacto);
      });
      const ir = await pool.query('INSERT INTO clientes SET ? ', clit);
      if (asesors) {
        const asr = {
          fullname: nombres.toUpperCase(),
          document: documento,
          cel: movl,
          username: email.toLowerCase(),
          cli: ir.insertId
        };
        await pool.query('UPDATE users SET ? WHERE id = ?', [asr, req.user.id]);
      }
      res.send({ code: ir.insertId });
    } else if (cliente.length > 0 && asesors) {
      const asr = {
        fullname: nombres.toUpperCase(),
        document: documento,
        cel: movl,
        username: email.toLowerCase(),
        cli: cliente[0].idc
      };
      await pool.query('UPDATE users SET ? WHERE id = ?', [asr, req.user.id]);
      res.send(true);
    }
  } else if (req.params.id === 'actualizar') {
  } else if (req.params.id === 'eliminar') {
  }

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH[1], (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES[0]
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH[1], JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH[1]);
        });
        callback(oAuth2Client);
      });
    });
  }
  function crearcontacto(auth) {
    const service = google.people({ version: 'v1', auth });
    service.people.createContact(person, (err, res) => {
      if (err) return console.error('La API devolvió un ' + err);
      clit.google = res.data.resourceName;
      console.log('Response', res.data.resourceName);
    });
  }
});

router.put('/editclientes', isLoggedIn, async (req, res) => {
  const { idc, name, tipod, docu, lugarex, fehex, fnaci, ecivil, email, pais, Movil, adres } =
    req.body;

  console.log(req.body);
  const movl = pais + ' ' + Movil.replace(/-/g, '');
  const clit = {
    nombre: name.toUpperCase(),
    documento: docu,
    fechanacimiento: fnaci,
    lugarexpedicion: lugarex,
    fechaexpedicion: fehex,
    estadocivil: ecivil,
    movil: movl,
    email: email.toLowerCase(),
    direccion: adres.toLowerCase(),
    tipo: tipod
  };
  await pool.query('UPDATE clientes SET ? WHERE idc = ?', [clit, idc]);
  res.send(true);
});

router.post('/adjuntar', isLoggedIn, async (req, res) => {
  var imagenes = '';
  req.files.map(e => {
    imagenes += `/uploads/${e.filename},`;
  });
  await pool.query('UPDATE clientes SET ? WHERE idc = ?', [{ imags: imagenes }, req.body.idc]);
  res.send(true);
});

router.post('/elicliente', noExterno, async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query(`DELETE FROM clientes WHERE idc = ?`, id);
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

router.post('/movil', isLoggedIn, async (req, res) => {
  const { movil } = req.body;
  const cliente = await pool.query('SELECT * FROM clientes WHERE movil = ?', movil);
  res.send(cliente);
});

/////////////////////////////////////////////////////
router.get('/social', noExterno, (req, res) => {
  var options = {
    method: 'POST',
    url: 'https://sbapi.bancolombia.com/v1/security/oauth-otp-pymes/oauth2/token',
    headers: {
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
      //authorization:  'MzdlYjEyNjctNmMzMy00NmIxLWE3NmYtMzNhNTUzZmQ4MTJmOnNUNnJYMndINGlMNGpKOHFROGVWNmJMNWlKOGNNMmdTMWVMOHNZMnBZMGhMNXZYNGVN'
    },
    form: {
      grant_type: 'client_credentials',
      client_id: '37eb1267-6c33-46b1-a76f-33a553fd812f',
      client_secret: 'sT6rX2wH4iL4jJ8qQ8eV6bL5iJ8cM2gS1eL8sY2pY0hL5vX4eM',
      scope: 'SOAT Search'
    }
  };

  request(options, function (error, response, body) {
    if (error) return console.error('Failed: %s', error.message);

    console.log('Success: ', body);
  });
  res.render('links/social');
});

//////////////* BONOS *//////////////////////////////////
router.post('/bonos/:id', isLoggedIn, (req, res) => {
  const { monto, ahora, pin, client, motivo } = req.body;
  const datos = {
    pin,
    descuento: 0,
    fecha: ahora,
    estado: 9,
    clients: client,
    monto: monto.replace(/\./g, ''),
    tip: 'BONO',
    motivo,
    concept: 'PERMUTA',
    soporte: '/uploads/' + req.files[0].filename
  };
  //console.log(req.body, datos);
  pool.query('INSERT INTO cupones SET ? ', datos);
  res.send(true);
});

//////////////* PAGOS *//////////////////////////////////
router.get('/pay', async (req, res) => {
  res.render('links/pay');
});

router.get('/pagos', async (req, res) => {
  res.render('links/pagos');
});

router.post('/pay/:id', async (req, res) => {
  const datos = await pool.query(
    `SELECT p.id orden, c.idc, c.nombre, c.movil, c.email, l.id lt, l.mz, l.n, d.id pyt, d.proyect, 
    SUM(q.cuota) deuda, SUM(IF(q.cuota = q.proyeccion, q.mora, 0)) mora,COUNT(q.id) cuotasvencidas,
    d.paymethods, (SELECT SUM(r.totalmora) FROM relacioncuotas r WHERE r.orden = p.id) moravieja,
    (SELECT SUM(r.morapaga) FROM relacioncuotas r WHERE r.orden = p.id) morapagada
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d 
    ON l.producto = d.id LEFT JOIN cuotas q ON q.separacion = p.id AND q.estado = 3 
    AND q.fechs <= CURDATE() INNER JOIN clientes c ON c.idc IN(p.cliente, p.cliente2, 
      p.cliente3, p.cliente4) WHERE p.tipobsevacion IS NULL AND c.documento = ?
    GROUP BY p.id, c.idc ORDER BY p.fecha;`,
    req.params.id
  );
  //datos[0].paymethods = JSON.parse(datos[0].paymethods);

  if (datos.length) {
    var recaudos = '';

    datos.map((e, i) => {
      e.paymethods = JSON.parse(e.paymethods);
      recaudos += !i ? `${e.pyt}` : `, ${e.pyt}`;
    });

    const cuentas = await pool.query(
      `SELECT * FROM prodrecauds p INNER JOIN recaudadores r 
       ON p.recaudador = r.id WHERE p.producto IN(${recaudos}) ORDER BY r.id`
    );

    datos.map((e, i) => {
      const qntas = cuentas.filter(a => a.producto == e.pyt);
      if (qntas.length) datos[i].cuentas = qntas;
    });

    res.send({ datos, status: true });
  } else {
    res.send({
      paquete: 'No existe ninguna orden relacionada con este documeto, comuniiquece con un asesor',
      status: false
    });
  }
});

router.get('/pagos/:id', async (req, res) => {
  const cliente = await pool.query('SELECT * FROM clientes WHERE documento = ?', req.params.id);
  if (cliente.length > 0) {
    const client = cliente[0];
    const d = await pool.query(
      `SELECT p.id, p.ahorro, pd.id lt, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, c.pin, pr.id pyt, 
        c.descuento, pr.proyect FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN cupones c ON p.cupon = c.id 
        INNER JOIN productos pr ON pd.producto = pr.id WHERE p.tipobsevacion IS NULL AND (p.cliente = ? OR p.cliente2 = ?)`,
      [client.idc, client.idc]
    );
    var c = '';
    if (d.length > 0) {
      d.length > 1
        ? d.map((b, x) => {
            c += `${x > 0 ? ' OR ' : ''}separacion = ${b.id}`;
          })
        : (c = `separacion = ${d[0].id}`);

      const cuentas = await pool.query(
        `SELECT * FROM prodrecauds p INNER JOIN recaudadores r ON p.recaudador = r.id WHERE p.producto = ${d[0].pyt} ORDER BY r.id`
      );
      const cuotas = await pool.query(
        `SELECT * FROM cuotas WHERE estado = 3 AND fechs <= CURDATE() AND (${c}) ORDER BY TIMESTAMP(fechs) ASC`
      );
      res.send({ d, client, cuotas, cuentas, status: true });
    } else {
      res.send({
        paquete: 'Aun no realiza una separacion, comuniiquece con un asesor',
        status: false
      });
    }
  } else {
    res.send({
      paquete: 'No existe un registro con este numero de documeto, comuniiquece con un asesor',
      status: false
    });
  }
});

router.post('/pagos', async (req, res) => {
  const { merchantId, amount, referenceCode, proyecto } = req.body;
  const codes = await pool.query(`SELECT key FROM prodrecauds p INNER JOIN recaudadores r 
    ON p.recaudador = r.id WHERE p.producto = '${proyecto}' AND r.entidad = 'PAYU'`);
  if (codes.length > 0) {
    const code = codes[0];
    var key = code.key + '~' + merchantId + '~' + referenceCode + '~' + amount + '~COP';
    var hash = crypto.createHash('md5').update(key).digest('hex');
    var ext = `${referenceCode}~${new Date().getTime()}`;
    res.send({ sig: hash, ext });
  }
  res.send(false);
});

router.post('/boton', async (req, res) => {
  const { pyt, mora, transferAmount, transferReference, transferDescription } = req.body;
  console.log(req.body);
  var data = JSON.stringify({
    data: [
      {
        commerceTransferButtonId: 'h4ShG3NER1C',
        transferReference: transferReference,
        transferAmount: transferAmount,
        commerceUrl: 'https://gateway.com/payment/route?commerce=Telovendo',
        transferDescription: transferDescription,
        confirmationURL: 'https://pagos-api-dev.tigocloud.net/bancolombia/callback'
      }
    ]
  });

  var config = {
    method: 'post',
    url: 'https://sbapi.bancolombia.com/v2/operations/cross-product/payments/payment-order/transfer/action/registry',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer AAIkMzdlYjEyNjctNmMzMy00NmIxLWE3NmYtMzNhNTUzZmQ4MTJmDtiIF4TAuv9kgn089V6e83QR05QKFMYC3i8QAr2fHyFCkaKFvzS8rhq75wwWVrXJhSpDQgc8e6wxrvoXY2Ts8FOMHb_8wkpk0rz0XYpuKDEAPniWedJvNmb8KP97Qht4PeL2EK3im3uEbkE1P91INYcMVVVzpbGoC_1SyCDcf4E'
    },
    data: data
  };
  axios(config)
    .then(function (response) {
      console.log(response.data);
      //var dat = JSON.parse(response.data)
      res.send({
        std: true,
        msj: 'vamos muy bien',
        href: response.data.data[0].redirectURL
      });
    })
    .catch(function (error) {
      //console.log(error);
      res.send({ std: false, msj: error, href: '/' });
    });
});

router.post('/rcbs', async (req, res) => {
  const { ahora, lt, formap, namercb, nrecibo, montos, feh, orden } = req.body;

  console.log(req.body, req.files);

  const pago = { fech: ahora, lt, orden, concepto: 'PAGO', stado: 3, descp: 'ABONO' };
  const sql = 'SELECT * FROM acuerdos WHERE orden = ? AND estado = 9';
  const acuerdo = (await pool.query(sql, orden))[0] || null;

  if (Array.isArray(nrecibo))
    for (i = 0; i <= nrecibo.length - 1; i++) {
      pago.img = `/uploads/${req.files.find(e => e.originalname === namercb[i]).filename}`;
      pago.recibo = nrecibo[i];
      pago.monto = noCifra(montos[i]);
      pago.fecharcb = feh[i];
      pago.formap = formap[i];

      if (acuerdo?.limite >= pago.fecharcb) pago.acuerdo = acuerdo?.id;

      console.log(pago);
      await pool.query('INSERT INTO solicitudes SET ? ', pago);
    }
  else {
    pago.img = `/uploads/${req.files[0].filename}`;
    pago.recibo = nrecibo;
    pago.monto = noCifra(montos);
    pago.fecharcb = feh;
    pago.formap = formap;

    if (acuerdo?.limite >= pago.fecharcb) pago.acuerdo = acuerdo?.id;

    console.log(pago);
    await pool.query('INSERT INTO solicitudes SET ? ', pago);

    /* await pool.query(`UPDATE solicitudes s INNER JOIN acuerdos a ON s.acuerdo = a.id 
      SET a.montopago = (SELECT SUM(s2.monto) FROM solicitudes s2 WHERE s2.acuerdo = a.id
      AND s2.fecharcb <= a.limite), a.estado = IF((SELECT SUM(s2.monto) FROM solicitudes s2 
      WHERE s2.acuerdo = a.id AND s2.stado = 4 AND s2.fecharcb <= a.limite) >= a.pago, 7, 9) 
      WHERE a.pago > 0`); */
  }

  await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', lt);
  res.json({ std: true, msj: 'Solicitud de pago enviada correctamente' });

  /* if (g) {
    return res.send({
      std: true,
      msj: 'Solicitud de pago enviada correctamente'
    });
  } else {
    req.flash('success', 'Solicitud de pago enviada correctamente');
    return res.redirect('/links/pagos');
  } */
});

router.post('/recibos', async (req, res) => {
  const { factura, formas, names, recibos, montos, fechas } = req.body;
  console.log(req.body, req.files);

  const rcbs = { factura };

  if (Array.isArray(recibos))
    for (i = 0; i <= recibos.length - 1; i++) {
      rcbs.imagen = `/uploads/${req.files.find(e => e.originalname === names[i]).filename}`;
      rcbs.recibo = recibos[i];
      rcbs.monto = montos[i];
      rcbs.fecha = fechas[i];
      rcbs.forma = formas[i];

      console.log(rcbs);
      await pool.query('INSERT INTO recibos SET ? ', rcbs);
    }
  else {
    rcbs.imagen = `/uploads/${req.files[0].filename}`;
    rcbs.recibo = recibos;
    rcbs.monto = montos;
    rcbs.fecha = fechas;
    rcbs.forma = formas;

    console.log(rcbs);
    await pool.query('INSERT INTO recibos SET ? ', rcbs);
  }

  await pool.query('UPDATE facturas SET status = 1 WHERE id = ?', factura);
  res.json({ std: true, msj: 'Solicitud de pago enviada correctamente' });
});

router.post('/recibo', async (req, res) => {
  const {
    total,
    factrs,
    id,
    recibos,
    ahora,
    concpto,
    lt,
    formap,
    bono,
    pin,
    montorcb,
    g,
    mora,
    rcbexcdnt,
    nrecibo,
    montos,
    feh,
    orden
  } = req.body;
  var rcb = ''; //console.log(req.body)
  if (recibos.indexOf(',')) {
    var rcbs = recibos.split(',');
    rcbs.map(s => {
      rcb += `recibo LIKE '%${s}%' OR `;
    });
    rcb = rcb.slice(0, -3);
  } else {
    rcb = `recibo LIKE '%${recibos}%'`;
  }
  var excd = false,
    excedente = 0;
  var sum = 0,
    saldo = montorcb;
  const recibe = await pool.query(`SELECT * FROM solicitudes WHERE stado != 6 AND (${rcb})`);
  if (recibe.length > 0) {
    recibe
      .filter(a => {
        return a.rcbexcdnt && a.excdnt;
      })
      .map(a => {
        sum += a.monto;
      });
    saldo = montorcb - sum;
    if (saldo < parseFloat(total) && sum > 1) {
      if (g) {
        return res.send({
          std: false,
          msj:
            'El excedente del anterior pago, no coinside con el moto a pagar de este, excedente de $' +
            Moneda(sum)
        });
      } else {
        req.flash(
          'error',
          'El excedente del anterior pago, no coinside con el moto a pagar de este, excedente de $' +
            Moneda(sum)
        );
        return res.redirect('/links/pagos');
      }
    } else if (!sum) {
      if (g) {
        return res.send({
          std: false,
          msj: 'Solicitud de pago rechazada, recibo o factura duplicada'
        });
      } else {
        req.flash('error', 'Solicitud de pago rechazada, recibo o factura duplicada');
        return res.redirect('/links/pagos');
      }
    }
  }
  if (saldo > parseFloat(total)) {
    excd = true;
    excedente = saldo - parseFloat(total);
  }

  if (bono) {
    await pool.query('UPDATE cupones SET ? WHERE id = ?', [{ producto: orden, estado: 14 }, pin]);
  }

  const r = await pool.query(
    `SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = ? AND s.lt = ?`,
    [4, lt]
  );
  var l = r[0].monto1 || 0,
    k = r[0].monto || 0;
  var acumulado = l + k;

  concpto !== 'ABONO' ? await pool.query('UPDATE cuotas SET estado = 1 WHERE id = ?', id) : '';
  await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', lt);
  await pool.query(`UPDATE solicitudes SET ? WHERE ${rcb}`, { excdnt: 0 });
  let pago = {
    fech: ahora,
    facturasvenc: factrs,
    lt,
    acumulado,
    orden,
    concepto: 'PAGO',
    stado: 3,
    descp: concpto,
    formap
  };

  var reci = 'INSERT INTO recibos (registro, date, formapg, rcb, monto, baucher, excdnt) VALUES ';
  if (Array.isArray(nrecibo)) {
    for (i = 0; i <= nrecibo.length - 1; i++) {
      //console.log(i, montos[i], nrecibo.length, parseFloat(montos[i].replace(/\./g, '')))
      var recib = parseFloat(montos[i].replace(/\./g, ''));
      pago.img = `/uploads/${req.files[i].filename}`;
      pago.motorecibos = recib;
      pago.recibo = nrecibo[i];
      pago.monto = recib;
      pago.fecharcb = feh[i];

      if (nrecibo[i] === rcbexcdnt) {
        pago.monto = recib - excedente;
        pago.rcbexcdnt = rcbexcdnt;
        pago.excdnt = 1;
      }

      mora != 0 ? (pago.moras = mora) : '';
      concpto === 'ABONO' ? (pago.concepto = concpto) : (pago.pago = id);

      const acuerdo = await pool.query(
        'SELECT id FROM acuerdos WHERE orden = ? AND estado != 5 AND limite >= ?',
        [orden, pago.fecharcb]
      );
      acuerdo.length && (pago.acuerdo = acuerdo[0].id);

      let pgo = await pool.query('INSERT INTO solicitudes SET ? ', pago);
      reci += `(${pgo.insertId}, '${feh[i]}', '${formap}', '${nrecibo[i]}', ${montos[i].replace(
        /\./g,
        ''
      )}, '/uploads/${req.files[i].filename}', ${nrecibo[i] === rcbexcdnt ? excedente : 0}),`;

      /* await pool.query(`UPDATE solicitudes s INNER JOIN acuerdos a ON s.acuerdo = a.id 
      SET a.montopago = (SELECT SUM(s2.monto) FROM solicitudes s2 WHERE s2.acuerdo = a.id
      AND s2.fecharcb <= a.limite), a.estado = IF((SELECT SUM(s2.monto) FROM solicitudes s2 
      WHERE s2.acuerdo = a.id AND s2.stado = 4 AND s2.fecharcb <= a.limite) >= a.pago, 7, 9) 
      WHERE a.pago > 0`); */
    }
  } else {
    var recib = parseFloat(montos.replace(/\./g, ''));
    pago.img = `/uploads/${req.files[0].filename}`;
    pago.motorecibos = recib;
    pago.recibo = nrecibo;
    pago.monto = recib;
    pago.fecharcb = feh;

    if (nrecibo === rcbexcdnt) {
      pago.monto = recib - excedente;
      pago.rcbexcdnt = rcbexcdnt;
      pago.excdnt = 1;
    }
    mora ? (pago.moras = mora) : '';
    concpto === 'ABONO' ? (pago.concepto = concpto) : (pago.pago = id);

    const acuerdo = await pool.query(
      'SELECT id FROM acuerdos WHERE orden = ? AND estado = 9 AND limite >= ?',
      [orden, pago.fecharcb]
    );
    acuerdo.length && (pago.acuerdo = acuerdo[0].id);

    let pgo = await pool.query('INSERT INTO solicitudes SET ? ', pago);
    reci += `(${pgo.insertId}, '${feh}', '${formap}', '${nrecibo}', ${montos.replace(
      /\./g,
      ''
    )}, '/uploads/${req.files[0].filename}', ${excedente}),`;

    /* await pool.query(`UPDATE solicitudes s INNER JOIN acuerdos a ON s.acuerdo = a.id 
      SET a.montopago = (SELECT SUM(s2.monto) FROM solicitudes s2 WHERE s2.acuerdo = a.id
      AND s2.fecharcb <= a.limite), a.estado = IF((SELECT SUM(s2.monto) FROM solicitudes s2 
      WHERE s2.acuerdo = a.id AND s2.stado = 4 AND s2.fecharcb <= a.limite) >= a.pago, 7, 9) 
      WHERE a.pago > 0`); */
  }
  //console.log(reci.slice(0, -1))
  await pool.query(reci.slice(0, -1));

  if (g) {
    return res.send({
      std: true,
      msj: 'Solicitud de pago enviada correctamente'
    });
  } else {
    req.flash('success', 'Solicitud de pago enviada correctamente');
    return res.redirect('/links/pagos');
  }
});

router.post('/bonus', async (req, res) => {
  const { factrs, id, ahora, concpto, lt, bonomonto, bono, pin, orden } = req.body;
  const a = await Bonos(bono, lt);
  if (a) {
    const r = await pool.query(
      `SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO', 'BONO') AND s.stado = ? AND s.lt = ?`,
      [4, lt]
    );
    var l = r[0].monto1 || 0,
      k = r[0].monto || 0;
    var acumulado = l + k;

    const pago = {
      fech: ahora,
      monto: bonomonto,
      recibo: bono,
      facturasvenc: factrs,
      lt,
      orden,
      concepto: 'BONO',
      stado: 3,
      descp: concpto,
      formap: 'BONO-' + a.concept,
      bono: pin,
      acumulado,
      observaciones: a.concept + ' - ' + a.motivo,
      img: a.soporte
    };
    await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', lt);
    await pool.query('UPDATE cupones SET ? WHERE id = ?', [{ producto: orden, estado: 14 }, pin]);
    const P = await pool.query('INSERT INTO solicitudes SET ? ', pago);
    const R = await PagosAbonos(P.insertId, '', {
      fullname: 'GRUPO ELITE SISTEMA',
      empresa: req.user.empresa
    });
    res.send(R);
  } else {
    res.send(false);
  }
});

/////////////* CARTERAS */////////////////////////////////////
router.get('/cartera', isLoggedIn, async (req, res) => {
  res.render('links/cartera');
});

router.post('/cartera/:id', noExterno, async (req, res) => {
  const { id } = req.params;
  const fila = await pool.query('SELECT * FROM productosd WHERE id = ?', id);
  res.send(fila[0]);
});

router.post('/cartera', isLoggedIn, async (req, res) => {
  const { h } = req.body;
  let prd;
  if (req.user.externo) {
    const prcd = await pool.query('SELECT producto FROM externos WHERE usuario = ?', req.user.pin);
    prd = prcd.map(e => e.producto);
  }
  let d = prd ? `AND d.id IN (${prd})` : '';

  sql = `SELECT p.id, l.mz, l.n, p.fecha, (
        SELECT MAX(TIMESTAMP(fech))
        FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id
      ) as ultimoabono, (
        SELECT TIMESTAMPDIFF(MONTH, MAX(TIMESTAMP(fech)), CURDATE())
        FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id
      ) as meses2, l.estado, l.valor, p.separar, p.ahorro, l.valor - p.ahorro Total, (
        SELECT SUM(monto)
        FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id
      ) as abonos, d.proyect, c.nombre, c.documento, u.fullname, c.movil, (
        SELECT SUM(cuota)
        FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3
        ORDER BY fechs ASC
      ) as deuda, (
        SELECT COUNT(*)
        FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3
        ORDER BY fechs ASC
      ) as meses
  FROM preventa p 
  INNER JOIN solicitudes s ON p.id = s.orden 
  INNER JOIN productosd l ON p.lote = l.id 
  INNER JOIN productos d ON l.producto = d.id 
  INNER JOIN clientes c ON p.cliente = c.idc 
  INNER JOIN users u ON p.asesor = u.id 
  WHERE p.tipobsevacion IS NULL ${d}
  GROUP BY p.id
  HAVING meses > 2 AND abonos < Total AND deuda > 0
  ORDER BY ultimoabono;`;

  const cuotas = await pool.query(sql);
  respuesta = { data: cuotas };
  res.send(respuesta);
});

router.post('/rcb', noExterno, async (req, res) => {
  const { rcb } = req.body;
  console.log(req.body);
  const recibo = await pool.query(`SELECT * FROM solicitudes WHERE recibo LIKE '%${rcb}%'`);
  //console.log(recibo)
  if (recibo.length > 0) {
    res.send(false);
  } else {
    res.send(true);
  }
});

router.post('/prodlotes', noExterno, async (req, res) => {
  const productos =
    await pool.query(`SELECT p.*, l.* FROM productos p INNER JOIN productosd l ON l.producto = p.id LEFT JOIN preventa v ON v.lote = l.id 
    WHERE l.estado IN('9', '15') AND (v.tipobsevacion = 'ANULADA' OR v.id IS NULL) ORDER BY p.proyect DESC, l.mz ASC, l.n ASC`);
  const asesores = await pool.query(`SELECT * FROM users ORDER BY fullname ASC`);
  const clientes = await pool.query(`SELECT * FROM clientes ORDER BY nombre ASC`);
  res.send({ productos, asesores, clientes });
});

router.post('/crearcartera', noExterno, async (req, res) => {
  const {
    idbono,
    asesor,
    clientes,
    mtr2,
    vmtr2,
    inicial,
    total,
    cupon,
    xcntag,
    cuponx100,
    cuot,
    ahorro,
    desinicial,
    destotal,
    inicialcuotas,
    financiacion,
    tini,
    tfnc,
    fecha,
    n,
    tipo,
    cuota,
    rcuota,
    std,
    concpto,
    lt,
    ahora,
    montorcb,
    recibos,
    formap,
    nrecibo,
    promesa,
    feh,
    montos
  } = req.body;

  //console.log(req.body, req.files, req.body.promesa ? 'si' : 'no')

  var separ = {
    lote: lt,
    asesor: asesor,
    iniciar: xcntag,
    obsevacion: 'CARTERA',
    cuot,
    numerocuotaspryecto: parseFloat(inicialcuotas) + parseFloat(financiacion),
    extraordinariameses: 0,
    cuotaextraordinaria: 0,
    cupon: idbono ? idbono : 1,
    inicialdiferida: inicialcuotas,
    ahorro: ahorro ? ahorro.replace(/\./g, '') : 0,
    separar: cuota[0].replace(/\./g, ''),
    extran: 0,
    vrmt2: vmtr2.replace(/\./g, '')
  };
  if (promesa && promesa !== '0') {
    separ.promesa = promesa;
    separ.autoriza = req.user.fullname;
    separ.status = promesa;
  }
  if (Array.isArray(clientes)) {
    clientes.map((e, i) => {
      i === 0
        ? (separ.cliente = e)
        : i === 1
        ? (separ.cliente2 = e)
        : i === 2
        ? (separ.cliente3 = e)
        : i === 3
        ? (separ.cliente4 = e)
        : '';
    });
  } else {
    separ.cliente = clientes;
  }
  const h = await pool.query('INSERT INTO preventa SET ? ', separ);
  idbono
    ? await pool.query('UPDATE cupones set ? WHERE id = ?', [
        { estado: 14, producto: h.insertId },
        idbono
      ])
    : '';
  var cuotas =
    'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, estado, proyeccion) VALUES ';
  var reci = 'INSERT INTO recibos (registro, date, formapg, rcb, monto, baucher) VALUES ';
  await n.map((t, i) => {
    cuotas += `(${h.insertId}, '${tipo[i]}', ${t}, '${fecha[i]}', ${rcuota[i].replace(
      /\./g,
      ''
    )}, ${std[i]}, ${cuota[i].replace(/\./g, '')}),`;
  });
  await pool.query(cuotas.slice(0, -1));

  var imagenes = '';
  req.files.map(e => {
    imagenes += `/uploads/${e.filename},`;
  });
  var fpago = Array.isArray(formap) ? formap[0] : formap;
  const pago = {
    fech: ahora,
    monto: montorcb,
    recibo: recibos,
    facturasvenc: 0,
    lt,
    acumulado: 0,
    orden: h.insertId,
    concepto: 'ABONO',
    stado: 4,
    img: imagenes,
    descp: 'ABONO',
    formap: fpago,
    excdnt: 0
  };
  const pgo = await pool.query('INSERT INTO solicitudes SET ? ', pago);
  if (Array.isArray(nrecibo)) {
    await nrecibo.map((t, i) => {
      reci += `(${pgo.insertId}, '${feh[i]}', '${formap[i]}', '${t}', ${montos[i].replace(
        /\./g,
        ''
      )}, '/uploads/${req.files[i].filename}'),`;
    });
  } else {
    reci += `(${pgo.insertId}, '${feh}', '${formap}', '${nrecibo}', ${montos.replace(
      /\./g,
      ''
    )}, '/uploads/${req.files[0].filename}'),`;
  }
  await pool.query(reci.slice(0, -1));
  const S = await Estados(h.insertId);
  await pool.query('UPDATE productosd set ? WHERE id = ?', [
    {
      estado: S.std,
      mtr: vmtr2.replace(/\./g, ''),
      inicial: inicial.replace(/\./g, ''),
      valor: total.replace(/\./g, ''),
      tramitando: ahora
    },
    lt
  ]);

  req.flash('success', 'Cartera creada correctamente, producto en estado ' + S.estado);
  res.redirect('/links/cartera');
});

//////////////* CUPONES *//////////////////////////////////
router.get('/saluda', noExterno, async (req, res) => {
  const r = await pool.query(`SELECT SUM(s.monto) + 
    SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS montos, 
    p.ahorro, pd.mz, pd.n, pd.mtr2, pd.valor, pd.inicial, p.vrmt2, p.fecha, 
    cu.descuento, c.nombre FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id 
    INNER JOIN productos pt ON pd.producto = pt.id LEFT JOIN cupones cu ON cu.id = p.cupon 
    INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id 
    INNER JOIN solicitudes s ON pd.id = s.lt LEFT JOIN cupones cp ON s.bono = cp.id
    WHERE s.stado = 4 AND s.concepto IN('PAGO', 'ABONO')
    GROUP BY p.id`);
  console.log(r);
  res.send('samir todo biaen');
});

router.get('/cupones', isLoggedIn, async (req, res) => {
  res.render('links/cupones');
});

router.post('/cupon', isLoggedIn, async (req, res) => {
  const { dto, std, cliente, ctn } = req.body;
  if (ctn < 1) {
    var hora = moment().format('YYYY-MM-DD HH:mm');
    var pin = ID(5);
    const cupon = {
      pin,
      descuento: dto ? dto : 5,
      estado: std ? std : 3,
      clients: cliente ? cliente : req.user.cli
    };
    await pool.query('INSERT INTO cupones SET ? ', cupon);
    const klint = await pool.query(`SELECT * FROM  clientes WHERE idc = ?`, cupon.clients);
    const encargado = await pool.query(
      `SELECT u.fullname, u.cel, u.username FROM encargos e INNER JOIN users u ON e.user = u.id  WHERE e.cargo = 'CUPONES'`
    );
    const en = encargado[0];
    var nom = en.fullname.split(' ')[0];

    EnviarWTSAP(
      en.cel,
      `_*${nom}* tienes una solicitu de un *CUPON ${pin}* del *${cupon.descuento}%* por aprobar de *${klint[0].nombre}*_\n\n_*GRUPO ELITE FICA RAÍZ*_`,
      `${nom} tienes una solicitu de un CUPON ${pin} ${cupon.descuento}% por aprobar de ${klint[0].nombre}`
    );
    res.send({
      tipo: 'success',
      msj: 'Solicitud de cupon enviada correctamente'
    });
  } else {
    res.send({
      tipo: 'error',
      msj: 'Ya generaste una solicitud de cupon antes, debes esperar al menos una hora para realizar una nueva solicitud'
    });
  }
});

router.post('/cupones', isLoggedIn, async (req, res) => {
  var d = req.user.auxicontbl > 0 ? '' : 'WHERE c.clients = ?';
  var sql = `SELECT c.id, c.pin, c.descuento, c.fecha, c.estado, v.ahorro, p.mz, p.n, t.proyect, cl.nombre, cl.movil, 
    cl.email FROM cupones c LEFT JOIN preventa v ON c.producto = v.id LEFT JOIN productosd p ON v.lote = p.id 
    LEFT JOIN productos t ON p.producto = t.id LEFT JOIN clientes cl ON c.clients = cl.idc ${d} `;

  const cupones = await pool.query(sql, req.user.cli);
  respuesta = { data: cupones };
  res.send(respuesta);
});

router.post('/cupones/:d', isLoggedIn, async (req, res) => {
  const { d } = req.params;
  if (d === 'BONO' && !req.user.externo) {
    const { id, pin, descuento, fecha, estado, ahorro, mz, n, proyect, nombre, movil, email } =
      req.body;
    const bono = {
      pin,
      descuento: 0,
      estado: 9,
      cliente: idc,
      tip: qhacer,
      monto: acumulado,
      motivo,
      concept: causa
    };
    const a = await pool.query('INSERT INTO cupones SET ? ', bono);
  } else if (d === 'CUPON') {
  } else if (d === 'clientes') {
    const clientes = await pool.query(`SELECT * FROM clientes ORDER BY nombre ASC`);
    res.send({ clientes });
  } else {
    const { id, pin, descuento, fecha, estado, ahorro, mz, n, proyect, nombre, movil, email } =
      req.body;
    if (d === 'Aprobar') {
      await pool.query('UPDATE cupones set ? WHERE id = ?', [{ estado: 9 }, id]);
      EnviarWTSAP(
        movil,
        `_*${
          nombre.split(' ')[0]
        }* tienes un cupon *${pin}* aprobado del *${descuento}%* de descuento para lotes *Campestres*_\n\n_Debes tener presente que estos descuentos estan sujetos a terminos y condiciones establecidos por *Grupo Elite.*_\n\n_para mas información cominicate con un una persona del area encargada_\n\n_*GRUPO ELITE FICA RAÍZ*_`,
        `${
          nombre.split(' ')[0]
        } tienes un cupon ${pin} aprobado de ${descuento}% GRUPO ELITE FICA RAÍZ`
      );
      res.send(true);
    }
  }
});

router.get('/bono/:id', isLoggedIn, async (req, res) => {
  const bono = await pool.query('SELECT * FROM cupones WHERE pin = ?', req.params.id);
  res.send(bono);
});

///////////////////////* ORDEN *//////////////////////////////////
router.get('/orden', isLoggedIn, async (req, res) => {
  moment.locale('es');
  const { lt } = req.query;
  const usrs = req.user.id;
  const lote = lt
    ? await pool.query(`SELECT * FROM  productosd l INNER JOIN productos o 
      ON l.producto = o.id WHERE l.estado = 9 AND l.id = ${lt}`)
    : [];

  if (!lote.length && lt) {
    req.flash('info', 'Este producto ya fue separado');
    return res.redirect('/links/productos');
  }

  res.render('links/orden', { lote: lt, usrs, orden: null });
});

router.get('/orden/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const usrs = req.user.id;

  if (!req.user.admin) {
    const promesa = await pool.query(`SELECT * FROM preventa WHERE id = ${id} AND status > 0`);

    if (promesa.length > 0) {
      req.flash(
        'error',
        'Esta Orden no es posible editarla ya que posee una promesa de compra y venta.'
      );
      return res.redirect('/links/reportes');
    }

    const comi = await pool.query(`SELECT * FROM solicitudes WHERE orden = ${id} AND stado != 6 AND 
     concepto REGEXP 'COMISION|GESTION' AND descp != 'SEPARACION'`);

    if (comi.length > 0) {
      req.flash(
        'error',
        'Esta Orden no es posible editarla ya que tiene ' + comi.length + ' comision(es) generadas'
      );
      return res.redirect('/links/reportes');
    }
  }

  res.render('links/orden', { lote: null, usrs, orden: id });
});

router.post('/orden/save', isLoggedIn, async (req, res) => {
  const { proyeccion, ordenAnt, producto, cupon, historyQuota } = req.body;
  const { id, mtr, mtr2, inicial, valor } = producto;
  const qotas = proyeccion.reduce((i, e) => (e.cuota && e.cuota2 ? i + 2 : e.cuota ? i + 1 : i), 0);
  let updateQotas = !cupon?.orden ? 1 : 0;
  //console.log(proyeccion, ordenAnt, producto, cupon, historyQuota, qotas);
  let lOte = [];
  if (!cupon?.orden) lOte = await pool.query(`SELECT * FROM productosd l WHERE l.id = ?`, id);
  if (lOte.length > 1) return res.send(false);

  const p = cupon?.orden ? 'p.' : '';
  const orden = {
    [p + 'cuot']: historyQuota.FINANCIACION,
    [p + 'dto']: producto.dto,
    [p + 'lote']: id,
    [p + 'cliente']: producto.cliente,
    [p + 'cliente2']: producto.cliente2,
    [p + 'cliente3']: producto.cliente3,
    [p + 'cliente4']: producto.cliente4,
    [p + 'asesor']: producto.asesor,
    [p + 'numerocuotaspryecto']: producto.numerocuotaspryecto,
    [p + 'separar']: producto.separar,
    [p + 'vrmt2']: producto.mtr,
    [p + 'iniciar']: producto.porcentage,
    [p + 'inicialdiferida']: producto.inicialdiferida,
    [p + 'cupon']: cupon.idcupon,
    [p + 'status']: producto.status,
    [p + 'ahorro']: cupon.ahorro,
    [p + 'comision']: cupon?.comision ? cupon.comision : 0
  };
  const qpon = {
    pin: ID(5),
    descuento: cupon.dto,
    estado: 14,
    producto: cupon?.orden ? cupon.orden : null,
    responsable: req.user.fullname
  };

  if (cupon?.orden) {
    const filas = [];

    const ordenAnt =
      await pool.query(`SELECT c.id idq, c.tipo, c.ncuota, c.fechs, c.proyeccion cuota, 
    p.dto, p.id o, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.asesor, p.numerocuotaspryecto, 
    p.cuot, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, p.cupon, p.comision, p.status, p.lote, 
    p.ahorro, c.cuota qota, l.id, l.producto, l.mtr, l.mtr2, l.inicial, l.valor, q.descuento
    FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id LEFT JOIN cupones q ON p.cupon = q.id
    INNER JOIN productosd l ON p.lote = l.id WHERE c.separacion = ${cupon.orden} ORDER BY TIMESTAMP(c.fechs) ASC`);
    updateQotas = Math.abs(qotas - ordenAnt.length);
    console.log(updateQotas, qotas, ordenAnt.length);
    ordenAnt.map(e => {
      if (e.ncuota % 2)
        filas.push({
          tipo: e.tipo,
          fechs: e.fechs,
          ncuota: e.ncuota,
          cuota: e.cuota > 0 ? e.cuota : e.qota,
          id: e.idq,
          o: e.o,
          cuot: e.cuot,
          id2: 1,
          fechs2: null,
          ncuota2: null,
          cuota2: null
        });
      else {
        filas
          .filter(a => a.ncuota === e.ncuota - 1 && a.tipo === e.tipo)
          .map(a => {
            a.id2 = e.idq;
            a.fechs2 = e.fechs;
            a.ncuota2 = e.ncuota;
            a.cuota2 = e.cuota > 0 ? e.cuota : e.qota;
          });
      }
    });

    const cambios = {
      cuot: [ordenAnt[0]?.cuot, historyQuota.FINANCIACION],
      dto: [ordenAnt[0]?.dto, producto.dto],
      lote: [ordenAnt[0]?.lote, id],
      cliente: [ordenAnt[0]?.cliente, producto.cliente],
      cliente2: [ordenAnt[0]?.cliente2, producto.cliente2],
      cliente3: [ordenAnt[0]?.cliente3, producto.cliente3],
      cliente4: [ordenAnt[0]?.cliente4, producto.cliente4],
      asesor: [ordenAnt[0]?.asesor, producto.asesor],
      numerocuotaspryecto: [ordenAnt[0]?.numerocuotaspryecto, producto.numerocuotaspryecto],
      separar: [ordenAnt[0]?.separar, producto.separar],
      vrmt2: [ordenAnt[0]?.vrmt2, producto.mtr],
      iniciar: [ordenAnt[0]?.iniciar, producto.porcentage],
      inicialdiferida: [ordenAnt[0]?.inicialdiferida, producto.inicialdiferida],
      cupon: [ordenAnt[0]?.cupon, cupon.idcupon],
      status: [ordenAnt[0]?.status, producto.status],
      ahorro: [ordenAnt[0]?.ahorro, cupon.ahorro],
      comision: [ordenAnt[0]?.comision, cupon?.comision ? cupon.comision : 0],
      mtr: [ordenAnt[0]?.mtr, mtr],
      mtr2: [ordenAnt[0]?.mtr2, mtr2],
      inicial: [ordenAnt[0]?.inicial, inicial],
      valor: [ordenAnt[0]?.valor, valor],
      SEPARACION: [
        filas.filter(e => e.tipo === 'SEPARACION'),
        proyeccion.filter(e => e.tipo === 'SEPARACION')
      ],
      INICIAL: [
        filas.filter(e => e.tipo === 'INICIAL'),
        proyeccion.filter(e => e.tipo === 'INICIAL')
      ],
      FINANCIACION: [
        filas.filter(e => e.tipo === 'FINANCIACION'),
        proyeccion.filter(e => e.tipo === 'FINANCIACION')
      ]
    };

    const changes = {
      change: JSON.stringify(cambios),
      type: 'ORDEN',
      idchange: cupon.orden,
      user: req.user.fullname
    };

    await pool.query('INSERT INTO historiales SET ? ', changes);
  }

  if (cupon.idcupon > 1)
    await pool.query(`UPDATE cupones SET ? WHERE id = ?`, [qpon, cupon.idcupon]);
  else if (cupon.dto)
    orden[p + 'cupon'] = (await pool.query('INSERT INTO cupones SET ? ', qpon)).insertId;

  if (cupon?.orden) {
    orden['l2.mtr'] = mtr;
    orden['l2.mtr2'] = mtr2;
    orden['l2.inicial'] = inicial;
    orden['l2.valor'] = valor;

    if (updateQotas) await pool.query('DELETE FROM cuotas WHERE separacion = ?', cupon.orden);

    await pool.query(
      `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
       LEFT JOIN solicitudes s ON s.orden = p.id INNER JOIN productosd l2 ON l2.id = ? 
       SET s.lt = l2.id, l2.estado = 1, l2.directa = l.directa, l2.comiempresa = l.comiempresa, 
       l2.comisistema = l.comisistema, l.estado = 9, l.directa = NULL, l.comiempresa = 0, 
       l.comisistema = 0, ? WHERE p.id = ?`,
      [id, orden, cupon.orden]
    );
  } else {
    if (!cupon?.comision)
      orden['comision'] =
        (
          await pool.query(`SELECT c.comision FROM productos p INNER JOIN productosd l ON l.producto = p.id 
        LEFT JOIN comisiones c ON c.producto = p.id AND c.asesor = ${producto.asesor} WHERE l.id = ${id}`)
        )[0].comision || 0;

    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [
      { mtr, mtr2, inicial, valor, estado: 1 },
      id
    ]);
    cupon.orden = (await pool.query(`INSERT INTO preventa SET ? `, orden)).insertId;
    if (orden['cupon'] > 1)
      await pool.query(`UPDATE cupones SET ? WHERE id = ?`, [
        { producto: cupon.orden },
        orden['cupon']
      ]);
  }

  if (updateQotas) {
    //console.log('creo las cuootas nuevamente');
    var cuotas = 'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, proyeccion) VALUES ';
    await proyeccion.map(e => {
      cuotas += `(${cupon.orden}, '${e.tipo}', ${e.ncuota}, '${e.fechs}', ${e.cuota}, ${e.cuota}),`;
      if (e.cuota2)
        cuotas += `(${cupon.orden}, '${e.tipo}', ${e.ncuota2}, '${e.fechs2}', ${e.cuota2}, ${e.cuota2}),`;
    });

    await pool.query(cuotas.slice(0, -1));
    //console.log(cuotas, orden);
  } else {
    //console.log(orden, 'no creo las cuootas');
    let ids = null;
    const cuotas = {
      tipo: 'tipo = CASE id',
      ncuota: 'ncuota = CASE id',
      fechs: 'fechs = CASE id',
      cuota: 'cuota = CASE id',
      proyeccion: 'proyeccion = CASE id'
    };
    await proyeccion.map(e => {
      ids += ids ? `, ${e.id}` : e.id;
      cuotas.tipo += ` WHEN ${e.id} THEN '${e.tipo}'`;
      cuotas.ncuota += ` WHEN ${e.id} THEN ${e.ncuota}`;
      cuotas.fechs += ` WHEN ${e.id} THEN '${e.fechs}'`;
      cuotas.cuota += ` WHEN ${e.id} THEN ${e.cuota}`;
      cuotas.proyeccion += ` WHEN ${e.id} THEN ${e.cuota}`;
      if (e.cuota2) {
        ids += `, ${e.id2}`;
        cuotas.tipo += ` WHEN ${e.id2} THEN '${e.tipo}'`;
        cuotas.ncuota += ` WHEN ${e.id2} THEN ${e.ncuota2}`;
        cuotas.fechs += ` WHEN ${e.id2} THEN '${e.fechs2}'`;
        cuotas.cuota += ` WHEN ${e.id2} THEN ${e.cuota2}`;
        cuotas.proyeccion += ` WHEN ${e.id2} THEN ${e.cuota2}`;
      }
    });
    cuotas.tipo += ` ELSE tipo END `;
    cuotas.ncuota += ` ELSE ncuota END `;
    cuotas.fechs += ` ELSE fechs END `;
    cuotas.cuota += ` ELSE cuota END `;
    cuotas.proyeccion += ` ELSE proyeccion END `;
    await pool.query(
      `UPDATE cuotas SET estado = 3, 
      ${cuotas.tipo}, 
      ${cuotas.ncuota}, 
      ${cuotas.fechs}, 
      ${cuotas.cuota}, 
      ${cuotas.proyeccion}
        WHERE separacion = ?`,
      cupon.orden
    );
    //console.log(ids);
    await pool.query(`DELETE FROM cuotas WHERE id NOT IN(${ids}) AND separacion = ?`, cupon.orden);
  }
  if (p) await ProyeccionPagos(cupon.orden);
  const st = await Estados(cupon.orden);
  try {
    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ estado: st?.std }, id]);
    if (/10|13/.test(st?.std)) await Desendentes(producto.asesor, 10);
  } catch (e) {
    console.log(e);
  }
  res.send(true);
});

router.post('/orden/:accion', isLoggedIn, async (req, res) => {
  const { accion } = req.params;
  let orden = [];
  const ordnId = parseInt(accion);
  if (!isNaN(ordnId))
    orden = await pool.query(`SELECT c.id idq, c.tipo, c.ncuota, c.fechs, c.proyeccion cuota, 
    p.dto, p.id o, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.asesor, p.numerocuotaspryecto, 
    p.cuot, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, p.cupon, p.comision, p.status, 
    p.ahorro, c.cuota qota, l.id, l.producto, l.mtr, l.mtr2, l.inicial, l.valor, l.mz, l.n, 
    o.cuotamin, o.fechafin, o.proyect, o.porcentage, o.separaciones, o.maxini, o.maxfnc, q.descuento
    FROM preventa p LEFT JOIN cuotas c ON c.separacion = p.id LEFT JOIN cupones q ON p.cupon = q.id
    INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos o ON l.producto = o.id 
    WHERE p.id = ${ordnId} ORDER BY TIMESTAMP(c.fechs) ASC`);

  const productos = await pool.query(`SELECT o.proyect, o.porcentage, o.fechaini, 
  o.fechafin, o.separaciones, o.cuotamin, o.maxini, o.maxfnc, l.id, l.mz, l.n, l.mtr, l.mtr2, 
  l.producto, l.inicial, l.valor FROM productos o INNER JOIN productosd l ON l.producto = o.id 
  WHERE l.estado IN('9') ORDER BY o.proyect DESC, l.n ASC, l.mz ASC`);
  const asesores = await pool.query(`SELECT * FROM users ORDER BY fullname ASC`);
  const clientes = await pool.query(`SELECT * FROM clientes ORDER BY nombre ASC`);
  const descuentos = await pool.query(`SELECT * FROM descuentos`);
  const historiales = await pool.query(`SELECT * FROM historiales`);
  //console.log(orden, ordnId, !isNaN(ordnId));
  res.send({ productos, asesores, clientes, descuentos, orden, historiales });
});

router.post('/orden', isLoggedIn, async (req, res) => {
  const {
    numerocuotaspryecto,
    extraordinariameses,
    lote,
    client,
    ahora,
    cuot,
    cuotaextraordinaria,
    cupon,
    inicialdiferida,
    ahorro,
    fecha,
    cuota,
    tipod,
    estado,
    ncuota,
    tipo,
    obsevacion,
    separacion,
    extran,
    vrmt2,
    iniciar,
    tipoDto
  } = req.body;
  //console.log(req.body)
  const fp = await pool.query('SELECT * FROM productosd WHERE id = ? AND estado = 9', lote);
  if (!fp.length) {
    req.flash('error', 'Separación no realizada ya existe una orden con este lote');
    res.redirect(`/links/orden?id=${lote}&h=${ahora}`);
  } else {
    const comision = await pool.query(`SELECT p.id, p.proyect, l.mz, l.n, c.* FROM productos p 
    INNER JOIN productosd l ON l.producto = p.id LEFT JOIN comisiones c ON c.producto = p.id 
    AND c.asesor = ${req.user.id} WHERE l.id = ${lote}`);

    const separ = {
      lote,
      cliente: client[0],
      cliente2: client[1] ? client[1] : null,
      cliente3: client[2] ? client[2] : null,
      cliente4: client[3] ? client[3] : null,
      asesor: req.user.id,
      numerocuotaspryecto: numerocuotaspryecto ? numerocuotaspryecto : 0,
      extraordinariameses: extraordinariameses ? extraordinariameses : 0,
      cuotaextraordinaria: cuotaextraordinaria ? cuotaextraordinaria.replace(/\./g, '') : 0,
      cupon: cupon ? cupon : 1,
      inicialdiferida: inicialdiferida || 0,
      ahorro: ahorro !== '$0' ? ahorro.replace(/\./g, '') : 0,
      separar: separacion.replace(/\./g, ''),
      extran: extran ? extran : 0,
      vrmt2: vrmt2.replace(/\./g, ''),
      iniciar,
      cuot,
      dto: tipoDto,
      comision: comision[0].comision ? comision[0].comision : 0
    };
    //console.log(separ);
    const h = await pool.query('INSERT INTO preventa SET ? ', separ);
    await pool.query('UPDATE productosd set ? WHERE id = ?', [
      { estado: 1, tramitando: ahora },
      lote
    ]);
    cupon
      ? await pool.query('UPDATE cupones set ? WHERE id = ?', [
          { estado: 14, producto: h.insertId },
          cupon
        ])
      : '';

    var cuotas =
      'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, estado, proyeccion) VALUES ';
    if (Array.isArray(ncuota)) {
      await ncuota.map((t, i) => {
        cuotas += `(${h.insertId}, '${tipo[i]}', ${t}, '${fecha[i]}', ${cuota[i]}, ${estado[i]}, ${cuota[i]}),`;
      });
    } else {
      cuotas += `(${h.insertId}, '${tipo}', ${ncuota}, '${fecha}', ${cuota}, ${estado}, ${cuota}),`;
    }
    await pool.query(cuotas.slice(0, -1));

    req.flash('success', 'Separación realizada exitosamente');
    res.redirect('/links/reportes');
  }
});

router.get('/cel/:id', async (req, res) => {
  const { id } = req.params;
  const datos = await pool.query(
    `SELECT * FROM clientes WHERE movil LIKE '%${id}%' OR documento = '${id}'`
  );
  res.send(datos);
});

router.post('/codigo', isLoggedIn, async (req, res) => {
  const { movil } = req.body;
  const codigo = ID2(5);
  console.log(codigo);
  EnviarWTSAP(
    movil,
    `_*Grupo Elite* te da la Bienvenida, usa este codigo *${codigo}* para confirmar tu separacion_ \n\n_*GRUPO ELITE FICA RAÍZ*_`,
    `GRUPO ELITE te da la Bienvenida, usa este codigo ${codigo} para confirmar tu separacion`
  );
  res.send(codigo);
});

router.post('/tabla/:id', isLoggedIn, async (req, res) => {
  if (req.params.id == 1) {
    var data = new Array();
    dataSet.data = data;
    const {
      fcha,
      fcha2,
      cuota70,
      cuota30,
      oficial70,
      oficial30,
      N,
      u,
      mesesextra,
      extra,
      separacion
    } = req.body;
    var v = N == 1 ? 1 : Math.round((parseFloat(N) - parseFloat(u)) / 2);
    var p = (parseFloat(N) - parseFloat(u)) / 2;
    var j = Math.round(parseFloat(u) / 2);
    var o = parseFloat(u) / 2;
    var y = 0;

    l = {
      n: `1 <input value="1" type="hidden" name="ncuota">`,
      fecha: fcha2,
      oficial: `<span class="badge badge-dark text-center text-uppercase">Cuota De Separacion</span>`,
      cuota: `${separacion} <input value="${separacion.replace(
        /\./g,
        ''
      )}" type="hidden" name="cuota">`,
      stado: `<span class="badge badge-primary">Pendiente</span>
                    <input value="3" type="hidden" name="estado">
                    <input value="SEPARACION" type="hidden" name="tipo">`,
      n2: '',
      fecha2: '',
      cuota2: '',
      stado2: ''
    };
    dataSet.data.push(l);
    for (i = 1; i <= v; i++) {
      y = o < 1 ? j + i : u > 3 ? j + i + 2 : i + j + 1;
      if (i <= j && cuota30 != 0) {
        x = {
          n: i + `<input value="${i}" type="hidden" name="ncuota">`,
          fecha: moment(fcha).add(i, 'month'),
          oficial: `<span class="badge badge-dark text-center text-uppercase">Cuota Inicial ${oficial30}</span>`,
          cuota:
            cuota30 + `<input value="${cuota30.replace(/\./g, '')}" type="hidden" name="cuota">`,
          stado: `<span class="badge badge-primary">Pendiente</span>
                            <input value="3" type="hidden" name="estado">
                            <input value="INICIAL" type="hidden" name="tipo">`,
          n2: i > o ? '' : `${i + j} <input value="${i + j}" type="hidden" name="ncuota">`,
          fecha2: i > o ? '' : moment(fcha).add(i + j, 'month'),
          cuota2:
            i > o
              ? ''
              : cuota30 +
                `<input value="${cuota30.replace(/\./g, '')}" type="hidden" name="cuota">`,
          stado2:
            i > o
              ? ''
              : `<span class="badge badge-primary">Pendiente</span>
                                          <input value="3" type="hidden" name="estado">
                                          <input value="INICIAL" type="hidden" name="tipo">`
        };
        dataSet.data.push(x);
      } else if (cuota30 == 0) {
        v = N / 2;
        p = v;
        y = i;
      }

      d = {
        n: i + `<input value="${i}" type="hidden" name="ncuota">`,
        fecha: moment(fcha).add(y, 'month'),
        oficial: `<span class="badge badge-dark text-center text-uppercase">Financiamiento ${oficial70}</span>`,
        cuota: cuota70 + `<input value="${cuota70.replace(/\./g, '')}" type="hidden" name="cuota">`,
        stado: `<span class="badge badge-primary">Pendiente</span>
                        <input value="3" type="hidden" name="estado">
                        <input value="FINANCIACION" type="hidden" name="tipo">`,
        n2: i > p ? '' : `${v + i} <input value="${v + i}" type="hidden" name="ncuota">`,
        fecha2: i > p ? '' : moment(fcha).add(y + v, 'month'),
        cuota2:
          i > p
            ? ''
            : cuota70 + `<input value="${cuota70.replace(/\./g, '')}" type="hidden" name="cuota">`,
        stado2:
          i > p
            ? ''
            : `<span class="badge badge-primary">Pendiente</span>
                                      <input value="3" type="hidden" name="estado">
                                      <input value="FINANCIACION" type="hidden" name="tipo">`
      };

      if (d.fecha._d.getMonth() == 5 && (mesesextra == 6 || mesesextra == 2)) {
        d.cuota = `<mark> ${extra}</mark> <input value="${extra.replace(
          /\./g,
          ''
        )}" type="hidden" name="cuota">`;
      } else if (d.fecha._d.getMonth() == 11 && (mesesextra == 12 || mesesextra == 2)) {
        d.cuota = `<mark> ${extra}</mark> <input value="${extra.replace(
          /\./g,
          ''
        )}" type="hidden" name="cuota">`;
      }
      if (d.fecha2) {
        if (d.fecha2._d.getMonth() == 5 && (mesesextra == 6 || mesesextra == 2)) {
          d.cuota2 = `<mark> ${extra}</mark> <input value="${extra.replace(
            /\./g,
            ''
          )}" type="hidden" name="cuota">`;
        } else if (d.fecha2._d.getMonth() == 11 && (mesesextra == 12 || mesesextra == 2)) {
          d.cuota2 = `<mark> ${extra}</mark> <input value="${extra.replace(
            /\./g,
            ''
          )}" type="hidden" name="cuota">`;
        }
      }
      dataSet.data.push(d);
    }
    //console.log(dataSet);
    res.send(true);
  } else {
    res.send(dataSet);
  }
});

router.get('/ordendeseparacion/:id/:tp', isLoggedIn, async (req, res) => {
  //console.log(req.params)
  const { id, tp } = req.params;

  ////////////////////* CORREGIR PROYECION *////////////////////////
  if (tp !== 'ANULADA') {
    await ProyeccionPagos(id);
    const e = await Estados(id);
    var estado = e.pendients ? 8 : e.std;
    await pool.query(
      `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
    SET ? WHERE p.id = ?`,
      [{ 'l.estado': estado }, id]
    );
  }
  ////////////////////* END *//////////////////////////////////////

  sql = `SELECT p.*, pd.*, pt.*, c.*, u.*, cu.*, c2.nombre n2, c2.documento d2, c2.movil m2, c2.email e2, c3.nombre n3, 
  c3.documento d3, c3.movil m3, c3.email e3, c4.nombre n4, c4.documento d4, c4.movil m4, c4.email e4

   FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id 
   INNER JOIN productos pt ON pd.producto = pt.id INNER JOIN clientes c ON p.cliente = c.idc 
   LEFT JOIN clientes c2 ON p.cliente2 = c2.idc LEFT JOIN clientes c3 ON p.cliente3 = c3.idc 
   LEFT JOIN clientes c4 ON p.cliente4 = c4.idc INNER JOIN users u ON p.asesor = u.id 
   INNER JOIN cupones cu ON p.cupon = cu.id WHERE p.id = ?`;
  const orden = await pool.query(sql, id);

  console.log(orden);
  const r = await pool.query(
    `SELECT SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS monto, SUM(s.monto) AS monto1
                 FROM solicitudes s INNER JOIN preventa pr ON s.orden = pr.id INNER JOIN productosd pd ON s.lt = pd.id
                 LEFT JOIN cupones cp ON s.bono = cp.id WHERE s.stado = 4 AND pr.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO')  AND pr.id = ? `,
    id
  );
  var l = r[0].monto1 || 0,
    k = r[0].monto || 0;
  var total = l + k;
  //console.log(orden)
  res.render('links/ordendeseparacion', { orden, id, total });
});

router.get('/ordn/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto,
    p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.cupon, p.ahorro, p.fecha, p.obsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, pt.proyect, 
    c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento, s.concepto, s.stado
    FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id 
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
    INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id 
    LEFT JOIN solicitudes s ON p.lote = s.lt WHERE p.tipobsevacion IS NULL AND p.id = ? LIMIT 1`;

  const orden = await pool.query(sql, id);
  var abono = 0;
  orden.map(x => {
    if (x.concepto === 'ABONO' && x.stado == 4) {
      abono = 1;
    }
  });
  if (abono === 1) {
    req.flash('error', 'Esta separacion no es posible editarla ya que tiene un ABONO aprobado');
    res.redirect('/links/reportes');
  } else {
    //console.log(orden)
    res.render('links/ordn', { orden, id });
  }
});

router.get('/editordn2/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const iD = id.indexOf('*') > 0 ? id.split('*')[0] : id;

  const comi = await pool.query(`SELECT * FROM solicitudes WHERE concepto REGEXP 'COMISION|GESTION' 
  AND descp != 'SEPARACION' AND orden = ${id} AND stado != 6`);

  if (comi.length > 0 && id.indexOf('*') < 0) {
    req.flash(
      'error',
      'Esta Orden no es posible editarla ya que tiene ' + comi.length + ' comision(es) generadas'
    );
    res.redirect('/links/reportes');
  } else {
    sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto, p.asesor,
            p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
            p.cupon, p.ahorro, p.fecha, p.obsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, pt.proyect, 
            c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento, pd.uno, pd.dos, 
            COUNT(if(s.concepto = 'PAGO' OR s.concepto = 'ABONO', s.ids, NULL)) AS t, pd.tres, pd.directa, p.dto,
            pt.valmtr2, pt.porcentage, COALESCE(SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cu.monto + s.monto, 
            if((s.concepto = 'PAGO' OR s.concepto = 'ABONO') AND s.stado = 4, s.monto, 0))), 0) AS Montos, p.status 
            FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc  
            LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
            INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id 
            LEFT JOIN solicitudes s ON p.lote = s.lt WHERE p.tipobsevacion IS NULL AND p.id = ?
            GROUP BY p.id`;

    sql2 = `SELECT SUM(IF(c.tipo = 'SEPARACION', 1, '')) AS SEPARACION,
            SUM(IF(c.tipo = 'INICIAL', 1, '')) AS INICIAL,
            SUM(IF(c.tipo = 'FINANCIACION', 1, '')) AS FINANCIACION
            FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id 
            WHERE p.tipobsevacion IS NULL AND p.id = ?`;

    const orden = await pool.query(sql, iD);
    const cuotas = await pool.query(sql2, iD); //console.log(cuotas)
    res.render('links/editordn2', { iD, orden, cuotas });
  }
});

router.get('/editordn/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const iD = id.indexOf('*') > 0 ? id.split('*')[0] : id;

  const comi = await pool.query(`SELECT * FROM solicitudes WHERE concepto REGEXP 'COMISION|GESTION' 
  AND descp != 'SEPARACION' AND orden = ${iD} AND stado != 6`);

  if (comi.length > 0 && id.indexOf('*') < 0) {
    req.flash(
      'error',
      'Esta Orden no es posible editarla ya que tiene ' + comi.length + ' comision(es) generadas'
    );
    res.redirect('/links/reportes');
  } else {
    sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto, p.asesor,
            p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
            p.cupon, p.ahorro, p.fecha, p.obsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, pt.proyect, 
            c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento, pd.uno, pd.dos, 
            COUNT(if(s.concepto = 'PAGO' OR s.concepto = 'ABONO', s.ids, NULL)) AS t, pd.tres, pd.directa, p.dto,
            pt.valmtr2, pt.porcentage, COALESCE(SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cu.monto + s.monto, 
            if((s.concepto = 'PAGO' OR s.concepto = 'ABONO') AND s.stado = 4, s.monto, 0))), 0) AS Montos, p.status 
            FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc  
            LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
            INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id 
            LEFT JOIN solicitudes s ON p.lote = s.lt WHERE p.tipobsevacion IS NULL AND p.id = ?
            GROUP BY p.id`;

    sql2 = `SELECT SUM(IF(c.tipo = 'SEPARACION', 1, '')) AS SEPARACION,
            SUM(IF(c.tipo = 'INICIAL', 1, '')) AS INICIAL,
            SUM(IF(c.tipo = 'FINANCIACION', 1, '')) AS FINANCIACION
            FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id 
            WHERE p.tipobsevacion IS NULL AND p.id = ?`;

    const orden = await pool.query(sql, iD);
    const cuotas = await pool.query(sql2, iD); //console.log(cuotas)
    res.render('links/editordn', { iD, orden, cuotas });
  }
});

router.post('/ordn/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  sql = `SELECT * FROM cuotas WHERE separacion = ? ORDER BY fechs ASC`;
  const orden = await pool.query(sql, id);
  body = { data: orden };
  res.send(body);
});

router.post('/ordne/', isLoggedIn, async (req, res) => {
  const {
    cuot,
    idbono,
    lt,
    asesor,
    clientes,
    vmtr2,
    promesa,
    porcentage,
    inicial,
    xcntag,
    ahorro,
    inicialcuotas,
    financiacion,
    fecha,
    n,
    tipo,
    mtr2,
    total,
    cuota,
    preventa,
    uno,
    dos,
    tres,
    directa,
    otro,
    valmtr2,
    tipoDto
  } = req.body;

  console.log(req.body, cuota[0].replace(/\./g, ''), cuot);
  var vr = parseFloat(vmtr2.replace(/\./g, ''));
  var ini = parseFloat(inicial.replace(/\./g, ''));
  var tot = parseFloat(total.replace(/\./g, ''));
  var ahorr = ahorro ? parseFloat(ahorro.replace(/\./g, '')) : 0;

  // ESTABLECIENDO NUEVOS PARAMETROS
  var orden = {
    'p.lote': lt,
    'p.vrmt2': vr,
    'p.cliente': Array.isArray(clientes) ? clientes[0] : clientes,
    'p.asesor': asesor,
    'p.numerocuotaspryecto': parseFloat(inicialcuotas) + parseFloat(financiacion),
    'p.cupon': idbono ? idbono : 1,
    'p.inicialdiferida': inicialcuotas,
    'p.ahorro': ahorr,
    'p.separar': Array.isArray(n) ? cuota[0].replace(/\./g, '') : cuota.replace(/\./g, ''),
    'p.iniciar': xcntag,
    'p.cuot': Math.round(cuot),
    'p.dto': tipoDto
  };
  if (otro) {
    orden['l.uno'] = null;
    orden['l.dos'] = null;
    orden['l.tres'] = null;
    orden['l.directa'] = null;
    orden['l.estado'] = 9;
    orden['l.mtr'] = valmtr2;
    orden['l.valor'] = Math.round(valmtr2 * mtr2);
    orden['l.inicial'] = Math.round((valmtr2 * mtr2 * porcentage) / 100);
  } else {
    const r = await Estados(preventa);
    var estado = r.pendients ? 8 : r.std;
    orden['l.mtr'] = vr;
    orden['l.valor'] = tot;
    orden['l.inicial'] = ini;
    orden['l.estado'] = estado;
  }

  if (promesa) {
    orden['p.promesa'] = promesa;
    orden['p.autoriza'] = req.user.fullname;
    orden['p.status'] = promesa;
  }

  if (Array.isArray(clientes)) {
    switch (clientes.length) {
      case 2:
        orden['p.cliente2'] = clientes[1];
        break;
      case 3:
        orden['p.cliente2'] = clientes[1];
        orden['p.cliente3'] = clientes[2];
        break;
      case 4:
        orden['p.cliente2'] = clientes[1];
        orden['p.cliente3'] = clientes[2];
        orden['p.cliente4'] = clientes[3];
        break;
    }
  }
  // ACTUALIZANDO EL PRODUCTO Y LA ORDEN DE SEPARACION
  await pool.query(
    `UPDATE preventa p INNER JOIN productosd l ON l.id = p.lote SET ? WHERE p.id = ?`,
    [orden, preventa]
  );
  await pool.query(`UPDATE solicitudes SET lt = ${lt} WHERE orden = ?`, preventa);

  // BUSCANDO LAS COMICIONES ANTES GENERADAS
  const comisiones = await pool.query(
    `SELECT * FROM solicitudes WHERE descp != 'SEPARACION' 
    AND concepto IN('COMISION DIRECTA', 'COMISION INDIRECTA') AND orden = ?`,
    preventa
  );

  // ELIMINACION DE EL PLAN DE FINACIACION
  await pool.query('DELETE FROM cuotas WHERE separacion = ?', preventa);

  // INSERTANDO EL NUEVO PLAN DE FINANCIACION
  var cuotas =
    'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, estado, proyeccion) VALUES ';
  if (Array.isArray(n)) {
    n.map((c, i) => {
      cuotas += `(${preventa}, '${tipo[i]}', ${c}, '${fecha[i]}', ${cuota[i].replace(
        /\./g,
        ''
      )}, 3, ${cuota[i].replace(/\./g, '')}),`;
    });
  } else {
    cuotas += `(${preventa}, '${tipo}', ${n}, '${fecha}', ${cuota.replace(
      /\./g,
      ''
    )}, 3, ${cuota.replace(/\./g, '')}),`;
  }
  await pool.query(cuotas.slice(0, -1));

  // CAMBIAR LOS ESTADO DE COMISIONES EN EL NUEVO PRODUCTO (ESTO SE DA SI CAMBIAN EL LOTE)
  if (otro) {
    const r = await Estados(preventa);
    var estado = r.pendients ? 8 : r.std;
    var ip = uno ? 'uno = ' + uno + ', ' : '';
    ip += dos ? 'dos = ' + dos + ', ' : '';
    ip += tres ? 'tres = ' + tres + ', ' : '';
    ip += directa ? 'directa = ' + directa + ', ' : '';
    ip += 'estado = ' + estado + ', mtr = ' + vr + ', valor = ' + tot + ', inicial = ' + ini;
    await pool.query(`UPDATE productosd SET ${ip} WHERE id = ?`, lt);
  }

  //CAMBIAR LOS VALORES DE LAS COMICIONES GENERADAS SI EL VALOR DEL PRODUCTO VARIA
  var ttt = tot - ahorr;
  if (comisiones.length > 0) {
    comisiones
      .filter(x => {
        return x.total !== ttt;
      })
      .map(x => {
        var monto = ttt * x.porciento;
        var retefuente = monto * 0.1;
        var reteica = (monto * 8) / 1000;
        var pagar = monto - (retefuente + reteica);
        var h = { monto, total: ttt, retefuente, reteica, pagar };
        pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [h, x.ids]);
      });
  }
  res.send(true);
});

router.post('/separacion/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const fila = await pool.query(
    `SELECT p.extraordinariameses, p.cuotaextraordinaria, p.extran, 
    p.separar, p.vrmt2, p.iniciar, p.cupon, p.ahorro, p.obsevacion, c.descuento, c.pin FROM preventa p  
    LEFT JOIN cupones c ON p.cupon = c.id WHERE p.id = ?`,
    id
  );
  res.send(fila[0]);
});

router.post('/prodlotes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const productos = await pool.query(
    `SELECT p.*, l.* FROM productos p INNER JOIN productosd l ON l.producto = p.id LEFT JOIN preventa v ON v.lote = l.id 
    WHERE l.estado IN('9', '15') AND v.tipobsevacion = 'ANULADA' OR v.id = ? OR v.id IS NULL ORDER BY p.proyect DESC, l.mz ASC, l.n ASC`,
    id
  );
  const asesores = await pool.query(`SELECT * FROM users ORDER BY fullname ASC`);
  const clientes = await pool.query(`SELECT * FROM clientes ORDER BY nombre ASC`);
  const orden = await pool.query(
    `SELECT * FROM cuotas WHERE separacion = ? ORDER BY fechs ASC`,
    id
  );
  res.send({ productos, asesores, clientes, orden });
});

router.post('/editarorden', isLoggedIn, async (req, res) => {
  //console.log(req.body);
  const {
    orden,
    separacion,
    cuotaInicial,
    vrm2,
    cuotaFinanciacion,
    separar,
    ahorro,
    idpin,
    mxr,
    mss,
    porcentage,
    inicial,
    valor
  } = req.body;
  const actualizar = {
    'p.extran': mxr,
    'p.extraordinariameses': mss,
    'p.vrmt2': vrm2,
    'p.iniciar': porcentage,
    'p.ahorro': ahorro,
    'p.cuot': cuotaFinanciacion,
    'l.inicial': inicial,
    'l.valor': valor,
    'c.cuota': cuotaFinanciacion //'p.obsevacion',
  };
  if (separar > 0) {
    actualizar['p.separar'] = separacion;
    await pool.query(
      `UPDATE cuotas SET ? WHERE separacion = ? AND estado = 3 AND tipo = 'SEPARACION'`,
      [{ cuota: separacion }, orden]
    );
  }
  if (cuotaInicial > 0) {
    await pool.query(
      `UPDATE cuotas SET ? WHERE separacion = ? AND estado = 3 AND tipo = 'INICIAL'`,
      [{ cuota: cuotaInicial }, orden]
    );
  }
  idpin ? (actualizar['p.cupon'] = idpin) : '';

  var cf =
    mss == 3
      ? `AND c.estado = 3 AND c.tipo = 'FINANCIACION' AND MONTH(c.fechs) != 6 AND MONTH(c.fechs) != 12`
      : mss == 2
      ? `AND c.estado = 3 AND c.tipo = 'FINANCIACION' AND MONTH(c.fechs) != 12`
      : mss == 1
      ? `AND c.estado = 3 AND c.tipo = 'FINANCIACION' AND MONTH(c.fechs) != 6`
      : `AND c.estado = 3 AND c.tipo = 'FINANCIACION'`;

  await pool.query(
    `UPDATE cuotas c 
    INNER JOIN preventa p ON c.separacion = p.id
    INNER JOIN productosd l ON p.lote = l.id SET ? 
    WHERE c.separacion = ? ${cf}`,
    [actualizar, orden]
  );

  sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto, 
    p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.cupon, p.ahorro, p.fecha, p.obsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, pt.proyect, 
    c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento 
    FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id 
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
    INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id WHERE p.id = ?`;

  const ordn = await pool.query(sql, orden);
  //console.log(ordn)
  res.send(ordn);
});

router.post('/ordendeseparacion/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  let { p, i } = req.body;
  p = parseFloat(p);
  i = parseFloat(i);
  sql = `SELECT * FROM cuotas WHERE separacion = ? ORDER BY fechs ASC`;
  const orden = await pool.query(sql, id);
  var y = [orden[0]],
    o = [orden[0]];
  var e = Math.round(i / 2);
  var u = Math.round((p - i) / 2);
  var m = (p - i) / 2;
  var v = i / 2;
  w = await orden.map((t, c) => {
    if ((t.tipo === 'INICIAL' && i === 0) || (t.tipo === 'FINANCIACION' && p === 0)) {
      s = {
        id2: '',
        ncuota2: '',
        fecha2: '',
        proyeccion2: '',
        cuota2: '',
        estado2: '',
        diasmora2: '',
        mora2: ''
      };
      return Object.assign(t, s);
    }
    if (t.tipo === 'SEPARACION') {
      s = {
        id2: '',
        ncuota2: '',
        fecha2: '',
        proyeccion2: '',
        cuota2: '',
        estado2: '',
        diasmora2: '',
        mora2: ''
      };
      return Object.assign(orden[0], s);
    }
    if (t.tipo === 'INICIAL' && i === 1) {
      s = {
        id2: '',
        ncuota2: '',
        fecha2: '',
        proyeccion2: '',
        cuota2: '',
        estado2: '',
        diasmora2: '',
        mora2: ''
      };
      return Object.assign(t, s);
    } else if (t.tipo === 'INICIAL' && t.ncuota > e) {
      s = {
        id2: t.id,
        ncuota2: t.ncuota,
        fecha2: t.fechs,
        proyeccion2: t.proyeccion,
        cuota2: t.cuota,
        estado2: t.estado,
        diasmora2: t.diasmora,
        mora2: t.mora
      };
      return Object.assign(y[t.ncuota - e], s);
    } else if (t.tipo === 'INICIAL') {
      y.push(t);
      if (v !== e && t.ncuota === e) {
        h = {
          id2: '',
          ncuota2: '',
          fecha2: '',
          proyeccion2: '',
          cuota2: '',
          estado2: '',
          diasmora2: '',
          mora2: ''
        };
        return Object.assign(y[e], h);
      }
    }
    if (t.tipo === 'FINANCIACION' && p < 3) {
      s = {
        id2: '',
        ncuota2: '',
        fecha2: '',
        proyeccion2: '',
        cuota2: '',
        estado2: '',
        diasmora2: '',
        mora2: ''
      };
      return Object.assign(t, s);
    } else if (t.tipo === 'FINANCIACION' && t.ncuota > u) {
      s = {
        id2: t.id,
        ncuota2: t.ncuota,
        fecha2: t.fechs,
        proyeccion2: t.proyeccion,
        cuota2: t.cuota,
        estado2: t.estado,
        diasmora2: t.diasmora,
        mora2: t.mora
      };
      return Object.assign(o[t.ncuota - u], s);
    } else if (t.tipo === 'FINANCIACION') {
      o.push(t);
      if (m !== u && t.ncuota === u) {
        h = {
          id2: '',
          ncuota2: '',
          fecha2: '',
          proyeccion2: '',
          cuota2: '',
          estado2: '',
          diasmora2: '',
          mora2: ''
        };
        return Object.assign(o[u], h);
      }
    }
  });
  //console.log(w.filter(Boolean))
  respuesta = { data: w.filter(Boolean) };
  res.send(respuesta);
});
////////////////////* COMISIONES *//////////////////////////////////
router.get('/comisiones', isLoggedIn, async (req, res) => {
  /* const comis =
    await pool.query(`SELECT p.id ordn, p.lote, d.external, l.comisistema, l.comiempresa,
    l.valor - p.ahorro Total, (l.valor - p.ahorro) * p.iniciar / 100 Inicial, d.maxcomis, d.sistema,
    ( SELECT SUM(monto) FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id ) as abonos 
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id 
    WHERE p.tipobsevacion IS NULL AND p.status IN(2, 3) AND d.external IS NOT NULL AND l.comiempresa = 0 
    AND l.comisistema = 0 GROUP BY p.id HAVING abonos >= Inicial ORDER BY p.id`);
  const hoy = moment().format('YYYY-MM-DD HH:mm'); //console.log(comis)
  var f = [];
  var sql = `UPDATE productosd SET comiempresa = CASE id`;
  var sql2 = `, comisistema = CASE id`;
  var sq = false;

  if (comis.length > 0) {
    await comis.map(async (a, x) => {
      var monto = a.Total * a.maxcomis;
      var iva = monto * 0.19;
      //var Lote = { comiempresa: monto };
      sql += ` WHEN ${a.lote} THEN ${monto}`;
      f.push([
        hoy,
        monto,
        'GESTION VENTAS',
        9,
        'VENTA INDIRECTA',
        '00000000000000012345',
        a.maxcomis,
        a.Total,
        a.lote,
        iva,
        0,
        monto + iva,
        a.ordn
      ]);

      if (a.sistema) {
        sq = true;
        var montoST = a.Total * a.sistema;
        var ivaST = montoST * 0.19;
        //Lote.comisistema = montoST;
        sql2 += ` WHEN ${a.lote} THEN ${montoST}`;

        f.push([
          hoy,
          montoST,
          'GESTION ADMINISTRATIVA',
          8,
          'ADMIN PROYECTOS',
          '00000000000000012345',
          a.sistema,
          a.Total,
          a.lote,
          ivaST,
          0,
          montoST + ivaST,
          a.ordn
        ]);
      }
      //await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [Lote, a.lote]);
    });
    sql += ' ELSE comiempresa END';
    sql2 += ' ELSE comisistema END';
    await pool.query(
      `INSERT INTO solicitudes (fech, monto, concepto, stado, descp, asesor, 
            porciento, total, lt, retefuente, reteica, pagar, orden) VALUES ?`,
      [f]
    );
    await pool.query(`${sql}${sq ? sql2 : ''}`);
  } */

  const comi = await pool.query(`SELECT p.id ordn, l.valor - p.ahorro Total, 
    (l.valor - p.ahorro) * d.cobrosistema Inicial, ( SELECT SUM(monto) 
    FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id ) as abonos 
    FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id 
    WHERE p.tipobsevacion IS NULL AND d.external IS NOT NULL AND d.cobrosistema > 0 GROUP BY p.id 
    HAVING abonos >= Inicial ORDER BY p.id`);

  if (comi.length) {
    let ids = null;
    await comi.map(e => (ids += ids ? ', ' + e.ordn : e.ordn));
    await pool.query(`UPDATE solicitudes s SET s.fech = NOW(), 
        s.stado = 9 WHERE s.concepto = 'GESTION ADMINISTRATIVA' AND s.stado = 8 AND s.orden IN(${ids})`);
  }

  res.render('links/comisiones');
});

router.post('/comisiones', isLoggedIn, async (req, res) => {
  const pdo = await usuario(req.user, req.user.pin);
  const params = pdo ? `AND p.id IN (${pdo})` : '';

  const solicitudes =
    await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, pr.id orden, 
    s.descp, s.porciento, s.total, u.id idu, u.fullname nam, u.cel clu, u.username mail, pd.mz, 
    pd.n, s.retefuente, s.reteica, s.pagar, us.id, us.fullname, s.lt, cl.nombre, p.proyect 
    FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
    INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
    INNER JOIN productos p ON pd.producto = p.id INNER JOIN users us ON pr.asesor = us.id 
    INNER JOIN clientes cl ON pr.cliente = cl.idc WHERE s.concepto IN('GESTION ADMINISTRATIVA',
    'GESTION VENTAS') AND pr.tipobsevacion IS NULL ${params} AND p.estados != 15`);

  respuesta = { data: solicitudes };
  res.send(respuesta);
});

router.post('/comisiones/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  if (id !== 'nada' && !req.user.externo) {
    const solicitudes = await pool.query(
      `SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, c.idc i,
        s.descp, c.bank, c.documento docu, s.porciento, s.total, u.id idu, u.fullname nam, u.cel clu, 
        u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar, c.tipocta, us.id, us.fullname, s.lt,
        cl.nombre, c.numerocuenta, p.proyect FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users us ON pr.asesor = us.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc INNER JOIN clientes c ON u.cli = c.idc 
        WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'BONO EXTRA')
        AND pr.tipobsevacion IS NULL AND pr.id = ?`,
      id
    );

    respuesta = { data: solicitudes };
    res.send(respuesta);
  } else {
    respuesta = { data: [] };
    res.send(respuesta);
  }
});

router.post('/comision/:item', isLoggedIn, async (req, res) => {
  const { item } = req.params;
  if (item === 'pdf') {
    const { ids } = req.body;
    //console.log(ids);
    const r = await FacturaDeCobro(ids);
    /* const cobro = await pool.query(`SELECT * FROM solicitudes WHERE ids IN(${ids})`);
        console.log(cobro) */
    res.send(r);
  }
});

//////////////////////* ACUERDOS *//////////////////////////////////
router.post('/acuerdos/:orden', isLoggedIn, async (req, res) => {
  const { orden } = req.params;
  if (orden === 'nuevo') {
    const data = req.body;
    data.autoriza = req.user.fullname;
    data.estado = 9;
    console.log(data);
    await pool.query('INSERT INTO acuerdos SET ? ', data);
    res.send(true);
  } else if (orden !== 'nada') {
    const so = await pool.query(`SELECT a.*, SUM(IF(s.monto, s.monto, 0)) recaudo FROM acuerdos a 
      LEFT JOIN solicitudes s ON s.acuerdo = a.id WHERE a.orden = ${orden} GROUP BY a.id`);
    respuesta = { data: so };
    res.send(respuesta);
  } else {
    respuesta = { data: [] };
    res.send(respuesta);
  }
});

//////////////////////* REPORTES *//////////////////////////////////
router.get('/reportes', isLoggedIn, async (req, res) => {
  /* await pool.query(
    `UPDATE users u SET u.rutas = '[{"name":"Tablero","new":false,"link":"/tablero","activo":false,"icono":"sliders"},{"name":"Productos","new":false,"link":"/links/productos","activo":false,"todo":false,"aprobar":false,"eliminar":false,"actualizar":false,"anular":false,"declinar":false,"asociar":false,"desasociar":false,"ctaCobro":false,"productos":[],"icono":"bell"},{"name":"Reportes","new":false,"link":"/links/reportes","activo":false,"todo":false,"editar":false,"eliminar":false,"acuerdos":false,"anular":false,"comisiones":false,"proyeccion":false,"estados":false,"excel":false,"estadodecuentas":false,"productos":[],"icono":"layers"},{"name":"Comisiones","new":false,"link":"/links/comisiones","activo":false,"todo":false,"pagar":false,"eliminar":false,"actualizar":false,"anular":false,"declinar":false,"asociar":false,"desasociar":false,"ctaCobro":false,"productos":[],"icono":"pocket"},{"name":"Solicitudes","new":true,"link":"/links/solicitudes","activo":false,"todo":false,"aprobar":false,"eliminar":false,"actualizar":false,"anular":false,"declinar":false,"asociar":false,"desasociar":false,"ctaCobro":false,"productos":[],"icono":"bell"},{"name":"Pagos","new":false,"link":"/links/pagos","activo":true,"icono":"dollar-sign"},{"name":"Cupones","new":false,"link":"/links/cupones","activo":false,"icono":"tag"},{"name":"Clientes","new":false,"link":"/links/clientes","activo":false,"todo":false,"aprobar":false,"eliminar":false,"actualizar":false,"anular":false,"declinar":false,"asociar":false,"desasociar":false,"ctaCobro":false,"productos":[],"icono":"users"},{"name":"Asesores","new":false,"link":"/links/asesores","activo":false,"todo":false,"aprobar":false,"eliminar":false,"actualizar":false,"anular":false,"declinar":false,"asociar":false,"desasociar":false,"ctaCobro":false,"productos":[],"icono":"users"},{"name":"Red","new":false,"link":"/links/red","activo":false,"icono":"users"},{"name":"Cartera","new":false,"link":"/links/cartera","activo":false,"icono":"file-text"}]'`
  ); */
  res.render('links/reportes');
});
var CODE = null;

router.post('/anular', noExterno, async (req, res) => {
  const {
    id,
    lote,
    proyecto,
    mz,
    n,
    estado,
    nombre,
    movil,
    documento,
    fullname,
    cel,
    idc,
    qhacer,
    causa,
    motivo,
    asesor
  } = req.body;
  var bonoanular = null;
  console.log(req.body);
  if (estado == 1) {
    return res.send({
      std: false,
      msg: 'No es posible ANULAR una orden que no posea recibo, se aconseja eliminar'
    });
  }
  const u = await pool.query(
    `SELECT * FROM solicitudes WHERE stado = 3 AND concepto IN('PAGO', 'ABONO') AND orden = ${id}`
  );
  if (u.length > 0) {
    return res.send({
      std: false,
      msg: 'Esta orden aun tiene un pago indefinido, defina el estado del pago primero para continuar con la aunulacion'
    });
  } else {
    const r = await pool.query(`SELECT SUM(s.monto) AS monto1, p.separar, l.valor, p.ahorro,
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto, p.status, COUNT(s.monto) pagos
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id INNER JOIN preventa p ON s.orden = p.id 
        INNER JOIN productosd l ON s.lt = l.id WHERE s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL 
        AND s.stado = 4 AND s.orden = ${id} GROUP BY p.status, p.separar, l.valor, p.ahorro`);
    const l = r[0].monto1 || 0,
      k = r[0].monto || 0,
      t = r[0];
    const acumulado = l + k;
    console.log(acumulado);

    if (qhacer === 'BONO' && acumulado > 0) {
      var pin = ID(5);
      const bono = {
        pin,
        descuento: 0,
        producto: id,
        estado: 9,
        clients: idc,
        tip: qhacer,
        monto: acumulado,
        motivo,
        concept: causa
      };
      const a = await pool.query('INSERT INTO cupones SET ? ', bono);
      bonoanular = a.insertId;
      var nombr = nombre.split(' ')[0],
        fullnam = fullname.split(' ')[0],
        body = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(
          acumulado
        )}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo *${fullname}* su movil es *${cel}* y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`,
        body2 = `_*${fullnam}* se genero un *BONO* para el cliente *${nombre}* por consepto de *${causa} - ${motivo}*_\n\n_*GRUPO ELITE FICA RAÍZ*_`;
      EnviarWTSAP(movil, body);
      EnviarWTSAP(cel, body2);
    } else if (qhacer === 'DEVOLUCION' && acumulado > 0) {
      const porciento = t.status == 2 || t == 3 ? 0.2 : 1;
      const total = porciento < 1 ? (t.valor - t.ahorro) * porciento : 1000000; //t.separar deberia traer de productos el valor estipulado  para la separacion hablar con habib;
      const monto = acumulado;
      const facturasvenc = t.pagos;
      const fech = moment(new Date()).format('YYYY-MM-DD');
      bonoanular = null;
      const devolucion = {
        fech,
        monto,
        concepto: qhacer,
        stado: 3,
        descp: causa,
        orden: id,
        asesor,
        porciento,
        total,
        lt: lote,
        retefuente: 0,
        facturasvenc,
        recibo: 'NO APLICA',
        reteica: 0,
        pagar: Math.round(monto - total),
        formap: porciento < 1 ? 'JARRA-TOTAL' : 'JARRA-SEPARACION'
      };
      await pool.query(`INSERT INTO solicitudes SET ?`, devolucion);
    }
    const sql = `UPDATE cuotas c  
        INNER JOIN preventa p ON c.separacion = p.id
        INNER JOIN productosd l ON p.lote = l.id 
        INNER JOIN productos d ON l.producto  = d.id
        LEFT JOIN solicitudes s ON s.orden = p.id
        LEFT JOIN cupones cp ON p.cupon = cp.id 
        SET s.stado = 6, c.estado = 6, l.estado = 9, 
        l.valor = CASE WHEN d.valmtr2 > 0 THEN d.valmtr2 * l.mtr2 ELSE l.mtr * l.mtr2 END,
        l.inicial = CASE WHEN d.valmtr2 > 0 THEN (d.valmtr2 * l.mtr2) * d.porcentage / 100 
        ELSE (l.mtr * l.mtr2) * d.porcentage / 100 END, cp.estado = 6, p.tipobsevacion = 'ANULADA', 
        l.uno = NULL, l.dos = NULL, l.tres = NULL, l.directa = NULL,
        ${
          bonoanular ? 's.bonoanular = ' + bonoanular + ',' : ''
        } p.descrip = '${causa} - ${motivo}', 
        s.orden = p.id WHERE l.id = ? AND s.concepto != 'DEVOLUCION'`; //console.log(sql)
    await pool.query(sql, lote);
    res.send({ std: true, msg: 'Orden anulada correctamente' });
  }
  //respuesta = { "data": ventas };
});

const reajustesReportes = async (solicitudes, id = null) => {
  const defaul = { abonado: 0, mora: 0, adeudada: 0, saldo: 0, deuda: 0, montos: 0, morapaga: 0 };

  if (!id) return solicitudes.map(e => ({ ...e, ...defaul, total: e.total || e.valor }));

  const result = [];
  for (let i = 0; i < solicitudes.length; i++) {
    const e = solicitudes[i];
    const data = {
      ...e,
      ...(e.id ? await Montos(e.id) : defaul),
      total: e.total || e.valor
    };
    result.push(data);
  }
  return result;
};

router.get('/estadoscuentas/:id?', isLoggedIn, async (req, res) => {
  const parm = req.params;

  const pdo = await usuario(req.user, req.user.pin);

  const params = parm?.id
    ? `WHERE d.id= ${parm?.id} AND d.estados = 7`
    : pdo
    ? `WHERE d.id IN (${pdo}) AND d.estados = 7`
    : req.user.asistente
    ? 'WHERE d.estados = 7'
    : 'WHERE p.asesor = ? AND d.estados = 7';

  sql = `SELECT p.id, d.imagenes, COUNT(c.proyeccion) cuotas, d.proyect, l.mz, l.n, 
    if(u.nombre IS NOT NULL, u.nombre, e.estado) nombre, l.mtr2, 
    if (p.vrmt2, p.vrmt2, l.mtr) vrmt2, if (p.vrmt2, l.mtr2 * p.vrmt2, l.valor) valor, p.fecha, 
    q.descuento, p.ahorro, SUM(c.proyeccion) total,
    SUM(IF(c.fechs < CURDATE(), c.proyeccion, 0)) recaudoproyectado     
    FROM productos d INNER JOIN productosd l ON l.producto = d.id 
    INNER JOIN estados e ON l.estado = e.id LEFT JOIN preventa p ON p.lote = l.id 
    AND p.tipobsevacion IS NULL LEFT JOIN cuotas c ON c.separacion = p.id 
    LEFT JOIN cupones q ON q.id = p.cupon LEFT JOIN clientes u ON p.cliente = u.idc 
    ${params} GROUP BY l.id, p.id ORDER BY d.proyect, l.mz, l.n;`;

  const solicitudes = await pool.query(sql, req.user.id);

  const result = await reajustesReportes(solicitudes, parm?.id);

  // console.log(result, 'result ');
  return res.send({ data: result });
});

router.post('/reportes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (id == 'table2') {
    const pdo = await usuario(req.user, req.user.pin);
    const params = pdo
      ? `WHERE d.id IN(${pdo}) AND d.estados = 7`
      : req.user.asistente
      ? 'WHERE d.estados = 7'
      : 'WHERE p.asesor = ? AND d.estados = 7';

    sql = `SELECT p.id, l.id lote, d.proyect proyecto, l.mz, l.n, c.imags, p.promesa, p.status, p.asesor, c.email,
        p.tipobsevacion, l.estado, c.idc, c.nombre, c.movil, c.documento, u.fullname, u.cel, p.fecha, p.autoriza, 
        p.obsevacion, l.valor, p.separar, p.ahorro, l.valor - p.ahorro Total, e.pin, e.descuento, l.mtr, l.mtr2,
        p.fechapagoini,

        (SELECT SUM(cuota) FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3 ORDER BY fechs ASC) as deuda, 
        (SELECT COUNT(*) FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3 ORDER BY fechs ASC) as meses,
        (SELECT MAX(TIMESTAMP(fech)) FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id) as ultimoabono, 
        (SELECT SUM(monto) FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') AND orden = p.id AND stado = 4) as abonos, 
        CASE WHEN e.estado = 6 AND e.tip = 'CUPON' THEN 1 ELSE 0 END kupn

        FROM preventa p 
        INNER JOIN productosd l ON p.lote = l.id 
        INNER JOIN productos d ON l.producto = d.id 
        INNER JOIN clientes c ON p.cliente = c.idc 
        INNER JOIN users u ON p.asesor = u.id 
        LEFT JOIN cupones e ON p.id = e.producto ${params}
        GROUP BY p.id, e.id
        ORDER BY ultimoabono;`;

    const ventas = await pool.query(sql, req.user.id);
    respuesta = { data: ventas };
    res.send(respuesta);

    /*var sqlr = 'UPDATE preventa SET cliente4 = CASE id';
        var idss = '';
        ventas.map((v) => {
            sqlr += ' WHEN ' + v.id + ' THEN ' + v.idc;
            idss += v.id.toString() + ', ';
        })
        idss = idss.slice(0, -2);
        sqlr += ' END WHERE id IN(' + idss + ')';
        //console.log(sqlr)
        await pool.query(sqlr);*/
  } else if (id == 'estadosc') {
    const pdo = await usuario(req.user, req.user.pin);
    const params = pdo
      ? `WHERE d.id IN (${pdo}) AND d.estados = 7`
      : req.user.asistente
      ? 'WHERE d.estados = 7'
      : 'WHERE p.asesor = ? AND d.estados = 7';

    sql = `SELECT p.id, d.imagenes, COUNT(c.proyeccion) cuotas, d.proyect, l.mz, l.n, 
    if(u.nombre IS NOT NULL, u.nombre, e.estado) nombre, l.mtr2, 
    if (p.vrmt2, p.vrmt2, l.mtr) vrmt2, if (p.vrmt2, l.mtr2 * p.vrmt2, l.valor) valor, p.fecha, 
    q.descuento, p.ahorro, SUM(c.proyeccion) total,

    (SELECT SUM(s.monto) FROM solicitudes s WHERE s.orden = p.id AND s.stado = 4 
    AND s.concepto IN('PAGO', 'ABONO', 'BONO')) montos,

    (SELECT SUM(r.totalmora) - SUM(r.saldomora) FROM relacioncuotas r WHERE r.orden = p.id) mora,

    (SELECT SUM(r.morapaga) + SUM(r.saldomora) FROM relacioncuotas r WHERE r.orden = p.id) morapaga,

    SUM(IF(c.cuota = c.proyeccion AND c.diaspagados < 1, c.mora, 0)) morafutura, 

    SUM(IF(c.fechs < CURDATE(), c.proyeccion, 0)) recaudoproyectado     
    FROM productos d INNER JOIN productosd l ON l.producto = d.id 
    INNER JOIN estados e ON l.estado = e.id LEFT JOIN preventa p ON p.lote = l.id 
    AND p.tipobsevacion IS NULL LEFT JOIN cuotas c ON c.separacion = p.id 
    LEFT JOIN cupones q ON q.id = p.cupon LEFT JOIN clientes u ON p.cliente = u.idc 
    ${params} GROUP BY l.id, p.id ORDER BY d.proyect, l.mz, l.n;`;

    const solicitudes = await pool.query(sql, req.user.id);

    for (let i = 0; i < solicitudes.length; i++) {
      const e = solicitudes[i];
      console.log(e.id, e.proyect, e.mz, e.n);
      const result = e.id
        ? await Montos(e.id)
        : {
            abonado: 0,
            mora: 0,
            adeudada: 0,
            saldo: 0,
            deuda: 0
          };
      console.log(result, 'result ');
    }

    respuesta = { data: solicitudes };
    res.send(respuesta);
  } else if (id == 'estadosc2') {
    const pdo = await usuario(req.user, req.user.pin);
    const params = pdo
      ? `AND d.id IN(${pdo}) AND d.estados = 7`
      : req.user.asistente
      ? 'AND d.estados = 7'
      : 'AND p.asesor = ? AND d.estados = 7';

    sql = `SELECT COUNT(c.proyeccion) cuotas, MAX(c.ncuota) ncuota, MAX(c.tipo) descp, d.proyect, 
      l.mz, l.n, MAX(r.id) rid, u.nombre, p.fecha, s.fecharcb, s.ids, s.formap, s.monto, s.concepto, 
      s.img, SUM(r.mora) mora, (SELECT SUM(proyeccion) FROM cuotas WHERE separacion = p.id) total, 
      p.id FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON 
      l.producto = d.id INNER JOIN relacioncuotas r ON r.orden = p.id INNER JOIN cuotas c 
      ON r.cuota = c.id LEFT JOIN solicitudes s ON r.pago = s.ids INNER JOIN clientes u ON 
      p.cliente = u.idc WHERE p.tipobsevacion IS NULL ${params} GROUP BY s.ids, d.id, l.id, p.id 
      ORDER BY d.proyect, l.mz, l.n, rid DESC, ncuota, TIMESTAMP(s.fecharcb)`;

    const solicitudes = await pool.query(sql, req.user.id);
    respuesta = { data: solicitudes };

    /*const solicitudes2 = await pool.query(`SELECT s.ids, s.formap, REPLACE(s.recibo,'~','') recibo, s.monto, REPLACE(s.img,',','') img, s.bono, c.pin, c.motivo, 
        DATE_FORMAT(c.fecha, '%Y-%m-%d') fecha, c.tip, c.monto mounto FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id WHERE s.concepto IN('PAGO', 'ABONO')`);

        //console.log(solicitudes2)
        var sql = 'INSERT INTO recibos (registro, formapg, rcb, monto, baucher) VALUES ';
        var sql2 = 'INSERT INTO recibos (registro, date, formapg, rcb, monto, observacion, baucher, bono) VALUES ';
        solicitudes2.map((c) => {
            var rcb = c.recibo.indexOf(",") < 0 ? true : false;
            if (rcb) {                

                if (c.bono && c.formap && c.formap !== 'BONO') {
                    sql2 += `\n(${c.ids}, '${c.fecha}', 'BONO', '${c.pin}', ${c.mounto}, '${c.motivo}', '/img/bonos.png', ${c.bono}),`;
                    sql += `\n(${c.ids}, '${c.formap ? c.formap : 'INDEFINIDO'}', '${c.recibo}', ${c.monto}, '${c.img ? c.img : '/img/bonos.png'}'),`;
                } else if (c.bono && c.formap === 'BONO') {
                    sql2 += `\n(${c.ids}, '${c.fecha}', 'BONO', '${c.pin}', ${c.mounto}, '${c.motivo}', '/img/bonos.png', ${c.bono}),`;
                } else {
                    sql += `\n(${c.ids}, '${c.formap ? c.formap : 'INDEFINIDO'}', '${c.recibo}', ${c.monto}, '${c.img ? c.img : '/img/bonos.png'}'),`;
                }
            }
        })
        try {
            console.log(sql2.slice(0, -1));
            await pool.query(sql.slice(0, -1));
            await pool.query(sql2.slice(0, -1));
        }
        catch (e) {
            console.log(e);
        }*/
    res.send(respuesta);
    //res.send(true);
  } else if (id == 'eliminar') {
    const { k, code } = req.body; //console.log(req.body)
    const R = await Estados(k);
    await pool.query(
      `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
      [{ 'l.estado': R.std }, k]
    );
    const i = await pool.query(
      `SELECT pd.estado, p.lote, p.id, pd.n, pd.mz, pl.proyect 
        FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id 
        INNER JOIN productos pl ON pd.producto = pl.id 
        WHERE pd.estado != 9 AND p.id = ?`,
      k
    );

    if (i[0].estado !== 1) {
      var D = () => {
        var imagenes = U.img === null ? '' : U.img.indexOf(',') > 0 ? U.img.split(',') : U.img;
        if (Array.isArray(imagenes)) {
          imagenes.map(e => {
            Eli(e);
          });
        } else {
          Eli(imagenes);
        }
      };
      const u = await pool.query(
        `SELECT * FROM preventa p INNER JOIN productosd l ON p.lote = l.id 
            INNER JOIN productos pl ON l.producto = pl.id LEFT JOIN solicitudes s ON p.id = s.orden WHERE s.stado != 6 AND p.id = ?`,
        k
      );
      if (!CODE) {
        CODE = ID(7);
        var mensaje = `_*${
          req.user.fullname
        }* intenta eliminar la orden de separacion *${k}* la cual corresponde al LT: *${u[0].n}* ${
          u[0].mz === 'no' ? 'DE' : 'MZ: *' + u[0].mz + '* DE'
        } *${u[0].proyect}*_\n\n`;
        var concept = '';
        u.map(x => {
          if (x.concepto) {
            concept += `_MONTO: *$${Moneda(x.monto)}* CONCEPTO: *${x.concepto}*,_\n`;
          }
        });
        mensaje += concept
          ? `_Estas son las solicitudes que se veran afectadas si se elimina esta orden_\n${concept}\n`
          : '';
        mensaje += `_Codigo de autorizacion para la eliminacion total de la orden y todo aquello que incluya *${CODE}*_`;
        await EnviarWTSAP('57 3002851046', mensaje);
        res.send({ r: false, m: 'Codigo enviado' });
      } else if (CODE === code.toUpperCase()) {
        CODE = null;
        await pool.query(
          `UPDATE productosd l
                INNER JOIN productos p ON l.producto  = p.id 
                SET l.estado = 9, l.valor = if (p.valmtr2 != 0, p.valmtr2 * l.mtr2, l.mtr * l.mtr2),
                l.inicial = if (p.valmtr2 != 0, (p.valmtr2 * l.mtr2) * p.porcentage / 100, (l.mtr * l.mtr2) * p.porcentage / 100),
                l.uno = NULL, l.dos = NULL, l.tres = NULL, l.directa = NULL WHERE l.id = ?`,
          u[0].lote
        );

        await pool.query(
          `DELETE p, s FROM preventa p LEFT JOIN solicitudes s ON s.orden = p.id WHERE p.id = ?`,
          k
        );
        await EnviarWTSAP('57 3002851046', `Orden de separacion *${k}* eliminada correctamente`);
        res.send({ r: true, m: 'El reporte fue eliminado de manera exitosa' });
      } else {
        res.send({ r: false, m: `Codigo de autorizacion invalido` });
      }
    } else {
      await pool.query(
        `UPDATE productosd l
            INNER JOIN productos p ON l.producto  = p.id 
            SET l.estado = 9, l.valor = if (p.valmtr2 != 0, p.valmtr2 * l.mtr2, l.mtr * l.mtr2),
            l.inicial = if (p.valmtr2 != 0, (p.valmtr2 * l.mtr2) * p.porcentage / 100, (l.mtr * l.mtr2) * p.porcentage / 100),
            l.uno = NULL, l.dos = NULL, l.tres = NULL, l.directa = NULL WHERE l.id = ?`,
        i[0].lote
      );

      await pool.query(
        `DELETE p, s FROM preventa p LEFT JOIN solicitudes s ON s.orden = p.id WHERE p.id = ?`,
        k
      );
      await EnviarWTSAP(
        '57 3002851046',
        `_*${req.user.fullname}* elimino el LT: *${i[0].n}* ${
          i[0].mz === 'no' ? 'DE' : 'MZ: *' + i[0].mz + '* DE'
        } ${i[0].proyect}_`
      );
      res.send({ r: true, m: 'El reporte fue eliminado de manera exitosa' });
    }
  } else if (id === 'proyectos') {
    /////////////* Selecciona el nombre de cada proyecto *///////////////////
    sql = `SELECT DISTINCT pt.id, pt.proyect FROM preventa p 
        INNER JOIN productosd pd ON p.lote = pd.id 
        INNER JOIN productos pt ON pd.producto = pt.id`;
    const proyectos = await pool.query(sql);
    res.send(proyectos);
  } else if (id === 'verificar') {
    const { k, h } = req.body;
    const r = await Estados(k);
    var estado = r.pendients ? 8 : r.std;
    await pool.query(
      `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
        SET ? WHERE p.id = ?`,
      [{ 'l.estado': estado }, k]
    );
    res.send(true);
  } else if (id === 'restkupon') {
    const { k } = req.body;
    await RestablecerCupon(k);
    const r = await Estados(k);
    var estado = r.pendients ? 8 : r.std;
    await pool.query(
      `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
        SET ? WHERE p.id = ?`,
      [{ 'l.estado': estado }, k]
    );
    res.send(true);
  } else if (id === 'proyeccion') {
    const { k, h } = req.body;
    await ProyeccionPagos(k);
    const r = await Estados(k);
    var estado = r.pendients ? 8 : r.std;
    await pool.query(
      `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
        SET ? WHERE p.id = ?`,
      [{ 'l.estado': estado }, k]
    );
    res.send(true);
  } else if (id === 'estadopromesas') {
    const { k, h, f } = req.body;
    //h = parseFloat(h);
    sql = `SELECT * FROM preventa p
        INNER JOIN productosd l ON p.lote = l.id 
        INNER JOIN clientes c ON p.cliente = c.idc 
        INNER JOIN users u ON p.asesor = u.id WHERE p.id = ?`;
    const pers = await pool.query(sql, k);
    const p = pers[0];
    if (!p.directa || h >= 2) {
      await pool.query(
        `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
        [
          {
            'p.status': h,
            'p.promesa': h,
            'p.autoriza': req.user.fullname,
            'l.fechar': h == 2 && !p.directa ? f : p.fechar
          },
          k
        ]
      );
      if (h == 1) {
        var bod = `_*${p.nombre}*. RED ELITE a generado tu *PROMESA DE COMPRA VENTA* la cual te sera enviada al correo *${p.email}* una ves la halla autenticado dirijase a una de nuestras oficinas con el documento_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
        var bo = `_*${p.fullname.split(' ')[0]}* se a generado la *PROMESA DE COMPRA VENTA* de *${
          p.nombre
        }*. *MZ ${p.mz} LT ${p.n}* la cual le sera enviada al correo *${
          p.email
        }*, se recomienda realizar seguimiento al cliente para que haga la autenticacion en el menor tiempo posible_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
        await EnviarWTSAP(p.movil, bod);
        await EnviarWTSAP(p.cel, bo);
      } else if (h > 1) {
        const r = await Estados(k);
        var estado = r.pendients ? 8 : r.std;
        await pool.query(
          `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
                    SET ? WHERE p.id = ?`,
          [{ 'l.estado': estado }, k]
        );
      }
      res.send(true);
    } else {
      res.send(false);
    }
  } else if (id === 'cartera') {
    const { k, h } = req.body;
    var f = k ? `AND p.id = ${k}` : '';
    sql = `SELECT p.id, pd.id lote, pt.proyect proyecto, pd.mz, pd.n, c.imags, p.promesa, p.status,   
            pd.estado, c.idc, c.nombre, c.movil, c.documento, u.fullname, u.cel, p.fecha, p.autoriza, 
            t.estado std, t.tipo, t.ncuota, t.fechs, t.cuota, t.abono, t.mora, t.id idcuota
            FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id INNER JOIN cuotas t ON t.separacion = p.id WHERE p.tipobsevacion IS NULL 
            AND t.estado IN(3,5) AND t.fechs < '${h}' ${f}`;
    const cuotas = await pool.query(sql);
    respuesta = { data: cuotas };
    res.send(respuesta);
  } else if (id === 'comision') {
    const solicitudes =
      await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, c.idc i, s.fecharcb, pr.id orden,
        s.descp, c.bank, c.documento docu, s.porciento, s.total, u.id idu, u.fullname nam, u.cel clu, 
        u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar, c.tipocta, us.id, us.fullname, s.lt,
        cl.nombre, c.numerocuenta, p.proyect FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users us ON pr.asesor = us.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc INNER JOIN clientes c ON u.cli = c.idc 
        WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'BONO EXTRA')
        AND pr.tipobsevacion IS NULL ${
          req.user.auxicontbl ? '' : 'AND u.id = ' + req.user.id
        } AND p.estados != 15`); //${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}

    respuesta = { data: solicitudes };
    res.send(respuesta);
  } else if (id === 'comisionOLD' && !req.user.externo) {
    if (req.user.admin == 1) {
      const solicitudes =
        await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, c.idc i,
        s.descp, c.bank, c.documento docu, s.porciento, s.total, u.id idu, u.fullname nam, u.cel clu, 
        u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar, c.tipocta, us.id, us.fullname,
        cl.nombre, c.numerocuenta, p.proyect FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN users u ON s.asesor = u.id  LEFT JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id LEFT JOIN users us ON pr.asesor = us.id 
        LEFT JOIN clientes cl ON pr.cliente = cl.idc INNER JOIN clientes c ON u.cli = c.idc 
        WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'BONO EXTRA') AND pd.estado IN(9, 15)`); //${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}

      respuesta = { data: solicitudes };
      res.send(respuesta);
    }
  } else if (id === 'bank') {
    const { banco, cta, idbank, numero } = req.body;
    console.log(req.body);
    await pool.query(`UPDATE clientes SET ? WHERE idc = ?`, [
      { bank: banco, tipocta: cta, numerocuenta: numero },
      idbank
    ]);
    res.send({ banco, cta, idbank, numero });
  } else if (id === 'std') {
    const { ids, blck, observacion } = req.body;
    const std = parseFloat(req.body.std);
    let sql = `SET s.aprueba = '${req.user.fullname}'`;

    if (/0|6/.test(std)) {
      sql += `, l.uno = IF(s.descp = 'PRIMERA LINEA', NULL, l.uno), 
      l.dos = IF(s.descp = 'SEGUNDA LINEA', NULL, l.dos), 
      l.tres = IF(s.descp = 'TERCERA LINEA', NULL, l.tres), 
      l.directa = IF(s.descp = 'VENTA DIRECTA', NULL, l.directa),
      l.comiempresa = IF(s.descp = 'VENTA INDIRECTA', 0, l.comiempresa),
      l.comisistema = IF(s.descp = 'ADMIN PROYECTOS', 0, l.comisistema),
      p.blockcomi = ${blck ? 1 : null}`;
    }

    sql += !!observacion ? `, s.observaciones = '${observacion}'` : '';
    sql += std ? `, s.stado = ${std}` : '';

    await pool.query(`UPDATE solicitudes s INNER JOIN preventa p ON s.orden = p.id
     INNER JOIN productosd l ON p.lote = l.id ${sql} WHERE ids = ${ids}`);
    if (!std) await pool.query(`DELETE FROM solicitudes WHERE ids = ?`, ids);
    res.send(true);
  } else if (id === 'registrarcb' && !req.user.externo) {
    const { img, id, nrecibo, montos, feh, formap, observacion, j } = req.body;
    //console.log(req.body, j);
    if (j) {
      const rcb = {
        date: feh,
        formapg: formap,
        rcb: nrecibo,
        monto: montos.replace(/\./g, ''),
        observacion,
        baucher: img
      };
      await pool.query(`UPDATE recibos SET ? WHERE id = ?`, [rcb, j]);
    } else {
      var sql1 =
        'INSERT INTO cupones (pin, descuento, estado, tip, monto, motivo, concept) VALUES ';
      var sql2 =
        'INSERT INTO recibos (registro, date, formapg, rcb, monto, observacion, baucher) VALUES ';
      var sql3 = '';
      id.map((x, i) => {
        if (formap[i].indexOf('BONO') === 0) {
          sql3 += `('${nrecibo[i]}', 0, 14, 'BONO', ${montos[i].replace(/\./g, '')}, '${
            observacion[i]
          }', '${formap[i]}'),`;
          sql2 += `(${x}, '${feh[i]}', '${formap[i]}', '${nrecibo[i]}', ${montos[i].replace(
            /\./g,
            ''
          )}, '${observacion[i]}', '/img/bonos.png'),`;
        } else {
          sql2 += `(${x}, '${feh[i]}', '${formap[i]}', '${nrecibo[i]}', ${montos[i].replace(
            /\./g,
            ''
          )}, '${observacion[i]}', '${img[i]}'),`;
        }
      });

      //console.log(req.body, sql1 + sql3, sql2)
      sql3 ? await pool.query(sql1 + sql3.slice(0, -1)) : '';
      await pool.query(sql2.slice(0, -1));
    }
    res.send(true);
  } else if (id === 'fechas') {
    const { id, fecha } = req.body; //console.log(req.body)
    const date = { fecha };
    await pool.query(`UPDATE preventa SET ? WHERE id = ?`, [date, id]);
    res.send(true);
  } else if (id === 'restorden') {
    const { k } = req.body;
    const sql = `UPDATE cuotas c  
        INNER JOIN preventa p ON c.separacion = p.id
        INNER JOIN productosd l ON p.lote = l.id 
        INNER JOIN productos d ON l.producto  = d.id
        LEFT JOIN solicitudes s ON s.orden = p.id
        LEFT JOIN cupones cp ON p.cupon = cp.id 
        SET s.stado = 4, c.estado = 3, l.estado = 1, 
        cp.estado = 14, p.tipobsevacion = NULL WHERE p.id = ?`;
    await pool.query(sql, k);

    await ProyeccionPagos(k);
    const r = await Estados(k);
    var estado = r.pendients ? 8 : r.std;
    await pool.query(
      `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
        SET ? WHERE p.id = ?`,
      [{ 'l.estado': estado }, k]
    );
    res.send(true);
  } else if (id === 'excel') {
    const { k, h, proyecto, nombre, mz, n } = req.body;
    const ruta = path.join(__dirname, '../public/uploads/CUOTAS.xlsx');

    fs.exists(ruta, function (exists) {
      console.log('Archivo ' + exists, ' ruta ' + ruta, ' html ' + req.headers.origin);
      if (exists) {
        fs.unlink(ruta, function (err) {
          if (err) console.log(err);
          console.log('Archivo eliminado');
          return 'Archivo eliminado';
        });
      } else {
        console.log('El archivo no exise');
        return 'El archivo no exise';
      }
    });

    /* `SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, s.descp, s.lt, s.orden, c.id, c.separacion, c.tipo, c.ncuota, c.fechs, c.estado, c.mora, c.diasmora FROM solicitudes s INNER JOIN cuotas c ON c.separacion = s.orden WHERE c.separacion = 46 AND s.concepto IN('PAGO', 'ABONO') 
        GROUP BY s.ids, c.id 
        ORDER BY c.fechs, s.fech;` */

    let content = await pool.query(
      `SELECT c.id ID, c.fechs FECHA, c.tipo TIPO, c.ncuota N, c.proyeccion CUOTA, 
        MAX(CASE WHEN MONTH(s.fech) = MONTH(c.fechs) AND YEAR(s.fech) = YEAR(c.fechs) THEN s.fech END) FECHAPAGO, 
        SUM(CASE WHEN MONTH(s.fech) = MONTH(c.fechs) AND YEAR(s.fech) = YEAR(c.fechs) THEN s.monto END) MONTO,
        MAX(CASE WHEN MONTH(s.fech) = MONTH(c.fechs) AND YEAR(s.fech) = YEAR(c.fechs) THEN s.ids END) IDS, 
        c.cuota CUOT, e.estado ESTADO, c.diasmora DIASMORA, i.teano TEA, c.mora MORA, c.descuentomora DTO, 
        c.totaldiasmora TOTALDIASM, c.totalmora TOTALMORA
        FROM cuotas c INNER JOIN solicitudes s ON s.orden = c.separacion 
        INNER JOIN estados e ON c.estado = e.id LEFT JOIN intereses i ON c.tasa = i.id
        WHERE c.separacion = 46 AND s.concepto IN('PAGO', 'ABONO')
        GROUP BY c.id
        ORDER BY c.fechs`,
      k
    );

    let newWB = XLSX.utils.book_new();
    let newWS = XLSX.utils.json_to_sheet([
      {
        Orden: k,
        Fecha: h,
        Proyecto: proyecto,
        Mz: mz,
        Lt: n,
        Cliente: nombre
      }
    ]);
    let Ws = await Object.assign(newWS, {
      A4: {
        t: 's',
        v: 'ID',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      B4: {
        t: 's',
        v: 'FECHA',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      C4: {
        t: 's',
        v: 'TIPO',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      D4: {
        t: 's',
        v: 'N',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      E4: {
        t: 's',
        v: 'CUOTA',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      F4: {
        t: 's',
        v: 'FECHAPAGO',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      G4: {
        t: 's',
        v: 'MONTO',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      H4: {
        t: 's',
        v: 'IDS',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      I4: {
        t: 's',
        v: 'CUOT',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      J4: {
        t: 's',
        v: 'ESTADO',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      K4: {
        t: 's',
        v: 'DIASM',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      L4: {
        t: 's',
        v: 'TEA',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      M4: {
        t: 's',
        v: 'MORA',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      N4: {
        t: 's',
        v: 'DTO',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      O4: {
        t: 's',
        v: 'TLDIASM',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      },
      P4: {
        t: 's',
        v: 'TOTALMORA',
        s: {
          // Establecer un estilo separado para una celda
          font: {
            name: 'MV Boli',
            //sz: 24,
            bold: true,
            color: { rgb: 'FFFFAA00' }
            /* underline: true, // Subrayado
                        italic: true,
                        strike: true, // Tachado
                        outline: false,
                        shadow: false, */
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false
          },
          fill: { bgColor: { rgb: 'ffff00' } }
        }
      }
    });
    Ws['A1'].s = {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    };
    Ws['B1'].s = {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    };
    Ws['C1'].s = {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    };
    Ws['D1'].s = {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    };
    Ws['E1'].s = {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    };
    Ws['F1'].s = {
      // Establecer un estilo separado para una celda
      font: {
        name: 'MV Boli',
        bold: true,
        color: { rgb: 'FFFFAA00' }
      },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
      fill: { bgColor: { rgb: 'ffff00' } }
    };

    let cont = 5;
    await content.map(e => {
      Ws['A' + cont] = { t: 'n', v: e.ID };
      Ws['B' + cont] = { t: 's', v: e.FECHA };
      Ws['C' + cont] = { t: 's', v: e.TIPO };
      Ws['D' + cont] = { t: 'n', v: e.N };
      Ws['E' + cont] = { t: 'n', v: e.CUOTA, z: '$#,##0.00' };
      Ws['F' + cont] = { t: 's', v: e.FECHAPAGO ? e.FECHAPAGO : '' };
      Ws['G' + cont] = { t: 'n', v: e.MONTO ? e.MONTO : 0, z: '$#,##0.00' };
      Ws['H' + cont] = { t: 'n', v: e.IDS ? e.IDS : 0 };
      Ws['I' + cont] = { t: 'n', v: e.CUOT, z: '$#,##0.00' };
      Ws['J' + cont] = { t: 's', v: e.ESTADO };
      Ws['K' + cont] = { t: 'n', v: e.DIASMORA };
      Ws['L' + cont] = { t: 'n', v: e.TEA ? e.TEA : 0, z: '0.00%' };
      Ws['M' + cont] = { t: 'n', v: e.MORA ? e.MORA : 0, z: '$#,##0.00' };
      Ws['N' + cont] = { t: 'n', v: e.DTO, z: '0.00%' };
      Ws['O' + cont] = { t: 'n', v: e.TOTALDIASM, z: '0%' };
      Ws['P' + cont] = { t: 'n', v: e.TOTALMORA, z: '$#,##0.00' };
      cont++;
    });
    Ws['A' + cont] = {
      t: 's',
      v: '.',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['B' + cont] = {
      t: 's',
      v: '.',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['C' + cont] = {
      t: 's',
      v: '.',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['D' + cont] = {
      t: 's',
      v: 'TOTAL',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['E' + cont] = {
      t: 'n',
      f: `SUM(E5:E${cont - 1})`,
      z: '$#,##0.00',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['F' + cont] = {
      t: 's',
      v: 'ABONADO',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['G' + cont] = {
      t: 'n',
      f: `SUM(G5:G${cont - 1})`,
      z: '$#,##0.00',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['H' + cont] = {
      t: 's',
      v: 'DEUDA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['I' + cont] = {
      t: 'n',
      f: `SUM(I5:I${cont - 1})`,
      z: '$#,##0.00',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['J' + cont] = {
      t: 's',
      v: 'DIAS',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['K' + cont] = {
      t: 'n',
      f: `SUM(K5:K${cont - 1})`,
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['L' + cont] = {
      t: 's',
      v: 'MORA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['M' + cont] = {
      t: 'n',
      f: `SUM(M5:M${cont - 1})`,
      z: '$#,##0.00',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['N' + cont] = {
      t: 's',
      v: '.',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['O' + cont] = {
      t: 's',
      v: 'TOTALMORA',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['P' + cont] = {
      t: 'n',
      f: `SUM(P5:P${cont - 1})`,
      z: '$#,##0.00',
      s: {
        // Establecer un estilo separado para una celda
        font: {
          name: 'MV Boli',
          bold: true,
          color: { rgb: 'FFFFAA00' }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: false
        },
        fill: { bgColor: { rgb: 'ffff00' } }
      }
    };
    Ws['!ref'] = 'A1:P' + cont;
    XLSX.utils.book_append_sheet(newWB, newWS, 'FINANCIACION');
    XLSX.writeFile(newWB, ruta);
    res.send('/uploads/CUOTAS.xlsx');
  } else if (id === 'dctomora' && req.user.contador) {
    const { producto, dcto, monto, limite, tipo, stop } = req.body;
    const acuerdo = await pool.query(
      'SELECT id FROM acuerdos WHERE orden = ? AND estado IN(7, 9)',
      producto
    );
    if (!acuerdo.length) {
      const newAcuerdo = {
        orden: producto,
        limite,
        tipo,
        autoriza: req.user.fullname
      };
      dcto && (newAcuerdo.dcto = parseFloat(dcto) / 100);
      monto && (newAcuerdo.monto = parseFloat(monto));
      stop && (newAcuerdo.stop = 1);
      await pool.query(`INSERT INTO acuerdos SET ? `, newAcuerdo);
      res.send({ std: true, msj: 'Acuerdo establecido xitosamente' });
    } else {
      res.send({
        std: false,
        msj: 'Existe un Acuerdo vigente establecido, no es posible crear uno nuevo'
      });
    }
  } else if (id === 'pdfs') {
    const { orden, fecha } = req.body;
    await ProyeccionPagos(orden);
    await EstadoDeCuenta(orden);
    res.send(`/uploads/estadodecuenta-${orden}.pdf`);
  }
});

router.post('/rcb/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (id !== 'nada') {
    const so = await pool.query(
      `SELECT * FROM solicitudes 
        WHERE concepto IN ('PAGO','ABONO') AND orden = ? ORDER BY ids`,
      id
    );
    respuesta = { data: so };
    res.send(respuesta);
  } else {
    respuesta = { data: [] };
    res.send(respuesta);
  }
});

router.post('/std/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (id === 'bank') {
  } else if (id === 'bank') {
    res.send(true);
  }
});

router.get('/cedula/:id', isLoggedIn, async (req, res) => {
  /* const { id } = req.params;
  const datos = await consultarDocumentos('1', id);
  res.json(datos); */
});

router.post('/desendentes', noExterno, async (req, res) => {
  const { id, asesor } = req.body;
  const hoy = moment().format('YYYY-MM-DD');

  const sepBon = await pool.query(`SELECT * FROM solicitudes WHERE concepto NOT IN('PAGO', 'ABONO') 
    AND (concepto = 'BONO EXTRA' OR descp = 'SEPARACION') AND orden = ${id} AND stado != 6`);

  const bon = sepBon.some(e => e.concepto === 'BONO EXTRA');
  const sep = sepBon.some(e => e.descp === 'SEPARACION');

  const comisiones = await pool.query(
    `SELECT p.id ordn, p.asesor, p.ahorro, p.lote, p.comision, p.blockcomi, p.obsevacion, 
     u.bonoextra, o.incentivo, o.bextra, l.directa, l.valor, o.external, l.comiempresa, 
     o.maxcomis, l.comisistema, o.sistema, o.company, l.estado, p.status, p.separar, 
     SUM(IF(s.concepto = 'COMISION DIRECTA' AND s.descp = 'VENTA DIRECTA', s.monto, 0)) comy 
     FROM preventa p INNER JOIN productosd l ON p.lote = l.id
     INNER JOIN productos o ON l.producto = o.id INNER JOIN users u ON p.asesor = u.id
     INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN solicitudes s ON s.orden = p.id
     WHERE p.id = ? AND p.tipobsevacion IS NULL GROUP BY p.id`,
    id
  );

  if (comisiones.length) {
    await comisiones.map(async a => {
      const direct = !a.directa && !a.blockcomi;
      var estds = /10|13/.test(a.estado) && a.status > 1;
      const valor = a.valor - a.ahorro;
      const comision = Math.min(a.comision, a.maxcomis);
      const monto = valor * comision;
      const comisionEmpresa = valor * a.maxcomis;
      const comisionSistema = valor * a.sistema;
      const std = a.obsevacion === 'CARTERA' ? 1 : 15;
      var concpt = 'COMISION DIRECTA';
      var desc = 'VENTA DIRECTA';

      const reporte = {};
      const comis = [];

      if (estds && (direct || (a.comy > 0 && a.comy < monto))) {
        const mount = monto - a.comy;
        comis.push([hoy, mount, concpt, std, desc, a.asesor, comision, valor, a.lote, a.ordn]);
        reporte.directa = a.asesor;
      }

      if (!sep && a.incentivo) {
        desc = 'SEPARACION';
        comis.push([hoy, a.incentivo, concpt, std, desc, a.asesor, 0, a.separar, a.lote, a.ordn]);
      }

      if (!bon && a.bonoextra && estds && a.bextra) {
        const mount = valor * a.bonoextra;
        concpt = 'BONO EXTRA';
        desc = 'VENTA INDIRECTA';
        comis.push([hoy, mount, concpt, std, desc, a.asesor, a.bonoextra, valor, a.lote, a.ordn]);
      }

      if (a.external && estds && a.comiempresa < comisionEmpresa) {
        const mount = comisionEmpresa - a.comiempresa;
        concpt = 'GESTION VENTAS';
        desc = 'VENTA INDIRECTA';
        reporte.comiempresa = comisionEmpresa;
        comis.push([hoy, mount, concpt, 9, desc, a.company, a.maxcomis, valor, a.lote, a.ordn]);
      }

      if (a.external && a.sistema && estds && a.comisistema < comisionSistema) {
        const mount = comisionSistema - a.comisistema;
        concpt = 'GESTION ADMINISTRATIVA';
        desc = 'ADMIN PROYECTOS';
        reporte.comisistema = comisionSistema;
        comis.push([hoy, mount, concpt, 8, desc, a.company, a.sistema, valor, a.lote, a.ordn]);
      }

      if (comis.length) {
        const sql = `INSERT INTO solicitudes (fech, monto, concepto, 
          stado, descp, asesor, porciento, total, lt, orden) VALUES ?`;
        pool.query(sql, [comis]);
        pool.query(`UPDATE productosd SET ? WHERE id = ?`, [reporte, a.lote]);
      }
    });
  }

  await pool.query(`UPDATE solicitudes s INNER JOIN preventa p ON s.orden = p.id 
  SET s.fecharcb = p.fechapagoini WHERE (s.concepto LIKE '%COMISION%' OR s.concepto 
  LIKE '%GESTION%') AND s.descp != 'SEPARACION' AND p.fechapagoini IS NOT NULL`);

  res.send(true);
});

////////////////////////* SOLICITUDES || CONSULTAS *//////////////////////////////////
router.get('/solicitudes', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render('links/solicitudes');
});

router.post('/solicitudes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (id === 'pago') {
    let prd;
    if (req.user.externo) {
      const prcd = await pool.query(
        'SELECT producto FROM externos WHERE usuario = ?',
        req.user.pin
      );
      prd = prcd.map(e => e.producto);
    }
    let n = prd
      ? `AND p.id IN (${prd}) AND p.estados = 7`
      : req.user.asistente
      ? 'AND p.estados = 7'
      : 'AND u.id = ' + req.user.id + ' AND p.estados = 7';
    const so =
      await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, s.img, pd.valor, cpb.monto montoa, e.lugar, e.otro, s.observaciones,
        pr.ahorro, cl.email, s.facturasvenc, cp.producto, s.pdf, s.acumulado, u.fullname, s.aprueba, pr.descrip, cpb.producto ordenanu, 
        cl.documento, cl.idc, cl.movil, cl.nombre, s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, u.cel, pr.tipobsevacion, s.fecharcb, p.imagenes,
        pd.n, s.stado, cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto, pd.id, pr.lote, e.id extr, e.consignado, p.business,
        e.date, e.description, s.ids, s.descp, pr.id cparacion, pd.estado, s.bonoanular, s.aprobado FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id 
        LEFT JOIN preventa pr ON s.orden = pr.id INNER JOIN productosd pd ON s.lt = pd.id LEFT JOIN extrabanco e ON s.extrato = e.id
        INNER JOIN productos p ON pd.producto = p.id LEFT JOIN users u ON pr.asesor = u.id 
        LEFT JOIN clientes cl ON pr.cliente = cl.idc LEFT JOIN cupones cp ON s.bono = cp.id 
        LEFT JOIN cupones cpb ON s.bonoanular = cpb.id WHERE s.concepto IN ('PAGO','ABONO') ${n} ORDER BY s.ids`); // AND (pd.estado IN(9, 15) OR pr.tipobsevacion IS NOT NULL)
    respuesta = { data: so };
    res.send(respuesta);
  } else if (id == 'recibos') {
    var n = req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id;
    const so = await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, s.img, pd.valor, 
        cpb.monto montoa, pr.ahorro, cl.email, s.facturasvenc, cp.producto, s.pdf, s.acumulado, u.fullname, 
        s.aprueba, pr.descrip, cpb.producto ordenanu, cl.documento, cl.idc, cl.movil, cl.nombre, s.recibo, 
        c.tipo, c.ncuota, p.proyect, pd.mz, u.cel, pr.tipobsevacion, r.baucher, pd.n, s.stado, cp.pin bono, 
        cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto, pd.id, pr.lote, r.monto mont, r.rcb, 
        r.formapg, r.registro, r.date, s.ids, s.descp, pr.id cparacion, pd.estado, s.bonoanular 
        FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id INNER JOIN preventa pr ON s.lt = pr.lote 
        INNER JOIN productosd pd ON pr.lote = pd.id INNER JOIN productos p ON pd.producto = p.id 
        INNER JOIN users u ON pr.asesor = u.id INNER JOIN clientes cl ON pr.cliente = cl.idc 
        LEFT JOIN cupones cp ON s.bono = cp.id LEFT JOIN cupones cpb ON s.bonoanular = cpb.id 
        LEFT JOIN recibos r ON s.ids = r.registro WHERE s.concepto IN ('PAGO','ABONO') ${n} ORDER BY s.ids`); // AND s.ids = 2247
    respuesta = { data: so }; //console.log(respuesta);
    res.send(respuesta);
  } else if (id === 'devoluciones') {
    const solicitudes = await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, 
        s.stado, s.formap, s.facturasvenc, s.descp, s.porciento, s.total, u.fullname, s.orden,
        l.mz, l.n, s.pagar, c.movil, c.email, p.descrip, c.nombre, d.proyect FROM solicitudes s 
        INNER JOIN productosd l ON s.lt = l.id INNER JOIN users u ON s.asesor = u.id  
        INNER JOIN preventa p ON s.orden = p.id INNER JOIN productos d ON l.producto = d.id 
        INNER JOIN clientes c ON p.cliente = c.idc WHERE s.concepto = 'DEVOLUCION' 
        ${req.user.auxicontbl ? '' : 'AND u.id = ' + req.user.id}`);
    respuesta = { data: solicitudes }; //console.log(solicitudes)
    res.send(respuesta);
  } else if (id === 'comision') {
    const solicitudes =
      await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, s.descp, s.porciento, pg.stads, s.cuentadecobro,
        s.total, u.id idu, u.fullname nam, u.cel clu, u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar, pg.deuda, pg.cuentacobro,
        pg.fechas, pg.descuentos, us.id, us.fullname, cl.nombre, p.proyect FROM pagos pg INNER JOIN solicitudes s ON s.cuentadecobro = pg.id
        INNER JOIN productosd pd ON s.lt = pd.id INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users us ON pr.asesor = us.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONO EXTRA')  
        AND pr.tipobsevacion IS NULL AND s.cuentadecobro IS NOT NULL ${
          req.user.auxicontbl ? '' : 'AND u.id = ' + req.user.id
        }`); //AND stado = 3
    respuesta = { data: solicitudes }; //console.log(solicitudes)
    res.send(respuesta);
  } else if (id === 'bono') {
    const solicitudes = await pool.query(`SELECT * FROM solicitudes s  
        INNER JOIN users u ON s.asesor = u.id WHERE s.concepto = 'BONO'
        ${req.user.auxicontbl ? '' : 'AND u.id = ' + req.user.id}`);
    respuesta = { data: solicitudes };
    //console.log(solicitudes)
    res.send(respuesta);
  } else if (id === 'saldo') {
    const { lote, solicitud, fecha } = req.body; //console.log(lote, solicitud, fecha)
    const u = await pool.query(`SELECT * FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') 
        AND lt = ${lote} AND stado = 3 AND TIMESTAMP(fech) < '${fecha}' AND ids != ${solicitud}`);
    //console.log(u)
    if (u.length > 0) return res.send(false);

    const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = 4 AND s.lt = ${lote}
        AND TIMESTAMP(s.fech) < '${fecha}' AND s.ids != ${solicitud}`);
    var l = r[0].monto1 || 0,
      k = r[0].monto || 0;
    var acumulado = l + k;

    res.send({ d: acumulado ? acumulado : 'NO' });
  } else if (id === 'cuentacobro') {
    const { total, descuentos, solicitudes, usuario, fechas, ID } = req.body;
    if (ID) {
      var pdf = '/uploads/' + req.files[0].filename; //'https://grupoelitered.com.co/uploads/' +
      await pool.query(`UPDATE pagos SET ? WHERE id = ?`, [{ cuentacobro: pdf }, ID]);
      res.send(true);
    } else {
      var cuenta = {
        acredor: usuario,
        deuda: total,
        fechas,
        descuentos //, cuentacobro: pdf
      };
      var ctas = await pool.query(`INSERT INTO pagos SET ?`, cuenta);
      await pool.query(`UPDATE solicitudes SET ? WHERE ids IN(${solicitudes})`, {
        cuentadecobro: ctas.insertId,
        stado: 3
      });
      console.log(ctas.insertId);
      res.send({ id: ctas.insertId });
    }
  } else if (id == 'eliminar') {
    const { k, pdf, porque, nombre, movil } = req.body;
    Eli(pdf);
    await pool.query(`UPDATE solicitudes SET ? WHERE cuentadecobro = ?`, [{ stado: 9 }, k]);
    await pool.query(`DELETE FROM pagos WHERE id = ?`, k);
    var bod = `_*${nombre}*. Hemos decidido declina la cuenta por cobrar *${k}* porque: *${porque}*_\n\n*_RED ELITE_*`;
    await EnviarWTSAP(movil, bod);
    res.send({ r: true, m: 'Cuenta de cobro eliminada correctamente' });
  } else if (id == 'extractos') {
    /* if (req.user.admin != 1) {
            return res.send(false);
        }; */
    const solicitudes = await pool.query(`SELECT e.*, s.ids, s.fech, s.monto 
        FROM extrabanco e LEFT JOIN solicitudes s ON s.extrato = e.id WHERE e.consignado > 0  
        ORDER BY TIMESTAMP(e.date) ASC`);
    //console.log(solicitudes)
    respuesta = { data: solicitudes };
    res.send(respuesta);
  } else if (id == 'rcbcc') {
    if (!req.user.contador) {
      return res.send(false);
    }
    const { ids, montorcb, recibos } = req.body;
    var t = {
      rcbs: '/uploads/' + req.files[0].filename,
      stads: 4,
      rbc: recibos,
      monto: montorcb
    };
    await pool.query(
      'UPDATE pagos p INNER JOIN solicitudes s ON p.id = s.cuentadecobro SET ? WHERE p.id = ?',
      [
        {
          'p.rcbs': '/uploads/' + req.files[0].filename,
          'p.stads': 4,
          'p.rbc': recibos,
          'p.monto': montorcb,
          's.stado': 4
        },
        ids
      ]
    );
    res.send(true);
  } else if (id === 'fechas') {
    const { id, fecha } = req.body;
    console.log(req.body);
    await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [{ fecharcb: fecha }, id]);
    res.send(true);
  } else if (id === 'informe') {
    const ruta = await informes(req.body);
    console.log(ruta);
    res.send({ r: true, m: 'todo salio bien', data: `/uploads/informes.pdf` });
  }
});

router.put('/solicitudes/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (!req.user.contador) {
    return res.send({
      std: false,
      msg: `No tienes permiso para realizar esta accion`
    });
  }

  if (id === 'Declinar') {
    const { Orden, ids, img, por, cel, fullname, mz, n, proyect, nombre } = req.body;
    const r = await Estados(Orden);

    await pool.query(
      `UPDATE solicitudes s 
            LEFT JOIN cuotas c ON s.pago = c.id 
            LEFT JOIN cupones cp ON s.bono = cp.id
            INNER JOIN productosd l ON s.lt = l.id SET ? WHERE s.ids = ?`,
      [
        {
          'l.estado': r.std,
          'c.estado': 3,
          'cp.producto': null,
          'cp.estado': 9
        },
        ids
      ]
    );

    await pool.query(`DELETE FROM solicitudes WHERE ids = ?`, ids);

    var imagenes = img.indexOf(',') > 0 ? img.split(',') : img;
    if (Array.isArray(imagenes)) {
      imagenes.map(e => {
        Eli(e);
      });
    } else {
      Eli(imagenes);
    }
    if (cel) {
      //console.log(cel)
      var body = `_*${
        fullname.split(' ')[0]
      }*_\n_Solicitud de pago *RECHAZADA*_\n_Proyecto *${proyect}*_\n_Manzana *${mz}* Lote *${n}*_\n_Cliente *${nombre}*_\n\n_*DESCRIPCIÓN*:_\n_${por}_\n\n_*GRUPO ELITE FICA RAÍZ*_`;
      var sm = `${fullname.split(',')[0]} tu solicitud de pago fue RECHAZADA MZ${mz} LT${n} ${por}`;
      await EnviarWTSAP(cel, body, sm);
    }
    res.send(true);
  } else if (id === 'Enviar') {
    const { ids, movil, nombre, pdef } = req.body;
    var pdf = '';
    if (!req.files[0]) {
      pdf = pdef;
    } else {
      pdf = req.headers.origin + '/uploads/' + req.files[0].filename;
      await pool.query('UPDATE solicitudes SET ? WHERE ids = ?', [{ pdf }, ids]);
    }

    const msg = `_*${nombre}*. Hemos procesado tu *PAGO* de manera exitoza. Adjuntamos recibo de pago *#${ids}*_\n\n*_${req.user.nombre}_*\n\n${pdf}`;

    // await WspRcb(movil, pdf, ids);
    await WspNewUser(req.user.empresa, movil, msg, { media: pdf });
    const r = { std: true, msg: `Solicitud procesada correctamente` };
    res.send(r);
  } else if (id === 'Asociar') {
    const { ids, idExtracto } = req.body;
    await pool.query('UPDATE solicitudes SET ? WHERE ids = ?', [{ extrato: idExtracto }, ids]);
    res.send(true);
  } else if (id === 'Desasociar') {
    const { ids } = req.body;
    await pool.query('UPDATE solicitudes SET extrato = NULL WHERE ids = ?', ids);
    res.send(true);
  } else if (id === 'Anular') {
    const { ids, observacion, orden, std } = req.body;

    const comisiones = await pool.query(
      `SELECT p.id, ROUND(p.vrmt2 * l.mtr2) valor, p.iniciar, p.ahorro, p.dto, 
      SUM(IF((s.concepto LIKE '%COMISION%' OR s.concepto LIKE '%GESTION%') AND 
      s.descp != 'SEPARACION', 1, 0)) comis, SUM(IF(s.concepto IN('ABONO', 'PAGO') 
      AND s.stado = 4, s.monto, 0)) abonos, SUM(IF(s.ids = ?, s.monto, 0)) pago 
      FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN solicitudes s 
      ON s.orden = p.id WHERE p.id = ? GROUP BY p.id`,
      [ids, orden]
    );
    const comi = comisiones[0];
    if (comi.comis && std == 4) {
      const inicial =
        comi.dto === 'INICIAL'
          ? Math.round((comi.valor * comi.iniciar) / 100 - comi.ahorro)
          : comi.dto === 'FINANCIACION'
          ? Math.round((comi.valor * comi.iniciar) / 100)
          : Math.round(((comi.valor - comi.ahorro) * comi.iniciar) / 100);
      const abonos = Math.round(comi.abonos - comi.pago);

      if (abonos >= inicial) {
        await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [
          {
            stado: 6,
            aprueba: req.user.fullname,
            observaciones: observacion
          },
          ids
        ]);
        const r = await Estados(orden);
        const estado = r.pendients ? 8 : r.std;
        await pool.query(
          `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
          [{ 'l.estado': estado }, orden]
        );
        ProyeccionPagos(orden);
        return res.json({
          type: 'success',
          msg: `Solicitud procesada exitosamente, el pago fue anulado`
        });
      } else
        return res.json({
          type: 'error',
          msg: `Solicitud no pudo ser procesada, el pago de la orden que intenta anular 
          tiene ${comi.comis} comisiones generada(s), elimine estas he intentelo nuevamente`
        });
    }

    await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [
      {
        stado: 6,
        aprueba: req.user.fullname,
        observaciones: observacion
      },
      ids
    ]);
    if (std == 4) {
      const r = await Estados(orden);
      const estado = r.pendients ? 8 : r.std;
      await pool.query(
        `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
        [{ 'l.estado': estado }, orden]
      );
      ProyeccionPagos(orden);
    }
    return res.json({
      type: 'success',
      msg: `Solicitud procesada exitosamente, el pago fue anulado`
    });
  } else if (id === 'Eliminar') {
    const { ids, orden, std } = req.body;

    const comisiones = await pool.query(
      `SELECT p.id, ROUND(p.vrmt2 * l.mtr2) valor, p.iniciar, p.ahorro, p.dto, 
      SUM(IF((s.concepto LIKE '%COMISION%' OR s.concepto LIKE '%GESTION%') AND 
      s.descp != 'SEPARACION', 1, 0)) comis, SUM(IF(s.concepto IN('ABONO', 'PAGO') 
      AND s.stado = 4, s.monto, 0)) abonos, SUM(IF(s.ids = ?, s.monto, 0)) pago 
      FROM preventa p INNER JOIN productosd l ON p.lote = l.id INNER JOIN solicitudes s 
      ON s.orden = p.id WHERE p.id = ? GROUP BY p.id`,
      [ids, orden]
    );
    const comi = comisiones[0];

    if (comi.comis > 0 && std == 4) {
      const inicial =
        comi.dto === 'INICIAL'
          ? Math.round((comi.valor * comi.iniciar) / 100 - comi.ahorro)
          : comi.dto === 'FINANCIACION'
          ? Math.round((comi.valor * comi.iniciar) / 100)
          : Math.round(((comi.valor - comi.ahorro) * comi.iniciar) / 100);
      const abonos = Math.round(comi.abonos - comi.pago);

      if (abonos >= inicial) {
        await pool.query('DELETE FROM solicitudes WHERE ids = ?', ids);
        const r = await Estados(orden);
        const estado = r.pendients ? 8 : r.std;
        await pool.query(
          `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
          [{ 'l.estado': estado }, orden]
        );
        ProyeccionPagos(orden);
        return res.json({
          type: 'success',
          msg: `Solicitud procesada exitosamente, el pago fue eliminado`
        });
      } else
        return res.json({
          type: 'error',
          msg: `Solicitud no pudo ser procesada, el pago de la orden que intenta eliminar 
          tiene ${comi.comis} comisiones generada(s), elimine estas he intentelo nuevamente`
        });
    }
    await pool.query('DELETE FROM solicitudes WHERE ids = ?', ids);

    if (std == 4) {
      const r = await Estados(orden);
      const estado = r.pendients ? 8 : r.std;
      await pool.query(
        `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
        [{ 'l.estado': estado }, orden]
      );
      ProyeccionPagos(orden);
    }
    return res.json({
      type: 'success',
      msg: `Solicitud procesada exitosamente, el pago fue eliminado`
    });
  } else if (id === 'Desanular') {
    const { ids, orden, pdf } = req.body;

    await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [
      {
        stado: pdf ? 4 : 3,
        aprueba: req.user.fullname,
        observaciones: 'Desanulado'
      },
      ids
    ]);
    if (pdf) {
      const r = await Estados(orden);
      const estado = r.pendients ? 8 : r.std;
      await pool.query(
        `UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
        [{ 'l.estado': estado }, orden]
      );
      ProyeccionPagos(orden);
    }
    return res.json({
      type: 'success',
      msg: `Solicitud procesada exitosamente, el pago fue restablecido`
    });
  } else {
    const { ids, ahora, idExtracto, enviaRcb } = req.body;

    console.log({ ids, ahora, idExtracto, enviaRcb });

    const pdf = req.headers.origin + '/uploads/' + req.files[0]?.filename;
    const R = await PagosAbonos(ids, pdf, req.user, idExtracto, parseInt(enviaRcb));
    var w = { aprobado: ahora };
    idExtracto && (w.extrato = idExtracto);
    if (R) {
      await pool.query('UPDATE solicitudes SET ? WHERE ids = ?', [w, ids]);
    }
    res.send(R);
  }
});

/////////////////////////* AFILIACION *////////////////////////////////////////
router.post('/afiliado', isLoggedIn, async (req, res) => {
  const { movil, cajero } = req.body;
  var pin = ID(13);
  var cel = movil.replace(/-| /g, '');
  if (req.user.admin) {
    const h = await pool.query('SELECT * FROM pines WHERE celular = ? ', cel);

    if (h.length) pin = h[0].id;
    else {
      const nuevoPin = {
        id: pin,
        categoria: 1,
        usuario: req.user.id,
        celular: cel,
        empresa: req.user.empresa,
        paths:
          '[{"new":false,"link":"/tablero","name":"Tablero","icono":"sliders","activo":true},{"new":false,"link":"/links/productos","name":"Productos","todo":true,"icono":"bell","activo":true,"anular":true,"aprobar":true,"asociar":true,"ctaCobro":true,"declinar":true,"eliminar":true,"productos":[],"actualizar":true,"desasociar":true},{"new":false,"link":"/links/reportes","name":"Reportes","todo":true,"excel":false,"icono":"layers","activo":true,"anular":false,"editar":true,"estados":false,"acuerdos":false,"eliminar":true,"productos":[],"comisiones":false,"proyeccion":false,"estadodecuentas":false},{"new":false,"link":"/links/comisiones","name":"Comisiones","todo":true,"icono":"pocket","pagar":false,"activo":false,"anular":false,"asociar":false,"ctaCobro":false,"declinar":false,"eliminar":false,"productos":[],"actualizar":false,"desasociar":false},{"name":"Solicitudes","new":true,"link":"/links/solicitudes","activo":true,"todo":false,"aprobar":false,"eliminar":false,"extracto":true,"enviar":false,"actualizar":false,"anular":false,"declinar":false,"asociar":false,"desasociar":false,"desanular":false,"ctaCobro":false,"productos":[],"icono":"bell"},{"new":false,"link":"/links/pagos","name":"Pagos","icono":"dollar-sign","activo":true},{"new":false,"link":"/links/cupones","name":"Cupones","icono":"tag","activo":false},{"new":false,"link":"/links/clientes","name":"Clientes","todo":true,"icono":"users","activo":true,"anular":false,"aprobar":false,"asociar":false,"ctaCobro":false,"declinar":false,"eliminar":false,"productos":[],"actualizar":false,"desasociar":false},{"new":false,"link":"/links/asesores","name":"Asesores","todo":true,"icono":"users","activo":false,"anular":false,"aprobar":false,"asociar":false,"ctaCobro":false,"declinar":false,"eliminar":false,"productos":[],"actualizar":false,"desasociar":false},{"new":false,"link":"/links/red","name":"Red","icono":"users","activo":false},{"new":false,"link":"/links/cartera","name":"Cartera","icono":"file-text","activo":false}]'
      };
      await pool.query('INSERT INTO pines SET ? ', nuevoPin);
    }

    const msg = `_Hola, *${req.user.nombre}* te da la buenvenida._\n_Tu pin de registro es: *${pin}*_`;
    WspNewUser(req.user.empresa, cel, msg, { media: req.get('origin') + req.user.logo });

    req.flash(
      'success',
      'Pin enviado satisfactoriamente, comuniquese con el afiliado para que se registre'
    );
  } else {
    req.flash('error', 'No tienes autorizacion para realizar esta accion');
  }

  res.redirect('/tablero');
});

router.post('/id', async (req, res) => {
  const { pin } = req.body;
  const rows = await pool.query('SELECT * FROM pines WHERE id = ?', pin);
  if (rows.length > 0 && rows[0].acreedor === null) {
    registro.pin = pin;
    res.send('Exitoso');
  } else {
    res.send('Pin de registro invalido, comuniquese con su distribuidor!');
  }
});

//"a0Ab1Bc2Cd3De4Ef5Fg6Gh7Hi8Ij9Jk0KLm1Mn2No3Op4Pq5Qr6Rs7St8Tu9Uv0Vw1Wx2Xy3Yz4Z"
function ID(lon) {
  let chars = '0A1B2C3D4E5F6G7H8I9J0KL1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z',
    code = '';
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}

//Eli('uploads/3xcy-02nj3ptv8wt7r5-7235y48fk7ihmz.pdf');
function ID2(lon) {
  let chars = '1234567890',
    code = '';
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}

async function usuario(user, pin) {
  return user.externo
    ? (await pool.query('SELECT producto FROM externos WHERE usuario = ?', pin)).map(
        e => e.producto
      )
    : false;
}

async function saldo(producto, rango, id, monto) {
  var operacion;
  if (!producto && monto) {
    operacion = monto;
  } else if (!producto && !monto) {
    return 'NO';
  } else {
    const produ = await pool.query(
      `SELECT precio, utilidad, stock FROM products WHERE id_producto = ?`,
      producto
    );
    const rang = await pool.query(`SELECT comision FROM rangos WHERE id = ?`, rango);
    operacion = produ[0].precio - (produ[0].utilidad * rang[0].comision) / 100;
  }
  const saldo = await pool.query(
    `SELECT IF(saldoactual < ${operacion} OR saldoactual IS NULL,'NO','SI') Respuesta FROM users WHERE id = ? `,
    id
  );
  return saldo[0].Respuesta;
}

async function Rango(id) {
  /*if (id == 15) { return 1 }
    let m = new Date(),
        month = Math.sign(m.getMonth() - 2) > 0 ? m.getMonth() - 2 : 1,
        d, meses = 0,
        mes = 0,
        reportes = new Array(4);
    const reporte = await pool.query(`SELECT MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, SUM(p.precio) venta, SUM(p.utilidad) utilidad
    FROM ventas v 
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    WHERE v.vendedor = ?
        AND YEAR(v.fechadecompra) = YEAR(CURDATE()) 
        AND MONTH(v.fechadecompra) BETWEEN ${month} and 12
    GROUP BY MONTH(v.fechadecompra)
    ORDER BY 1`, id);
    const reporte2 = await pool.query(`SELECT MONTH(t.fecha) Mes, COUNT(*) CanTrans, SUM(t.monto) monto
    FROM transacciones t     
    WHERE t.acreedor = ?
        AND YEAR(t.fecha) = YEAR(CURDATE()) 
        AND MONTH(t.fecha) BETWEEN ${month} and 12
    GROUP BY MONTH(t.fecha)
    ORDER BY 1`, id);

    if (reporte.length > 0 || reporte2.length > 0) {
        await reporte.filter((repor) => {
            return repor.Mes === m.getMonth() + 1;
            //return repor.Mes === 9;
        }).map((repor) => {
            if (repor.CantMes >= 1 && repor.CantMes <= 19) {
                d = `${repor.Mes} ${repor.CantMes} 5`
                return reportes[0] = 5;
            } else if (repor.CantMes >= 20 && repor.CantMes <= 49) {
                return reportes[0] = 4;
            } else if (repor.CantMes >= 50 && repor.CantMes <= 99) {
                return reportes[0] = 3;
            } else if (repor.CantMes >= 100 && repor.CantMes <= 499) {
                return reportes[0] = 2;
            } else if (repor.CantMes >= 500) {
                return reportes[0] = 1;
            }
        });
        if (!reportes[0]) {
            reportes[0] = 6;
        };
        await reporte.filter((re) => {
            return re.Mes !== m.getMonth() + 1;
        }).map((re) => {
            mes += re.CantMes;
        });
        if (mes >= 1 && mes <= 59) {
            reportes[1] = 5;
        } else if (mes >= 60 && mes <= 149) {
            reportes[1] = 4;
        } else if (mes >= 150 && mes <= 299) {
            reportes[1] = 3;
        } else if (mes >= 300 && mes <= 1499) {
            reportes[1] = 2;
        } else if (mes >= 1500) {
            reportes[1] = 1;
        } else {
            reportes[1] = 6;
        }
        await reporte2.filter((re) => {
            return re.Mes !== m.getMonth() + 1;
        }).map((re) => {
            meses += re.monto;
        });
        if (meses <= 50000) {
            reportes[2] = 5;
        } else if (meses >= 600000 && meses <= 1499900) {
            reportes[2] = 4;
        } else if (meses >= 1500000 && meses <= 2999900) {
            reportes[2] = 3;
        } else if (meses >= 3000000 && meses <= 4999900) {
            reportes[2] = 2;
        } else if (meses >= 5000000) {
            reportes[2] = 1;
        } else {
            reportes[2] = 6;
        }
        await reporte2.filter((rep) => {
            return rep.Mes === m.getMonth() + 1;
        }).map((rep) => {
            if (rep.monto <= 50000) {
                return reportes[3] = 5;
            } else if (rep.monto >= 600000 && rep.monto <= 1499900) {
                return reportes[3] = 4;
            } else if (rep.monto >= 1500000 && rep.monto <= 2999900) {
                return reportes[3] = 3;
            } else if (rep.monto >= 3000000 && rep.monto <= 4999900) {
                return reportes[3] = 2;
            } else if (rep.monto >= 5000000) {
                return reportes[3] = 1;
            } else {
                return reportes[3] = 6;
            }
        });
        if (!reportes[3]) {
            reportes[3] = 6;
        };
        return Math.min(...reportes);
    } else {
        return 5;
    };
    return 4;*/
}

async function Estados(S) {
  // S = id de separacion

  var F = { r: S, m: `AND pr.id = ${S}` };

  const Pagos = await pool.query(
    `SELECT SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS BONOS, SUM(s.monto) AS MONTO,
         pr.asesor FROM solicitudes s INNER JOIN preventa pr ON s.orden = pr.id INNER JOIN productosd pd ON s.lt = pd.id
         LEFT JOIN cupones cp ON s.bono = cp.id WHERE s.stado = 4 AND pr.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO') ${F.m}`
  );
  const Cuotas = await pool.query(`SELECT p.separar AS SEPARACION,
    CASE p.dto
      WHEN "INICIAL" THEN ROUND((l.valor * p.iniciar /100) - p.ahorro)   
      WHEN "TOTAL" THEN ROUND((l.valor - p.ahorro) * p.iniciar /100)
      ELSE ROUND(l.valor * p.iniciar /100)
    END AS INICIAL,
    CASE p.dto
      WHEN "FINANCIACION" THEN ROUND((l.valor * (100 - p.iniciar) /100) - p.ahorro)
      WHEN "TOTAL" THEN ROUND((l.valor - p.ahorro) * (100 - p.iniciar) /100)
      ELSE ROUND(l.valor * (100 - p.iniciar) /100)
    END AS FINANCIACION,
    l.valor - p.ahorro AS TOTAL FROM preventa p INNER JOIN productosd l 
    ON p.lote = l.id WHERE p.tipobsevacion IS NULL AND p.id = ${F.r} LIMIT 1`);

  console.log(Pagos, Cuotas);
  const Pendientes = await pool.query(
    `SELECT * FROM solicitudes s INNER JOIN preventa pr ON s.orden = pr.id 
         INNER JOIN productosd pd ON s.lt = pd.id LEFT JOIN cupones cp ON s.bono = cp.id 
         WHERE s.stado = 3 AND pr.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO') ${F.m}`
  );
  var pendients = Pendientes.length || 0;
  if (Pagos[0].BONOS || Pagos[0].MONTO) {
    var pagos = Pagos[0].BONOS + Pagos[0].MONTO,
      cuotas = Cuotas[0]; //console.log(Pagos, Cuotas, Pendientes);

    if (pagos >= cuotas.TOTAL) {
      Desendentes(Pagos[0].asesor, 10);
      //console.log(Pagos, Cuotas, Pendientes, { std: 13, estado: 'VENDIDO', pendients });
      return { std: 13, estado: 'VENDIDO', pendients };
    } else if (pagos >= cuotas.INICIAL && pagos < cuotas.TOTAL) {
      Desendentes(Pagos[0].asesor, 10);
      //console.log(Pagos, Cuotas, Pendientes, { std: 10, estado: 'SEPARADO', pendients });
      return { std: 10, estado: 'SEPARADO', pendients };
    } else if (pagos >= cuotas.SEPARACION && pagos < cuotas.INICIAL) {
      //console.log(Pagos, Cuotas, Pendientes, { std: 12, estado: 'APARTADO', pendients });
      return { std: 12, estado: 'APARTADO', pendients };
    } else {
      //console.log(Pagos, Cuotas, Pendientes, { std: 1, estado: 'PENDIENTE', pendients }, 'Aca');
      return { std: 1, estado: 'PENDIENTE', pendients };
    }
  } else {
    //console.log(Pagos, Cuotas, Pendientes, { std: 1, estado: 'PENDIENTE', pendients }, 'aqui');
    return { std: 1, estado: 'PENDIENTE', pendients };
  }
}

async function RestablecerCupon(S) {
  const W = await pool.query(
    `SELECT c.id, p.numerocuotaspryecto, p.extraordinariameses, p.dto, 
    p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.ahorro, p.fecha, p.obsevacion, p.cuot, c.separacion, c.tipo, c.ncuota, c.fechs, 
    c.proyeccion, c.cuota, c.estado, l.mtr2, e.id idcupon, e.descuento FROM preventa p 
    INNER JOIN cuotas c ON c.separacion = p.id INNER JOIN productosd l ON p.lote = l.id 
    INNER JOIN cupones e ON p.id = e.producto WHERE p.id = ? AND p.tipobsevacion IS NULL 
    AND e.tip = 'CUPON' ORDER BY TIMESTAMP(c.fechs) ASC`,
    S
  );

  const x = W[0];
  const separa = x.separar;
  const valor = Math.round(x.vrmt2 * x.mtr2);
  const ahorro =
    x.dto === 'INICIAL'
      ? Math.round((((valor * x.iniciar) / 100) * x.descuento) / 100)
      : x.dto === 'FINANCIACION'
      ? Math.round(((valor - (valor * x.iniciar) / 100) * x.descuento) / 100)
      : Math.round((valor * x.descuento) / 100);

  const total = x.dto === 'TODO' ? Math.round(valor - ahorro) : valor;

  const initials =
    x.dto === 'INICIAL'
      ? Math.round((total * x.iniciar) / 100 - ahorro)
      : Math.round((total * x.iniciar) / 100);

  const incl = initials - separa;
  const inicial = Math.sign(incl) >= 0 ? incl : 0;
  const nini = x.inicialdiferida ? x.inicialdiferida : 0;
  const cuotaini = inicial ? Math.round(inicial / nini) : 0;

  const financiacion =
    x.dto === 'FINANCIACION' ? Math.round(total - inicial - ahorro) : Math.round(total - inicial);

  if (x.proyeccion > 0) {
    var Extra = 0,
      cont = 0;
    W.filter(c => {
      return c.proyeccion !== x.cuot && c.tipo === 'FINANCIACION';
    }).map(c => {
      Extra += c.proyeccion;
      cont++;
    });

    const nfncn = x.numerocuotaspryecto - nini - cont;
    const cuotafncn = Math.round((financiacion - Extra) / nfncn);

    const r = await pool.query(
      `UPDATE cuotas c INNER JOIN preventa p ON p.id = c.separacion 
        INNER JOIN cupones u ON u.id = p.cupon SET u.estado = 14, p.cupon = ${x.idcupon}, 
        p.ahorro = ${ahorro}, p.cuot = ${cuotafncn}, c.proyeccion = CASE WHEN c.tipo = 'SEPARACION' 
        THEN ${separa} WHEN c.tipo = 'INICIAL' THEN ${cuotaini} WHEN c.tipo = 'FINANCIACION' 
        AND c.proyeccion = ${x.cuot} THEN ${cuotafncn} ELSE c.proyeccion END, c.cuota = CASE  
        WHEN c.tipo = 'SEPARACION' THEN ${separa} WHEN c.tipo = 'INICIAL' THEN ${cuotaini}
        WHEN c.tipo = 'FINANCIACION' AND c.proyeccion = ${x.cuot} THEN ${cuotafncn}
        ELSE c.proyeccion END WHERE c.separacion = ?`,
      S
    );
    if (r.affectedRows) {
      await ProyeccionPagos(S);
    }
    return r.affectedRows;
  }
}

async function QuitarCupon(S) {
  const W = await pool.query(
    `SELECT c.id, p.numerocuotaspryecto, p.extraordinariameses,
    p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida,
    p.ahorro, p.fecha, p.obsevacion, p.cuot, c.separacion, c.tipo, c.ncuota, c.fechs, c.proyeccion,
    c.cuota, c.estado, l.mtr2 FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id
    INNER JOIN productosd l ON p.lote = l.id WHERE p.id = ? AND p.tipobsevacion IS NULL 
    ORDER BY TIMESTAMP(c.fechs) ASC`,
    S
  );

  const x = W[0];
  const separa = x.separar;
  const total = Math.round(x.vrmt2 * x.mtr2);
  const incl = Math.round((total * x.iniciar) / 100 - separa);
  const inicial = Math.sign(incl) >= 0 ? incl : 0;
  const nini = x.inicialdiferida ? x.inicialdiferida : 0;
  const cuotaini = inicial ? Math.round(inicial / nini) : 0;
  const financiacion = Math.round(total - (inicial + separa));

  if (x.proyeccion > 0) {
    var Extra = 0,
      cont = 0;
    W.filter(c => {
      return c.proyeccion !== x.cuot && c.tipo === 'FINANCIACION';
    }).map(c => {
      Extra += c.proyeccion;
      cont++;
    });

    const nfncn = x.numerocuotaspryecto - nini - cont;
    const cuotafncn = Math.round((financiacion - Extra) / nfncn);

    const r = await pool.query(
      `UPDATE cuotas c INNER JOIN preventa p ON p.id = c.separacion 
        INNER JOIN cupones u ON u.id = p.cupon SET u.estado = 6, p.cupon = 1, p.ahorro = 0, 
        p.cuot = ${cuotafncn}, c.proyeccion = CASE WHEN c.tipo = 'SEPARACION' THEN ${separa} 
        WHEN c.tipo = 'INICIAL' THEN ${cuotaini} WHEN c.tipo = 'FINANCIACION' 
        AND c.proyeccion = ${x.cuot} THEN ${cuotafncn} ELSE c.proyeccion END, c.cuota = CASE  
        WHEN c.tipo = 'SEPARACION' THEN ${separa} WHEN c.tipo = 'INICIAL' THEN ${cuotaini}
        WHEN c.tipo = 'FINANCIACION' AND c.proyeccion = ${x.cuot} THEN ${cuotafncn}
        ELSE c.proyeccion END WHERE c.separacion = ?`,
      S
    );
    if (r.affectedRows) {
      await ProyeccionPagos(S);
    }
    return r.affectedRows;
  } else {
    const extraordinarias = Math.round(x.cuotaextraordinaria * x.extran);
    const cuotaordi = x.cuotaextraordinaria;
    const nfnc = x.numerocuotaspryecto - nini - x.extran;
    const cuotafnc = Math.round((financiacion - extraordinarias) / nfnc);
    const cf = x.extraordinariameses;
    mes6 = cuotafnc;
    mes12 = cuotafnc;

    if (cuotaordi) {
      cf == 1 ? (mes6 = cuotaordi) : cf == 2 ? (mes12 = cuotaordi) : (mes6 = cuotaordi),
        (mes12 = cuotaordi);
    }

    const r = await pool.query(
      `UPDATE cuotas c INNER JOIN preventa p ON p.id = c.separacion 
        INNER JOIN cupones u ON u.id = p.cupon SET u.estado = 6, p.cupon = 1, p.ahorro = 0, 
        p.cuot = ${cuotafnc}, c.proyeccion = CASE WHEN c.tipo = 'SEPARACION' THEN ${separa} 
        WHEN c.tipo = 'INICIAL' THEN ${cuotaini}
        WHEN c.tipo = 'FINANCIACION' AND 
        MONTH(c.fechs) = 6 THEN ${mes6}
        WHEN c.tipo = 'FINANCIACION' AND 
        MONTH(c.fechs) = 12 THEN ${mes12}
        ELSE ${cuotafnc} END, c.cuota = CASE 
        WHEN c.tipo = 'SEPARACION' THEN ${separa} 
        WHEN c.tipo = 'INICIAL' THEN ${cuotaini}
        WHEN c.tipo = 'FINANCIACION' AND 
        MONTH(c.fechs) = 6 THEN ${mes6}
        WHEN c.tipo = 'FINANCIACION' AND 
        MONTH(c.fechs) = 12 THEN ${mes12}
        ELSE ${cuotafnc} END 
        WHERE c.separacion = ?`,
      S
    );

    if (r.affectedRows) {
      await ProyeccionPagos(S);
    }
    return r.affectedRows;
  }
}

async function ProyeccionPagos(S) {
  let W = await pool.query(
    `SELECT c.id, p.numerocuotaspryecto, p.extraordinariameses, p.dto, e.descuento,
    p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida,
    p.ahorro, p.fecha, p.obsevacion, p.cuot, c.separacion, c.tipo, c.ncuota, c.fechs, 
    c.proyeccion, c.cuota, c.estado, l.mtr2, d.moras, d.timelimit FROM preventa p 
    INNER JOIN cuotas c ON c.separacion = p.id INNER JOIN productosd l ON p.lote = l.id 
    INNER JOIN productos d ON l.producto = d.id LEFT JOIN cupones e ON p.cupon = e.id 
    WHERE p.id = ? AND p.tipobsevacion IS NULL ORDER BY TIMESTAMP(c.fechs) ASC`,
    S
  );

  if (!W.length) return;
  const x = W[0];
  const Cartera = x.obsevacion;
  const Proyeccion = x.proyeccion;
  const separa = x.separar;
  const valor = Math.round(x.vrmt2 * x.mtr2);
  const ahorro =
    x.dto === 'INICIAL'
      ? Math.round((((valor * x.iniciar) / 100) * x.descuento) / 100)
      : x.dto === 'FINANCIACION'
      ? Math.round(((valor - (valor * x.iniciar) / 100) * x.descuento) / 100)
      : Math.round((valor * x.descuento) / 100);

  const total = x.dto === 'TODO' ? Math.round(valor - ahorro) : valor;

  const initials =
    x.dto === 'INICIAL'
      ? Math.round((total * x.iniciar) / 100 - ahorro)
      : Math.round((total * x.iniciar) / 100);

  const inicial = x.separar >= initials ? 0 : initials - separa;

  const financiacion =
    x.dto === 'FINANCIACION'
      ? Math.round(total - (inicial + x.separar) - ahorro)
      : Math.round(total - (inicial + x.separar));

  //console.log(pagos, Cartera, Proyeccion, separa, total, inicial, financiacion, x)
  if (Proyeccion > 0) {
    op = true;
    await pool.query(
      `UPDATE cuotas SET estado = 3, mora = 0, abono = 0, diaspagados = 0, 
        diasmora = 0, cuota = proyeccion WHERE separacion = ?`,
      S
    );
  } else {
    // if (Cartera !== 'CARTERA')
    const extraordinarias = Math.round(x.cuotaextraordinaria * x.extran);
    const cuotaordi = x.cuotaextraordinaria;
    const nini = x.inicialdiferida ? x.inicialdiferida : 0;
    const nfnc = x.numerocuotaspryecto - nini - x.extran;
    const cuotaini = inicial && nini ? Math.round(inicial / nini) : 0;
    const financiamiento = !nini && inicial ? financiacion + inicial : financiacion;
    const cuotafnc = Math.round((financiamiento - extraordinarias) / nfnc);
    const cf = x.extraordinariameses;
    mes6 = cuotafnc;
    mes12 = cuotafnc;

    if (cuotaordi) {
      cf == 1 ? (mes6 = cuotaordi) : cf == 2 ? (mes12 = cuotaordi) : (mes6 = cuotaordi),
        (mes12 = cuotaordi);
    }

    await pool.query(
      `UPDATE cuotas SET estado = 3, 
        mora = 0, abono = 0, diaspagados = 0, 
        diasmora = 0, cuota = CASE 
        WHEN tipo = 'SEPARACION' THEN ${separa} 
        ${nini && inicial ? `WHEN tipo = 'INICIAL' THEN ${cuotaini}` : ''}        
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 6 THEN ${mes6}
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 12 THEN ${mes12}
        ELSE ${cuotafnc} END, proyeccion = CASE 
        WHEN tipo = 'SEPARACION' THEN ${separa} 
        ${nini && inicial ? `WHEN tipo = 'INICIAL' THEN ${cuotaini}` : ''}
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 6 THEN ${mes6}
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 12 THEN ${mes12}
        ELSE ${cuotafnc} END 
        WHERE separacion = ?`,
      S
    );
  }

  ////////////////////* ASIGNAR RELACION DE PAGOS CUOTAS *////////////////////////
  let Cuotas = await pool.query(
    `SELECT c.*, r.pago FROM cuotas c LEFT JOIN relacioncuotas r ON c.id = r.cuota 
    WHERE c.separacion = ? ORDER BY TIMESTAMP(c.fechs) ASC`,
    S
  );

  if (Cuotas[0].pago) {
    await pool.query(
      `DELETE r FROM cuotas c INNER JOIN relacioncuotas r ON c.id = r.cuota WHERE c.separacion = ?`,
      S
    );
    Cuotas = await pool.query(
      `SELECT * FROM cuotas WHERE separacion = ? ORDER BY TIMESTAMP(fechs) ASC`,
      S
    );
  }
  const Abonos = await pool.query(
    `SELECT s.ids, s.monto, s.fech, s.fecharcb, a.dcto, a.estado FROM solicitudes s 
    LEFT JOIN acuerdos a ON s.acuerdo = a.id WHERE s.concepto IN('PAGO', 'ABONO', 'BONO') AND s.stado = 4 AND s.orden = ? 
    ORDER BY TIMESTAMP(s.fecharcb) ASC, TIMESTAMP(s.fech) ASC`,
    S
  );

  const acuerdos = await pool.query(
    `SELECT * FROM acuerdos a WHERE a.orden = ? AND a.estado IN(7, 9)`,
    S
  );

  const Moras = await pool.query(`SELECT * FROM intereses ORDER BY fecha`);
  let mOra = false; //false/true determina si el proyecto cobra mora o no, predeterminado en false (no cobra)
  let cuotas = Cuotas.map(e => {
    const diffDay = moment().diff(e.fechs, 'days'); // dias vencidos de una cuota
    if (!mOra) mOra = x.moras && diffDay > x.timelimit; // determina si el proyecto cobra mora
    return {
      id: e.id,
      cuota: e.cuota,
      monto: e.cuota,
      fechs: e.fechs,
      total: 0,
      estado: 3
    };
  });

  let Relacion = []; // aqui estara la relacion entre pagos y cuotas
  let idCuota = false; // id de cada cuota
  let montoparainicial = 0; // monto para calcular la fecha de la cuota inicial
  let fechapagoini = false; // fecha en la que se termino de pagar la cuota inicial

  let acuerdoActual = 0; // variable que determina desde que acuerdo empezara la logica del algoritmo para generar los descuentos
  let totalAcuerdos = acuerdos.length - 1; // se determina el numero de acuerdo vigentes o activos que el cliente a echo con la empresa a lo largo del tiempo
  let startDate = moment(acuerdos[acuerdoActual]?.start || '2017-08-31').format('YYYY-MM-DD'); // fecha en la que entra en vigencia un acuerdo desde la que el sistema empesara a cobrar mora
  let stopDate = moment(acuerdos[acuerdoActual]?.stop).format('YYYY-MM-DD'); // fecha hasta cuando se cobrara o congelara una mora en la que el sistema dejara de cobrar mora
  let endDate = moment(acuerdos[acuerdoActual]?.end).format('YYYY-MM-DD'); // fecha fin de un acuerdo prestablecido en la que el sistema dejara de congelar la mora
  let dcto = acuerdos[acuerdoActual]?.dcto || 0;

  const pruebas = await Math.min(
    ...(Moras.filter(x => moment(x.fecha).isBetween('2022-08-05', '2022-08-08', 'month', '[]')).map(
      x => x.teano
    ) || [0])
  );

  for (i = 0; i < Abonos.length; i++) {
    const a = Abonos[i]; //                          array de abonos que el cliente a realizado
    const fechaLMT = a.fecharcb //                   fecha del recibo de pago
      ? moment(a.fecharcb).format('YYYY-MM-DD') //   si la fecha del recibo no existe toma la fecha en que se subio el pago
      : moment(a.fech).format('YYYY-MM-DD'); //      fecha en que se subio el pago al sistema

    montoparainicial += a.monto; // monto para establecer cuando se pago la cuota inicial
    if (montoparainicial >= initials && !fechapagoini) fechapagoini = fechaLMT; // estableciendo la fecha de la cuota inicial

    let Monto = a.monto; // valor del pago aboonado del cual se ira descontando el valor de la cuota

    for (o = 0; o < cuotas.length; o++) {
      if (!Monto) continue;
      const q = cuotas[o]; // array de cuotas
      const DateQta = idCuota?.id === q.id ? idCuota.nwFecha : moment(q.fechs).format('YYYY-MM-DD'); // fecha en la que la cuota debe ser pagada

      if (DateQta > endDate && acuerdoActual < totalAcuerdos) {
        acuerdoActual++;
        dcto = acuerdos[acuerdoActual].dcto || 0;
        startDate = moment(acuerdos[acuerdoActual]?.start || '2017-08-31').format('YYYY-MM-DD'); // fecha en la que entra en vigencia un acuerdo desde la que el sistema empesara a cobrar mora
        stopDate = moment(acuerdos[acuerdoActual]?.stop).format('YYYY-MM-DD'); // fecha hasta cuando se cobrara o congelara una mora en la que el sistema dejara de cobrar mora
        endDate = moment(acuerdos[acuerdoActual]?.end).format('YYYY-MM-DD'); // fecha fin de un acuerdo prestablecido en la que el sistema dejara de congelar la mora
      } else if (DateQta > endDate) {
        dcto = 0;
        startDate = '2017-08-31'; // fecha desde la que el sistema empesara a cobrar mora
        stopDate = null; // fecha hasta en la que el sistema dejara de cobrar mora
        endDate = moment().format('YYYY-MM-DD');
      }

      const fechaStop = fechaLMT > stopDate ? stopDate : fechaLMT;
      const cobro = DateQta > startDate && (!stopDate || stopDate > DateQta) && mOra; // determinara si debe cobrar mora en la cuota siguiente a analizar
      const daysDiff = fechaStop > DateQta ? moment(fechaStop).diff(DateQta, 'days') : 0; // diferencia de dias de la fecha de la cuota y la fecha en que se abono ala cuota

      const Tasa =
        cobro && daysDiff
          ? Math.min(
              ...Moras.filter(x => moment(x.fecha).isBetween(DateQta, fechaLMT, 'month', '[]')).map(
                x => x.teano
              )
            )
          : 0; // selecciona la tasa mas baja dentro del periodo de la mora

      const saldAnt = idCuota?.id === q.id ? idCuota.saldomora : 0;
      const moratoria = isFinite(Tasa) ? (daysDiff * q.monto * Tasa) / 365 : 0; // valor de la mora
      const dctoMoratorio = isFinite(Tasa) ? moratoria - moratoria * dcto : 0; // descuento de la mora si existe algun acuerdo
      const diasmoratorios = isFinite(Tasa) ? daysDiff : 0; // dias total de mora
      cuotas[o].tasa = isFinite(Tasa) ? Tasa : 0;
      cuotas[o].moratoria = moratoria;
      cuotas[o].dctoMoratorio = dctoMoratorio;
      cuotas[o].diasmoratorios = diasmoratorios;
      cuotas[o].total = q.monto + dctoMoratorio + saldAnt;
      /* console.log(
        saldAnt,
        dctoMoratorio,
        isFinite(Tasa) ? Tasa : 0,
        moratoria,
        dcto,
        daysDiff,
        q.monto,
        DateQta,
        fechaLMT,
        moment().min(moment().add(1, 'd')).format('YYYY-MM-DD'),
        'fecha mayor'
      ); */

      if (Monto >= q.total && q.estado === 3) {
        Relacion.push([
          a.ids,
          q.id,
          q.moratoria,
          q.diasmoratorios,
          dcto ? dcto : 0,
          q.diasmoratorios,
          q.dctoMoratorio + saldAnt,
          q.dctoMoratorio,
          q.monto,
          0,
          13,
          q.tasa,
          DateQta,
          0,
          S
        ]);
        Monto = Math.sign(Monto - q.total) > 0 ? Monto - q.total : 0;
        cuotas[o].monto = 0;
        cuotas[o].estado = 13;
        idCuota = false;
      } else if (Monto > 0 && q.estado === 3) {
        const cuot = Math.abs(q.total - Monto);
        const saldomora = q.monto >= cuot ? 0 : cuot - q.monto;
        const totalmora = q.dctoMoratorio + saldAnt;
        const morapaga = Monto >= totalmora ? totalmora : Monto;
        const diaspagados = !q.tasa ? 0 : morapaga / (q.dctoMoratorio / q.diasmoratorios) || 0;
        const saldocuota = Monto > totalmora ? q.monto - (Monto - totalmora) : q.monto;
        //const diaspagados = !q.tasa ? 0 : dpg >= q.diasmoratorios ? q.diasmoratorios : dpg;
        //const morapaga = dpg >= q.diasmoratorios ? q.dctoMoratorio : Monto;

        if (!idCuota)
          idCuota = {
            id: q.id,
            nwFecha: moment(fechaLMT).min(q.fechs).format('YYYY-MM-DD'), // Extrae la fecha mayor y para determinar desde donde inicia la proxima fecha de pago
            saldomora
          };
        else if (idCuota?.id === q.id) {
          idCuota.nwFecha = moment(fechaLMT).min(q.fechs).format('YYYY-MM-DD'); // Extrae la fecha mayor y para determinar desde donde inicia la proxima fecha de pago
          idCuota.saldomora = saldomora;
        }
        Relacion.push([
          a.ids,
          q.id,
          q.moratoria,
          q.diasmoratorios,
          dcto ? dcto : 0,
          diaspagados,
          totalmora, //q.dctoMoratorio,
          morapaga,
          q.monto,
          saldocuota,
          3,
          q.tasa,
          DateQta,
          saldomora,
          S
        ]);
        Monto = Math.sign(Monto - q.total) > 0 ? Monto - cuot : 0;
        cuotas[o].monto = saldocuota;
      }
    }
  }

  const R = [];
  await Relacion.reverse().map(r => {
    const s = R.some(s => s.cuota === r[1]);
    if (s) return;
    R.push({
      pago: r[0],
      cuota: r[1],
      mora: r[2],
      dias: r[3],
      dcto: r[4],
      diaspagados: r[5],
      totalmora: r[6],
      morapaga: r[7],
      montocuota: r[8],
      saldocuota: r[9],
      stdcuota: r[10],
      tasa: r[11],
      fechaLMT: r[12],
      saldomora: r[13]
    });
  });

  Relacion.length &&
    (await pool.query(
      `INSERT INTO relacioncuotas 
        (pago, cuota, mora, dias, dcto, diaspagados, totalmora, morapaga, montocuota, saldocuota, stdcuota, tasa, fechaLMT, saldomora, orden) 
        VALUES ?`,
      [Relacion]
    ));

  if (R.length) {
    let cuota = `CASE`;
    let stado = `CASE`;
    let diaspgdos = `CASE`;
    R.map(e => {
      cuota += ` WHEN c.id = ${e.cuota} THEN ${e.saldocuota}`;
      stado += ` WHEN c.id = ${e.cuota} THEN ${e.stdcuota}`;
      diaspgdos += ` WHEN c.id = ${e.cuota} THEN ${e.diaspagados}`;
    });
    cuota += ` ELSE c.cuota END`;
    stado += ` ELSE c.estado END`;
    diaspgdos += ` ELSE c.diaspagados END`;

    await pool.query(
      `UPDATE cuotas c SET c.cuota = ${cuota}, c.estado = ${stado}, c.diaspagados = ${diaspgdos} WHERE c.separacion = ?`,
      S
    );
  }

  fechapagoini &&
    (await pool.query(`UPDATE preventa SET fechapagoini = '${fechapagoini}' WHERE id = ?`, S));

  ////////////////////////////////* END *///////////////////////////////////////

  ///////////////////////////////* MORAS */////////////////////////////////////////////
  await pool.query(`UPDATE cuotas c INNER JOIN preventa p ON c.separacion = p.id 
  INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id 
  INNER JOIN intereses i ON i.teano SET c.diasmora = DATEDIFF(CURDATE(), c.fechs), c.mora = 
  ROUND(c.cuota * DATEDIFF(CURDATE(), c.fechs) * i.teano / 365, 2), c.tasa = i.teano WHERE 
  c.fechs < CURDATE() AND c.estado = 3 AND d.moras = 1 AND c.separacion = ${S} AND i.teano = 
  (SELECT MIN(i.teano) FROM intereses i WHERE i.fecha BETWEEN c.fechs AND LAST_DAY(CURDATE()));`);

  await pool.query(`    
  UPDATE cuotas c INNER JOIN preventa p ON c.separacion = p.id INNER JOIN productosd l 
  ON p.lote = l.id INNER JOIN productos d ON l.producto = d.id INNER JOIN intereses i 
  ON i.teano INNER JOIN acuerdos a ON a.orden SET c.diasmora = CASE WHEN a.type = 'REMOVE' 
  AND a.limite > c.fechs THEN 0 WHEN a.type = 'STOP' AND c.fechs BETWEEN a.limite 
  AND a.datestop THEN 0 ELSE DATEDIFF(CURDATE(), c.fechs) END, c.mora = CASE WHEN a.type = 
  'REMOVE' THEN 0 WHEN a.type = 'STOP' AND c.fechs BETWEEN a.limite AND a.datestop THEN 0 
  ELSE ROUND(c.cuota * DATEDIFF(CURDATE(), c.fechs) * i.teano / 365 * IF(a.dcto, 1 - a.dcto, 1), 2) 
  END, c.tasa = i.teano, c.acuerdo = IF(a.id, a.id, NULL), c.dto = IF(a.dcto, a.dcto, 0) WHERE 
  c.fechs < CURDATE() AND c.estado = 3 AND d.moras = 1 AND c.separacion = ${S} AND i.teano = 
  (SELECT MIN(i.teano) FROM intereses i WHERE i.fecha BETWEEN c.fechs AND CURDATE()) AND a.id = 
  (SELECT MIN(id) FROM acuerdos WHERE orden = p.id AND estado IN(7, 9) AND limite > c.fechs);`);

  await pool.query(`UPDATE solicitudes s INNER JOIN preventa p ON s.orden = p.id 
    SET s.fecharcb = p.fechapagoini WHERE (s.concepto LIKE '%COMISION%' OR s.concepto 
    LIKE '%GESTION%') AND s.descp != 'SEPARACION' AND p.fechapagoini IS NOT NULL`);
  //////////////////////////* ENVIAR PDF *///////////////////////////
  //await EstadoDeCuenta(S)
}

async function PagosAbonos(Tid, pdf, user, extr = false, enviaRcb) {
  //u. obsevacion pr
  const SS = await pool.query(`SELECT s.fech, s.monto, u.pin, u.nrango, pd.valor, pr.ahorro, 
    pr.iniciar, s.facturasvenc, pd.estado, p.incentivo, pr.asesor, u.sucursal, pr.lote, cl.idc, 
    cl.movil, cl.nombre, s.recibo, p.proyect, pd.mz, r.incntivo, pd.n, s.stado, s.formap, 
    s.concepto, pr.obsevacion, s.ids, s.descp, pr.id cparacion, s.pago, a.dcto, a.monto montoacuerdo, 
    s.extrato, a.type tipoacuerdo FROM solicitudes s
    INNER JOIN preventa pr ON s.orden = pr.id INNER JOIN productosd pd ON s.lt = pd.id 
    INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id INNER JOIN clientes cl ON pr.cliente = cl.idc 
    LEFT JOIN acuerdos a ON s.acuerdo = a.id WHERE pr.tipobsevacion IS NULL AND s.ids = ${Tid}`);
  const S = SS[0];
  const T = S.cparacion;
  const fech2 = moment(S.fech).format('YYYY-MM-DD HH:mm');
  const monto = S.bono && S.formap !== 'BONO' ? S.monto + S.mount : S.monto;
  const std = S.obsevacion === 'CARTERA' ? 1 : 15;

  if (S.stado === 4 || S.stado === 6) {
    Eli(pdf);
    return {
      std: false,
      msg: S.stado === 4 ? `Este pago ya ha sido aprobado.` : 'Este pago se encuentra declinado.'
    };
  }
  if (S.extrato && extr && S.extrato != extr) {
    Eli(pdf);
    return {
      std: false,
      msg: `Este pago ya posee un extrato asociado difrente, desasocielo primero si desea continuar con esta solicitud.`
    };
  }
  //if (S.concepto === 'ABONO') {
  //var montocuotas = monto;
  const Cuotas = await pool.query(
    `SELECT * FROM cuotas WHERE separacion = ${T} AND estado = 3 ORDER BY TIMESTAMP(fechs) ASC`
  );

  //console.log(Cuotas.length, monto, T);
  if (monto > 0) {
    await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [
      {
        concepto: 'ABONO',
        descp: Cuotas.length ? Cuotas[0].tipo : 'ABONO',
        stado: 4,
        aprueba: user.fullname
      },
      Tid
    ]);
  } else {
    return {
      std: false,
      msg: !Cuotas.length
        ? `No se encontraron cuotas pendientes por pagar`
        : 'El monto es insuficiente'
    };
  }

  /* await pool.query(`UPDATE solicitudes s INNER JOIN acuerdos a ON s.acuerdo = a.id 
      SET a.montopago = (SELECT SUM(s2.monto) FROM solicitudes s2 WHERE s2.acuerdo = a.id
      AND s2.fecharcb <= a.limite), a.estado = IF((SELECT SUM(s2.monto) FROM solicitudes s2 
      WHERE s2.acuerdo = a.id AND s2.stado = 4 AND s2.fecharcb <= a.limite) >= a.pago, 7, 9) 
      WHERE a.pago > 0` )*/ await ProyeccionPagos(T);
  var st = await Estados(T);
  try {
    await pool.query(
      `UPDATE solicitudes s 
        INNER JOIN productosd l ON s.lt = l.id 
        SET ? WHERE s.ids = ?`,
      [
        {
          'l.estado': st.std,
          's.pdf': pdf
        },
        Tid
      ]
    );
  } catch (e) {
    console.log(e);
  }

  console.log(S.movil, pdf, 'RECIBO DE CAJA ' + Tid, 'PAGO EXITOSO', enviaRcb);
  //enviaRcb && (await EnviarWTSAP(S.movil, bod));
  if (enviaRcb) {
    // await WspRcb(S.movil, pdf, Tid);
    await WspNewUser(user.empresa, S.movil, 'RECIBO DE CAJA ' + Tid, 'PAGO EXITOSO', {
      media: pdf
    });
  }
  return { std: true, msg: `Solicitud procesada correctamente` };
}

async function Bonos(pin, lote) {
  const recibe = await pool.query(
    `SELECT pr.id, c.* FROM cupones c
            INNER JOIN clientes cl ON c.clients = cl.idc 
            INNER JOIN preventa pr ON cl.idc 
            IN(pr.cliente, pr.cliente2, pr.cliente3, pr.cliente4) 
            INNER JOIN productosd l ON pr.lote = l.id
            WHERE c.pin = ? AND l.id = ? AND c.producto IS NULL AND c.estado = 9`,
    [pin, lote]
  );
  if (recibe.length > 0) {
    const IdSeparacion = recibe[0];
    return IdSeparacion;
  } else {
    return false;
  }
}

var normalize = (function () {
  var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
    to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnCc',
    mapping = {};

  for (var i = 0, j = from.length; i < j; i++) mapping[from.charAt(i)] = to.charAt(i);

  return function (str) {
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
      var c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
      else ret.push(c);
    }
    return ret.join('');
  };
})();

//Desendentes('97890290003800000154', 10) 82113863080099902022
async function Desendentes(user, stados, pasado) {
  if (stados != 10) return false;
  const hoy = moment().format('YYYY-MM-DD');

  const comisiones = await pool.query(
    `SELECT p.id ordn, p.asesor, p.ahorro, p.lote, p.comision, p.blockcomi, p.obsevacion, 
     u.bonoextra, o.incentivo, o.bextra, l.directa, l.valor, o.external, l.comiempresa, 
     o.maxcomis, l.comisistema, o.sistema, o.company, l.estado, p.status, p.separar, 
     SUM(IF(s.concepto = 'COMISION DIRECTA' AND s.descp = 'VENTA DIRECTA', s.monto, 0)) comy 
     FROM preventa p INNER JOIN productosd l ON p.lote = l.id
     INNER JOIN productos o ON l.producto = o.id INNER JOIN users u ON p.asesor = u.id
     INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN solicitudes s ON s.orden = p.id
     WHERE p.asesor = ? AND l.estado IN(10, 13) AND p.tipobsevacion IS NULL AND p.status IN(2, 3) 
     AND p.blockcomi IS NULL GROUP BY p.id`,
    user
  );

  if (comisiones.length) {
    await comisiones.map(async a => {
      if (a.blockcomi > 0) return false;
      const valor = a.valor - a.ahorro;
      const comision = Math.min(a.comision, a.maxcomis);
      const monto = valor * comision;
      const comisionEmpresa = valor * a.maxcomis;
      const comisionSistema = valor * a.sistema;
      const std = a.obsevacion === 'CARTERA' ? 1 : 15;
      var concpt = 'COMISION DIRECTA';
      var desc = 'VENTA DIRECTA';

      const reporte = {};
      const comis = [];

      if (!a.directa || (a.comy > 0 && a.comy < monto)) {
        reporte.directa = a.asesor;
        const mount = monto - a.comy;
        comis.push([hoy, mount, concpt, std, desc, a.asesor, comision, valor, a.lote, a.ordn]);
      }

      if (a.external && a.comiempresa < comisionEmpresa) {
        const mount = comisionEmpresa - a.comiempresa;
        concpt = 'GESTION VENTAS';
        desc = 'VENTA INDIRECTA';
        reporte.comiempresa = comisionEmpresa;
        comis.push([hoy, mount, concpt, 9, desc, a.company, a.maxcomis, valor, a.lote, a.ordn]);
      }

      if (a.external && a.sistema && a.comisistema < comisionSistema) {
        const mount = comisionSistema - a.comisistema;
        concpt = 'GESTION ADMINISTRATIVA';
        desc = 'ADMIN PROYECTOS';
        reporte.comisistema = comisionSistema;
        comis.push([hoy, mount, concpt, 8, desc, a.company, a.sistema, valor, a.lote, a.ordn]);
      }

      if (comis.length) {
        const sql = `INSERT INTO solicitudes (fech, monto, concepto, 
          stado, descp, asesor, porciento, total, lt, orden) VALUES ?`;
        pool.query(sql, [comis]);
        pool.query(`UPDATE productosd SET ? WHERE id = ?`, [reporte, a.lote]);
      }
    });
  }

  await pool.query(`UPDATE solicitudes s INNER JOIN preventa p ON s.orden = p.id 
  SET s.fecharcb = p.fechapagoini WHERE (s.concepto LIKE '%COMISION%' OR s.concepto 
  LIKE '%GESTION%') AND s.descp != 'SEPARACION' AND p.fechapagoini IS NOT NULL`);

  return true;
}

async function Eli(img) {
  path.join(__dirname, '../public/uploads/0y6or--pfxay07e4332144q2zs-90v9w91.pdf');
  fs.exists(img, function (exists) {
    if (exists) {
      fs.unlink(img, function (err) {
        if (err) throw err;
        console.log('Archivo eliminado');
        return 'Archivo eliminado';
      });
    } else {
      console.log('El archivo no exise');
      return 'El archivo no exise';
    }
  });
}

function Moneda(valor) {
  valor = valor
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
  valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
  return valor;
}

async function WspNewUser(empresa, movil, msg, options) {
  const cel =
    movil.indexOf('-') > 0
      ? '57' + movil.replace(/-/g, '')
      : movil.indexOf(' ') > 0
      ? movil.replace(/ /g, '')
      : '57' + movil;

  const rows = await pool.query(
    `SELECT c.url, c.token, b.routes 
    FROM chatbots c 
    INNER JOIN bots b ON c.id = b.chatbot 
    WHERE b.category = 'SISTEMAS' AND c.empresa = ?`,
    [empresa]
  );

  if (!rows.length) return false;

  const row = rows[0];

  const route = JSON.parse(row.routes).find(e => e.name === 'messages')?.path;

  // console.log({ row, cel, msg, route, options });

  var config = {
    method: 'post',
    url: row?.url + route,
    headers: {
      token: row?.token,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      number: cel,
      message: msg,
      urlMedia: options?.media || null
    })
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data), 'Respuesta de la api de whatsapp WspNewUser');
    })
    .catch(function (error) {
      console.log(error.response, 'Error de la api de whatsapp WspNewUser');
    });
}

async function WspRcb(movil, url, filename) {
  const cel =
    movil.indexOf('-') > 0
      ? '57' + movil.replace(/-/g, '')
      : movil.indexOf(' ') > 0
      ? movil.replace(/ /g, '')
      : '57' + movil;
  var data = JSON.stringify({
    messaging_product: 'whatsapp',
    to: cel,
    type: 'template',
    template: {
      name: 'recibo_de_caja',
      language: {
        code: 'es'
      },
      components: [
        {
          type: 'header',
          parameters: [
            {
              type: 'document',
              document: {
                link: url,
                filename: 'RCB-' + filename
              }
            }
          ]
        },
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: filename
            }
          ]
        }
      ]
    }
  });

  var config = {
    method: 'post',
    url: 'https://graph.facebook.com/v14.0/100312482788649/messages',
    headers: {
      Authorization: 'Bearer ' + wasb,
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  //const resp = await axios(config);
  //console.log(resp.data);
  return true;
}

//EnviarWTSAP('57 3012673944', 'esto es una prueba de grupo elite');
async function EnviarWTSAP(movil, body, smsj, chatid, q) {
  const cel =
    movil.indexOf('-') > 0
      ? '57' + movil.replace(/-/g, '')
      : movil.indexOf(' ') > 0
      ? movil.replace(/ /g, '')
      : '57' + movil;

  let options = {
    method: 'POST',
    url: 'https://inmovili.com.co/api/wtsp/sendText',
    headers: { 'x-access-token': tokenWtsp },
    data: {
      to: cel + '@c.us',
      message: body
    }
  };

  /* q ? (options.data.quotedMsgId = q) : '';
  chatid ? (options.data.chatId = chatid) : (options.data.to = cel); */

  const tt = await axios(options);
  //smsj ? await sms(desarrollo ? "57 3012673944" : cel, smsj) : "";
  //console.log(tt.data);
  return tt.data;
  //return true;
}

async function EnvWTSAP_FILE(movil, body, filename, caption) {
  const cel =
    movil.indexOf('-') > 0
      ? '57' + movil.replace(/-/g, '')
      : movil.indexOf(' ') > 0
      ? movil.replace(/ /g, '')
      : '57' + movil;

  let options = {
    method: 'POST',
    url: 'https://inmovili.com.co/api/wtsp/sendFile',
    headers: { 'x-access-token': tokenWtsp },
    data: {
      to: cel + '@c.us',
      route: body,
      name: filename,
      caption
    }
  };
  const tt = await axios(options);
  return tt.data;
  //return true;
}
//s = `SELECT * FROM solicitudes s WHERE s.fech LIKE '%2021-11-03 16:%' ORDER BY ids DESC`
module.exports = router;
