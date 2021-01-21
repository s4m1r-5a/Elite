const express = require('express');
const router = express.Router();
const request = require('request')
const nodemailer = require('nodemailer')
const pool = require('../database');
const crypto = require('crypto');
const sms = require('../sms.js');

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
    const { messages, ack } = req.body;
    console.log(ack ? 'bien' : 'nada');
    require('../index.js')('samir', 'todo se encuentra muy bien carajo ');
    [{
        id: 'false_573175386881@c.us_3A46E3BC12D770B30A20',
        body:
            'Les agradezco hacer llegar los recibos por este medio o por correo electrónico',
        fromMe: false,
        self: 0,
        isForwarded: 0,
        author: '573175386881@c.us',
        time: 1611176338,
        chatId: '573175386881@c.us',
        messageNumber: 26637,
        type: 'chat',
        senderName: 'VICTOR MANUEL FORBES OROZCO',
        caption: null,
        quotedMsgBody: null,
        quotedMsgId: null,
        quotedMsgType: null,
        chatName: 'VICTOR MANUEL FORBES OROZCO'
    },
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
                "id": "false_17472822486@c.us_DF38E6A25B42CC8CCE57EC40F",
                "queueNumber": 100,
                "chatId": "17472822486@c.us",
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

    for (var i in data.messages) {
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
    }
    res.send('Ok');
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
        const a = await Bonos(bono, lt);
        if (a) {
            await pool.query('UPDATE cupones SET ? WHERE id = ?',
                [{ producto: a, estado: 14 }, pin]
            );
        } else if (!a && bono != 0) {
            response_message_pol
            return EnviarWTSAP(phone, `Solicitud de pago ${reference_sale} rechazada, Bono erroneo`)
        }
        const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = ? AND s.lt = ?`, [4, i[3]]);
        var l = r[0].monto1 || 0,
            k = r[0].monto || 0;
        var acumulado = l + k;

        const pago = {
            fech: transaction_date, monto: i[0], recibo: reference_sale, facturasvenc: i[1], lt: i[3],
            acumulado, concepto: 'PAGO', stado: 3, descp: i[2], formap: payment_method_name
        }

        i[4] != 0 ? pago.bono = i[5] : '';
        i[2] === 'ABONO' ? pago.concepto = i[2] : pago.pago = i[6],
            await pool.query('UPDATE cuotas SET estado = 1 WHERE id = ?', i[6]);
        await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', i[3]);
        const P = await pool.query('INSERT INTO solicitudes SET ? ', pago);
        const R = await PagosAbonos(P.insertId)
        var body = reference_sale + ' ' + d + ' ' + description;
        EnviarWTSAP(phone, `Solicitud de pago ${reference_sale} aprobada, ${response_message_pol}, cuanto antes enviaremos tu recibo de caja`)
        EnviarWTSAP('57 3007753983', body)
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
async function PagosAbonos(Tid, pdf) {

    const SS = await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, 
    pd.valor, pr.ahorro, pr.iniciar, s.facturasvenc, pd.estado, p.incentivo, pr.asesor, 
    pr.lote, cl.idc, cl.movil, cl.nombre, s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, 
    pd.n, s.stado, cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto,
    s.ids, s.descp, pr.id cparacion FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id
    INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON s.lt = pd.id
    INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
    INNER JOIN clientes cl ON pr.cliente = cl.idc LEFT JOIN cupones cp ON s.bono = cp.id
    WHERE s.ids = ${Tid}`);

    const S = SS[0];
    const T = S.cparacion;
    var estados = 0, resp = true;
    const fech = moment(S.fechs).format('YYYY-MM-DD');
    const fech2 = moment(S.fech).format('YYYY-MM-DD HH:mm');
    const monto = S.bono && S.formap !== 'BONO' ? parseFloat(S.monto) + S.mount : parseFloat(S.monto);
    //console.log(S, monto)
    if (S.stado === 4 || S.stado === 6) {
        Eli(pdf)
        return false
    };

    if (S.concepto === 'ABONO') {
        const Ai = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
            WHERE c.separacion = ${T} AND c.tipo = 'INICIAL' AND c.estado = 3`);
        //console.log(Ai);
        if (Ai.length > 0) {
            var totalinicial = 0,
                cuotainicial = Ai[0].cuota;

            Ai.map((c, x) => {
                totalinicial += c.cuota;
            })
            if (monto >= totalinicial) {
                estados = 10
                await pool.query(
                    `UPDATE cuotas c 
                            INNER JOIN preventa p ON c.separacion = p.id 
                            INNER JOIN productosd l ON p.lote = l.id 
                            INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                            WHERE s.ids = ? AND c.tipo = 'INICIAL' AND c.estado = 3`,
                    [
                        {
                            's.stado': 4,
                            'c.estado': 13,
                            'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                            'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                            'l.estado': estados
                        }, Tid
                    ]
                );
                if (monto > totalinicial) {
                    const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
                    WHERE c.separacion = ${T} AND c.tipo = 'FINANCIACION' AND c.estado = 3`)

                    var extraordinaria = Af[0].cuotaextraordinaria,
                        cuotafinanciada = 0,
                        excedenteinicial = Math.round(monto - totalinicial),
                        totalfinanceo = 0,
                        cuota = 0,
                        numerocuotas = 0;

                    Af.filter((c) => {
                        return c.cuota !== c.cuotaextraordinaria;
                    }).map((c, x) => {
                        totalfinanceo += c.cuota;
                        cuotafinanciada = c.cuota
                        numerocuotas = x + 1;
                    })
                    if (excedenteinicial >= totalfinanceo) {
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE s.ids = ? AND c.tipo = 'FINANCIACION' 
                                    AND c.cuota != ${extraordinaria} AND c.estado = 3`,
                            [
                                {
                                    's.stado': 4,
                                    'c.estado': 13,
                                    'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.estado': 13
                                }, Tid
                            ]
                        );
                        if (excedenteinicial > totalfinanceo) {
                            resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                            var pin = ID(5),
                                motivo = `${fech} Excedente del pago total del producto`;
                            const bono = {
                                pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                tip: 'BONO', monto: excedenteinicial - totalfinanceo, motivo,
                            }
                            await pool.query('INSERT INTO cupones SET ? ', bono);

                            var nombr = S.nombre.split(" ")[0],
                                bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                            EnviarWTSAP(S.movil, bodi);
                        };
                    } else {
                        cuota = cuotafinanciada - Math.round(excedenteinicial / numerocuotas);
                        await pool.query(
                            `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.tipo = 'FINANCIACION' 
                                AND c.cuota != ${extraordinaria} AND c.estado = 3`,
                            [
                                {
                                    's.stado': 4,
                                    'c.cuota': cuota,
                                    'l.estado': estados
                                }, Tid
                            ]
                        );
                    }
                }
                await Desendentes(S.pin, estados);

            } else {
                //console.log('no alcanso para toda la inicial porque monto es menor que la cuota inicial, y paso por aqui')
                var cuota = cuotainicial - Math.round(monto / Ai.length)
                await pool.query(
                    `UPDATE cuotas c 
                            INNER JOIN preventa p ON c.separacion = p.id 
                            INNER JOIN productosd l ON p.lote = l.id 
                            INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                            WHERE s.ids = ?  AND c.tipo = 'INICIAL' AND c.estado = 3`,
                    [
                        {
                            's.stado': 4,
                            'c.cuota': cuota,
                            'l.estado': 12
                        }, Tid
                    ]
                );
            }

        } else {
            const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
            WHERE c.separacion = ${T} AND c.estado = 3`)
            //console.log(Af, 'ESTA ES Af, no encontro en Ai ninguna cuota')
            if (Af.length > 0) {
                var extraordinaria = Af[0].cuotaextraordinaria,
                    cuotafinanciada = 0,
                    totalfinanceo = 0,
                    cuota = 0,
                    numerocuotas = 0;

                Af.filter((c) => {
                    return c.cuota !== c.cuotaextraordinaria;
                }).map((c, x) => {
                    totalfinanceo += c.cuota;
                    cuotafinanciada = c.cuota
                    numerocuotas = x + 1;
                })
                if (monto >= totalfinanceo) {
                    await pool.query(
                        `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.estado = 3`,
                        [
                            {
                                's.stado': 4,
                                'c.estado': 13,
                                'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                'l.estado': 13
                            }, Tid
                        ]
                    );
                    if (monto > totalfinanceo) {

                        resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                        var pin = ID(5),
                            motivo = `${fech} Excedente del pago total del producto`;
                        const bono = {
                            pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                            tip: 'BONO', monto: monto - totalfinanceo, motivo,
                        }
                        await pool.query('INSERT INTO cupones SET ? ', bono);

                        var nombr = S.nombre.split(" ")[0],
                            bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                        EnviarWTSAP(S.movil, bodi);

                    }
                } else {
                    //console.log(cuotafinanciada, Math.round(monto / numerocuotas))
                    var cuota = cuotafinanciada - Math.round(monto / numerocuotas);
                    await pool.query(
                        `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.tipo = 'FINANCIACION' 
                                AND c.cuota != ${extraordinaria} AND c.estado = 3`,
                        [
                            {
                                's.stado': 4,
                                'c.cuota': cuota,
                                'l.estado': 10
                            }, Tid
                        ]
                    );
                }
            }
        }
    } else if (S.concepto === 'PAGO') {
        console.log('es un pago')
        var Total = parseFloat(S.cuota), texto = '';

        var Ps = async (Total, texto) => {
            var inicial = (S.valor - S.ahorro) * S.iniciar / 100

            if (S.tipo === 'SEPARACION' && S.incentivo) {
                //var retefuente = S.incentivo * 0.10
                //var reteica = S.incentivo * 8 / 1000
                console.log('es una separacion')
                var solicitar = {
                    fech: fech2, monto: S.incentivo, concepto: 'COMISION DIRECTA', stado: 9, descp: 'SEPARACION',
                    asesor: S.asesor, porciento: 0, total: S.cuota, lt: S.lote, retefuente: 0, reteica: 0, pagar: S.incentivo
                }
                await pool.query(`INSERT INTO solicitudes SET ?`, solicitar);
            }
            await pool.query(
                `UPDATE solicitudes s 
                        INNER JOIN cuotas c ON s.pago = c.id 
                        INNER JOIN preventa p ON c.separacion = p.id 
                        INNER JOIN productosd o ON p.lote = o.id SET ? WHERE s.ids = ?`,
                [
                    {
                        's.stado': 4,
                        'c.estado': 13,
                        'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'o.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                        'o.estado': 12
                    }, Tid
                ]
            );
            console.log('actualiza el pago')
            if (texto) {
                await pool.query(`UPDATE cuotas SET ? WHERE ${texto}`, { estado: 13 });
            }
            if (monto > Total) {
                console.log('monto es mayor al total')
                const d = await pool.query(`SELECT * FROM cuotas WHERE separacion = ? 
                    AND tipo = 'INICIAL' AND estado = 3 AND fechs > ?`, [T, fech]);

                if (d.length > 0) {
                    var iniciales = 0,
                        excedente = monto - Total,
                        valorcuota = d[0].cuota,
                        cuotas = 0;

                    d.map((c, x) => {
                        iniciales += c.cuota;
                    })
                    if (excedente >= iniciales) {
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE c.separacion = ? AND c.tipo = 'INICIAL' 
                                    AND c.estado = 3 AND fechs > ?`,
                            [
                                {
                                    's.stado': 4,
                                    'c.estado': 13,
                                    'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.estado': 10
                                }, T, fech
                            ]
                        );
                        const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
                            WHERE c.separacion = ? AND c.tipo = 'FINANCIACION' AND c.estado = 3 AND c.fechs > ?`, [T, fech]);

                        if (Af.length > 0) {
                            var extraordinaria = Af[0].cuotaextraordinaria,
                                excedenteinicial = Math.round(excedente - iniciales),
                                cuotafinanciada = 0,
                                totalfinanceo = 0,
                                cuota = 0,
                                numerocuotas = 0;

                            Af.filter((c) => {
                                return c.cuota !== c.cuotaextraordinaria;
                            }).map((c, x) => {
                                totalfinanceo += c.cuota;
                                cuotafinanciada = c.cuota
                                numerocuotas = x + 1;
                            })
                            if (excedenteinicial >= totalfinanceo) {
                                await pool.query(
                                    `UPDATE cuotas c 
                                            INNER JOIN preventa p ON c.separacion = p.id 
                                            INNER JOIN productosd l ON p.lote = l.id 
                                            INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                            WHERE c.separacion = ? AND c.estado = 3 AND fechs > ?`,
                                    [
                                        {
                                            's.stado': 4,
                                            'c.estado': 13,
                                            'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                            'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                            'l.estado': 13
                                        }, T, fech
                                    ]
                                );
                                if (excedenteinicial > totalfinanceo) {
                                    resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                                    var pin = ID(5),
                                        motivo = `${fech} Excedente del pago total del producto`;
                                    const bono = {
                                        pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                        tip: 'BONO', monto: excedente - totalfinanceo, motivo,
                                    }
                                    await pool.query('INSERT INTO cupones SET ? ', bono);

                                    var nombr = S.nombre.split(" ")[0],
                                        bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                                    EnviarWTSAP(S.movil, bodi);
                                }
                            } else {
                                cuota = cuotafinanciada - Math.round(excedenteinicial / numerocuotas);
                                await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND tipo = 'FINANCIACION' 
                                    AND estado = 3 AND cuota != ? AND fechs > ?`, [{ cuota }, T, extraordinaria, fech]);
                            }
                        } else {
                            resp = 'No existen cuotas a la cual abonarle saldo, verifica'
                            var pin = ID(5),
                                motivo = `${fech} Excedente del pago total del producto`;
                            const bono = {
                                pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                tip: 'BONO', monto: excedente - totalfinanceo, motivo,
                            }
                            await pool.query('INSERT INTO cupones SET ? ', bono);

                            var nombr = S.nombre.split(" ")[0],
                                bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                            EnviarWTSAP(S.movil, bodi);
                        }
                    } else if (excedente === iniciales) {
                        estados = 10
                        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${T} AND tipo = 'INICIAL' 
                            AND estado = 3 AND fechs > '${fech}'`, { estado: 13, fechapago: fech2 });
                    } else {
                        estados = 12
                        cuotas = valorcuota - Math.round(excedente / d.length)
                        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND tipo = 'INICIAL' AND estado = 3 AND fechs > ?`, [{ cuota: cuotas }, T, fech]);
                    }
                } else {
                    const Af = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id
                        WHERE separacion = ? AND tipo = 'FINANCIACION' AND estado = 3 AND fechs > ?`, [T, fech]);

                    var extraordinaria = Af[0].cuotaextraordinaria,
                        excedenteinicial = Math.round(monto - Total),
                        cuotafinanciada = 0,
                        totalfinanceo = 0,
                        cuota = 0,
                        numerocuotas = 0;

                    Af.filter((c) => {
                        return c.cuota !== c.cuotaextraordinaria;
                    }).map((c, x) => {
                        totalfinanceo += c.cuota;
                        cuotafinanciada = c.cuota
                        numerocuotas = x + 1;
                    });

                    if (excedenteinicial >= totalfinanceo) {
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE c.separacion = ? AND c.estado = 3 AND fechs > ?`,
                            [
                                {
                                    's.stado': 4,
                                    'c.estado': 13,
                                    'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.estado': 13
                                }, T, fech
                            ]
                        );
                        if (excedenteinicial > totalfinanceo) {
                            resp = 'El monto consignado es mayor al del valor total del producto, se genero un BONO'
                            var pin = ID(5),
                                motivo = `${fech} Excedente del pago total del producto`;
                            const bono = {
                                pin, descuento: 0, estado: 9, clients: S.idc, concept: 'EXCEDENTE',
                                tip: 'BONO', monto: excedente - totalfinanceo, motivo,
                            }
                            await pool.query('INSERT INTO cupones SET ? ', bono);

                            var nombr = S.nombre.split(" ")[0],
                                bodi = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(bono.monto)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`;

                            EnviarWTSAP(S.movil, bodi);
                        }
                    } else {
                        cuota = cuotafinanciada - Math.round(excedenteinicial / numerocuotas)
                        //console.log(cuota, cuotaextraordinaria)
                        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND tipo = 'FINANCIACION' 
                            AND estado = 3 AND cuota != ? AND fechs > ?`, [{ cuota }, T, cuotaextraordinaria, fech]);
                    }
                }
            }
        }
        const Totales = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${T} AND (estado = 3 OR estado = 5) AND fechs < '${fech}'`);
        if (Totales.length > 0 && monto > S.cuota && S.facturasvenc > 1) {
            pas.map((c, x) => {
                Total += c.cuota + c.mora;
                texto += x === 0 ? `id = ${c.id}` : ` AND id = ${c.id}`;
            });
            Ps(Total, texto);
        } else {
            Ps(Total, texto);
        }
    }
    await pool.query('UPDATE solicitudes SET ? WHERE ids = ?', [{ pdf }, Tid]);
    Desendentes(S.pin, estados)

    var bod = `_*${S.nombre}*. Hemos procesado tu *${S.concepto}* de manera exitoza. Recibo *${S.recibo}* Monto *${Moneda(monto)}* Adjuntamos recibo de pago *#${Tid}*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
    var smsj = `hemos procesado tu pago de manera exitoza Recibo: ${S.recibo} Bono ${S.bono} Monto: ${Moneda(monto)} Concepto: ${S.proyect} MZ ${S.mz} LOTE ${S.n}`

    await EnviarWTSAP(S.movil, bod);
    await EnvWTSAP_FILE(S.movil, pdf, 'RECIBO DE CAJA ' + Tid, 'PAGO EXITOSO');
    return true
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