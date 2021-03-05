const express = require('express');
const router = express.Router();
const request = require('request')
const nodemailer = require('nodemailer')
const pool = require('../database');
const crypto = require('crypto');
const sms = require('../sms.js');
const MSGS = require('../index.js');
const moment = require('moment');
moment.locale('es');

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
    console.log(ack ? 'bien' : 'nada');
    [
        {
            "messages": [
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
            "instanceId": "107218"
        }]
    if (messages) {
        messages
            /*.filter((x) => {
                return !x.fromMe;
            })*/
            .map((x) => {
                /*const author = x.author;
                const body = x.body.replace(/[^a-zA-Z 0-9.,?!¡¿]+/g, '');
                const chatId = x.chatId;
                const senderName = x.senderName;*/
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
        previous_substatus
    }
    res.send(true);
    res.end();
    /*for (var i in data.messages) {
        const author = data.messages[i].author;
        const body = data.messages[i].body;
        const chatId = data.messages[i].chatId;
        const senderName = data.messages[i].senderName;
        if (data.messages[i].fromMe) return;

        if (/help/.test(body)) {
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
            const text = `🤖 ¡Hola! Soy el Asistente de RedElite creado para ofrecerte mayor facilidad de procesos

            ➖➖➖➖➖➖➖
            ¡Déjame mostrarte lo que puedo hacer!
            ➖➖➖➖➖➖➖    

            😮 (Para seleccionar el elemento deseado, simplemente envíeme el número en el mensaje de respuesta)
            1 - Estado de cuenta
            2 - Enviar el ultimo recibo
            3 - Enviar todos los recibos
            4 - Conocer mi saldo a la fecha
            5 - Chatear con un asesor
            
            Empieza a probar, estoy esperando 👀
            
            Siempre puedes volver al menú principal: 
            🔙 Para volver al menú, envíame "#"`
            await apiChatApi('message', { chatId: chatId, body: text });
        }
    }*/
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


async function apiChatApi(method, params) {
    const options = {};
    options['method'] = "POST";
    options['body'] = JSON.stringify(params);
    options['headers'] = { 'Content-Type': 'application/json' };

    const url = `${apiUrl}/${method}?token=${token}`;

    const apiResponse = await fetch(url, options);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
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
async function Estados(S) {
    // S = id de separacion

    var F = { r: S, m: `AND pr.id = ${S}` };

    const Pagos = await pool.query(
        `SELECT SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS BONOS, SUM(s.monto) AS MONTO,
         pr.asesor FROM solicitudes s INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON s.lt = pd.id
         LEFT JOIN cupones cp ON s.bono = cp.id WHERE s.stado = 4 AND pr.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO') ${F.m}`
    );
    const Cuotas = await pool.query(`SELECT pr.separar AS SEPARACION,
    ROUND((l.valor - pr.ahorro) * pr.iniciar /100) AS INICIAL, 
    ROUND((l.valor - pr.ahorro) * (100 - pr.iniciar) /100) AS FINANCIACION,
    l.valor - pr.ahorro AS TOTAL FROM preventa pr INNER JOIN productosd l 
    ON pr.lote = l.id WHERE pr.tipobsevacion IS NULL AND pr.id = ${F.r} LIMIT 1`);

    const Pendientes = await pool.query(
        `SELECT * FROM solicitudes s INNER JOIN preventa pr ON s.lt = pr.lote 
         INNER JOIN productosd pd ON s.lt = pd.id LEFT JOIN cupones cp ON s.bono = cp.id 
         WHERE s.stado = 3 AND pr.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO') ${F.m}`
    );
    var pendients = Pendientes.length;
    if (Pagos[0].BONOS || Pagos[0].MONTO) {
        var pagos = Pagos[0].BONOS + Pagos[0].MONTO,
            cuotas = Cuotas[0];

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
async function Desendentes(pin, stados) {
    if (stados != 10) {
        return false
    }
    let m = new Date();
    var mes = m.getMonth() + 1;
    let linea = '', lDesc = '';
    var corte, cort = 0, cortp = 0, rangofchs = '';
    var hoy = moment().format('YYYY-MM-DD')
    var venta = 0, bono = 0, bonop = 0, personal = 0
    var sqlINSERT = 'INSERT INTO solicitudes (fech, monto, concepto, stado, descp, asesor, porciento, total, lt, retefuente, reteica, pagar) VALUES ';
    var sqlUPDATE = 'UPDATE productosd SET';
    var sqlDIRECTA = ', directa = CASE id', direct = false;
    var sqlUNO = ', uno = CASE id', one = false;
    var sqlDOS = ', dos = CASE id', two = false;
    var sqlTRES = ', tres = CASE id', three = false;
    var IDS = '';

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
    const asesor = await pool.query(`SELECT * FROM pines p INNER JOIN users u ON p.acreedor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id WHERE u.id = ? LIMIT 1`, pin);

    var j = asesor[0]
    if (j.sucursal) {
        sqlDIRECTA = ' directa = CASE id';
        const directas = await pool.query(`SELECT * FROM preventa p 
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN clientes c ON p.cliente = c.idc
            WHERE p.asesor = ? AND l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL AND p.status IN(2, 3) AND l.directa IS NULL`, j.acreedor);

        if (directas.length > 0) {
            await directas.map(async (a, x) => {
                var val = a.valor - a.ahorro;
                var i = Math.min(j.sucursal, a.maxcomis);
                var monto = val * i;
                var retefuente = monto * 0.10;
                var reteica = monto * 8 / 1000;
                var std = a.obsevacion === 'CARTERA' ? 4 : 15;

                sqlINSERT += `('${hoy}', ${monto}, 'COMISION DIRECTA', ${std}, 'VENTA DIRECTA', '${j.acreedor}', ${j.sucursal}, ${val}, ${a.lote}, ${retefuente}, ${reteica}, ${monto - (retefuente + reteica)}),`;
                sqlDIRECTA += ` WHEN ${a.lote} THEN '${j.acreedor}'`;
                IDS += a.lote.toString() + ', ';
                direct = true;
            })
            if (direct) {
                IDS = IDS.slice(0, -2);
                sqlUPDATE += sqlDIRECTA + ' END WHERE id IN(' + IDS + ')';
                await pool.query(sqlUPDATE);
                await pool.query(sqlINSERT.slice(0, -1));
            }
        }
        return true
    } else {
        const directas = await pool.query(`SELECT MONTH(fechar) AS mes, 
            p.*, l.*, o.*, u.*, c.* FROM preventa p 
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN clientes c ON p.cliente = c.idc
            WHERE p.asesor = ? AND l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${rangofchs}`, j.acreedor);

        if (directas.length > 0) {
            await directas.map(async (a, x) => {
                var val = a.valor - a.ahorro
                var monto = val * a.comision
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                personal += val
                if (a.directa === null) {
                    var std = a.obsevacion === 'CARTERA' ? 4 : 15;
                    bonop += val
                    sqlINSERT += `('${hoy}', ${monto}, 'COMISION DIRECTA', ${std}, 'VENTA DIRECTA', '${j.acreedor}', ${a.comision}, ${val}, ${a.lote}, ${retefuente}, ${reteica}, ${monto - (retefuente + reteica)}),`;
                    sqlDIRECTA += ` WHEN ${a.lote} THEN '${j.acreedor}'`;
                    IDS += a.lote.toString() + ', ';
                    direct = true;
                    if (a.bonoextra > 0.0000) {
                        monto = val * a.bonoextra;
                        retefuente = monto * 0.10;
                        reteica = monto * 8 / 1000;
                        sqlINSERT += `('${hoy}', ${monto}, 'BONO EXTRA', ${std}, 'VENTA DIRECTA', '${j.acreedor}', ${a.bonoextra}, ${val}, ${a.lote}, ${retefuente}, ${reteica}, ${monto - (retefuente + reteica)}),`;
                    }
                }
                if (a.mes === mes || a.pagobono) {
                    cortp += val;
                }
            });
            sqlDIRECTA += ' END'
        }
        var repor1 = [0];
        var repor2 = [0];
        var repor3 = [0];
        const lineaUno = await pool.query(`SELECT * FROM pines WHERE usuario = ? AND  acreedor IS NOT NULL AND usuario IS NOT NULL`, j.acreedor);

        if (lineaUno.length > 0 && j.nrango !== 6) {
            /////////////////////////* COMISIONES *///////////////////////////////////
            await lineaUno.map((p, x) => {
                lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
                linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
            });
            const reporte = await pool.query(`SELECT MONTH(fechar) AS mes, 
                p.*, l.*, o.*, u.*, r.*, c.* FROM preventa p 
                INNER JOIN productosd l ON p.lote = l.id
                INNER JOIN productos o ON l.producto = o.id
                INNER JOIN users u ON p.asesor = u.id
                INNER JOIN rangos r ON u.nrango = r.id 
                INNER JOIN clientes c ON p.cliente = c.idc
                WHERE (${lDesc}) AND l.estado IN(10, 13) 
                AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${rangofchs}`);

            if (reporte.length > 0) {
                await reporte.map(async (a, x) => {
                    var val = a.valor - a.ahorro
                    var monto = val * a.linea1
                    var retefuente = monto * 0.10
                    var reteica = monto * 8 / 1000
                    venta += val
                    if (a.uno === null) {
                        var std = a.obsevacion === 'CARTERA' ? 4 : 15;
                        bono += val;
                        sqlINSERT += `('${hoy}', ${monto}, 'COMISION INDIRECTA', ${std}, 'PRIMERA LINEA', '${j.acreedor}', ${a.linea1}, ${val}, ${a.lote}, ${retefuente}, ${reteica}, ${monto - (retefuente + reteica)}),`;
                        IDS += a.lote.toString() + ', ';
                        sqlUNO += ` WHEN ${a.lote} THEN '${j.acreedor}'`;
                        one = true;
                    }
                    if (a.mes === mes) {
                        cort += val;
                    }
                    repor1.push(a.nrango)
                });
                sqlUNO += ' END'
            }
            const lineaDos = linea ? await pool.query(`SELECT * FROM pines WHERE acreedor IS NOT NULL AND ${linea}`) : '';
            lDesc = '', linea = '';
            if (lineaDos.length > 0) {
                await lineaDos.map((p, x) => {
                    lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
                    linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
                });
                const reporte2 = await pool.query(`SELECT MONTH(fechar) AS mes, 
                p.*, l.*, o.*, u.*, r.*, c.* FROM preventa p 
                INNER JOIN productosd l ON p.lote = l.id
                INNER JOIN productos o ON l.producto = o.id
                INNER JOIN users u ON p.asesor = u.id
                INNER JOIN rangos r ON u.nrango = r.id 
                INNER JOIN clientes c ON p.cliente = c.idc
                WHERE (${lDesc}) AND l.estado IN(10, 13) 
                AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${rangofchs}`);

                if (reporte2.length > 0) {
                    await reporte2.map(async (a, x) => {
                        var val = a.valor - a.ahorro
                        var monto = val * a.linea2
                        var retefuente = monto * 0.10
                        var reteica = monto * 8 / 1000
                        venta += val
                        if (a.dos === null) {
                            var std = a.obsevacion === 'CARTERA' ? 4 : 15;
                            bono += val
                            sqlINSERT += `('${hoy}', ${monto}, 'COMISION INDIRECTA', ${std}, 'SEGUNDA LINEA', '${j.acreedor}', ${a.linea2}, ${val}, ${a.lote}, ${retefuente}, ${reteica}, ${monto - (retefuente + reteica)}),`;
                            IDS += a.lote.toString() + ', ';
                            sqlDOS += ` WHEN ${a.lote} THEN '${j.acreedor}'`;
                            two = true;
                        }
                        if (a.mes === mes) {
                            cort += val;
                        }
                        repor2.push(a.nrango)
                    });
                    sqlDOS += ' END'
                }
            };
            const lineaTres = linea ? await pool.query(`SELECT * FROM pines WHERE acreedor IS NOT NULL AND ${linea}`) : '';
            lDesc = '', linea = '';
            if (lineaTres.length > 0) {
                await lineaTres.map((p, x) => {
                    lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
                });
                const reporte3 = await pool.query(`SELECT MONTH(fechar) AS mes, 
                p.*, l.*, o.*, u.*, r.*, c.* FROM preventa p 
                INNER JOIN productosd l ON p.lote = l.id
                INNER JOIN productos o ON l.producto = o.id
                INNER JOIN users u ON p.asesor = u.id
                INNER JOIN rangos r ON u.nrango = r.id 
                INNER JOIN clientes c ON p.cliente = c.idc
                WHERE (${lDesc}) AND l.estado IN(10, 13) 
                AND p.tipobsevacion IS NULL AND p.status IN(2, 3) ${rangofchs}`);
                if (reporte3.length > 0) {
                    await reporte3.map(async (a, x) => {
                        var val = a.valor - a.ahorro
                        var monto = val * a.linea3
                        var retefuente = monto * 0.10
                        var reteica = monto * 8 / 1000
                        venta += val
                        if (a.tres === null) {
                            var std = a.obsevacion === 'CARTERA' ? 4 : 15;
                            bono += val
                            sqlINSERT += `('${hoy}', ${monto}, 'COMISION INDIRECTA', ${std}, 'TERCERA LINEA', '${j.acreedor}', ${a.linea3}, ${val}, ${a.lote}, ${retefuente}, ${reteica}, ${monto - (retefuente + reteica)}),`;
                            IDS += a.lote.toString() + ', ';
                            sqlTRES += ` WHEN ${a.lote} THEN '${j.acreedor}'`;
                            three = true;
                        }
                        if (a.mes === mes) {
                            cort += val;
                        }
                        repor3.push(a.nrango);
                    });
                    sqlTRES += ' END';
                }
            }
        }
        if (direct || one || two || three) {
            IDS = IDS.slice(0, -2);
            sqlUPDATE += `${direct ? sqlDIRECTA : ''}${one ? sqlUNO : ''}${two ? sqlDOS : ''}${three ? sqlTRES : ''} WHERE id IN(${IDS})`;
            await pool.query(sqlUPDATE.replace(/,/, ''));
            await pool.query(sqlINSERT.slice(0, -1));

            var rangoniveles = await [Math.max(...repor1), Math.max(...repor2), Math.max(...repor3)];
            var v = {
                totalcorte: venta + personal, totalcortep: personal,
                rangoabajo: await Math.max(...rangoniveles), cortep: cortp
            }
            corte === 1 ? v.corte1 = cort
                : corte === 2 ? v.corte2 = cort
                    : corte === 3 ? v.corte3 = cort : '';

            await pool.query(`UPDATE users SET ? WHERE id = ? AND nrango != 7`, [v, pin]);
        }
        return true
    }
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

