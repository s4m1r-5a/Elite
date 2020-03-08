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
    const {
        transaction_date,
        reference_sale,
        state_pol,
        payment_method_type,
        value,
        email_buyer,
        phone,
        cc_number,//targeta del pagador
        cc_holder,//nombre del pagador
        description,//descripcion de la compra
        response_message_pol,
        payment_method_name,
        pse_bank,
        reference_pol,//referecia de pago para payu
        ip//ip de donde se genero la compra
    } = req.body;
    const r = {
        transaction_date,
        reference_sale,
        state_pol,
        payment_method_type,
        value,
        cc_number,//targeta del pagador
        cc_holder,//nombre del pagador
        description,//descripcion de la compra1111111q  |
        response_message_pol,
        payment_method_name,
        pse_bank,
        reference_pol,//referecia de pago para payu
        ip
        //pin : reference_sale || 'samir0',
    }
    let url;
    const cliente = await pool.query('SELECT * FROM clientes WHERE email = ? AND movil = ?', [email_buyer, phone]);
    if (cliente.length > 0) {
        let clave = `jodete cabron este codigo no esta completo aun-${cliente[0].nombre}-${cliente[0].movil}-${cliente[0].email}-${reference_sale}`,
            key = crypto.createHash('md5').update(clave).digest("hex");
        url = `https://iux.com.co/x/venta.php?name=${cliente[0].nombre}&movil=${cliente[0].movil}&email=${cliente[0].email}&ref=${reference_sale}&key=${key}`;
        r.cliente = cliente[0].id;
        r.usuario = 15;
    }
    const pin = await pool.query('SELECT * FROM payu WHERE reference_sale = ?', reference_sale);
    if (pin.length > 0) {
        if (pin[0].state_pol != state_pol && state_pol != 4) {
            await pool.query('UPDATE payu set ? WHERE reference_sale = ?', [r, reference_sale]);
        } else if (pin[0].state_pol != state_pol && state_pol == 4) {
            await pool.query('UPDATE payu set ? WHERE reference_sale = ?', [r, reference_sale]);
            await transpoter.sendMail({
                from: "'Suport' <suport@tqtravel.co>",
                to: 's4m1r.5a@gmail.com',
                subject: 'confirmacion de que si sirbe',
                text: `${reference_sale}-${state_pol}-${payment_method_type}-${value}-${email_buyer}
                -${phone}-${transaction_date}-${cc_number}-${cc_holder}-${description}
                -${response_message_pol}-${payment_method_name}-${pse_bank}-${reference_pol}-${ip}-ACTUALIZA`
            });
            request({
                url,
                json: true
            }, (error, res, body) => {
                if (error) {
                    console.error(error)
                    return
                }
                sms('573007753983', `${body} ${res.statusCode} ACTUALIZADO`);
            })
        }
    } else if (state_pol == 4) {
        await pool.query('INSERT INTO payu SET ? ', r);
        await transpoter.sendMail({
            from: "'Suport' <suport@tqtravel.co>",
            to: 's4m1r.5a@gmail.com',
            subject: 'confirmacion de que si sirbe',
            text: `${reference_sale}-${state_pol}-${payment_method_type}-${value}-${email_buyer}
            -${phone}-${transaction_date}-${cc_number}-${cc_holder}-${description}
            -${response_message_pol}-${payment_method_name}-${pse_bank}-${reference_pol}-${ip}-INSERTA`
        });
        request({
            url,
            json: true
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            sms('573007753983', `${body} ${res.statusCode} INSERTADO`);
        })
    } else {
        await pool.query('INSERT INTO payu SET ? ', r);
    }
});

router.get(`/planes`, async (req, res) => {
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
    let venta,
        c = req.query.iux || '';

    if (c == 'ir') {
        res.render('respuesta');
    } else {
        const links = await pool.query('SELECT * FROM clientes WHERE email = ?', r.buyerEmail);
        if (links.length > 0) {
            r.nombre = links[0].nombre;
            r.movil = links[0].movil;
            venta = {
                fechadecompra: new Date(),
                pin: r.referenceCode,
                puntodeventa: 'IUX',
                vendedor: 15,
                client: links[0].id,
                cajero: 'PAYU',
                product: 27
            }
            let clave = 'jodete cabron este codigo no esta completo aun-' + r.nombre + '-' + r.movil + '-' + r.buyerEmail + '-' + r.referenceCode,
                yave = crypto.createHash('md5').update(clave).digest("hex");
            r.llave = yave
        }

        if (r.transactionState == 4) {
            r.estado = 'success';
            r.msg = "aprobada";
            await pool.query('INSERT INTO ventas SET ? ', venta);
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
            await pool.query('INSERT INTO ventas SET ? ', venta);
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
module.exports = router;