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
    const data = req.body;
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
        cc_holder, description, response_message_pol, payment_method_name, pse_bank, reference_pol, ip
    } = req.body;
    console.log(req.body)
    EnviarWTSAP('57 3007753983', req.body)
    /*sms('573007753983', `Entro la confirmacion`);
    const ids = reference_sale.split("-");
    const r = {
        transaction_date, reference_sale, state_pol, payment_method_type, value, cc_number, cc_holder, response_message_pol,
        payment_method_name, description, pse_bank, reference_pol, ip, relacion: ids[2], cliente: ids[0], usuario: ides[1]
    }
    const pin = await pool.query('SELECT * FROM payu WHERE reference_sale = ?', reference_sale);
    if (pin.length > 0) {
        await pool.query('UPDATE payu set ? WHERE reference_sale = ?', [r, reference_sale]);
        await transpoter.sendMail({
            from: "'Suport' <suport@tqtravel.co>",
            to: 's4m1r.5a@gmail.com',
            subject: 'confirmacion de que si sirbe',
            text: `${reference_sale}-${state_pol}-${payment_method_type}-${value}-${email_buyer}
                -${phone}-${transaction_date}-${cc_number}-${cc_holder}-${description}
                -${response_message_pol}-${payment_method_name}-${pse_bank}-${reference_pol}-${ip}-ACTUALIZA`
        });
        sms('573007753983', `SE ATUALIZO`);
    } else {
        await pool.query('INSERT INTO payu SET ? ', r);
        await transpoter.sendMail({
            from: "'Suport' <suport@tqtravel.co>",
            to: 's4m1r.5a@gmail.com',
            subject: 'confirmacion de que si sirbe',
            text: `${reference_sale}-${state_pol}-${payment_method_type}-${value}-${email_buyer}
            -${phone}-${transaction_date}-${cc_number}-${cc_holder}-${description}
            -${response_message_pol}-${payment_method_name}-${pse_bank}-${reference_pol}-${ip}-INSERTA`
        });
        sms('573007753983', `SE INSERTO CORRECTAMENTE`);
    }*/
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
module.exports = router;