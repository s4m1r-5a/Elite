const express = require('express');
const router = express.Router();
const request = require('request');
const nodemailer = require('nodemailer');
const pool = require('../database');
const crypto = require('crypto');
const axios = require('axios');
const sms = require('../sms.js');
const MSGS = require('../index.js');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
moment.locale('es');
const {
  EstadoCuenta,
  EstadoDeCuenta,
  apiChatApi,
  QuienEs,
  RecibosCaja,
  NumeroALetras
} = require('../functions.js');

///////////* PARA COBRAR DIARIO *////////////////////////
var E = `SELECT p.id, l.mz, l.n, d.id idp, d.proyect, c.nombre, c.movil, c.email, (
    SELECT SUM(cuota)
    FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3
    ORDER BY fechs ASC
  ) as deuda, (
    SELECT COUNT(*)
    FROM cuotas WHERE separacion = p.id AND fechs <= CURDATE() AND estado = 3
    ORDER BY fechs ASC
  ) as meses
FROM preventa p  
INNER JOIN productosd l ON p.lote = l.id 
INNER JOIN productos d ON l.producto = d.id 
INNER JOIN clientes c ON p.cliente = c.idc 
WHERE p.tipobsevacion IS NULL
GROUP BY p.id
HAVING meses > 1 AND deuda > 0
ORDER BY meses DESC;`;

