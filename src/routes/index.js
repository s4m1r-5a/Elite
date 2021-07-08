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
const PdfPrinter = require('pdfmake')
const Roboto = require('../public/fonts/Roboto');
const moment = require('moment');
moment.locale('es');
const NumeroALetras = require('../functions.js')



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
    console.log(ack ? 'bien' : 'nada', req.body);
    [
        {
            /* "messages": [
                {
                    "id": "false_17472822486@c.us_DF38E6A25B42CC8CCE57EC40F",
                    "body": "Ok!",
                    "type": "chat",
                    "senderName": "Ilya",
                    "fromMe": true,
                    "author": "17472822486@c.us",
                    "time": 1504208593,
                    "chatId": "17472822486@c.us",
                    "messageNumber": 100
                }
            ]
        },
        {
            "chatUpdate": [
                {
                    "old": {
                        "id": "1493046918-13216468942@g.us",
                        "name": "Ok!",
                        "image": "https://pps.whatsapp.net/v/t61.11540-24/42886681_356710581739497_4892819781461213184_n.jpg?oe=5BD90F82&oh=c256f7e5c7aeccd19cf2e626f3ef4236",
                        "metadata": {
                            "groupInviteLink": null,
                            "isGroup": true,
                            "participants": [
                                "17162266665@c.us",
                                "17162277775@c.us"
                            ]
                        },
                        "last_time": 0
                    },
                    "new": {
                        "id": "1493046918-13216468942@g.us",
                        "name": "Ok!",
                        "image": "https://pps.whatsapp.net/v/t61.11540-24/42886681_356710581739497_4892819781461213184_n.jpg?oe=5BD90F82&oh=c256f7e5c7aeccd19cf2e626f3ef4236",
                        "metadata": {
                            "groupInviteLink": null,
                            "isGroup": true,
                            "participants": [
                                "17162266665@c.us",
                                "17162277775@c.us"
                            ]
                        },
                        "last_time": 0
                    }
                }
            ]
        },
        {
            "ack": [
                {
                    "id": "true573175386881@c.us_3EB0DA8B4C1A96DA52C3",
                    "queueNumber": 100,
                    "chatId": "573175386881@c.us",
                    "status": "viewed"
                }
            ]
        },
        {
            "status": "authenticated",
            "previous_status": "authenticated",
            "substatus": "normal",
            "previous_substatus": "battery_low_2",
            "instanceId": "107218" */
        }
    ]



    for (var i in messages) {


        const author = messages[i].author;
        const body = messages[i].body;
        const chatId = messages[i].chatId;
        const senderName = messages[i].senderName;

        if (messages[i].fromMe || /@g.us/.test(chatId)) return;

        if (body == 1) {
            const res = await EstadoCuenta(chatId.replace('@c.us', ''), senderName, author);
            await apiChatApi('message', { chatId: chatId, body: res });
        } else if (body == 2) {
            await apiChatApi('message', { chatId: chatId, body: chatId });
        } else if (body == 3) {
            await apiChatApi('message', { chatId: chatId, body: chatId });
        } else if (body == 4) {
            await apiChatApi('message', { chatId: chatId, body: chatId });
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
        } else {
            const max_time = moment().unix();
            const min_time = moment().subtract(2, "hours").unix();
            const Url = `https://api.chat-api.com/instance107218/messages?chatId=${chatId}&limit=1&min_time=${min_time}&max_time=${max_time}&token=5jn3c5dxvcj27fm0`;
            const chat = await axios(Url);
            //console.log(Url, chat.data.messages, moment.unix(max_time).format('YYYY-MM-DD H:mm:ss'), max_time, moment.unix(min_time).format('YYYY-MM-DD H:mm:ss'), min_time, chatId, moment.unix(chat.data.messages[0].time).format('YYYY-MM-DD H:mm:ss'));
            if (chat.data.messages.length) {
                await apiChatApi('message', { chatId: chatId, body: 'No comprendo lo que dice' });
            } else {

                const text = `🤖 ¡Hola! Soy el Asistente de GrupoElite creado para ofrecerte mayor facilidad de procesos
    
                ➖➖➖➖➖➖➖
                ¡Déjame mostrarte lo que puedo hacer!
                ➖➖➖➖➖➖➖    
    
                😮 (Para seleccionar el elemento deseado, simplemente envíeme el número en el mensaje de respuesta)
                1 - Estado de cuenta
                2 - Enviar el ultimo recibo
                3 - Enviar todos los recibos
                4 - Conocer mi saldo a la fecha
                5 - Auditoria
                6 - Chatear con un asesor
                
                Empieza a probar, estoy esperando 👀
                
                Siempre puedes volver al menú principal: 
                🔙 Para volver al menú, envíame "#"`
                var r = await apiChatApi('message', { chatId: chatId, body: text });
                console.log(r, 'lo que respondio del envio')
            }
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
async function EstadoCuenta(movil, nombre, author) {
    const cel = movil.slice(-10);
    const estado = await pool.query(`SELECT pd.valor - p.ahorro AS total, pt.proyect, cu.pin AS cupon, cp.pin AS bono, 
    p.ahorro, pd.mz, pd.n, pd.valor, p.vrmt2, p.fecha, s.fech, s.ids, s.formap, s.descp,s.monto, s.img, cu.descuento, 
    c.nombre, c.documento, c.email, c.movil, cp.monto mtb, pd.mtr2 FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
    INNER JOIN productos pt ON pd.producto = pt.id INNER JOIN preventa p ON pd.id = p.lote 
    LEFT JOIN cupones cu ON cu.id = p.cupon LEFT JOIN cupones cp ON s.bono = cp.id
    INNER JOIN clientes c ON p.cliente = c.idc WHERE s.stado != 6 AND s.concepto IN('PAGO', 'ABONO') 
    AND p.tipobsevacion IS NULL AND c.movil LIKE '%${cel}%' OR nombre = ?`, nombre);
    const cuerpo = []
    let totalAbonado = 0;
    estado.map((e, i) => {
        totalAbonado += e.monto;
        if (!i) {
            cuerpo.push(
                [
                    { text: `Area: ${e.mtr2} mt2`, style: 'tableHeader', colSpan: 2, alignment: 'center' },
                    {}, { text: `Vr Mt2: $${Moneda(e.vrmt2)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {},
                    { text: '$' + Moneda(e.valor), style: 'tableHeader', alignment: 'center' }
                ],
                [
                    'Cupon', 'Dsto', 'Ahorro',
                    { text: `Total lote`, colSpan: 2 }, {}
                ],
                [
                    { text: e.cupon, style: 'tableHeader', alignment: 'center' },
                    { text: `${e.descuento}%`, style: 'tableHeader', alignment: 'center' },
                    { text: `-$${Moneda(e.ahorro)}`, style: 'tableHeader', alignment: 'center' },
                    { text: `$${Moneda(e.total)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}
                ],
                ['Fecha', 'Recibo', 'Forma', 'Tipo', 'Monto'],
                [moment(e.fech).format('YYYY-MM-DD'), `RC${e.ids}`, e.formap, e.descp, '$' + Moneda(e.monto)]);
        } else {
            cuerpo.push([moment(e.fech).format('YYYY-MM-DD'), `RC${e.ids}`, e.formap, e.descp, '$' + Moneda(e.monto)]);
        }
    }) 
    cuerpo.push(
        [
            { text: 'TOTAL ABONADO', style: 'tableHeader', alignment: 'center', colSpan: 4 }, {}, {}, {},
            { text: '$' + Moneda(totalAbonado), style: 'tableHeader', alignment: 'center' }
        ],
        [
            { text: NumeroALetras(totalAbonado), style: 'small', colSpan: 5 },
            {}, {}, {}, {}
        ],
        [
            { text: 'SALDO A LA FECHA', style: 'tableHeader', alignment: 'center', colSpan: 4 }, {}, {}, {},
            { text: '$' + Moneda(estado[0].total - totalAbonado), style: 'tableHeader', alignment: 'center' }
        ],
        [
            { text: NumeroALetras(estado[0].total - totalAbonado), style: 'small', colSpan: 5 },
            {}, {}, {}, {}
        ]
    )
    ////////////////////////* CREAR PDF *//////////////////////////////
    const printer = new PdfPrinter(Roboto);
    let docDefinition = {
        content: [ // pageBreak: 'before',
            {
                columns: [
                    [
                        { text: 'ESTADO DE CUENTA', style: 'header' },
                        'Conoce aqui el estado el estado de tus pagos y montos',
                        { text: estado[0].nombre, style: 'subheader' },
                        {
                            alignment: 'justify', italics: true, color: 'gray', fontSize: 9,
                            columns: [
                                { text: `Doc. ${estado[0].documento}` },
                                { text: `Movil ${estado[0].movil}` },
                                { text: estado[0].email },
                            ]
                        },
                        {
                            alignment: 'justify', italics: true,
                            columns: [
                                { width: 250, text: estado[0].proyect },
                                { text: `MZ: ${estado[0].mz ? estado[0].mz : 'No aplica'}` },
                                { text: `LT: ${estado[0].n}` }
                            ]
                        }
                    ],
                    {
                        width: 100,
                        image: path.join(__dirname, '/../public/img/avatars/avatar.png'),
                        fit: [100, 100]
                    }
                ]
            },
            {
                style: 'tableBody',
                color: '#444',
                table: {
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                    headerRows: 4,
                    // keepWithHeaderRows: 1,
                    body: cuerpo
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
                margin: [0, 5, 0, 2]
            },
            tableBody: {
                margin: [0, 5, 0, 5]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            small: {
                fontSize: 9,
                italics: true, 
                color: 'gray',
                alignment: 'right'
            }
        }
    }
    let ruta = path.join(__dirname);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(ruta + '/tables.pdf'));
    pdfDoc.end();

    var dataFile = {
        phone: author,
        body: 'https://grupoelitefincaraiz.co/uploads/0pj3q97q5c4q8h-av1vzxmsma8o49u4574.pdf',
        filename: `E.C. ${estado[0].nombre}.pdf`
    };
    await apiChatApi('sendFile', dataFile);
    return JSON.stringify(estado);
}
async function apiChatApi(method, params) {

    const apiUrl = 'https://eu89.chat-api.com/instance107218';
    const token = '5jn3c5dxvcj27fm0';
    const options = {
        method: "POST",
        url: `${apiUrl}/${method}?token=${token}`,
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    };

    const apiResponse = await axios(options); 
    console.log(apiResponse.data)
    return apiResponse.data;
}
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

