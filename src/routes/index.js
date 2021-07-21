const express = require('express');
const router = express.Router();
const request = require('request')
const nodemailer = require('nodemailer')
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
    EstadoCuenta, apiChatApi, QuienEs, RecibosCaja, NumeroALetras
} = require('../functions.js')



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
router.post('/webhook', async function (req, res) {
    const { messages, ack, chatUpdate, previous_substatus } = req.body;
    //console.log(req.body)
    for (var i in messages) {

        const msgId = messages[i].id;
        const author = messages[i].author;
        const body = messages[i].body;
        const chatId = messages[i].chatId;
        const senderName = messages[i].senderName;

        if (messages[i].fromMe || /@g.us/.test(chatId)) return;

        if (body == 1) {
            const res = await EstadoCuenta(chatId.replace('@c.us', ''), senderName, author);
            if (res.sent) {
                await apiChatApi('message', { chatId: chatId, body: `😃 _Tú solicitud fue procesada exitosamente._\n\n_Te la enviamos también al correo que diste al momento de tu registro_ 👊🤝 🕜\n\nEnvíanos la opción de tu preferencia 🤔🤔 👇🏼\n \n# - *_Volver al menú principal_*\n5 - *_Auditar los pagos_*\n0 - *_Salir_*` });
            } else {
                await apiChatApi('message', { chatId: chatId, body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜` });
            }
        } else if (body == 2) {
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
                let body = `_😁Hola *${recibos[0].nombre.split(" ")[0]}*, en el sistema nos registran *${recibos.length}* recibos🧾 de caja los cuales se resumen a continuación_ \n\n`
                recibos.map((e, i) => {
                    body += `_${e.stado !== 4 ? '~' : ''}*RC${e.ids}* por un valor de💵 *$${Moneda(e.monto)}*${e.stado !== 4 ? '~' : ''}_\n`;
                })
                body += `\n_Los recibos con *tachaduras* no se enviaran ya estan a espera de que el area de contabilidad los apruebe, una ves *aprobados* se le enviaran por este medio_\n\n_Si desea recibir uno de estos recibos por favor envienos el recibo, ej: *"rc990"* sin las comillas. Si lo que desea es que le enviemos todos los recibos envienos *"rc##"*._
                \n\n_*rc+numero de recibo* - Enviar recibo_\n_*rc##* - Enviar todos los recibos_\n_*#* - Volver al menú principal_\n_*5* - Auditar los pagos_\n_*0* - Salir_`;
                await apiChatApi('message', { chatId: chatId, body });
            } else {
                await apiChatApi('message', { chatId: chatId, body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜` });
            }
        } else if (body == 3) {
            var dataLink = {
                body: "https://grupoelitefincaraiz.com/links/pagos",
                previewBase64: "data:image/x-icon;base64,AAABAAEAAAAAAAEAIAB5GQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAEAAAABAAgGAAAAXHKoZgAAGUBJREFUeNrt3XmcXGWd7/HPqb2r9yUhnX0hnZAACYEQkggBAioOEFZfc1EZRLgojLwUnfEig9fBYXPuwNULgpoRHB1kkMUNBhQMewgkkJXs+55OutNr7XXuH091Ld3V3VXdSbqr+b5fr34lVXWq6pxT5/k9z3lWEBERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRE8habk9aM9A7IQVry1nW1isHeiek71zAqQO9EyIyMBwDvQMiMnBcvW0QCtiseS/Izo1h9m6LYqe95vZYTJjq5uTTvUw+3dOnHQi02axZGsC2c9t+5AQ3lcOclJT3PXZ9vDxES2PMnAC3xaRTPVTUOPP6jKYjMbasDhONmh0/aYyL8VN7PgeH98fYsT5MLJbbwVbUOKmpdVE5zIkjv93rcb8/Xh5i8+owjfWxjNdKyhyMn+pm2mwfI8a4sI5N9lABXAeM78dnfAg83c1r04G/y/L8OuA/gWg/vncs8AWgstPzO4CfZNnemdj+WJWqw8BTwMdZXrsUOK8fn70PeKrbANDeEuetF9t57vFmtq0LE2iLEwpkXriWA4qKHZSUO5hzcRF/e3s5dad787pwDu2J8r3rDxEJ57a9t8jC7bGYfraXi64pYeanfFSdlF/qWHxPI6veDQJQXuXgfz02jLMXFuX1GZtXh/mXm+tpORoHYNFXSrn9weoe37PqnSD/99uHaW/NLQC4PSbI1o5zcfmNZcy+sIjho11YVl67im1D/b4of3yihZd+3cLR+jjtrXEi4cz9cLrM71lR4+ScTxfxpW9XMGKcG2f/gk8pJgDM78dn/IruA8Bk4B+yPP9C4j39CQC1wM3AhE7Pv033AWARcFW/zlhKG7CM7AHgfOBb/fjslcDLWQNAw6EYT9zfyG8fbSYa6f5i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78OBUzEVi9nMBY5gKgN9wFmJ97UkPmMmphSSzXpERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE5IT4/3XR8/QYP54iAAAAAElFTkSuQmCC",
                title: "PAGOS EN LINEA",
                description: "Gestiona tus pagos en línea con solo unos clics",
                chatId
            };
            await apiChatApi('sendLink', dataLink);
            await apiChatApi('message', { chatId: chatId, body: `_Solo debes ingresar el numero de *documento* del comprador y seguir los pasos_` });
        } else if (body == 4) {
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
                let body = `_😁Hola *${recibos[0].nombre.split(" ")[0]}*, Su salso a la fecha es de *$${Moneda(recibos[0].valor - recibos[0].ahorro - saldo)}*_
                \n_*${NumeroALetras(recibos[0].valor - recibos[0].ahorro - saldo)}.*_`;
                await apiChatApi('message', { chatId: chatId, body });
            } else {
                await apiChatApi('message', { chatId: chatId, body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜` });
            }
        } else if (body == 5 || body == 6 || body == 8) {
            await apiChatApi('message', { chatId: chatId, body: `😃 _Esta opcion aun no se encuentra disponible, nos encontramos trabajando en ello_` });
        } else if (body == 7) {
            await apiChatApi('labelChat', { labelId: "7", chatId });
            await apiChatApi('message', { chatId: chatId, body: `😃 _Pronto te antenderemos recuerda que hay personas antes que tu. Una ves llegue tu turno una persona te contactara_\n\n_De antemano agradecemos por tu paciencia_` });
        } else if (/^\s?[0-9]+#\s?$/.test(body)) {
            QuienEs(body.replace('#', '').trim(), chatId);
        } else if (/^\s?[a-zA-Z0-9]{5}@7\s?$/.test(body)) {
            const Code = await pool.query(`SELECT * FROM clientes WHERE code = ?`, body.trim());
            if (Code.length) {
                await pool.query(`UPDATE clientes SET code = ? WHERE  code = ?`, [chatId.replace('@c.us', ''), body.trim()]);
                await apiChatApi('message', { chatId: chatId, body: `CODIGO APROBADO` });
                await apiChatApi('message', {
                    chatId: chatId, body: `_🤖 😃¡Bienvenido! *${Code[0].nombre.split(" ")[0]}*_
    
                    ➖➖➖➖➖➖➖
    _*¡* Déjame mostrarte lo que puedo hacer *!*_
                    ➖➖➖➖➖➖➖    
        
    _😮 (Para seleccionar la opción deseada, simplemente envíame el *número* que la antepone)_
    
                    _*1* - Estado de cuenta_
                    _*2* - Enviar recibo(s) de caja_
                    _*3* - Realizar pago o abono_
                    _*4* - Conocer mi saldo a la fecha_
                    _*5* - Auditar producto_
                    _*6* - Actualizar datos de contacto_
                    _*7* - Chatear con un asesor_
                    _*8* - Agendar llamada o cita_
                    
    _Empieza a probar, estoy esperando 👀_
                    
    _Siempre que lo desees puedes volver al *menú principal*. 🔙 Enviándome *"#"*_` });
            } else {
                await apiChatApi('message', { chatId: chatId, body: `CODIGO INVALIDO` });
            }
        } else if (/^\s?rc[0-9]+\s?$|^\s?rc##\s?$/i.test(body)) {
            const res = await RecibosCaja(chatId.replace('@c.us', ''), senderName, author, body.trim().replace(/rc/i, ''));
            !res && await apiChatApi('message', { chatId: chatId, body: `😔 _¡Valla! parece que el sistema no te reconoce aún._\n\n_Envíanos tu número de documento seguido del carácter *#* y así poder verificar_ 🧐 🕜` });
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
                doc: "http://domain.com/tra.docx",
                jpg: "http://domain.com/tra.jpg",
                mp3: "http://domain.com/tra.mp3",
                pdf: "http://domain.com/tra.pdf"
            };
            var dataFile = {
                phone: author,
                body: files[fileType],
                filename: `File *.${fileType}`
            };
            if (fileType == "jpg") dataFile['caption'] = "Text under the photo.";
            await apiChatApi('sendFile', dataFile);
        } else if (/ptt/.test(body)) {
            await apiChatApi('sendAudio', { audio: "http://domain.com/tra.ogg", chatId: chatId });
        } else if (/geo/.test(body)) {
            await apiChatApi('sendLocation', { lat: 51.178843, lng: -1.826210, address: 'Stonehenge', chatId: chatId });
        } else if (/group/.test(body)) {
            let arrayPhones = [author.replace("@c.us", "")];
            await apiChatApi('group', { groupName: 'Bot group', phones: arrayPhones, messageText: 'Welcome to the new group!' });
        } else if (/[a-zA-Z0-9]+/.test(body)) {
            const max_time = moment().unix();
            const min_time = moment().subtract(5, "hours").unix();
            const Url = `https://api.chat-api.com/instance107218/messages?chatId=${chatId}&limit=200&min_time=${min_time}&max_time=${max_time}&token=5jn3c5dxvcj27fm0`;
            const chat = await axios(Url);
            let msgs = 0, res = 0;
            chat.data.messages.map((e, i) => {
                if (!e.fromMe) {
                    msgs++
                } else if (e.body == 7) {
                    res++
                }
            });

            //console.log(Url, chat.data.messages, msgs, moment.unix(max_time).format('YYYY-MM-DD H:mm:ss'), max_time, moment.unix(min_time).format('YYYY-MM-DD H:mm:ss'), min_time, chatId);
            //chat.length && console.log(Url, chat.data.messages, moment.unix(max_time).format('YYYY-MM-DD H:mm:ss'), max_time, moment.unix(min_time).format('YYYY-MM-DD H:mm:ss'), min_time, chatId, moment.unix(chat.data.messages[0].time).format('YYYY-MM-DD H:mm:ss'));

            if ((msgs) > 1 && !res) {
                await apiChatApi('message', { chatId: chatId, quotedMsgId: msgId, body: '_☝️No comprendo lo que dices_' });
            } else if ((msgs) > 0 && !res) {
                await apiChatApi('message', {
                    chatId: chatId, quotedMsgId: msgId, body: `_☝️*No comprendo lo que dices.*_ 

                _Si lo que deseas es *chatear* 💬 con una *persona* 🙋🏼‍♀️🙋🏽‍♂️ solo envíame un *7*_
                
                _O si lo que prefieres es volver a ver el *menú* ⚙️ de opciones envíame un *#*_` });
            } else {
                const text = `_🤖 *¡Hola!* Soy *Ana* el Asistente de *RedElite* creado para ofrecerte mayor facilidad de procesos_
    
                ➖➖➖➖➖➖➖
_*¡* Déjame mostrarte lo que puedo hacer *!*_
                ➖➖➖➖➖➖➖    
    
_😮 (Para seleccionar la opción deseada, simplemente envíame el *número* que la antepone)_

                _*1* - Estado de cuenta_
                _*2* - Enviar recibo(s) de caja_
                _*3* - Realizar pago o abono_
                _*4* - Conocer mi saldo a la fecha_
                _~*5* - Auditar producto~_
                _~*6* - Actualizar datos de contacto~_    
                _*7* - Chatear con una persona_
                _~*8* - Agendar llamada o cita~_
                
_Empieza a probar, estoy esperando 👀_
                
_Siempre que lo desees puedes volver al *menú principal*. 🔙 Enviándome *"#"*_`;

                var r = await apiChatApi('message', { chatId: chatId, body: text });
                console.log(r, 'lo que respondio del envio')
            }
        } else if (/^\s?#\s?$/.test(body)) {
            const text = `_🤖 *¡Hola!* Soy *Ana* el Asistente de *RedElite* creado para ofrecerte mayor facilidad de procesos_
    
                ➖➖➖➖➖➖➖
_*¡* Déjame mostrarte lo que puedo hacer *!*_
                ➖➖➖➖➖➖➖    
    
_😮 (Para seleccionar la opción deseada, simplemente envíame el *número* que la antepone)_

                _*1* - Estado de cuenta_
                _*2* - Enviar recibo(s) de caja_
                _*3* - Realizar pago o abono_
                _*4* - Conocer mi saldo a la fecha_
                _~*5* - Auditar producto~_
                _~*6* - Actualizar datos de contacto~_    
                _*7* - Chatear con una persona_
                _~*8* - Agendar llamada o cita~_
                
_Empieza a probar, estoy esperando 👀_
                
_Siempre que lo desees puedes volver al *menú principal*. 🔙 Enviándome *"#"*_`;

            var r = await apiChatApi('message', { chatId: chatId, body: text });
            //console.log(r, 'lo que respondio del envio de #')
        }
    }
    //https://grupoelitefincaraiz.com/webhook

    if (messages) {
        /* messages
            
            .map((x) => {
                
                require('../index.js')('messages', x);
            });
    } else if (chatUpdate) {
        chatUpdate.map((x) => {
            require('../index.js')('chatUpdate', x);
        });
    } else if (ack) {
        ack.map((x) => {
            require('../index.js')('typing', x);
        });
    } else if (previous_substatus) {
        previous_substatus */
    }
    res.send(true);
    res.end();

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
})
var t = {
    "response_code_pol": 5,
    "phone": "573012673944",
    "additional_value": 0.00,
    "test": 1,
    "transaction_date": "2015-05-27 13:07:35",
    "cc_number": "************ 0004",
    "cc_holder": "test_buyer",
    "error_code_bank": 1,
    "billing_country": "CO",
    "bank_referenced_name": "fg",
    "description": "test_payu_01",
    "administrative_fee_tax": 0.00,
    "value": 100.00,
    "administrative_fee": 0.00,
    "payment_method_type": 2,
    "office_phone": 1,
    "email_buyer": "test@payulatam.com",
    "response_message_pol": "ENTITY_DECLINED",
    "error_message_bank": 0,
    "shipping_city": 0,
    "transaction_id": "f5e668f1-7ecc-4b83-a4d1-0aaa68260862",
    "sign": "e1b0939bbdc99ea84387bee9b90e4f5c",
    "tax": 0.00,
    "payment_method": 10,
    "billing_address": "cll 93",
    "payment_method_name": "VISA",
    "pse_bank": 0,
    "state_pol": 6,
    "date": "2015.05.27 01:07:35",
    "nickname_buyer": 0,
    "reference_pol": "7069375",
    "currency": "USD",
    "risk": 1.0,
    "shipping_address": 0,
    "bank_id": 10,
    "payment_request_state": "R",
    "customer_number": 0,
    "administrative_fee_base": 0.00,
    "attempts": 1,
    "merchant_id": 508029,
    "exchange_rate": 2541.15,
    "shipping_country": 0,
    "installments_number": 1,
    "franchise": "VISA",
    "payment_method_id": 2,
    "extra1": 0,
    "extra2": 0,
    "antifraudMerchantId": 0,
    "extra3": 0,
    "nickname_seller": 0,
    "ip": "190.242.116.98",
    "airline_code": 0,
    "billing_city": "Bogota",
    "pse_reference1": 0,
    "reference_sale": "2015-05-27 13:04:37",
    "pse_reference3": 0,
    "pse_reference2": 0
}
router.post('/api/bank/callback', async (req, res) => {
    const { transferVoucher, transferAmount, transferStateDescription, sign, requestDate, transferState,
        transferDate, transferCode, transferReference, commerceTransferButtonId } = req.body;


    let AppiKey = '1Fj8eK4rlyUd252L48herdrnEZ';
    let key = `${AppiKey}~${commerceTransferButtonId}~${transferCode}~${transferAmount}~${transferState}`;
    let hash = crypto.createHash('sha512').update(key).digest("hex");
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
    const { transaction_date, reference_sale, state_pol, payment_method_type, value, email_buyer, phone, cc_number,
        cc_holder, description, response_message_pol, payment_method_name, pse_bank, reference_pol, ip, transaction_id,
        transaction_bank_id, currency, error_message_bank, extra2 } = req.body;
    console.log(req.body)
    const ids = reference_sale.split("-");
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
        /*const a = await Bonos(bono, lt);
        if (a) {
            await pool.query('UPDATE cupones SET ? WHERE id = ?',
                [{ producto: a, estado: 14 }, pin]
            );
        } else if (!a && bono != 0) {
            response_message_pol
            return EnviarWTSAP(phone, `Solicitud de pago ${reference_sale} rechazada, Bono erroneo`)
        }*/
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
    }
});
router.get(`/planes`, async (req, res) => {
    console.log(req.query)
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
    }
    let c = req.query.iux || '';

    if (c == 'ir') {
        res.render('respuesta');
    } else {
        if (r.transactionState == 4) {
            r.estado = 'success';
            r.msg = "aprobada";
            //await pool.query('INSERT INTO ventas SET ? ', venta);
            res.render('respuesta', r);
        } else if (r.transactionState == 6) {
            r.msg = "rechazada";
            r.estado = 'danger';
            res.render('respuesta', r);
        } else if (r.transactionState == 104) {
            r.msg = "Error";
            r.estado = 'danger';
            res.render('respuesta', r);
        } else if (r.transactionState == 7) {
            r.msg = "pendiente";
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

    const cliente = await pool.query('SELECT * FROM clientes WHERE email = ? AND movil = ?', [buyerEmail, telephone]);
    if (cliente.length > 0) {
        let clave = `jodete cabron este codigo no esta completo aun-${cliente[0].nombre}-${cliente[0].movil}-${cliente[0].email}-${pin}`,
            key = crypto.createHash('md5').update(clave).digest("hex");
        url = `https://iux.com.co/x/venta.php?name=${cliente[0].nombre}&movil=${cliente[0].movil}&email=${cliente[0].email}&ref=${pin}&key=${key}`;
        let pi = pin.slice(0, 3), fh = new Date();

        switch (pi) {
            case 'S1M':
                fh.setDate(fh.getDate() + 30)
                break;
            case 'S2M':
                fh.setDate(fh.getDate() + 60)
                break;
            case 'S6M':
                fh.setDate(fh.getDate() + 180)
                break;
        }
        await pool.query('UPDATE ventas set ? WHERE pin = ?',
            [
                {
                    client: cliente[0].id,
                    correo: cliente[0].email,
                    fechadeactivacion: new Date(),
                    fechadevencimiento: fh
                }, pin
            ]
        );

        await transpoter.sendMail({
            from: "'Suport' <suport@tqtravel.co>",
            to: 'redflix.red@hotmail.com',
            subject: 'confirmacion de registro',
            text: `${telephone}-${buyerFullName}-${buyerEmail}-${pin}-${key}
            -VENTA`
        });
        request({
            url,
            json: true
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            //sms('573007753983', `${body} ${res.statusCode} ACTUALIZADO`);
        })
        res.redirect('https://iux.com.co/app/login');
    } else {

    }
});
async function PagosAbonos(Tid, user) {
    //u.
    const SS = await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, u.nrango, c.mora, 
    pd.valor, pr.ahorro, pr.iniciar, s.facturasvenc, pd.estado, p.incentivo, pr.asesor, u.sucursal, 
    pr.lote, cl.idc, cl.movil, cl.nombre, s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, r.incntivo, 
    pd.n, s.stado, cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto, c.abono,
    s.ids, s.descp, pr.id cparacion, s.pago, c.estado std FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id
    INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON s.lt = pd.id
    INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id INNER JOIN clientes cl ON pr.cliente = cl.idc 
    LEFT JOIN cupones cp ON s.bono = cp.id WHERE  pr.tipobsevacion IS NULL AND s.ids = ${Tid}`);

    const S = SS[0];
    const T = S.cparacion;
    const fech = moment(S.fechs).format('YYYY-MM-DD');
    const fech2 = moment(S.fech).format('YYYY-MM-DD HH:mm');
    const monto = S.bono && S.formap !== 'BONO' ? S.monto + S.mount : S.monto;
    if (S.stado === 4 || S.stado === 6) {
        return false
    };
    if (S.concepto === 'ABONO') {
        var montocuotas = monto;
        const Cuotas = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${T} AND estado = 3 ORDER BY TIMESTAMP(fechs) ASC`);

        if (Cuotas.length > 0 && monto > 0) {
            await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [{ stado: 4, aprueba: user }, Tid]);
            var sql = `UPDATE cuotas SET estado = 13, mora = 0, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}'`;
            var sql2 = '', idS = '';

            Cuotas.map((c) => {
                var cuot = c.cuota + c.mora;
                if (montocuotas >= cuot) {
                    idS += c.id.toString() + ', ';
                    montocuotas = montocuotas - (c.cuota + c.mora);
                    //console.log(c, cuota, cuot, montocuotas, montocuotas >= cuot)
                } else if (montocuotas > 0) {
                    var mor = montocuotas >= c.mora ? 0 : c.mora - montocuotas
                    var cuo = montocuotas > c.mora ? c.cuota - (montocuotas + c.mora) : c.cuota;
                    var abono = c.abono + montocuotas; console.log(c, c.cuota, cuot, montocuotas, montocuotas >= cuot, abono)
                    sql2 = `UPDATE cuotas SET estado = 3, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}', cuota = ` + cuo + ', mora = ' + mor + ', abono = ' + abono + ' WHERE id = ' + c.id;
                    montocuotas = 0;
                }
            });
            idS = idS.slice(0, -2);
            sql += ' WHERE id IN(' + idS + ')';
            try {
                idS ? await pool.query(sql) : console.log(sql, 'no sql');
                sql2 ? await pool.query(sql2) : console.log(sql2, 'no sql2');
            }
            catch (e) {
                console.log(e);
            }
            if (montocuotas > 0) {
                var pin = ID(5),
                    motivo = `${fech} Excedente del pago total del producto con id de ORDEN ${T}, id de pago ${Tid}`;
                const bono = {
                    pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                    tip: 'BONO', monto: montocuotas, motivo,
                }
                const bno = await pool.query('INSERT INTO cupones SET ? ', bono);
                var respts = `El monto consignado es mayor al del valor total del producto con id de ORDEN ${T}, se genero un BONO con el excedente idBono:${bno.insertId}` //
                await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [{ observaciones: respts }, Tid]);

                var nombr = S.nombre.split(" ")[0],
                    bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                EnviarWTSAP(S.movil, bodi);
            };
        } else {
            return false
        }
    } else if (S.concepto === 'PAGO') {
        var cuota = S.cuota + S.mora;
        if (S.tipo === 'SEPARACION' && S.incentivo && S.incntivo && monto >= cuota) {
            var solicitar = {
                fech: fech2, monto: S.incentivo, concepto: 'COMISION DIRECTA', stado: 15, descp: 'SEPARACION',
                asesor: S.asesor, porciento: 0, total: S.cuota, lt: S.lote, retefuente: 0, reteica: 0, pagar: S.incentivo
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, solicitar);
        } else if (S.tipo === 'SEPARACION' && monto < cuota) {
            return false;
        }
        if (monto >= cuota || S.std === 13) {
            var montocuotas = monto - cuota;
            //console.log(S.pago, Tid, T, montocuotas);
            await pool.query(`UPDATE cuotas c 
                INNER JOIN preventa p ON c.separacion = p.id 
                INNER JOIN productosd l ON p.lote = l.id 
                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                WHERE c.id = ?`,
                [
                    {
                        's.aprueba': user,
                        's.stado': 4,
                        'c.estado': 13,
                        'c.mora': 0,
                        'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'l.fechar': moment(fech2).format('YYYY-MM-DD')
                    }, S.pago
                ]
            );
            const Cuotas = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${T} AND estado = 3 ORDER BY TIMESTAMP(fechs) ASC`);

            if (Cuotas.length > 0 && montocuotas > 0) {
                var sql = `UPDATE cuotas SET estado = 13, mora = 0, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}'`;
                var sql2 = '', idS = '';

                Cuotas.map((c) => {
                    var cuot = c.cuota + c.mora;
                    if (montocuotas >= cuot) {
                        idS += c.id.toString() + ', ';
                        montocuotas = montocuotas - (c.cuota + c.mora);
                        //console.log(c, cuota, cuot, montocuotas, montocuotas >= cuot)
                    } else if (montocuotas > 0) {
                        var mor = montocuotas >= c.mora ? 0 : c.mora - montocuotas
                        var cuo = montocuotas > c.mora ? c.cuota - (montocuotas + c.mora) : c.cuota;
                        var abono = c.abono + montocuotas;
                        sql2 = `UPDATE cuotas SET estado = 3, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}', cuota = ` + cuo + ', mora = ' + mor + ', abono = ' + abono + ' WHERE id = ' + c.id;
                        montocuotas = 0;
                    }
                })
                idS = idS.slice(0, -2);
                sql += ' WHERE id IN(' + idS + ')';
                try {
                    idS ? await pool.query(sql) : console.log(sql, 'no sql');
                    sql2 ? await pool.query(sql2) : console.log(sql2, 'no sql2');
                }
                catch (e) {
                    console.log(e);
                }
            }
        } else if (monto < cuota) {
            var mor = monto >= S.mora ? 0 : S.mora - monto
            var cuo = monto > S.mora ? S.cuota - (monto + S.mora) : S.cuota;
            await pool.query(
                `UPDATE cuotas c 
                    INNER JOIN preventa p ON c.separacion = p.id 
                    INNER JOIN productosd l ON p.lote = l.id 
                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                    WHERE c.id = ?`,
                [
                    {
                        's.aprueba': user,
                        's.stado': 4,
                        'c.estado': 3,
                        'c.cuota': cuo,
                        'c.mora': mor,
                        'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'c.abono': S.abono + monto
                    }, S.pago
                ]
            );
        }
    }
    var st = await Estados(T)
    await pool.query(`UPDATE solicitudes s 
        INNER JOIN productosd l ON s.lt = l.id 
        SET ? WHERE s.ids = ?`,
        [
            {
                'l.estado': st.std
            }, Tid
        ]
    );

    var bod = `_*${S.nombre}*. Hemos procesado tu *${S.concepto}* de manera exitosa. Recibo *${S.recibo}* Monto *${Moneda(monto)}* recibo de pago *#${Tid}*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
    var smsj = `hemos procesado tu pago de manera exitosa Recibo: ${S.recibo} Bono ${S.bono} Monto: ${Moneda(monto)} Concepto: ${S.proyect} MZ ${S.mz} LOTE ${S.n}`

    await EnviarWTSAP(S.movil, bod);
    return true
}
async function PagosAbonos(Tid, user) {
    //u.
    const SS = await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, u.nrango, c.mora, 
    pd.valor, pr.ahorro, pr.iniciar, s.facturasvenc, pd.estado, p.incentivo, pr.asesor, u.sucursal, 
    pr.lote, cl.idc, cl.movil, cl.nombre, s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, r.incntivo, 
    pd.n, s.stado, cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto, c.abono,
    s.ids, s.descp, pr.id cparacion, s.pago, c.estado std FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id
    INNER JOIN preventa pr ON s.orden = pr.id INNER JOIN productosd pd ON s.lt = pd.id
    INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id INNER JOIN clientes cl ON pr.cliente = cl.idc 
    LEFT JOIN cupones cp ON s.bono = cp.id WHERE  pr.tipobsevacion IS NULL AND s.ids = ${Tid}`);

    const S = SS[0];
    const T = S.cparacion;
    const fech = moment(S.fechs).format('YYYY-MM-DD');
    const fech2 = moment(S.fech).format('YYYY-MM-DD HH:mm');
    const monto = S.bono && S.formap !== 'BONO' ? S.monto + S.mount : S.monto;
    //console.log(S, monto)
    if (S.stado === 4 || S.stado === 6) {
        //Eli(pdf)
        return false
    };
    if (S.concepto === 'ABONO') {
        var montocuotas = monto;
        const Cuotas = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${T} AND estado = 3 ORDER BY TIMESTAMP(fechs) ASC`);

        if (Cuotas.length > 0 && monto > 0) {
            await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [{ stado: 4, aprueba: user }, Tid]);
            var sql = `UPDATE cuotas SET estado = 13, mora = 0, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}'`;
            var sql2 = '', idS = '';

            Cuotas.map((c) => {
                var cuot = c.cuota + c.mora;
                if (montocuotas >= cuot) {
                    idS += c.id.toString() + ', ';
                    montocuotas = montocuotas - (c.cuota + c.mora);
                    //console.log(c, cuota, cuot, montocuotas, montocuotas >= cuot)
                } else if (montocuotas > 0) {
                    var mor = montocuotas >= c.mora ? 0 : c.mora - montocuotas
                    var cuo = montocuotas > c.mora ? c.cuota - (montocuotas + c.mora) : c.cuota;
                    var abono = c.abono + montocuotas; console.log(c, c.cuota, cuot, montocuotas, montocuotas >= cuot, abono)
                    sql2 = `UPDATE cuotas SET estado = 3, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}', cuota = ` + cuo + ', mora = ' + mor + ', abono = ' + abono + ' WHERE id = ' + c.id;
                    montocuotas = 0;
                }
            });
            idS = idS.slice(0, -2);
            sql += ' WHERE id IN(' + idS + ')';
            try {
                idS ? await pool.query(sql) : console.log(sql, 'no sql');
                sql2 ? await pool.query(sql2) : console.log(sql2, 'no sql2');
            }
            catch (e) {
                console.log(e);
            }
            if (montocuotas > 0) {
                var pin = ID(5),
                    motivo = `${fech} Excedente del pago total del producto con id de ORDEN ${T}, id de pago ${Tid}`;
                const bono = {
                    pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                    tip: 'BONO', monto: montocuotas, motivo,
                }
                const bno = await pool.query('INSERT INTO cupones SET ? ', bono);
                var respts = `El monto consignado es mayor al del valor total del producto con id de ORDEN ${T}, se genero un BONO con el excedente idBono:${bno.insertId}` //
                await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [{ observaciones: respts }, Tid]);

                var nombr = S.nombre.split(" ")[0],
                    bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                EnviarWTSAP(S.movil, bodi);
            };
        } else {
            return false
        }

    } else if (S.concepto === 'PAGO') {
        var cuota = S.cuota + S.mora;
        if (S.tipo === 'SEPARACION' && S.incentivo && S.incntivo && monto >= cuota) {
            const sep = await pool.query(`SELECT * FROM solicitudes WHERE descp = 'SEPARACION' AND lt = ${S.lote} AND stado != 6 AND asesor = ${S.asesor}`);
            if (!sep.length) {
                var solicitar = {
                    fech: fech2, monto: S.incentivo, concepto: 'COMISION DIRECTA', stado: 15, descp: 'SEPARACION', orden: T,
                    asesor: S.asesor, porciento: 0, total: S.cuota, lt: S.lote, retefuente: 0, reteica: 0, pagar: S.incentivo
                }
                await pool.query(`INSERT INTO solicitudes SET ?`, solicitar);
            }
        }
        if (monto >= cuota || S.std === 13) {
            var montocuotas = monto - cuota;
            await pool.query(`UPDATE solicitudes s  
                INNER JOIN preventa p ON s.lt = p.lote
                INNER JOIN productosd l ON s.lt = l.id 
                INNER JOIN cuotas c ON s.pago = c.id SET ? 
                WHERE s.ids = ?`,
                [
                    {
                        's.aprueba': user,
                        's.stado': 4,
                        'c.estado': 13,
                        'c.mora': 0,
                        'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'l.fechar': moment(fech2).format('YYYY-MM-DD')
                    }, Tid
                ]
            );
            const Cuotas = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${T} AND estado = 3 ORDER BY TIMESTAMP(fechs) ASC`);

            if (Cuotas.length > 0 && montocuotas > 0) {
                var sql = `UPDATE cuotas SET estado = 13, mora = 0, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}'`;
                var sql2 = '', idS = '';

                Cuotas.map((c) => {
                    var cuot = c.cuota + c.mora;
                    if (montocuotas >= cuot) {
                        idS += c.id.toString() + ', ';
                        montocuotas = montocuotas - (c.cuota + c.mora);
                        //console.log(c, cuota, cuot, montocuotas, montocuotas >= cuot)
                    } else if (montocuotas > 0) {
                        var mor = montocuotas >= c.mora ? 0 : c.mora - montocuotas
                        var cuo = montocuotas > c.mora ? c.cuota - (montocuotas + c.mora) : c.cuota;
                        var abono = c.abono + montocuotas;
                        sql2 = `UPDATE cuotas SET estado = 3, fechapago = '${moment(fech2).format('YYYY-MM-DD HH:mm')}', cuota = ` + cuo + ', mora = ' + mor + ', abono = ' + abono + ' WHERE id = ' + c.id;
                        montocuotas = 0;
                    }
                })
                idS = idS.slice(0, -2);
                sql += ' WHERE id IN(' + idS + ')';
                try {
                    idS ? await pool.query(sql) : console.log(sql, 'no sql');
                    sql2 ? await pool.query(sql2) : console.log(sql2, 'no sql2');
                }
                catch (e) {
                    console.log(e);
                }
            }
        } else if (monto < cuota) {
            var mor = monto >= S.mora ? 0 : S.mora - monto
            var cuo = monto > S.mora ? S.cuota - (monto + S.mora) : S.cuota;
            await pool.query(
                `UPDATE solicitudes s  
                INNER JOIN preventa p ON s.lt = p.lote
                INNER JOIN productosd l ON s.lt = l.id 
                INNER JOIN cuotas c ON s.pago = c.id SET ? 
                WHERE s.ids = ?`,
                [
                    {
                        's.aprueba': user,
                        's.stado': 4,
                        'c.estado': 3,
                        'c.cuota': cuo,
                        'c.mora': mor,
                        'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'c.abono': S.abono + monto
                    }, Tid
                ]
            );
        }
    }
    var st = await Estados(T)
    await pool.query(`UPDATE solicitudes s 
        INNER JOIN productosd l ON s.lt = l.id 
        SET ? WHERE s.ids = ?`,
        [
            {
                'l.estado': st.std
            }, Tid
        ]
    );

    var bod = `_*${S.nombre}*. Hemos procesado tu *${S.concepto}* de manera exitosa. Recibo *${S.recibo}* Monto *${Moneda(monto)}* recibo de pago *#${Tid}*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
    var smsj = `hemos procesado tu pago de manera exitosa Recibo: ${S.recibo} Bono ${S.bono} Monto: ${Moneda(monto)} Concepto: ${S.proyect} MZ ${S.mz} LOTE ${S.n}`

    await EnviarWTSAP(S.movil, bod);
    //await EnvWTSAP_FILE(S.movil, pdf, 'RECIBO DE CAJA ' + Tid, 'PAGO EXITOSO');
    return true
}
async function Estados(S) {
    // S = id de separacion

    var F = { r: S, m: `AND pr.id = ${S}` };

    const Pagos = await pool.query(
        `SELECT SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS BONOS, SUM(s.monto) AS MONTO,
         pr.asesor FROM solicitudes s INNER JOIN preventa pr ON s.orden = pr.id INNER JOIN productosd pd ON s.lt = pd.id
         LEFT JOIN cupones cp ON s.bono = cp.id WHERE s.stado = 4 AND pr.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO') ${F.m}`
    );
    const Cuotas = await pool.query(`SELECT pr.separar AS SEPARACION,
    ROUND((l.valor - pr.ahorro) * pr.iniciar /100) AS INICIAL, 
    ROUND((l.valor - pr.ahorro) * (100 - pr.iniciar) /100) AS FINANCIACION,
    l.valor - pr.ahorro AS TOTAL FROM preventa pr INNER JOIN productosd l 
    ON pr.lote = l.id WHERE pr.tipobsevacion IS NULL AND pr.id = ${F.r} LIMIT 1`);

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
            Desendentes(Pagos[0].asesor, 10)
            //console.log(Pagos, Cuotas, Pendientes, { std: 13, estado: 'VENDIDO', pendients });
            return { std: 13, estado: 'VENDIDO', pendients }
        } else if (pagos >= cuotas.INICIAL && pagos < cuotas.TOTAL) {
            Desendentes(Pagos[0].asesor, 10)
            //console.log(Pagos, Cuotas, Pendientes, { std: 10, estado: 'SEPARADO', pendients });
            return { std: 10, estado: 'SEPARADO', pendients }
        } else if (pagos >= cuotas.SEPARACION && pagos < cuotas.INICIAL) {
            //console.log(Pagos, Cuotas, Pendientes, { std: 12, estado: 'APARTADO', pendients });
            return { std: 12, estado: 'APARTADO', pendients }
        } else {
            //console.log(Pagos, Cuotas, Pendientes, { std: 1, estado: 'PENDIENTE', pendients }, 'Aca');
            return { std: 1, estado: 'PENDIENTE', pendients }
        }

    } else {
        //console.log(Pagos, Cuotas, Pendientes, { std: 1, estado: 'PENDIENTE', pendients }, 'aqui');
        return { std: 1, estado: 'PENDIENTE', pendients }
    }
}
async function Desendentes(pin, stados, pasado) {
    if (stados != 10) {
        return false
    }
    let m = new Date();
    var mes = m.getMonth() + 1;
    var corte, cort = 0, cortp = 0, rangofchs = '';
    var hoy = moment().format('YYYY-MM-DD')
    var venta = 0, bono = 0, bonop = 0, personal = 0

    switch (mes) {
        case 1:
            corte = 1
            rangofchs = `AND MONTH(l.fechar) = ${mes} AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 2:
            corte = 2
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 3:
            corte = 3
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 2}, ${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 4:
            corte1 = 1
            rangofchs = `AND MONTH(l.fechar) = ${mes} AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 5:
            corte = 2
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 6:
            corte = 3
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 2}, ${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 7:
            corte = 1
            rangofchs = `AND MONTH(l.fechar) = ${mes} AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 8:
            corte = 2
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 9:
            corte = 3
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 2}, ${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 10:
            corte = 1
            rangofchs = `AND MONTH(l.fechar) = ${mes} AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 11:
            corte = 2
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        case 12:
            corte = 3
            rangofchs = `AND MONTH(l.fechar) IN(${mes - 2}, ${mes - 1}, ${mes}) AND YEAR(l.fechar) = YEAR(CURDATE())`
            break;
        default:
            return false
    }

    await pool.query(`UPDATE solicitudes s INNER JOIN productosd l ON s.lt = l.id 
        SET l.uno = IF(s.descp = 'PRIMERA LINEA', s.asesor, l.uno), 
        l.dos = IF(s.descp = 'SEGUNDA LINEA', s.asesor, l.dos), 
        l.tres = IF(s.descp = 'TERCERA LINEA', s.asesor, l.tres), 
        l.directa = IF(s.descp = 'VENTA DIRECTA', s.asesor, l.directa)
        WHERE (l.directa IS NULL AND s.descp = 'VENTA DIRECTA') 
        OR (l.uno IS NULL AND s.descp = 'PRIMERA LINEA') 
        OR (l.dos IS NULL AND s.descp = 'SEGUNDA LINEA') 
        OR (l.tres IS NULL AND s.descp = 'TERCERA LINEA') 
        AND s.descp != 'SEPARACION'`);

    const asesor = await pool.query(`SELECT * FROM pines p INNER JOIN users u ON p.acreedor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id WHERE u.id = ? LIMIT 1`, pin);

    var j = asesor[0]
    if (j.sucursal) {
        const directas = await pool.query(`SELECT p0.usuario papa, p1.usuario abuelo, 
            p2.usuario bisabuelo, p.id ordn, p.*, l.*, o.*, u.*, c.* 
            FROM pines p0 LEFT JOIN pines p1 ON p0.usuario = p1.acreedor 
            LEFT JOIN pines p2 ON p1.usuario = p2.acreedor
            INNER JOIN preventa p ON p0.acreedor = p.asesor
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN clientes c ON p.cliente = c.idc
            WHERE p.asesor = ? AND l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL AND p.status IN(2, 3) AND l.directa IS NULL`, j.acreedor);

        if (directas.length > 0) {
            await directas.map(async (a, x) => {
                var val = a.valor - a.ahorro
                personal += val
                if (a.directa === null) {
                    var i = Math.min(j.sucursal, a.maxcomis);
                    var monto = val * i;
                    var retefuente = monto * 0.10;
                    var reteica = monto * 8 / 1000;

                    var montoP = val * a.linea1
                    var retefuenteP = montoP * 0.10
                    var reteicaP = montoP * 8 / 1000

                    var montoA = val * a.linea2
                    var retefuenteA = montoA * 0.10
                    var reteicaA = montoA * 8 / 1000

                    var montoB = val * a.linea3
                    var retefuenteB = montoB * 0.10
                    var reteicaB = montoB * 8 / 1000
                    var std = a.obsevacion === 'CARTERA' ? 4 : 15;
                    bonop += val
                    var f = [[
                        hoy, monto, 'COMISION DIRECTA', std, 'VENTA DIRECTA',
                        j.acreedor, i, val, a.lote, retefuente,
                        reteica, monto - (retefuente + reteica), a.ordn
                    ]]
                    a.papa ? f.push([
                        hoy, montoP, 'COMISION INDIRECTA', std, 'PRIMERA LINEA',
                        a.papa, a.linea1, val, a.lote, retefuenteP,
                        reteicaP, montoP - (retefuenteP + reteicaP), a.ordn
                    ]) : '';
                    a.abuelo ? f.push([
                        hoy, montoA, 'COMISION INDIRECTA', std, 'SEGUNDA LINEA',
                        a.abuelo, a.linea2, val, a.lote, retefuenteA,
                        reteicaA, montoA - (retefuenteA + reteicaA), a.ordn
                    ]) : '';
                    a.bisabuelo ? f.push([
                        hoy, montoB, 'COMISION INDIRECTA', std, 'TERCERA LINEA',
                        a.bisabuelo, a.linea3, val, a.lote, retefuenteB,
                        reteicaB, montoB - (retefuenteB + reteicaB), a.ordn
                    ]) : '';
                    pool.query(`INSERT INTO solicitudes (fech, monto, concepto, stado, descp, asesor, 
                        porciento, total, lt, retefuente, reteica, pagar, orden) VALUES ?`, [f]);
                    pool.query(`UPDATE productosd SET ? WHERE id = ?`,
                        [{ directa: j.acreedor, uno: a.papa, dos: a.abuelo, tres: a.bisabuelo }, a.lote]
                    );
                }
                if (a.mes === mes || a.pagobono) {
                    cortp += val;
                }
            });
        }
        return true
    } else {
        const directas = await pool.query(`SELECT p0.usuario papa, p1.usuario abuelo, p2.usuario bisabuelo, 
            MONTH(fechar) AS mes, p.id ordn, p.*, l.*, o.*, u.*, c.* 
            FROM pines p0 LEFT JOIN pines p1 ON p0.usuario = p1.acreedor 
            LEFT JOIN pines p2 ON p1.usuario = p2.acreedor
            INNER JOIN preventa p ON p0.acreedor = p.asesor
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN clientes c ON p.cliente = c.idc
            WHERE p.asesor = ? AND l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${pasado ? '' : rangofchs}`, j.acreedor);

        const bajolineas1 = await pool.query(`SELECT MONTH(fechar) AS mes, 
            p.id ordn, p.*, l.*, o.*, u.*, r.*, c.* FROM pines p0
            LEFT JOIN pines p1 ON p1.usuario = p0.acreedor    
            INNER JOIN preventa p ON p.asesor = p1.acreedor
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN rangos r ON u.nrango = r.id 
            INNER JOIN clientes c ON p.cliente = c.idc    
            WHERE p0.acreedor = ? AND p1.acreedor IS NOT NULL AND l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${pasado ? '' : rangofchs}
            ORDER BY p.id`, j.acreedor);

        const bajolineas2 = await pool.query(`SELECT MONTH(fechar) AS mes, 
            p.id ordn, p.*, l.*, o.*, u.*, r.*, c.* FROM pines p0
            LEFT JOIN pines p1 ON p1.usuario = p0.acreedor
            LEFT JOIN pines p2 ON p2.usuario = p1.acreedor   
            INNER JOIN preventa p ON p.asesor = p2.acreedor
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN rangos r ON u.nrango = r.id 
            INNER JOIN clientes c ON p.cliente = c.idc    
            WHERE p0.acreedor = ? AND p2.acreedor IS NOT NULL AND l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${pasado ? '' : rangofchs}
            ORDER BY p.id`, j.acreedor);

        const bajolineas3 = await pool.query(`SELECT MONTH(fechar) AS mes, 
            p.id ordn, p.*, l.*, o.*, u.*, r.*, c.* FROM pines p0 
            LEFT JOIN pines p1 ON p1.usuario = p0.acreedor
            LEFT JOIN pines p2 ON p2.usuario = p1.acreedor
            LEFT JOIN pines p3 ON p3.usuario = p2.acreedor    
            INNER JOIN preventa p ON p.asesor = p3.acreedor
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN rangos r ON u.nrango = r.id 
            INNER JOIN clientes c ON p.cliente = c.idc    
            WHERE p0.acreedor = ? AND p3.acreedor IS NOT NULL AND l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${pasado ? '' : rangofchs}
            ORDER BY p.id`, j.acreedor);

        //console.log(bajolineas1.length, bajolineas2.length, bajolineas3.length, directas.length)
        var repor1 = [0];
        var repor2 = [0];
        var repor3 = [0];

        if (directas.length > 0) {
            await directas.map(async (a, x) => {
                var val = a.valor - a.ahorro
                personal += val
                if (a.directa === null) {
                    var monto = val * a.comision
                    var retefuente = monto * 0.10
                    var reteica = monto * 8 / 1000

                    var montoP = val * a.linea1
                    var retefuenteP = montoP * 0.10
                    var reteicaP = montoP * 8 / 1000

                    var montoA = val * a.linea2
                    var retefuenteA = montoA * 0.10
                    var reteicaA = montoA * 8 / 1000

                    var montoB = val * a.linea3
                    var retefuenteB = montoB * 0.10
                    var reteicaB = montoB * 8 / 1000
                    var std = a.obsevacion === 'CARTERA' ? 1 : 15;
                    bonop += val
                    var f = [[
                        hoy, monto, 'COMISION DIRECTA', std, 'VENTA DIRECTA',
                        j.acreedor, a.comision, val, a.lote, retefuente,
                        reteica, monto - (retefuente + reteica), a.ordn
                    ]]
                    a.papa ? f.push([
                        hoy, montoP, 'COMISION INDIRECTA', std, 'PRIMERA LINEA',
                        a.papa, a.linea1, val, a.lote, retefuenteP,
                        reteicaP, montoP - (retefuenteP + reteicaP), a.ordn
                    ]) : '';
                    a.abuelo ? f.push([
                        hoy, montoA, 'COMISION INDIRECTA', std, 'SEGUNDA LINEA',
                        a.abuelo, a.linea2, val, a.lote, retefuenteA,
                        reteicaA, montoA - (retefuenteA + reteicaA), a.ordn
                    ]) : '';
                    a.bisabuelo ? f.push([
                        hoy, montoB, 'COMISION INDIRECTA', std, 'TERCERA LINEA',
                        a.bisabuelo, a.linea3, val, a.lote, retefuenteB,
                        reteicaB, montoB - (retefuenteB + reteicaB), a.ordn
                    ]) : '';
                    //console.log(a.papa, a.abuelo, a.bisabuelo, f)
                    if (a.bonoextra > 0.0000) {
                        montoC = val * a.bonoextra;
                        retefuenteC = montoC * 0.10;
                        reteicaC = montoC * 8 / 1000;
                        f.push([
                            hoy, montoC, 'BONO EXTRA', std, 'VENTA DIRECTA',
                            j.acreedor, a.bonoextra, val, a.lote, retefuenteC,
                            reteicaC, montoC - (retefuenteC + reteicaC), a.ordn
                        ]);
                    }
                    pool.query(`INSERT INTO solicitudes (fech, monto, concepto, stado, descp, asesor, 
                        porciento, total, lt, retefuente, reteica, pagar, orden) VALUES ?`, [f]);
                    pool.query(`UPDATE productosd SET ? WHERE id = ?`,
                        [{ directa: j.acreedor, uno: a.papa, dos: a.abuelo, tres: a.bisabuelo }, a.lote]
                    );
                }
                if (a.mes === mes || a.pagobono) {
                    cortp += val;
                }
            });
        }
        if (bajolineas1.length > 0 && j.nrango !== 6) {
            await bajolineas1.map(async (a, x) => {
                var val = a.valor - a.ahorro
                venta += val
                if (a.uno === null) {
                    var monto = val * a.linea1
                    var retefuente = monto * 0.10
                    var reteica = monto * 8 / 1000
                    var std = a.obsevacion === 'CARTERA' ? 1 : 15;
                    bono += val;
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: std, descp: 'PRIMERA LINEA',
                        asesor: j.acreedor, porciento: a.linea1, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica), orden: a.ordn
                    }
                    pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ uno: j.acreedor }, a.lote]);
                    pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
                if (a.mes === mes) {
                    cort += val;
                }
                repor1.push(a.nrango)
            });
        }
        if (bajolineas2.length > 0 && j.nrango !== 6) {
            await bajolineas2.map(async (a, x) => {
                var val = a.valor - a.ahorro
                venta += val
                if (a.dos === null) {
                    var monto = val * a.linea2
                    var retefuente = monto * 0.10
                    var reteica = monto * 8 / 1000
                    var std = a.obsevacion === 'CARTERA' ? 1 : 15;
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: std, descp: 'SEGUNDA LINEA',
                        asesor: j.acreedor, porciento: a.linea2, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica), orden: a.ordn
                    }
                    pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ dos: j.acreedor }, a.lote]);
                    pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
                if (a.mes === mes) {
                    cort += val;
                }
                repor2.push(a.nrango)
            });
        }
        if (bajolineas3.length > 0 && j.nrango !== 6) {
            await bajolineas3.map(async (a, x) => {
                var val = a.valor - a.ahorro
                venta += val
                if (a.tres === null) {
                    var monto = val * a.linea3
                    var retefuente = monto * 0.10
                    var reteica = monto * 8 / 1000
                    var std = a.obsevacion === 'CARTERA' ? 1 : 15;
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: std, descp: 'TERCERA LINEA',
                        asesor: j.acreedor, porciento: a.linea3, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica), orden: a.ordn
                    }
                    pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ tres: j.acreedor }, a.lote]);
                    pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
                if (a.mes === mes) {
                    cort += val;
                }
                repor3.push(a.nrango)
            });
        }

        var rangoniveles = await [Math.max(...repor1), Math.max(...repor2), Math.max(...repor3)];
        var v = {
            totalcorte: venta + personal, totalcortep: personal,
            rangoabajo: await Math.max(...rangoniveles), cortep: cortp
        }
        corte === 1 ? v.corte1 = cort
            : corte === 2 ? v.corte2 = cort
                : corte === 3 ? v.corte3 = cort : '';

        await pool.query(`UPDATE users SET ? WHERE id = ? AND nrango != 7`, [v, pin]);
        return true
    }
    /////////////////////////* PREMIOS *///////////////////////////////////
    /*var rango = j.nrango;
    var tot = venta + personal
    if (personal >= j.venta && tot >= j.ventas) {
        const r = await pool.query(`SELECT * FROM rangos WHERE ventas BETWEEN 500000000 AND ${tot} LIMIT 1`)
        if (r.length > 0) {
            var y = r[0];
            var retefuente = y.premio * 0.10
            var reteica = y.premio * 8 / 1000
            var descp = y.id === 5 ? 'ASENSO A DIRECTOR'
                : y.id === 4 ? 'ASENSO A GERENTE'
                    : y.id === 3 ? 'ASENSO A GERENTE ELITE'
                        : y.id === 2 ? 'ASENSO A VICEPRESIDENTE'
                            : 'ASENSO A PRESIDENTE'
            var f = {
                fech: hoy, monto: y.premio, concepto: 'PREMIACION', stado: 9,
                descp, asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: y.premio - (retefuente + reteica)
            }
            rango = y.id - 1;
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: rango }, j.acreedor]);
        }
    }*/
    /////////////////////////* BONOS *///////////////////////////////////


};
function EnviarWTSAP(movil, body, smsj) {
    var cel = movil.indexOf("-") > 0 ? '57' + movil.replace(/-/g, "") : movil.indexOf(" ") > 0 ? movil : '57' + movil;
    var options = {
        method: 'POST',
        url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
        form: {
            phone: cel,
            body
        }
    };
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });
    smsj ? sms(cel, smsj) : '';
}
function Moneda(valor) {
    valor = valor.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
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