router.get('/', async (req, res) => {
  res.render('index');
});
router.get('/politicas', async (req, res) => {
  res.render('politicas');
});
router.get('/condiciones', async (req, res) => {
  res.render('condiciones');
});
// token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFkZSI6IlNhbXlyIiwid2ViaG9vayI6Imh0dHBzOi8vYzE4YS0yODAwLTQ4NC1hYzgyLTFhMGMtMjk5Ni1iZGUyLTI4NWUtMzgyYS5uZ3Jvay5pby93dHNwL3dlYmhvb2siLCJpYXQiOjE2NDg4MjYxNTR9.o-aWCOLCowGoJdqnUQnKpNrtJFWYrNqZ8LpPycQH7U0
router.post('/wtsp/webhook', async function (req, res) {
  //console.log(req.body);
});
router.post('/webhook', async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function reportes(agent) {
    agent.add(`Se estan imprimiendo los reportes`);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('reportes', reportes);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
router.post('/webhook2', async function (req, res) {
  /* const { sender, from, body, messages, ack, chatUpdate, previous_substatus } = req.body;
  //console.log(req.body)
  for (var i in messages) {
    const msgId = messages[i].id;
    const author = messages[i].author;
    //const body = messages[i].body;
    const chatId = from;
    const senderName = sender.name;

    if (messages[i].fromMe || /@g.us/.test(chatId)) return;

    const textFaltanteDelMenu = `
_~*5* - Auditar producto~_
_~*6* - Actualizar datos de contacto~_
_~*8* - Agendar llamada o cita~_`;
    const text = `_🤖 *¡Hola!* Soy *Ana* el Asistente de *RedElite* creado para ofrecerte mayor facilidad de procesos_
    
        ➖➖➖➖➖➖➖
_*¡* Déjame mostrarte lo que puedo hacer *!*_
        ➖➖➖➖➖➖➖    

_😮 (Para seleccionar la opción deseada, simplemente envíame el *número* que la antepone)_

_*1* - Estado de cuenta_
_*2* - Enviar recibo(s) de caja_
_*3* - Realizar pago o abono_
_*4* - Conocer mi saldo a la fecha_ 
_*7* - Chatear con una persona_
         
_Empieza a probar, estoy esperando 👀_
         
_Siempre que lo desees puedes volver al *menú principal*. 🔙 Enviándome *"#"*_`;

    if (body == 0) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `👋🏼  _*¡bey!* fue un placer servirte, estaré atenta para cuando necesites_`
      });
    } else if (body == 1) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `🕜⚡ _*Espera* un momento mientras *respondemos* a tu *solicitud*_`
      });
      const cel = chatId.replace('@c.us', '').slice(-10);
      const orden = await pool.query(`SELECT p.id FROM preventa p 
            INNER JOIN clientes c ON p.cliente = c.idc 
            LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
            LEFT JOIN clientes c3 ON p.cliente3 = c3.idc 
            LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
            WHERE p.tipobsevacion IS NULL 
            AND (c.movil LIKE '%${cel}%' OR c.code LIKE '%${cel}%'
            OR c2.movil LIKE '%${cel}%' OR c2.code LIKE '%${cel}%'
            OR c3.movil LIKE '%${cel}%' OR c3.code LIKE '%${cel}%'
            OR c4.movil LIKE '%${cel}%' OR c4.code LIKE '%${cel}%')`);
      console.log(orden);
      const res = await EstadoDeCuenta(orden[0].id);
      if (res) {
        await apiChatApi('message', {
          chatId: chatId,
          body: `😃 _Tú solicitud fue procesada exitosamente._\n\n_Te la enviamos también al correo que diste al momento de tu registro_ 👊🤝 🕜\n\nEnvíanos la opción de tu preferencia 🤔🤔 👇🏼\n \n# - *_Volver al menú principal_*\n5 - *_Auditar los pagos_*\n0 - *_Salir_*`
        });
        var dataFile = {
          phone: chatId.replace('@c.us', ''),
          body: res,
          filename: `ESTADO DE CUENTA ${orden[0].id}.pdf`
        };
        let r = await apiChatApi('sendFile', dataFile);
      } else {
        await apiChatApi('message', {
          chatId: chatId,
          body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜`
        });
      }
    } else if (body == 2) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `🕜⚡ _*Espera* un momento mientras *respondemos* a tu *solicitud*_`
      });
      const cel = chatId.replace('@c.us', '').slice(-10);
      const recibos = await pool.query(`SELECT s.*, c.nombre FROM solicitudes s 
            INNER JOIN preventa p ON s.orden = p.id INNER JOIN clientes c ON p.cliente = c.idc 
            LEFT JOIN clientes c2 ON p.cliente2 = c2.idc LEFT JOIN clientes c3 ON p.cliente3 = c3.idc 
            LEFT JOIN clientes c4 ON p.cliente4 = c4.idc WHERE s.stado != 6 AND s.concepto IN('PAGO', 'ABONO') 
            AND p.tipobsevacion IS NULL AND (c.movil LIKE '%${cel}%' OR c.code LIKE '%${cel}%' OR c.nombre = '${senderName}'
            OR c2.movil LIKE '%${cel}%' OR c2.code LIKE '%${cel}%' OR c2.nombre = '${senderName}'
            OR c3.movil LIKE '%${cel}%' OR c3.code LIKE '%${cel}%' OR c3.nombre = '${senderName}'
            OR c4.movil LIKE '%${cel}%' OR c4.code LIKE '%${cel}%' OR c4.nombre = '${senderName}')`);
      if (recibos.length) {
        //let l = "```+numero de recibo```";
        let body = `_😁Hola *${recibos[0].nombre.split(' ')[0]}*, en el sistema nos registran *${
          recibos.length
        }* recibos🧾 de caja los cuales se resumen a continuación_ \n\n`;
        recibos.map((e, i) => {
          body += `_${e.stado !== 4 ? '~' : ''}*RC${e.ids}* por un valor de💵 *$${Moneda(
            e.monto
          )}*${e.stado !== 4 ? '~' : ''}_\n`;
        });
        body += `\n_Los recibos con *tachaduras* no se enviaran ya estan a espera de que el area de contabilidad los apruebe, una ves *aprobados* se le enviaran por este medio_\n\n_Si desea recibir uno de estos recibos por favor envienos el recibo, ej: *"rc990"* sin las comillas. Si lo que desea es que le enviemos todos los recibos envienos *"rc##"*._
                \n\n_*rc+numero de recibo* - Enviar recibo_\n_*rc##* - Enviar todos los recibos_\n_*#* - Volver al menú principal_\n_*5* - Auditar los pagos_\n_*0* - Salir_`;
        await apiChatApi('message', { chatId: chatId, body });
      } else {
        await apiChatApi('message', {
          chatId: chatId,
          body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜`
        });
      }
    } else if (body == 3) {
      var dataLink = {
        body: 'https://grupoelitefincaraiz.com/links/pagos',
        previewBase64:
          'data:image/x-icon;base64,',
        title: 'PAGOS EN LINEA',
        description: 'Gestiona tus pagos en línea con solo unos clics',
        chatId
      };
      await apiChatApi('sendLink', dataLink);
      await apiChatApi('message', {
        chatId: chatId,
        body: `_Solo debes ingresar el numero de *documento* del comprador y seguir los pasos_`
      });
    } else if (body == 4) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `🕜⚡ _*Espera* un momento mientras *respondemos* a tu *solicitud*_`
      });
      const cel = chatId.replace('@c.us', '').slice(-10);
      const recibos = await pool.query(`SELECT s.monto, c.nombre, l.valor, p.ahorro
            FROM solicitudes s INNER JOIN productosd l ON l.id = s.lt 
            INNER JOIN preventa p ON s.orden = p.id INNER JOIN clientes c ON p.cliente = c.idc 
            LEFT JOIN clientes c2 ON p.cliente2 = c2.idc LEFT JOIN clientes c3 ON p.cliente3 = c3.idc 
            LEFT JOIN clientes c4 ON p.cliente4 = c4.idc WHERE s.stado != 6 AND s.concepto IN('PAGO', 'ABONO') 
            AND p.tipobsevacion IS NULL AND (c.movil LIKE '%${cel}%' OR c.code LIKE '%${cel}%' OR c.nombre = '${senderName}'
            OR c2.movil LIKE '%${cel}%' OR c2.code LIKE '%${cel}%' OR c2.nombre = '${senderName}'
            OR c3.movil LIKE '%${cel}%' OR c3.code LIKE '%${cel}%' OR c3.nombre = '${senderName}'
            OR c4.movil LIKE '%${cel}%' OR c4.code LIKE '%${cel}%' OR c4.nombre = '${senderName}')`);

      if (recibos.length) {
        let saldo = 0;
        recibos.map((e, i) => {
          saldo += e.monto;
        });
        let body = `_😁Hola *${
          recibos[0].nombre.split(' ')[0]
        }*, Su salso a la fecha es de *$${Moneda(recibos[0].valor - recibos[0].ahorro - saldo)}*_
                \n_*${NumeroALetras(recibos[0].valor - recibos[0].ahorro - saldo)}.*_`;
        await apiChatApi('message', { chatId: chatId, body });
      } else {
        await apiChatApi('message', {
          chatId: chatId,
          body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜`
        });
      }
    } else if (body == 5 || body == 6 || body == 8) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `😃 _Esta opcion aun no se encuentra disponible, nos encontramos trabajando en ello_`
      });
    } else if (body == 7) {
      await apiChatApi('labelChat', { labelId: '7', chatId });
      await apiChatApi('message', {
        chatId: chatId,
        body: `😃 _Pronto te antenderemos recuerda que hay personas antes que tu. Una ves llegue tu turno una persona te contactara_\n\n_De antemano agradecemos por tu paciencia_`
      });
    } else if (/^\s?[0-9]+#\s?$/.test(body)) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `🕜⚡ _*Espera* un momento mientras *respondemos* a tu *solicitud*_`
      });
      QuienEs(body.replace('#', '').trim(), chatId);
    } else if (/^\s?[a-zA-Z0-9]{5}@7\s?$/.test(body)) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `🕜⚡ _*Espera* un momento mientras *respondemos* a tu *solicitud*_`
      });
      const Code = await pool.query(`SELECT * FROM clientes WHERE code = ?`, body.trim());
      if (Code.length) {
        await pool.query(`UPDATE clientes SET code = ? WHERE  code = ?`, [
          chatId.replace('@c.us', ''),
          body.trim()
        ]);
        await apiChatApi('message', {
          chatId: chatId,
          body: `CODIGO APROBADO`
        });
        const newText = text.replace(
          '*¡Hola!* Soy *Ana* el Asistente de *RedElite* creado para ofrecerte mayor facilidad de procesos',
          `_🤖 😃¡Bienvenido! *${
            Code[0].nombre.split(' ')[0]
          }* envianos nuevamente el *numero* de la opcion de tu preferencia`
        );
        await apiChatApi('message', { chatId: chatId, body: newText });
      } else {
        await apiChatApi('message', {
          chatId: chatId,
          body: `CODIGO INVALIDO`
        });
      }
    } else if (/^\s?rc[0-9]+\s?$|^\s?rc##\s?$/i.test(body)) {
      await apiChatApi('message', {
        chatId: chatId,
        body: `🕜⚡ _*Espera* un momento mientras *respondemos* a tu *solicitud*_`
      });
      const res = await RecibosCaja(
        chatId.replace('@c.us', ''),
        senderName,
        author,
        body.trim().replace(/rc/i, '')
      );
      !res &&
        (await apiChatApi('message', {
          chatId: chatId,
          body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜`
        }));
    } else if (/help/.test(body)) {
      const text = `${senderName}, this is a demo bot for https://chat-api.com/.
                Commands:
                1. chatId - view the current chat ID
                2. file [pdf/jpg/doc/mp3] - get a file
                3. ptt - get a voice message
                4. geo - get a location
                5. group - create a group with you and the bot`;
      await apiChatApi('message', { chatId: chatId, body: text });
    } else if (/chatId/.test(body)) {
      await apiChatApi('message', { chatId: chatId, body: chatId });
    } else if (/file (pdf|jpg|doc|mp3)/.test(body)) {
      const fileType = body.match(/file (pdf|jpg|doc|mp3)/)[1];
      const files = {
        doc: 'http://domain.com/tra.docx',
        jpg: 'http://domain.com/tra.jpg',
        mp3: 'http://domain.com/tra.mp3',
        pdf: 'http://domain.com/tra.pdf'
      };
      var dataFile = {
        phone: author,
        body: files[fileType],
        filename: `File *.${fileType}`
      };
      if (fileType == 'jpg') dataFile['caption'] = 'Text under the photo.';
      await apiChatApi('sendFile', dataFile);
    } else if (/ptt/.test(body)) {
      await apiChatApi('sendAudio', {
        audio: 'http://domain.com/tra.ogg',
        chatId: chatId
      });
    } else if (/geo/.test(body)) {
      await apiChatApi('sendLocation', {
        lat: 51.178843,
        lng: -1.82621,
        address: 'Stonehenge',
        chatId: chatId
      });
    } else if (/group/.test(body)) {
      let arrayPhones = [author.replace('@c.us', '')];
      await apiChatApi('group', {
        groupName: 'Bot group',
        phones: arrayPhones,
        messageText: 'Welcome to the new group!'
      });
    } else if (/[a-zA-Z0-9]+/.test(body)) {
      const max_time = moment().unix();
      const min_time = moment().subtract(5, 'hours').unix();
      const Url = `https://api.chat-api.com/instance107218/messages?chatId=${chatId}&limit=0&min_time=${min_time}&max_time=${max_time}&token=5jn3c5dxvcj27fm0`;
      const chat = await axios(Url);
      let msgs = 0,
        res = false;

      
      chat.data.messages
        .filter(e => {
          return !e.fromMe || /ayudarte|ayudarle/i.test(e.body);
        })
        .map((e, i) => {
          msgs++;
          if (e.body == 7 || /ayudarte|ayudarle/i.test(e.body)) res = true;
        });

      if (res) return;
      //console.log(Url, chat.data.messages, msgs, moment.unix(max_time).format('YYYY-MM-DD H:mm:ss'), max_time, moment.unix(min_time).format('YYYY-MM-DD H:mm:ss'), min_time, chatId);

      if (msgs > 3 && !res) {
        await apiChatApi('labelChat', { labelId: '7', chatId });
        await apiChatApi('message', {
          chatId: chatId,
          quotedMsgId: msgId,
          body: `_☝️*Se te asignara una persona que pueda ayudarte a despejar tus dudas*, en el lapso de un breve momento te atenderemos. Agradecemos por tu espera en linea_`
        });
      } else if (msgs > 2 && !res) {
        await apiChatApi('message', {
          chatId: chatId,
          quotedMsgId: msgId,
          body: `_☝️*No comprendo lo que dices.*_
                \n_Si lo que deseas es *chatear* 💬 con una *persona* 🙋🏼‍♀️🙋🏽‍♂️ solo envíame un *7*_               
                \n_O si lo que prefieres es volver a ver el *menú* ⚙️ de opciones envíame un *#*_`
        });
      } else if (msgs > 1 && !res) {
        await apiChatApi('message', {
          chatId: chatId,
          quotedMsgId: msgId,
          body: '_☝️No comprendo lo que dices_'
        });
      } else {
        var r = await apiChatApi('message', { chatId: chatId, body: text });
      }
    } else if (/^\s?#\s?$/.test(body)) {
      var r = await apiChatApi('message', { chatId: chatId, body: text });
    }
  }
  //https://grupoelitefincaraiz.com/webhook

  if (messages) {
  }
  res.send(true);
  res.end();*/
});
//console.log(path.join(__dirname, '/public/uploads/estadodecuenta-${estado[0].cparacion}.pdf'))
const transpoter = nodemailer.createTransport({
  host: 'smtp.hostinger.co',
  port: 587,
  secure: false,
  auth: {
    user: 'suport@tqtravel.co',
    pass: '123456789'
  },
  tls: {
    rejectUnauthorized: false
  }
});
var t = {
  response_code_pol: 5,
  phone: '573012673944',
  additional_value: 0.0,
  test: 1,
  transaction_date: '2015-05-27 13:07:35',
  cc_number: '************ 0004',
  cc_holder: 'test_buyer',
  error_code_bank: 1,
  billing_country: 'CO',
  bank_referenced_name: 'fg',
  description: 'test_payu_01',
  administrative_fee_tax: 0.0,
  value: 100.0,
  administrative_fee: 0.0,
  payment_method_type: 2,
  office_phone: 1,
  email_buyer: 'test@payulatam.com',
  response_message_pol: 'ENTITY_DECLINED',
  error_message_bank: 0,
  shipping_city: 0,
  transaction_id: 'f5e668f1-7ecc-4b83-a4d1-0aaa68260862',
  sign: 'e1b0939bbdc99ea84387bee9b90e4f5c',
  tax: 0.0,
  payment_method: 10,
  billing_address: 'cll 93',
  payment_method_name: 'VISA',
  pse_bank: 0,
  state_pol: 6,
  date: '2015.05.27 01:07:35',
  nickname_buyer: 0,
  reference_pol: '7069375',
  currency: 'USD',
  risk: 1.0,
  shipping_address: 0,
  bank_id: 10,
  payment_request_state: 'R',
  customer_number: 0,
  administrative_fee_base: 0.0,
  attempts: 1,
  merchant_id: 508029,
  exchange_rate: 2541.15,
  shipping_country: 0,
  installments_number: 1,
  franchise: 'VISA',
  payment_method_id: 2,
  extra1: 0,
  extra2: 0,
  antifraudMerchantId: 0,
  extra3: 0,
  nickname_seller: 0,
  ip: '190.242.116.98',
  airline_code: 0,
  billing_city: 'Bogota',
  pse_reference1: 0,
  reference_sale: '2015-05-27 13:04:37',
  pse_reference3: 0,
  pse_reference2: 0
};
router.post('/api/bank/callback', async (req, res) => {
  const {
    transferVoucher,
    transferAmount,
    transferStateDescription,
    sign,
    requestDate,
    transferState,
    transferDate,
    transferCode,
    transferReference,
    commerceTransferButtonId
  } = req.body;

  let AppiKey = '1Fj8eK4rlyUd252L48herdrnEZ';
  let key = `${AppiKey}~${commerceTransferButtonId}~${transferCode}~${transferAmount}~${transferState}`;
  let hash = crypto.createHash('sha512').update(key).digest('hex');
  console.log(req.body, hash, hash.length);

  res.status(200).end();

  /*const ids = reference_sale.split("-");
    const r = {
        transaction_date, reference_sale, state_pol, payment_method_type, value, cc_number, cc_holder, response_message_pol,
        payment_method_name, description, pse_bank, reference_pol, ip, cliente: ids[0], transaction_id, transaction_bank_id,
        currency, error_message_bank
    }
    const pin = await pool.query('SELECT * FROM payu WHERE reference_sale = ?', reference_sale);
    var d = '';
    if (pin.length > 0) {
        console.log('si existe')
        await pool.query('UPDATE payu set ? WHERE reference_sale = ?', [r, reference_sale]);
    } else {
        console.log('no existe')
        const l = await pool.query('INSERT INTO payu SET ? ', r);
        d = l.insertId
    }
    if (state_pol == 4 && d) {
        var i = extra2.split("~");
        const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = ? AND s.lt = ?`, [4, i[3]]);
        var l = r[0].monto1 || 0,
            k = r[0].monto || 0;
        var acumulado = l + k;

        const pago = {
            fech: transaction_date, monto: i[0], recibo: reference_sale, facturasvenc: i[1], lt: i[3], motorecibos: i[0], transfer: d,
            acumulado, concepto: 'PAGO', stado: 3, descp: i[2], formap: payment_method_name, orden: ids[1], img: '/img/payu.png'
        }

        i[4] != 0 ? pago.bono = i[5] : '';
        i[2] === 'ABONO' ? pago.concepto = i[2] : pago.pago = i[6],
            await pool.query('UPDATE cuotas SET estado = 1 WHERE id = ?', i[6]);
        await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', i[3]);
        const P = await pool.query('INSERT INTO solicitudes SET ? ', pago);
        const R = await PagosAbonos(P.insertId, 'GRUPO ELITE SISTEMA')
        var body = reference_sale + ' ' + d + ' ' + description;
        EnviarWTSAP(phone, `Solicitud de pago ${reference_sale} aprobada, ${response_message_pol}, cuanto antes enviaremos tu recibo de caja`)
        EnviarWTSAP('57 3012673944', body)
    } else {
        EnviarWTSAP(phone, `Solicitud de pago ${reference_sale} rechazada, ${response_message_pol}`)
    }*/
});
router.post('/confir', async (req, res) => {
  const {
    transaction_date,
    reference_sale,
    state_pol,
    payment_method_type,
    value,
    email_buyer,
    phone,
    cc_number,
    cc_holder,
    description,
    response_message_pol,
    payment_method_name,
    pse_bank,
    reference_pol,
    ip,
    transaction_id,
    transaction_bank_id,
    currency,
    error_message_bank,
    extra2
  } = req.body;
  console.log(req.body);
  const ids = reference_sale.split('-');
  const r = {
    transaction_date,
    reference_sale,
    state_pol,
    payment_method_type,
    value,
    cc_number,
    cc_holder,
    response_message_pol,
    payment_method_name,
    description,
    pse_bank,
    reference_pol,
    ip,
    cliente: ids[0],
    transaction_id,
    transaction_bank_id,
    currency,
    error_message_bank
  };
  const pin = await pool.query('SELECT * FROM payu WHERE reference_sale = ?', reference_sale);
  var d = '';
  if (pin.length > 0) {
    console.log('si existe');
    await pool.query('UPDATE payu set ? WHERE reference_sale = ?', [r, reference_sale]);
  } else {
    console.log('no existe');
    const l = await pool.query('INSERT INTO payu SET ? ', r);
    d = l.insertId;
  }
  if (state_pol == 4 && d) {
    var i = extra2.split('~');
    /*const a = await Bonos(bono, lt);
        if (a) {
            await pool.query('UPDATE cupones SET ? WHERE id = ?',
                [{ producto: a, estado: 14 }, pin]
            );
        } else if (!a && bono != 0) {
            response_message_pol
            return EnviarWTSAP(phone, `Solicitud de pago ${reference_sale} rechazada, Bono erroneo`)
        }*/
    const r = await pool.query(
      `SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = ? AND s.lt = ?`,
      [4, i[3]]
    );
    var l = r[0].monto1 || 0,
      k = r[0].monto || 0;
    var acumulado = l + k;

    const pago = {
      fech: transaction_date,
      monto: i[0],
      recibo: reference_sale,
      facturasvenc: i[1],
      lt: i[3],
      motorecibos: i[0],
      transfer: d,
      acumulado,
      concepto: 'PAGO',
      stado: 3,
      descp: i[2],
      formap: payment_method_name,
      orden: ids[1],
      img: '/img/payu.png'
    };

    i[4] != 0 ? (pago.bono = i[5]) : '';
    i[2] === 'ABONO' ? (pago.concepto = i[2]) : (pago.pago = i[6]),
      await pool.query('UPDATE cuotas SET estado = 1 WHERE id = ?', i[6]);
    await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', i[3]);
    const P = await pool.query('INSERT INTO solicitudes SET ? ', pago);
    const R = await PagosAbonos(P.insertId, 'GRUPO ELITE SISTEMA');
    var body = reference_sale + ' ' + d + ' ' + description;
    EnviarWTSAP(
      phone,
      `Solicitud de pago ${reference_sale} aprobada, ${response_message_pol}, cuanto antes enviaremos tu recibo de caja`
    );
    EnviarWTSAP('57 3012673944', body);
  } else {
    EnviarWTSAP(phone, `Solicitud de pago ${reference_sale} rechazada, ${response_message_pol}`);
  }
});
router.get(`/planes`, async (req, res) => {
  console.log(req.query);
  const r = {
    transactionState: req.query.transactionState || '',
    referenceCode: req.query.referenceCode || '',
    reference_pol: req.query.reference_pol || '',
    polPaymentMethod: req.query.polPaymentMethod || '',
    lapPaymentMethodType: req.query.lapPaymentMethodType || '',
    TX_VALUE: req.query.TX_VALUE || '',
    buyerEmail: req.query.buyerEmail || '',
    processingDate: req.query.processingDate || '',
    description: req.query.description || '',
    mensaje: req.query.message || '',
    msg: '',
    estado: ''
  };
  let c = req.query.iux || '';

  if (c == 'ir') {
    res.render('respuesta');
  } else {
    if (r.transactionState == 4) {
      r.estado = 'success';
      r.msg = 'aprobada';
      //await pool.query('INSERT INTO ventas SET ? ', venta);
      res.render('respuesta', r);
    } else if (r.transactionState == 6) {
      r.msg = 'rechazada';
      r.estado = 'danger';
      res.render('respuesta', r);
    } else if (r.transactionState == 104) {
      r.msg = 'Error';
      r.estado = 'danger';
      res.render('respuesta', r);
    } else if (r.transactionState == 7) {
      r.msg = 'pendiente';
      r.estado = 'warning';
      //await pool.query('INSERT INTO ventas SET ? ', venta);
      res.render('respuesta', r);
    } else {
      res.render('planes');
    }
  }
});
router.post(`/venta`, async (req, res) => {
  const { telephone, buyerFullName, buyerEmail, pin } = req.body;

  const cliente = await pool.query('SELECT * FROM clientes WHERE email = ? AND movil = ?', [
    buyerEmail,
    telephone
  ]);
  if (cliente.length > 0) {
    let clave = `jodete cabron este codigo no esta completo aun-${cliente[0].nombre}-${cliente[0].movil}-${cliente[0].email}-${pin}`,
      key = crypto.createHash('md5').update(clave).digest('hex');
    url = `https://iux.com.co/x/venta.php?name=${cliente[0].nombre}&movil=${cliente[0].movil}&email=${cliente[0].email}&ref=${pin}&key=${key}`;
    let pi = pin.slice(0, 3),
      fh = new Date();

    switch (pi) {
      case 'S1M':
        fh.setDate(fh.getDate() + 30);
        break;
      case 'S2M':
        fh.setDate(fh.getDate() + 60);
        break;
      case 'S6M':
        fh.setDate(fh.getDate() + 180);
        break;
    }
    await pool.query('UPDATE ventas set ? WHERE pin = ?', [
      {
        client: cliente[0].id,
        correo: cliente[0].email,
        fechadeactivacion: new Date(),
        fechadevencimiento: fh
      },
      pin
    ]);

    await transpoter.sendMail({
      from: "'Suport' <suport@tqtravel.co>",
      to: 'redflix.red@hotmail.com',
      subject: 'confirmacion de registro',
      text: `${telephone}-${buyerFullName}-${buyerEmail}-${pin}-${key}
            -VENTA`
    });
    request(
      {
        url,
        json: true
      },
      (error, res, body) => {
        if (error) {
          console.error(error);
          return;
        }
        //sms('573007753983', `${body} ${res.statusCode} ACTUALIZADO`);
      }
    );
    res.redirect('https://iux.com.co/app/login');
  } else {
  }
});
async function PagosAbonos(Tid, user) {
  //u. obsevacion pr
  const SS = await pool.query(`SELECT s.fech, s.monto, u.pin, u.nrango, pd.valor, pr.ahorro, 
    pr.iniciar, s.facturasvenc, pd.estado, p.incentivo, pr.asesor, u.sucursal, pr.lote, cl.idc, 
    cl.movil, cl.nombre, s.recibo, p.proyect, pd.mz, r.incntivo, pd.n, s.stado, s.formap, 
    s.concepto, pr.obsevacion, s.ids, s.descp, pr.id cparacion, s.pago, a.dcto, a.monto montoacuerdo, 
    s.extrato, a.tipo tipoacuerdo FROM solicitudes s
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

  const Cuotas = await pool.query(
    `SELECT * FROM cuotas WHERE separacion = ${T} AND estado = 3 ORDER BY TIMESTAMP(fechs) ASC`
  );

  if (monto > 0) {
    await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [
      {
        concepto: 'ABONO',
        descp: Cuotas.length ? Cuotas[0].tipo : 'ABONO',
        stado: 4,
        aprueba: user
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

  return { std: true, msg: `Solicitud procesada correctamente` };
}
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
async function Bonos(pin, lote) {
  const recibe = await pool.query(
    `SELECT pr.id FROM cupones c
            INNER JOIN clientes cl ON c.clients = cl.idc 
            INNER JOIN preventa pr ON cl.idc 
            IN(pr.cliente, pr.cliente2, pr.cliente3, pr.cliente4) 
            INNER JOIN productosd l ON pr.lote = l.id
            WHERE c.pin = ? AND l.id = ? AND c.producto IS NULL AND c.estado = 9`,
    [pin, lote]
  );
  if (recibe.length > 0) {
    const IdSeparacion = recibe[0].id;
    return IdSeparacion;
  } else {
    return false;
  }
}
module.exports = router;
