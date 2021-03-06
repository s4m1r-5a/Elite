const express = require('express');
//const {Builder, By, Key, until} = require('selenium-webdriver');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../database');
const { isLoggedIn, isLogged, Admins } = require('../lib/auth');
const sms = require('../sms.js');
const { registro, dataSet, Contactos } = require('../keys');
const request = require('request');
const cron = require("node-cron");
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const moment = require('moment');
const nodemailer = require('nodemailer');
const { isNull } = require('util');
const { Console } = require('console');
const { send } = require('process');
const mysqldump = require('mysqldump')
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
moment.locale('es');
var desarrollo = false;
var url = 'https://bin.chat-api.com/1bd03zz1'

//////////////////////////////////////////////////////////// REPLACE INTO cuotas SELECT * FROM elite.cuotas; /////////////////////////////////////
/*request(url, función(error, respuesta, cuerpo) {
    if(!error) {
        console.log(body);
    }
});*/
/*request(url, function (error, response, body) {
    if (error) return console.error('Failed: %s', error.message);
¿
    console.log('Success: ', body); 
});                                            573007753983-1593217257@g.us 573002851046-1593217257@g.us	*/
/*BEGIN:VCARD
VERSION:3.0
N:SALDARRIAGA;SAMIR
FN:SAMIR SALDARRIAGA
TEL;TYPE=CELL;waid=573007753983:+573007753983
NICKNAME:SAM
BDAY:31.12.1190
X-GENDER:M
NOTE:Area de sistemas
ADR;TYPE=home:;;Colombia;Bolivar;Turbaco;la granja;
EMAIL;CHARSET=UTF-8;type=HOME,INTERNET:s4m1r.5a@gmail.com
URL;CHARSET=UTF-8:redelite.co
ORG:GRUPO ELITE
TITLE:GRUPO ELITE
ADR;TYPE=work_:;;Colombia;Bolivar;Turbaco;la granja;
TEL;TYPE=WORK,VOICE:3012673944
URL;type=WORK;CHARSET=UTF-8:admin@retfly.co
END:VCARD*/

router.post('/desarrollo', async (req, res) => {
    desarrollo = req.body.actividad;
    /*var Dia = moment().subtract(1, 'days').endOf("days").format('YYYY-MM-DD HH:mm');
    const f = await pool.query(`SELECT p.id, l.mz, l.n, DATE_FORMAT(p.fecha, "%e de %b") fecha FROM productosd l 
    INNER JOIN preventa p ON l.id = p.lote WHERE TIMESTAMP(p.fecha) < '${Dia}' AND p.tipobsevacion IS NULL AND l.estado = 1`);
    var body = `_*${Dia}*_\n_Existen *${f.length}* productos a liberar el dia de mañana_\n_Si alguno de estos es tuyo, diligencia el pago lo antes posible de lo contrario estara disponible mañana a las *23:59*_\n_A continuacion se describen los *productos* a liberar_\n\n`; //${JSON.stringify(f)} ${f.length} _*registros en total ${req.body.sitio}*
    f.map((x) => {
        body += `_ID: *${x.id}* MZ: *${x.mz}* LT: *${x.n}* - ${x.fecha}_\n`;
    })
    await EnviarWTSAP(0, body, 0, '573002851046-1593217257@g.us');*/ //, 'true_573002851046-1593217257@g.us_3EB01486B9FB9A592E32'
    //console.log(body)
    /*var diacupon = moment().subtract(3, 'days').endOf("days").format('YYYY-MM-DD HH:mm:ss');

    const separaciones = await pool.query(`SELECT p.id, p.fecha, l.estado FROM preventa p INNER JOIN productosd l ON p.lote = l.id 
    WHERE p.tipobsevacion IS NULL AND l.estado IN(1,12) AND p.cupon != 1 AND p.fecha < '${diacupon}'`);

    separaciones.forEach(async (val, i) => {
        console.log(val.id, i);
        var u = await QuitarCupon(val.id);
        console.log(val.id, i, u);
    });*/
    /*const cuotas = await pool.query(`SELECT p.id, COUNT(c.id) cont FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id WHERE c.tipo = 'INICIAL' GROUP BY p.id`);
    var sql = `UPDATE preventa SET inicialdiferida = CASE id`;
    var ID = '';

    cuotas.map((c) => {
        ID += c.id.toString() + ', ';
        sql += ' WHEN ' + c.id + ' THEN ' + c.cont;
    })

    ID = ID.slice(0, -2);
    sql += ' END WHERE id IN(' + ID + ')';
    await pool.query(sql);*/
    res.send(true);

});
cron.schedule("7 10 * * *", async () => {
    var Dia = moment().subtract(1, 'days').endOf("days").format('YYYY-MM-DD HH:mm');
    const f = await pool.query(`SELECT p.id, l.mz, l.n, DATE_FORMAT(p.fecha, "%e de %b") fecha FROM productosd l 
    INNER JOIN preventa p ON l.id = p.lote WHERE TIMESTAMP(p.fecha) < '${Dia}' AND p.tipobsevacion IS NULL AND l.estado = 1`);
    var body = `_*${Dia}*_\n_Existen *${f.length}* productos a liberar el dia de mañana_\n_Si alguno de estos es tuyo, diligencia el pago lo antes posible de lo contrario estara disponible mañana a las *23:59*_\n_A continuacion se describen los *productos* a liberar_\n\n`; //${JSON.stringify(f)} ${f.length} _*registros en total ${req.body.sitio}*
    f.map((x) => {
        body += `_ID: *${x.id}* MZ: *${x.mz}* LT: *${x.n}* - ${x.fecha}_\n`;
    })
    await EnviarWTSAP(0, body, 0, '573002851046-1593217257@g.us');
})
cron.schedule("0 0 * * *", async () => {
    /*mysqldump({
        connection: {
            host: '96.43.143.58',
            user: 'samir',
            password: 'Abcd1234@',
            database: 'pruebasElite',
            port: 3306
        },
        dumpToFile: './elite.sql',
        //compressFile: true,
    });*/
    var Dia = moment().subtract(1, 'days').endOf("days").format('YYYY-MM-DD HH:mm');
    /*await pool.query(`UPDATE productosd l INNER JOIN preventa p ON l.id = p.lote 
    SET l.estado = 9, l.tramitando = NULL WHERE TIMESTAMP(p.fecha) < '${Dia}' 
    AND p.tipobsevacion IS NULL AND l.estado = 1`);

    await pool.query(`DELETE p FROM preventa p INNER JOIN productosd l ON p.lote = l.id     
    WHERE  TIMESTAMP(p.fecha) < '${Dia}' AND p.tipobsevacion IS NULL AND l.estado = 9`);*/
    const f = await pool.query(`SELECT p.id, l.mz, l.n, DATE_FORMAT(p.fecha, "%e de %b") fecha FROM productosd l 
    INNER JOIN preventa p ON l.id = p.lote WHERE TIMESTAMP(p.fecha) < '${Dia}' AND p.tipobsevacion IS NULL AND l.estado = 1`);
    var body = `_*${Dia}*_\n_Existen *${f.length}* productos a liberar el dia de mañana_\n_Si alguno de estos es tuyo, diligencia el pago lo antes posible de lo contrario estara disponible mañana a las *23:59*_\n_A continuacion se describen los *productos* a liberar_\n\n`; //${JSON.stringify(f)} ${f.length} _*registros en total ${req.body.sitio}*
    f.map((x) => {
        body += `_ID: *${x.id}* MZ: *${x.mz}* LT: *${x.n}* - ${x.fecha}_\n`;
    })
    await EnviarWTSAP(0, body, 0, '573002851046-1593217257@g.us');

    /////////////////////////////////////////* QUITAR QUPONES *//////////////////////////////////////////

    var diacupon = moment().subtract(3, 'days').endOf("days").format('YYYY-MM-DD HH:mm:ss');

    const separaciones = await pool.query(`SELECT p.id, p.fecha, l.estado FROM preventa p INNER JOIN productosd l ON p.lote = l.id 
    WHERE p.tipobsevacion IS NULL AND l.estado IN(1,12) AND p.cupon != 1 AND p.fecha < '${diacupon}'`);
    separaciones.forEach(async (val, i) => {
        await QuitarCupon(val.id);
    });
});
cron.schedule("0 0 1 * *", async () => {
    let m = new Date();
    var mes = m.getMonth() + 1;
    var hoy = moment().format('YYYY-MM-DD')
    const asesor = await pool.query(`SELECT u.*, r.venta, r.bono FROM users u 
        INNER JOIN rangos r ON u.nrango = r.id WHERE u.sucursal IS NULL`);
    if (asesor.length > 0) {
        await asesor.map(async (j, x) => {
            var porcentual = Math.sign(j.bono - j.rangoabajo) > 0 ? Math.abs(j.bono - j.rangoabajo) : 0;

            if (j.nrango === 4 && j.cortep >= j.venta && !j.pagobono) {
                var monto = j.cortep * porcentual;
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                var f = {
                    fech: hoy, monto, concepto: 'BONOS', stado: 15, porciento: porcentual,
                    descp: 'BONO GERENCIAL', asesor: j.id, total: j.cortep, retefuente,
                    reteica, pagar: monto - (retefuente + reteica)
                }
                await pool.query(`INSERT INTO solicitudes SET ?`, f);

            } else if ((j.nrango === 3 || j.nrango === 2 || j.nrango === 1) && j.cortep >= j.venta && !j.pagobono) {
                var corte;
                switch (mes) {
                    case 1: corte = 1; break;
                    case 2: corte = 2; break;
                    case 3: corte = 3; break;
                    case 4: corte1 = 1; break;
                    case 5: corte = 2; break;
                    case 6: corte = 3; break;
                    case 7: corte = 1; break;
                    case 8: corte = 2; break;
                    case 9: corte = 3; break;
                    case 10: corte = 1; break;
                    case 11: corte = 2; break;
                    case 12: corte = 3; break;
                }
                var acumulado = corte === 1 ? j.corte1 : corte === 2 ? j.corte2 : corte === 3 ? j.corte3 : '';
                var monto = (acumulado + j.cortep) * porcentual;
                var retefuente = monto * 0.10;
                var reteica = monto * 8 / 1000;
                var descp = j.nrango === 1 ? 'BONO PRESIDENCIAL'
                    : j.nrango === 2 ? 'BONO VICEPRESIDENCIAL'
                        : 'BONO GERENCIAL ELITE';
                var f = {
                    fech: hoy, monto, concepto: 'BONOS', stado: 15, porciento: porcentual,
                    descp, asesor: j.id, total: acumulado + j.cortep, retefuente,
                    reteica, pagar: monto - (retefuente + reteica)
                }
                await pool.query(`INSERT INTO solicitudes SET ?`, f);
            }
        })
    }
    var bod = `_Hemos procesado todos los *BONOS* de este mes *${hoy}* _\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
    await EnviarWTSAP('57 3007753983', bod);
});
cron.schedule("0 0 13-15,27-31 * *", async () => {
    await pool.query(`UPDATE solicitudes SET stado = 9 WHERE concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'PREMIACION', 'BONO EXTRA') AND stado = 15`);
    var bod = `_Hemos *Desbloqueado* todas las *COMISIONES O BONOS Y PREMIOS*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
    await EnviarWTSAP('57 3007753983', bod);
});
cron.schedule("0 12 15,28-31 * *", async () => {
    const finmes = moment().endOf('month').format('DD');
    const dia = moment().endOf('month').format('DD');
    if (dia === finmes || dia === '15') {
        await pool.query(`UPDATE solicitudes SET stado = 15 WHERE concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'PREMIACION', 'BONO EXTRA') AND stado = 9`);
        var bod = `_Hemos *Bloqueado* todas las *COMISIONES O BONOS Y PREMIOS*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
        await EnviarWTSAP('57 3007753983', bod);
    }
});
cron.schedule("0 1 1 1,4,7,10 *", async () => {
    var hoy = moment().format('YYYY-MM-DD');
    const asesor = await pool.query(`SELECT u.*, r.venta, r.ventas FROM users u 
        INNER JOIN rangos r ON u.nrango = r.id WHERE u.sucursal IS NULL`);

    if (asesor.length > 0) {
        await asesor.map(async (j, x) => {
            if (j.totalcortep >= j.venta && j.totalcorte >= j.ventas) {
                const r = await pool.query(`SELECT * FROM rangos WHERE ventas BETWEEN 500000000 AND ${j.totalcorte} LIMIT 1`)
                if (r.length > 0) {
                    var y = r[0];
                    var retefuente = y.premio * 0.10
                    var reteica = y.premio * 8 / 1000
                    var descp = y.id === 5 ? 'NUEVO DIRECTOR'
                        : y.id === 4 ? 'NUEVO GERENTE'
                            : y.id === 3 ? 'NUEVO GERENTE ELITE'
                                : y.id === 2 ? 'NUEVO VICEPRESIDENTE'
                                    : 'NUEVO PRESIDENTE'
                    var f = {
                        fech: hoy, monto: y.premio, concepto: 'PREMIACION', stado: 15,
                        descp, asesor: j.id, total: j.totalcorte, retefuente,
                        reteica, pagar: y.premio - (retefuente + reteica)
                    }
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);
                    await pool.query(`UPDATE users SET ? WHERE id = ?`, [
                        {
                            nrango: y.id, /*cortep: 0, corte1: 0, corte2: 0,
                            corte3: 0, totalcorte: 0, totalcortep: 0*/
                        }, j.id
                    ]);
                }

            }
        })
    }
    var bod = `_Hemos realizado el *Corte* del pasado trimestre *PREMIOS*_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
    await EnviarWTSAP('57 3007753983', bod);
});
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});
router.get('/prueba', async (req, res) => {
    /*await pool.query(`UPDATE productosd p INNER JOIN preventa pr ON p.id = pr.lote 
    SET p.estado = 9, p.tramitando = NULL, pr.cupon = NULL 
    WHERE p.estado = 1`);
    await pool.query(`DELETE c, p FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id     
    WHERE p.cupon IS NULL`)
    await pool.query(
        `UPDATE solicitudes s INNER JOIN cuotas c ON s.pago = c.id SET ? WHERE s.stado = ?`,
        [
            {
                's.stado': 3,
                'c.estado': 3
            }, 6
        ]
    );*/
    //var request = require("request");

    /*var options1 = {
        method: 'POST',
        url: 'https://sbapi.bancolombia.com/v1/security/oauth-otp-pymes/oauth2/token',
        headers:
        {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            authorization: `Basic ${Buffer.from("37eb1267-6c33-46b1-a76f-33a553fd812f:yO0jB0tD4jI8vP2yD2sR6gI4iA1rF8cV3rK3jQ3gS7hD7aI7tP").toString('base64')}`
            //'Basic base64(37eb1267-6c33-46b1-a76f-33a553fd812f:sT6rX2wH4iL4jJ8qQ8eV6bL5iJ8cM2gS1eL8sY2pY0hL5vX4eM)'
        },
        form:
        {
            grant_type: 'client_credentials',
            scope: `Transfer-Intention:write:app Transfer-Intention:read:app`
        }
    };
    request(options1, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });*/

    /*var options = {
        method: 'POST',
        url: 'https://sbapi.bancolombia.com/v2/operations/cross-product/payments/payment-order/transfer/action/registry',
        headers:
        {
            accept: 'application/vnd.bancolombia.v1+json',
            'content-type': 'application/vnd.bancolombia.v1+json'
        },
        form:
        {
            "token_type": "Bearer",
            "access_token": "AAIkMzdlYjEyNjctNmMzMy00NmIxLWE3NmYtMzNhNTUzZmQ4MTJmtdFG9j6TgzXbLObt3L0ZB0OzPEY_5FQOdKb8h52V2Q0TLb9FbjW6peNsFMmkc9Fp-ayy3lPtqYJGYl6TX7CW-WAXvPNH-gI_RK6L7UJXbGBmBNueWz3lpEQ61ETta9c5RUF7Dvn9svAZcRe1mHvdjk-itXDqB7tgWmm5L4PEFZr6Lf-hgeTL9POn134BckGa",
            "expires_in": 1200,
            "consented_on": 1599933480,
            "scope": "Transfer-Intention:write:app Transfer-Intention:read:app"
        },
        body: `{"data":[
                    {
                        "commerceTransferButtonId": "h4ShG3NER1C",
                        "transferReference": "1002345678",
                        "transferDescription": "Compra en Telovendo",
                        "transferAmount": 3458.33,
                        "commerceUrl": "https://gateway.com/payment/route?commerce=Telovendo",
                        "confirmationURL": "https://pagos-api-dev.cloud.net/callback"
                    }
                ]
        }`
    };
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });*/

    res.send(true);
})
router.post('/desendentes', async (req, res) => {
    var y = await Desendentes(req.user.id, 10)
    res.send(y);
})
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
    var cf = 0
    var mes6 = 0
    var mes12 = 0
    W.map((x) => {
        separa = x.separar;
        total = Math.round(x.vrmt2 * x.mtr2);
        inicial = Math.round((total * x.iniciar / 100) - x.separar);
        extraordinarias = Math.round(x.cuotaextraordinaria * x.extran);
        financiacion = Math.round(total - inicial - extraordinarias);
        cuotaordi = x.cuotaextraordinaria;
        cuotaini = Math.round(inicial / x.inicialdiferida);
        nfnc = x.numerocuotaspryecto - x.inicialdiferida - x.extran;
        cuotafnc = Math.round(financiacion / nfnc);
        cf = x.extraordinariameses;
        x.obsevacion

    })
    mes6 = cuotafnc;
    mes12 = cuotafnc;
    if (cuotaordi) {
        cf == 1 ? mes6 = cuotaordi
            : cf == 2 ? mes12 = cuotaordi
                : mes6 = cuotaordi, mes12 = cuotaordi;
    };
    await pool.query(`UPDATE cuotas SET 
    estado = 3, cuota = CASE 
    WHEN tipo = 'SEPARACION' THEN ${separa} 
    WHEN tipo = 'INICIAL' THEN ${cuotaini}
    WHEN tipo = 'FINANCIACION' AND 
    MONTH(fechs) = 6 THEN ${mes6}
    WHEN tipo = 'FINANCIACION' AND 
    MONTH(fechs) = 12 THEN ${mes12}
    ELSE ${cuotafnc} END 
    WHERE c.separacion = ?`, orden);





    cuataa = ', cuota = CASE tipo WHEN ' + x.tipo + ' THEN ' + montocuotas + ' END';
    var sql = 'UPDATE cuotas SET mora = 0, estado = CASE id';
    var ID = '', montocuotas = pagos, cuotaa = '';

    Cuots.map((c) => {
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
    })
    ID = ID.slice(0, -2);
    sql += ' END' + cuotaa + ' WHERE id IN(' + ID + ')';
    await pool.query(sql);
    res.send(true);
})
//////////////////* CHATS */////////////////////
router.get('/chats', async (req, res) => {
    const cliente = await pool.query(`SELECT movil FROM clientes`);
    var moviles = cliente.map((x) => {
        return x.movil.replace(/ /g, '').length === 10 ? '57' + x.movil.replace(/ /g, '') + '@c.us' : x.movil.replace(/ /g, '') + '@c.us';
    })
    async function chats() {
        const options = { method: 'GET' };
        const url = 'https://api.chat-api.com/instance107218/dialogs?token=5jn3c5dxvcj27fm0&limit=50&page=0'

        const apiRes = await fetch(url, options);
        const jsonResponse = await apiRes.json();
        return jsonResponse;
    }
    var b = await chats()
    var a = await b.dialogs.map((x) => {
        if (moviles.indexOf(x.id) != -1) {
            return x
        }
    })
    res.send({ dialogs: a.filter(Boolean) });

})
router.get('/chats/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id === 'bank') {

    } else {
        async function chats() {
            const options = { method: 'GET' };
            const url = `https://api.chat-api.com/instance107218/messagesHistory?token=5jn3c5dxvcj27fm0&page=0&count=50&chatId=${id}`

            const apiRes = await fetch(url, options);
            const jsonR = await apiRes.json();
            return jsonR;
        }
        var b = await chats()
        res.send(b);
    }
})
//////////////////* BANCO */////////////////////
router.post('/extrabank', async (req, res) => {
    const { date, description, lugar, concpt1, concpt2, otro, consignado, cont } = req.body;
    //var f = moment(Date(date)).format('YYYY-MM-DD');
    const b = {
        date, description, lugar: lugar ? lugar : null,
        concpt1: concpt1 ? concpt1 : null, concpt2: concpt2 ? concpt2 : null,
        otro: otro ? otro : null, consignado: consignado ? consignado.replace(/[\$,]/g, '') * 1 : 0
    };
    pool.query('INSERT INTO extrabanco SET ? ', b);
    //console.log(b, cont) //, bank.insertId
    //res.send(cont);
    res.send(consignado);
})
router.post('/extractos', async (req, res) => {
    console.log(req.body)
    const solicitudes = await pool.query(`SELECT e.*, s.ids, s.fech, s.monto, s.concepto, cl.nombre, p.proyect, pd.mz, pd.n, s.excdnt, x.xtrabank, x.pagos
        FROM extrabanco e LEFT JOIN extratos x ON x.xtrabank = e.id LEFT JOIN solicitudes s ON x.pagos = s.ids LEFT JOIN productosd pd ON s.lt = pd.id 
        LEFT JOIN preventa pr ON pr.lote = pd.id LEFT JOIN productos p ON pd.producto = p.id LEFT JOIN clientes cl ON pr.cliente = cl.idc`);
    //console.log(solicitudes)
    //respuesta = { "data": solicitudes };
    res.json(solicitudes);
    //res.send(solicitudes);
});
//////////////////* PRODUCTOS */////////////////////
router.get('/productos', isLoggedIn, async (req, res) => {
    const proveedores = await pool.query(`SELECT id, empresa FROM proveedores`);
    res.render('links/productos', { proveedores });
});
router.post('/productos', isLoggedIn, async (req, res) => {
    const fila = await pool.query('SELECT * FROM productos');
    respuesta = { "data": fila };
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
        WHEN l.estado NOT IN(9, 15) THEN 15 ELSE l.estado END WHERE l.producto = ${id} AND p.tipobsevacion IS NULL`);

        await pool.query(`UPDATE productosd l INNER JOIN productos d ON l.producto  = d.id 
        INNER JOIN preventa p ON p.lote = l.id SET l.valor = CASE WHEN d.valmtr2 > 0 THEN d.valmtr2 * l.mtr2 
        ELSE l.mtr * l.mtr2 END, l.inicial = CASE WHEN d.valmtr2 > 0 THEN (d.valmtr2 * l.mtr2) * d.porcentage / 100 
        ELSE (l.mtr * l.mtr2) * d.porcentage / 100 END, l.mtr = CASE WHEN d.valmtr2 > 0 THEN d.valmtr2 ELSE l.mtr END 
        WHERE l.producto = ${id} AND p.tipobsevacion IS NOT NULL AND l.estado IN(9, 15)`);

        const fila = await pool.query('SELECT * FROM productos WHERE id = ?', id);
        res.send(fila[0]);
    } else if (id === 'nuevo') {
        const { producto, mz, n, mtr2, estado, valor, inicial, descripcion } = req.body;
        const nuevo = { producto, mz: mz ? mz.toUpperCase() : 'no', n, mtr2, estado, valor, inicial, descripcion }
        const fila = await pool.query('INSERT INTO productosd SET ? ', nuevo);
        await pool.query(`UPDATE productos SET cantidad = cantidad + 1 WHERE id = ${producto}`)
        res.send(true);
    } else if (id === 'emili') {
        const { id, prod } = req.body;
        await pool.query('DELETE FROM productosd WHERE id = ?', id);
        await pool.query(`UPDATE productos SET cantidad = cantidad - 1 WHERE id = ${prod}`)
        res.send(true);
    } else if (id === 'update') {
        const { alterable, editar, categoria, title, totalmtr2, separacion, incentivo, mzs, lts,
            porcentage, fecha, fechafin, comision, maxcomis, linea1, linea2, linea3, idlote, mtr,
            mz, n, mtr2, estado, valor, inicial, descripcion, valorproyect } = req.body;

        if (idlote === undefined) {
            const produc = {
                categoria, proyect: title.toUpperCase(), porcentage, totalmtr2, valproyect: valorproyect, mzs, cantidad: lts,
                estados: 7, fechaini: fecha, fechafin, separaciones: separacion.length > 3 ? separacion.replace(/\./g, '') : separacion,
                incentivo: incentivo.length > 3 ? incentivo.replace(/\./g, '') : 0, comision, maxcomis, linea1, linea2, linea3
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
            await pool.query(`UPDATE productosd l INNER JOIN productos p ON l.producto = p.id 
            SET ? WHERE l.id = ?`, [
                {
                    'l.mz': mz, 'l.n': n, 'l.mtr': mtr.replace(/\./g, ''), 'l.mtr2': mtr2, 'l.estado': estado, 'l.valor': valor,
                    'l.inicial': inicial, 'l.descripcion': descripcion, 'p.categoria': categoria, 'p.proyect': title.toUpperCase(),
                    'p.porcentage': porcentage, 'p.totalmtr2': totalmtr2, 'p.valproyect': valorproyect, 'p.mzs': mzs, 'p.cantidad': lts,
                    'p.estados': 7, 'p.fechaini': fecha, 'p.fechafin': fechafin, 'p.separaciones': separacion.length > 3 ? separacion.replace(/\./g, '') : separacion,
                    'p.incentivo': incentivo.length > 3 ? incentivo.replace(/\./g, '') : 0, 'p.comision': comision, 'p.maxcomis': maxcomis, 'p.linea1': linea1, 'p.linea2': linea2,
                    'p.linea3': linea3, 'l.ediitado': req.user.fullname
                }, idlote]
            );
            res.send(true);
        }

    } else {
        const fila = await pool.query('SELECT * FROM productosd WHERE producto = ?', id);
        respuesta = { "data": fila };
        res.send(respuesta);
    }
});
router.put('/produc/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { valor } = req.body;
    await pool.query(`UPDATE productosd pd INNER JOIN productos p ON pd.producto = p.id 
    SET pd.inicial = pd.valor * ${valor} /100, p.porcentage = ${valor} 
    WHERE pd.producto = ${id} AND pd.estado = 9`)
    res.send(true);
});
router.put('/productos/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { valor } = req.body;
    await pool.query(`UPDATE productosd pd INNER JOIN productos p ON pd.producto = p.id 
    SET pd.valor = pd.mtr2 * ${valor}, pd.inicial = (pd.mtr2 * ${valor}) * p.porcentage /100, p.valmtr2 = ${valor}, 
    p.valproyect = p.totalmtr2 * ${valor}, pd.mtr = ${valor} WHERE pd.producto = ${id} AND pd.estado IN(9, 15)`)
    res.send(respuesta);
});
router.post('/regispro', isLoggedIn, async (req, res) => {
    const { categoria, title, porcentage, totalmtr2, valmtr2, valproyect, mzs, lts, std, mz, n, mtr2, vrlt, vri, vmtr2,
        separacion, incentivo, fecha, fechafin, descripcion, comision, maxcomis, linea1, linea2, linea3 } = req.body;
    const produc = {                                                           //mzs cantidad
        categoria, proyect: title.toUpperCase(),
        porcentage, totalmtr2, valmtr2: valmtr2.length > 3 ? valmtr2.replace(/\./g, '') : valmtr2,
        valproyect, mzs, cantidad: lts, estados: 7, fechaini: fecha, fechafin, separaciones: separacion.length > 3 ? separacion.replace(/\./g, '') : separacion,
        incentivo: incentivo.length > 3 ? incentivo.replace(/\./g, '') : 0, comision, maxcomis, linea1, linea2, linea3
    };
    //console.log(req.body, produc)
    const datos = await pool.query('INSERT INTO productos SET ? ', produc);
    var producdata = 'INSERT INTO productosd (producto, mz, n, mtr2, descripcion, estado, mtr, valor, inicial) VALUES ';
    await n.map((t, i) => {
        producdata += `(${datos.insertId}, '${mz[i]}', ${t}, ${mtr2[i]}, '${descripcion[i]}', ${std[i]}, ${vmtr2[i].replace(/\./g, '')}, ${vrlt[i].replace(/\./g, '')}, ${vri[i].replace(/\./g, '')}),`;
    });
    await pool.query(producdata.slice(0, -1));
    req.flash('success', 'Producto registrado exitosamente');
    res.redirect('/links/productos');
});
//////////////* RED *//////////////////////////////////
router.get('/red', isLoggedIn, async (req, res) => {
    res.render('links/red');
});
router.post('/red', async (req, res) => {
    const red = await pool.query(`SELECT u.fullname,
    u.nrango, u.admin, u1.fullname nombre1, u1.nrango rango1, 
    u1.admin admin1, u2.fullname nombre2, u2.nrango rango2, 
    u2.admin admin2, u3.fullname nombre3, u3.nrango rango3, 
    u3.admin admin3 FROM pines p
    LEFT JOIN users u ON u.pin = p.id
    LEFT JOIN pines p1 ON p1.usuario = u.id
    LEFT JOIN users u1 ON u1.pin = p1.id 
    LEFT JOIN pines p2 ON p2.usuario = u1.id
    LEFT JOIN users u2 ON u2.pin = p2.id 
    LEFT JOIN pines p3 ON p3.usuario = u2.id
    LEFT JOIN users u3 ON u3.pin = p3.id 
    ${req.user.admin != 1 ? 'WHERE u.id = ' + req.user.id : ''}`);
    respuesta = { "data": red };
    res.send(respuesta);
});
router.post('/reds', async (req, res) => {
    if (req.user.admin == 1) {
        const red = await pool.query(`SELECT * FROM users u 
            INNER JOIN rangos r ON u.nrango = r.id`);
        respuesta = { "data": red };
        res.send(respuesta);
    }
});
router.put('/red', async (req, res) => {
    if (req.user.admin == 1) {
        const { S, U, F } = req.body
        console.log(S, U, F)
        if (!S) {
            await pool.query(`UPDATE users SET ? WHERE pin = ?`, [{ nrango: U == 0 ? 5 : 7, sucursal: U == 0 ? null : U }, F]);
        } else {
            await pool.query(`UPDATE users SET ? WHERE pin = ?`, [{ nrango: U, }, F]);
        }
        res.send(true);
    }
});
///////////////////* CLIENTES *///////////////////////////
router.get('/clientes', isLoggedIn, (req, res) => {
    res.render('links/clientes');
});
router.post('/clientes', async (req, res) => {
    const cliente = await pool.query(`SELECT * FROM clientes c 
    LEFT JOIN users u ON c.acsor = u.id     
    ${req.user.admin != 1 ? 'WHERE c.acsor = ' + req.user.id : ''}`);
    respuesta = { "data": cliente };
    res.send(respuesta);
});
router.put('/clientes/:id', async (req, res) => {
    const SCOPES = ['https://www.googleapis.com/auth/contacts'];
    const TOKEN_PATH = 'token.json';
    const {
        ahora, nombres, documento, lugarexpedicion, fechaexpedicion, tipo,
        fechanacimiento, estadocivil, email, movil, direccion, asesors, id
    } = req.body;
    var imagenes = ''
    req.files.map((e) => {
        imagenes += `/uploads/${e.filename},`
    })
    var indic = movil.indexOf(' ');
    var movl = indic != -1 ? movil.replace(/-/g, "") : '57 ' + movil.replace(/-/g, "");

    const clit = {
        nombre: nombres.toUpperCase(), documento: documento.replace(/\./g, ''), fechanacimiento,
        lugarexpedicion, fechaexpedicion, estadocivil, movil: movl, agendado: 1,
        email: email.toLowerCase(), direccion: direccion.toLowerCase(), tipo,
        acsor: req.user.id, tiempo: ahora, google: '', imags: imagenes
    }
    if (req.params.id === 'agregar') {
        const cliente = await pool.query(`SELECT * FROM clientes WHERE documento = ?`, documento);
        if (!cliente.length) {
            var person = {
                "resource": {
                    "names": [{ "familyName": nombres.toUpperCase() }],
                    "emailAddresses": [{ "value": email.toLowerCase() }],
                    "phoneNumbers": [{ "value": '+' + movl, "type": "Personal" }],
                    "organizations": [{ "name": "Red Elite", "title": "Cliente" }]
                }
            };
            await fs.readFile('credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                authorize(JSON.parse(content), crearcontacto);
            });
            const ir = await pool.query('INSERT INTO clientes SET ? ', clit);
            if (asesors) {
                const asr = {
                    fullname: nombres.toUpperCase(), document: documento,
                    cel: movl, username: email.toLowerCase(), cli: ir.insertId
                }
                await pool.query('UPDATE users SET ? WHERE id = ?', [asr, req.user.id]);
            }
            res.send({ code: ir.insertId });

        } else if (cliente.length > 0 && asesors) {
            const asr = {
                fullname: nombres.toUpperCase(), document: documento,
                cel: movl, username: email.toLowerCase(), cli: cliente[0].idc
            }
            await pool.query('UPDATE users SET ? WHERE id = ?', [asr, req.user.id]);
            res.send(true);
        }
    } else if (req.params.id === 'actualizar') {

    } else if (req.params.id === 'eliminar') {

    }

    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = Contactos;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris);

        // Comprueba si previamente hemos almacenado un token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }
    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Autorice esta aplicación visitando esta url: ', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Ingrese el código de esa página aquí: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Almacenar el token en el disco para posteriores ejecuciones del programa
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token almacenado en', TOKEN_PATH);
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
            console.log("Response", res.data.resourceName);
        });
    }
});
router.put('/editclientes', async (req, res) => {
    const { idc, name, tipod, docu, lugarex, fehex, fnaci,
        ecivil, email, pais, Movil, adres } = req.body;

    console.log(req.body);
    const movl = pais + ' ' + Movil.replace(/-/g, "");
    const clit = {
        nombre: name.toUpperCase(), documento: docu, fechanacimiento: fnaci,
        lugarexpedicion: lugarex, fechaexpedicion: fehex, estadocivil: ecivil,
        movil: movl, email: email.toLowerCase(), direccion: adres.toLowerCase(),
        tipo: tipod
    }
    await pool.query('UPDATE clientes SET ? WHERE idc = ?', [clit, idc]);
    res.send(true);
})
router.post('/adjuntar', async (req, res) => {
    var imagenes = ''
    req.files.map((e) => {
        imagenes += `/uploads/${e.filename},`
    })
    await pool.query('UPDATE clientes SET ? WHERE idc = ?', [{ imags: imagenes }, req.body.idc]);
    res.send(true);
})
router.post('/elicliente', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query(`DELETE FROM clientes WHERE idc = ?`, id);
        res.send(true);
    }
    catch (e) {
        res.send(false);
    }
})
router.post('/movil', async (req, res) => {
    const { movil } = req.body;
    const cliente = await pool.query('SELECT * FROM clientes WHERE movil = ?', movil);
    res.send(cliente);
});
/////////////////////////////////////////////////////
router.get('/social', isLoggedIn, (req, res) => {
    var options = {
        method: 'POST',
        url: 'https://sbapi.bancolombia.com/v1/security/oauth-otp-pymes/oauth2/token',
        headers:
        {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            //authorization:  'MzdlYjEyNjctNmMzMy00NmIxLWE3NmYtMzNhNTUzZmQ4MTJmOnNUNnJYMndINGlMNGpKOHFROGVWNmJMNWlKOGNNMmdTMWVMOHNZMnBZMGhMNXZYNGVN'
        },
        form:
        {
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
//////////////* PAGOS *//////////////////////////////////
router.get('/pagos', async (req, res) => {
    res.render('links/pagos');
});
router.get('/pagos/:id', async (req, res) => {
    const cliente = await pool.query('SELECT * FROM clientes WHERE documento = ?', req.params.id)
    if (cliente.length > 0) {
        const client = cliente[0]
        const d = await pool.query(`SELECT p.id, p.ahorro, pd.id lt, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, c.pin, 
        c.descuento, pr.proyect FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN cupones c ON p.cupon = c.id 
        INNER JOIN productos pr ON pd.producto = pr.id WHERE p.tipobsevacion IS NULL AND (p.cliente = ? OR p.cliente2 = ?)`, [client.idc, client.idc]);
        var c = ''
        if (d.length > 0) {

            d.length > 1 ? d.map((b, x) => {
                c += `${x > 0 ? ' OR ' : ''}separacion = ${b.id}`
            }) : c = `separacion = ${d[0].id}`;

            const cuotas = await pool.query(`SELECT * FROM cuotas WHERE estado = 3 AND fechs <= CURDATE() AND (${c}) ORDER BY TIMESTAMP(fechs) ASC`);
            res.send({ d, client, cuotas, status: true });
        } else {
            res.send({ paquete: 'Aun no realiza una separacion, comuniiquece con un asesor', status: false });
        }
    } else {
        res.send({ paquete: 'No existe un registro con este numero de documeto, comuniiquece con un asesor', status: false });
    }
});
router.post('/pagos', async (req, res) => {
    const { merchantId, amount, referenceCode, total, factrs, id, concpto, lt, bono, pin } = req.body;
    //var nombre = normalize(buyerFullName).toUpperCase();
    var APIKey = 'lPAfp1kXJPETIVvqr60o6cyEIy' //Grupo Elite 
    //var APIKey = '4Vj8eK4rloUd272L48hsrarnUA' //para pruebas
    //var APIKey = 'pGO1M3MA7YziDyS3jps6NtQJAg' // Para SAMIR
    var key = APIKey + '~' + merchantId + '~' + referenceCode + '~' + amount + '~COP'
    var hash = crypto.createHash('md5').update(key).digest("hex");
    var ext = `${total}~${factrs}~${concpto}~${lt}~${bono ? bono : 0}~${pin ? pin : 0}~${id ? id : 0}`;
    res.send({ sig: hash, ext });
});
router.post('/recibo', async (req, res) => {
    //console.log(req.body, req.files)
    const { total, factrs, id, recibos, ahora, concpto, lt, formap, bono, pin, montorcb, g, mora, rcbexcdnt, nrecibo, montos, feh } = req.body;
    var rcb = ''; //console.log(req.body, rcbexcdnt ? 'si' : 'no')
    if (recibos.indexOf(',')) {
        var rcbs = recibos.split(',')
        rcbs.map((s) => {
            rcb += `recibo LIKE '%${s}%' OR `;
        })
        rcb = rcb.slice(0, -3);
    } else {
        rcb = `recibo LIKE '%${recibos}%'`;
    }
    var excd = false;
    var sum = 0, saldo = montorcb;
    //var excedent = Math.sign(excd) >= 0 ? excd : 0;
    //console.log(rcb, id)
    const recibe = await pool.query(`SELECT * FROM solicitudes WHERE (${rcb})`); //stado != 6 AND 
    if (recibe.length > 0) {
        recibe.filter((a) => {
            return a.rcbexcdnt && a.excdnt;
        }).map((a) => {
            sum += a.monto;
        });
        saldo = montorcb - sum;
        //console.log(recibe, sum, saldo, montorcb, total)
        if (saldo < parseFloat(total) && sum > 1) {
            if (g) {
                return res.send({ std: false, msj: 'El excedente del anterior pago, no coinside con el moto a pagar de este, excedente de $' + Moneda(sum) });
            } else {
                req.flash('error', 'El excedente del anterior pago, no coinside con el moto a pagar de este, excedente de $' + Moneda(sum))
                return res.redirect('/links/pagos');
            }
        } else if (!sum) {
            if (g) {
                return res.send({ std: false, msj: 'Solicitud de pago rechazada, recibo o factura duplicada' });
            } else {
                req.flash('error', 'Solicitud de pago rechazada, recibo o factura duplicada');
                return res.redirect('/links/pagos');
            }
        }
    }
    if (saldo > parseFloat(total)) {
        excd = true;
    }
    //console.log(sum, saldo, montorcb, total)
    var imagenes = ''
    req.files.map((e) => {
        imagenes += `/uploads/${e.filename},`
    })
    const a = await Bonos(bono, lt);
    if (a) {
        await pool.query('UPDATE cupones SET ? WHERE id = ?',
            [{ producto: a, estado: 14 }, pin]
        );
    } else if (!a && bono != 0) {
        if (g) {
            return res.send({ std: false, msj: 'Solicitud de pago rechazada, Bono erroneo' });
        } else {
            req.flash('error', 'Solicitud de pago rechazada, Bono erroneo');
            return res.redirect('/links/pagos');
        }
    }
    const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = ? AND s.lt = ?`, [4, lt]);
    var l = r[0].monto1 || 0,
        k = r[0].monto || 0;
    var acumulado = l + k;

    const pago = {
        fech: ahora, monto: total, recibo: recibos, facturasvenc: factrs, lt, acumulado,
        concepto: 'PAGO', stado: 3, img: imagenes, descp: concpto, formap, motorecibos: montorcb
    }
    !rcbexcdnt || !excd ? '' : pago.excdnt = 1;
    !rcbexcdnt ? '' : pago.rcbexcdnt = rcbexcdnt;
    mora != 0 ? pago.moras = mora : '';
    bono != 0 ? pago.bono = pin : ''; //console.log(pago);
    concpto === 'ABONO' ? pago.concepto = concpto : pago.pago = id,
        await pool.query('UPDATE cuotas SET estado = 1 WHERE id = ?', id);
    await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', lt);
    await pool.query(`UPDATE solicitudes SET ? WHERE ${rcb}`, { excdnt: 0 });
    const pgo = await pool.query('INSERT INTO solicitudes SET ? ', pago);
    var reci = 'INSERT INTO recibos (registro, date, formapg, rcb, monto, baucher, excdnt) VALUES ';

    if (Array.isArray(nrecibo)) {
        await nrecibo.map((t, i) => {
            reci += `(${pgo.insertId}, '${feh[i]}', '${formap}', '${t}', ${montos[i].replace(/\./g, '')}, '/uploads/${req.files[i].filename}', ${rcbexcdnt === t ? parseFloat(montorcb) - parseFloat(total) : 0}),`;
        });
    } else {
        reci += `(${pgo.insertId}, '${feh}', '${formap}', '${nrecibo}', ${montos.replace(/\./g, '')}, '/uploads/${req.files[0].filename}', ${parseFloat(montorcb) - parseFloat(total)}),`;
    }
    await pool.query(reci.slice(0, -1));

    /*req.flash('success', 'Cartera creada correctamente, producto en estado ' + S.estado);
    res.redirect('/links/cartera');*/

    if (g) {
        return res.send({ std: true, msj: 'Solicitud de pago enviada correctamente' });
    } else {
        req.flash('success', 'Solicitud de pago enviada correctamente');
        return res.redirect('/links/pagos');
    }
    //uploads/
});
router.post('/bonus', async (req, res) => {
    const { factrs, id, ahora, concpto, lt, bonomonto, bono, pin } = req.body;
    /*const recibe = await pool.query(
        `SELECT c.id, pr.id e FROM cupones c
            INNER JOIN clientes cl ON c.clients = cl.idc 
            INNER JOIN preventa pr ON cl.idc = pr.cliente 
            OR cl.idc = pr.cliente2 OR cl.idc = pr.cliente3 
            OR cl.idc = pr.cliente4 INNER JOIN productosd l ON pr.lote = l.id
            WHERE c.pin = ? AND l.id = ? AND c.producto IS NULL AND c.estado = 9`,
        [bono, lt]
    );*/
    const a = await Bonos(bono, lt);
    if (a) {
        const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = ? AND s.lt = ?`, [4, lt]);
        var l = r[0].monto1 || 0,
            k = r[0].monto || 0;
        var acumulado = l + k;

        const pago = {
            fech: ahora, monto: bonomonto, recibo: bono, facturasvenc: factrs, lt,
            concepto: 'PAGO', stado: 3, descp: concpto, formap: 'BONO', bono: pin,
            acumulado
        }
        concpto === 'ABONO' ? pago.concepto = concpto : pago.pago = id,
            await pool.query('UPDATE cuotas SET estado = 1 WHERE id = ?', id);
        await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', lt);

        await pool.query('UPDATE cupones SET ? WHERE id = ?',
            [{ producto: a, estado: 14 }, pin]
        );
        const P = await pool.query('INSERT INTO solicitudes SET ? ', pago);
        const R = await PagosAbonos(P.insertId, '', 'GRUPO ELITE SISTEMA')
        res.send(R);
    } else {
        res.send(false);
    }
});
/////////////* CARTERAS */////////////////////////////////////
router.get('/cartera', isLoggedIn, async (req, res) => {
    if (req.user.admin == 1) {
        res.render('links/cartera');
    } else {
        req.flash('error', 'No tienes permisos para acceder al modulo CARTERA');
        res.redirect('/links/reportes');
    }
});
router.post('/cartera/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const fila = await pool.query('SELECT * FROM productosd WHERE id = ?', id);
    res.send(fila[0]);
});
router.post('/cartera', isLoggedIn, async (req, res) => {
    const { h } = req.body;
    sql = `SELECT p.id, pd.id lote, pt.proyect proyecto, pd.mz, pd.n, c.imags, p.promesa, p.status,
            pd.estado, c.idc, c.nombre, c.movil, c.documento, u.fullname, u.cel, p.fecha, p.autoriza, 
            t.estado std, t.tipo, t.ncuota, t.fechs, t.cuota, t.abono, t.mora
            FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id 
            INNER JOIN cuotas t ON t.separacion = p.id WHERE p.tipobsevacion IS NULL 
            AND t.estado IN(3,5) AND t.fechs < '${h}'`

    const cuotas = await pool.query(sql);
    respuesta = { "data": cuotas };
    //console.log(cuotas.length, h)
    res.send(respuesta);

});
router.post('/rcb', async (req, res) => {
    const { rcb } = req.body; console.log(req.body)
    const recibo = await pool.query(`SELECT * FROM solicitudes WHERE recibo LIKE '%${rcb}%'`);
    //console.log(recibo)
    if (recibo.length > 0) {
        res.send(false);
    } else {
        res.send(true);
    }
});
router.post('/prodlotes', isLoggedIn, async (req, res) => {
    const productos = await pool.query(`SELECT p.*, l.* FROM productos p INNER JOIN productosd l ON l.producto = p.id LEFT JOIN preventa v ON v.lote = l.id 
    WHERE l.estado IN('9', '15') AND (v.tipobsevacion = 'ANULADA' OR v.id IS NULL) ORDER BY p.proyect DESC, l.mz ASC, l.n ASC`);
    const asesores = await pool.query(`SELECT * FROM users ORDER BY fullname ASC`);
    const clientes = await pool.query(`SELECT * FROM clientes ORDER BY nombre ASC`);
    res.send({ productos, asesores, clientes });

});
router.post('/crearcartera', isLoggedIn, async (req, res) => {
    const { idbono, asesor, clientes, mtr2, vmtr2, inicial, total, cupon, xcntag, cuponx100, cuot,
        ahorro, desinicial, destotal, inicialcuotas, financiacion, tini, tfnc, fecha, n, tipo, cuota, rcuota,
        std, concpto, lt, ahora, montorcb, recibos, formap, nrecibo, promesa, feh, montos } = req.body;

    //console.log(req.body, req.files, req.body.promesa ? 'si' : 'no')

    var separ = {
        lote: lt, asesor: asesor, iniciar: xcntag, obsevacion: 'CARTERA', cuot,
        numerocuotaspryecto: parseFloat(inicialcuotas) + parseFloat(financiacion),
        extraordinariameses: 0, cuotaextraordinaria: 0, cupon: idbono ? idbono : 1,
        inicialdiferida: inicialcuotas, ahorro: ahorro ? ahorro.replace(/\./g, '') : 0,
        separar: cuota[0].replace(/\./g, ''), extran: 0, vrmt2: vmtr2.replace(/\./g, '')
    };
    if (promesa && promesa !== '0') {
        separ.promesa = promesa
        separ.autoriza = req.user.fullname
        separ.status = promesa
    }
    if (Array.isArray(clientes)) {
        clientes.map((e, i) => {
            i === 0 ? separ.cliente = e
                : i === 1 ? separ.cliente2 = e
                    : i === 2 ? separ.cliente3 = e
                        : i === 3 ? separ.cliente4 = e
                            : '';
        })
    } else {
        separ.cliente = clientes
    }
    const h = await pool.query('INSERT INTO preventa SET ? ', separ);
    idbono ? await pool.query('UPDATE cupones set ? WHERE id = ?', [{ estado: 14, producto: h.insertId }, idbono]) : '';
    var cuotas = 'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, estado, proyeccion) VALUES ';
    var reci = 'INSERT INTO recibos (registro, date, formapg, rcb, monto, baucher) VALUES ';
    await n.map((t, i) => {
        cuotas += `(${h.insertId}, '${tipo[i]}', ${t}, '${fecha[i]}', ${rcuota[i].replace(/\./g, '')}, ${std[i]}, ${cuota[i].replace(/\./g, '')}),`;
    });
    await pool.query(cuotas.slice(0, -1));

    var imagenes = ''
    req.files.map((e) => {
        imagenes += `/uploads/${e.filename},`
    })
    var fpago = Array.isArray(formap) ? formap[0] : formap;
    const pago = {
        fech: ahora, monto: montorcb, recibo: recibos, facturasvenc: 0, lt, acumulado: 0,
        concepto: 'ABONO', stado: 4, img: imagenes, descp: 'ABONO', formap: fpago, excdnt: 0
    }
    const pgo = await pool.query('INSERT INTO solicitudes SET ? ', pago);
    if (Array.isArray(nrecibo)) {
        await nrecibo.map((t, i) => {
            reci += `(${pgo.insertId}, '${feh[i]}', '${formap[i]}', '${t}', ${montos[i].replace(/\./g, '')}, '/uploads/${req.files[i].filename}'),`;
        });
    } else {
        reci += `(${pgo.insertId}, '${feh}', '${formap}', '${nrecibo}', ${montos.replace(/\./g, '')}, '/uploads/${req.files[0].filename}'),`;
    }
    await pool.query(reci.slice(0, -1));
    const S = await Estados(h.insertId);
    await pool.query('UPDATE productosd set ? WHERE id = ?',
        [
            {
                estado: S.std, mtr: vmtr2.replace(/\./g, ''),
                inicial: inicial.replace(/\./g, ''),
                valor: total.replace(/\./g, ''), tramitando: ahora
            }, lt
        ]
    );

    req.flash('success', 'Cartera creada correctamente, producto en estado ' + S.estado);
    res.redirect('/links/cartera');
})
//////////////* CUPONES *//////////////////////////////////
router.get('/saluda', isLoggedIn, async (req, res) => {
    const r = await pool.query(`SELECT SUM(s.monto) + 
    SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS montos, 
    p.ahorro, pd.mz, pd.n, pd.mtr2, pd.valor, pd.inicial, p.vrmt2, p.fecha, 
    cu.descuento, c.nombre FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id 
    INNER JOIN productos pt ON pd.producto = pt.id LEFT JOIN cupones cu ON cu.id = p.cupon 
    INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id 
    INNER JOIN solicitudes s ON pd.id = s.lt LEFT JOIN cupones cp ON s.bono = cp.id
    WHERE s.stado = 4 AND s.concepto IN('PAGO', 'ABONO')
    GROUP BY p.id`);
    console.log(r)
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
        }
        await pool.query('INSERT INTO cupones SET ? ', cupon);
        const klint = await pool.query(`SELECT * FROM  clientes WHERE idc = ?`, cupon.clients);
        const encargado = await pool.query(`SELECT u.fullname, u.cel, u.username FROM encargos e INNER JOIN users u ON e.user = u.id  WHERE e.cargo = 'CUPONES'`);
        const en = encargado[0]
        var nom = en.fullname.split(" ")[0];

        EnviarWTSAP(en.cel,
            `_*${nom}* tienes una solicitu de un *CUPON ${pin}* del *${cupon.descuento}%* por aprobar de *${klint[0].nombre}*_\n\n_*GRUPO ELITE FICA RAÍZ*_`,
            `${nom} tienes una solicitu de un CUPON ${pin} ${cupon.descuento}% por aprobar de ${klint[0].nombre}`
        );
        res.send({ tipo: 'success', msj: 'Solicitud de cupon enviada correctamente' });
    } else {
        res.send({ tipo: 'error', msj: 'Ya generaste una solicitud de cupon antes, debes esperar al menos una hora para realizar una nueva solicitud' });
    }
});
router.post('/cupones', isLoggedIn, async (req, res) => {

    var d = req.user.admin > 0 ? '' : 'WHERE c.clients = ?';
    var sql = `SELECT c.id, c.pin, c.descuento, c.fecha, c.estado, v.ahorro, p.mz, p.n, t.proyect, cl.nombre, cl.movil, 
    cl.email FROM cupones c LEFT JOIN preventa v ON c.producto = v.id LEFT JOIN productosd p ON v.lote = p.id 
    LEFT JOIN productos t ON p.producto = t.id LEFT JOIN clientes cl ON c.clients = cl.idc ${d} `

    const cupones = await pool.query(sql, req.user.cli);
    respuesta = { "data": cupones };
    res.send(respuesta);

});
router.post('/cupones/:d', isLoggedIn, async (req, res) => {
    const { d } = req.params;
    if (d === 'BONO') {
        const { id, pin, descuento, fecha, estado, ahorro, mz, n, proyect, nombre, movil, email } = req.body;
        const bono = {
            pin, descuento: 0, estado: 9, cliente: idc,
            tip: qhacer, monto: acumulado, motivo, concept: causa
        }
        const a = await pool.query('INSERT INTO cupones SET ? ', bono);

    } else if (d === 'CUPON') {

    } else if (d === 'clientes') {
        const clientes = await pool.query(`SELECT * FROM clientes ORDER BY nombre ASC`);
        res.send({ clientes });
    } else {
        const { id, pin, descuento, fecha, estado, ahorro, mz, n, proyect, nombre, movil, email } = req.body;
        if (d === 'Aprobar') {
            await pool.query('UPDATE cupones set ? WHERE id = ?', [{ estado: 9 }, id]);
            EnviarWTSAP(movil,
                `_*${nombre.split(" ")[0]}* tienes un cupon *${pin}* aprobado del *${descuento}%* de descuento para lotes *Campestres*_\n\n_Debes tener presente que estos descuentos estan sujetos a terminos y condiciones establecidos por *Grupo Elite.*_\n\n_para mas información cominicate con un una persona del area encargada_\n\n_*GRUPO ELITE FICA RAÍZ*_`,
                `${nombre.split(" ")[0]} tienes un cupon ${pin} aprobado de ${descuento}% GRUPO ELITE FICA RAÍZ`
            );
            res.send(true);
        }
    }
});
router.get('/bono/:id', async (req, res) => {
    const bono = await pool.query('SELECT * FROM cupones WHERE pin = ?', req.params.id)
    res.send(bono);
});
//////////////* ORDEN *//////////////////////////////////
router.get('/orden', isLoggedIn, async (req, res) => {
    moment.locale('es');
    const { id, h } = req.query;
    var ahora = moment(h).subtract(1, 'hours').format('YYYY-MM-DD HH:mm');
    var hora2 = moment(h).subtract(2, 'hours').format('YYYY-MM-DD HH:mm');

    const proyecto = await pool.query(`SELECT * FROM  productosd pd INNER JOIN productos p ON pd.producto = p.id WHERE pd.id = ?`, id);
    var t = proyecto[0].tramitando ? proyecto[0].tramitando : 'nada'
    var p = proyecto[0].tramitando ? proyecto[0].tramitando : 'nada'
    var hora = t.indexOf("*") > 0 ? t.split('*')[1] : hora2;
    if (ahora > hora) {
        await pool.query('UPDATE productosd set ? WHERE id = ?', [{ tramitando: req.user.fullname + '*' + h }, id]);
        res.render('links/orden', { proyecto, id, mensaje: '' });
    } else if (req.user.fullname !== t.split('*')[0]) {
        var mensaje = `ESTE LOTE ESTUVO O ESTA SIENDO TRAMITADO POR ${t.split('*')[0]} EN LA ULTIMA HORA. ES POSIBLE QUE TU NO LO PUEDAS TRAMITAR`
        res.render('links/orden', { proyecto, id, mensaje });
    } else {
        res.render('links/orden', { proyecto, id, mensaje: '' });
    }
});
router.post('/orden', isLoggedIn, async (req, res) => {
    const { numerocuotaspryecto, extraordinariameses, lote, client, ahora, cuot,
        cuotaextraordinaria, cupon, inicialdiferida, ahorro, fecha, cuota, tipod,
        estado, ncuota, tipo, obsevacion, separacion, extran, vrmt2, iniciar } = req.body;
    console.log(req.body)
    const fp = await pool.query('SELECT * FROM productosd WHERE id = ? AND estado = 9', lote);
    if (!fp.length) {
        req.flash('error', 'Separación no realizada ya existe una orden con este lote');
        res.redirect(`/links/orden?id=${lote}&h=${ahora}`);
    } else {
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
            extran: extran ? extran : 0, vrmt2: vrmt2.replace(/\./g, ''),
            iniciar, cuot
        };
        console.log(separ)
        const h = await pool.query('INSERT INTO preventa SET ? ', separ);
        await pool.query('UPDATE productosd set ? WHERE id = ?', [{ estado: 1, tramitando: ahora }, lote]);
        cupon ? await pool.query('UPDATE cupones set ? WHERE id = ?', [{ estado: 14, producto: h.insertId }, cupon]) : '';


        var cuotas = 'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, estado, proyeccion) VALUES ';
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
    const { id } = req.params
    const datos = await pool.query(`SELECT * FROM clientes WHERE movil LIKE '%${id}%' OR documento = '${id}'`)
    res.send(datos);
});
router.post('/codigo', isLoggedIn, async (req, res) => {
    const { movil } = req.body;
    const codigo = ID2(5);
    EnviarWTSAP(movil,
        `_*Grupo Elite* te da la Bienvenida, usa este codigo *${codigo}* para confirmar tu separacion_ \n\n_*GRUPO ELITE FICA RAÍZ*_`,
        `GRUPO ELITE te da la Bienvenida, usa este codigo ${codigo} para confirmar tu separacion`
    );
    res.send(codigo);
});
router.post('/tabla/:id', async (req, res) => {
    if (req.params.id == 1) {
        var data = new Array();
        dataSet.data = data
        const { fcha, fcha2, cuota70, cuota30, oficial70, oficial30, N, u, mesesextra, extra, separacion } = req.body;
        var v = N == 1 ? 1 : Math.round((parseFloat(N) - parseFloat(u)) / 2);
        var p = (parseFloat(N) - parseFloat(u)) / 2
        var j = Math.round(parseFloat(u) / 2);
        var o = parseFloat(u) / 2;
        var y = 0; console.log(fcha, fcha2, 'c70' + cuota70, 'c30' + cuota30, oficial70, oficial30, N, u, mesesextra, extra, separacion, v, p, j, o, y)
        l = {
            n: `1 <input value="1" type="hidden" name="ncuota">`,
            fecha: fcha2,
            oficial: `<span class="badge badge-dark text-center text-uppercase">Cuota De Separacion</span>`,
            cuota: `${separacion} <input value="${separacion.replace(/\./g, '')}" type="hidden" name="cuota">`,
            stado: `<span class="badge badge-primary">Pendiente</span>
                    <input value="3" type="hidden" name="estado">
                    <input value="SEPARACION" type="hidden" name="tipo">`,
            n2: '',
            fecha2: '',
            cuota2: '',
            stado2: ''
        }
        dataSet.data.push(l);
        for (i = 1; i <= v; i++) {
            y = o < 1 ? j + i : u > 3 ? j + i + 2 : i + j + 1;
            if (i <= j && cuota30 != 0) {
                x = {
                    n: i + `<input value="${i}" type="hidden" name="ncuota">`,
                    fecha: moment(fcha).add(i, 'month'),
                    oficial: `<span class="badge badge-dark text-center text-uppercase">Cuota Inicial ${oficial30}</span>`,
                    cuota: cuota30 + `<input value="${cuota30.replace(/\./g, '')}" type="hidden" name="cuota">`,
                    stado: `<span class="badge badge-primary">Pendiente</span>
                            <input value="3" type="hidden" name="estado">
                            <input value="INICIAL" type="hidden" name="tipo">`,
                    n2: i > o ? '' : `${i + j} <input value="${i + j}" type="hidden" name="ncuota">`,
                    fecha2: i > o ? '' : moment(fcha).add(i + j, 'month'),
                    cuota2: i > o ? '' : cuota30 + `<input value="${cuota30.replace(/\./g, '')}" type="hidden" name="cuota">`,
                    stado2: i > o ? '' : `<span class="badge badge-primary">Pendiente</span>
                                          <input value="3" type="hidden" name="estado">
                                          <input value="INICIAL" type="hidden" name="tipo">`
                }
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
                cuota2: i > p ? '' : cuota70 + `<input value="${cuota70.replace(/\./g, '')}" type="hidden" name="cuota">`,
                stado2: i > p ? '' : `<span class="badge badge-primary">Pendiente</span>
                                      <input value="3" type="hidden" name="estado">
                                      <input value="FINANCIACION" type="hidden" name="tipo">`
            };

            if (d.fecha._d.getMonth() == 5 && (mesesextra == 6 || mesesextra == 2)) {
                d.cuota = `<mark> ${extra}</mark> <input value="${extra.replace(/\./g, '')}" type="hidden" name="cuota">`
            } else if (d.fecha._d.getMonth() == 11 && (mesesextra == 12 || mesesextra == 2)) {
                d.cuota = `<mark> ${extra}</mark> <input value="${extra.replace(/\./g, '')}" type="hidden" name="cuota">`
            };
            if (d.fecha2) {
                if (d.fecha2._d.getMonth() == 5 && (mesesextra == 6 || mesesextra == 2)) {
                    d.cuota2 = `<mark> ${extra}</mark> <input value="${extra.replace(/\./g, '')}" type="hidden" name="cuota">`
                } else if (d.fecha2._d.getMonth() == 11 && (mesesextra == 12 || mesesextra == 2)) {
                    d.cuota2 = `<mark> ${extra}</mark> <input value="${extra.replace(/\./g, '')}" type="hidden" name="cuota">`
                };
            };
            dataSet.data.push(d);
        };
        //console.log(dataSet)
        res.send(true);
    } else {
        res.send(dataSet);
    }
});
router.get('/ordendeseparacion/:id', isLoggedIn, async (req, res) => {
    //console.log(req.params)
    const { id } = req.params
    sql = `SELECT * FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id WHERE p.id = ?`
    const orden = await pool.query(sql, id);
    const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
            SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
            FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id INNER JOIN preventa p ON s.lt = p.lote
            WHERE s.concepto IN('PAGO', 'ABONO') AND p.id = ? `, id);
    var l = r[0].monto1 || 0,
        k = r[0].monto || 0;
    var total = l + k;
    //console.log(orden)
    res.render('links/ordendeseparacion', { orden, id, total });
})
router.get('/ordn/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto,
    p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.cupon, p.ahorro, p.fecha, p.obsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, pt.proyect, 
    c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento, s.concepto, s.stado
    FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id 
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
    INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id 
    LEFT JOIN solicitudes s ON p.lote = s.lt WHERE p.tipobsevacion IS NULL AND p.id = ? LIMIT 1`

    const orden = await pool.query(sql, id);
    var abono = 0;
    orden.map((x) => {
        if (x.concepto === 'ABONO' && x.stado == 4) {
            abono = 1;
        }
    })
    if (abono === 1) {
        req.flash('error', 'Esta separacion no es posible editarla ya que tiene un ABONO aprobado');
        res.redirect('/links/reportes');
    } else {
        //console.log(orden)
        res.render('links/ordn', { orden, id });
    }

})
router.get('/editordn/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto, p.asesor,
    p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.cupon, p.ahorro, p.fecha, p.obsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, pt.proyect, 
    c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento, pd.uno, pd.dos, 
    COUNT(if(s.concepto = 'PAGO' OR s.concepto = 'ABONO', s.ids, NULL)) AS t, pd.tres, pd.directa, 
    pt.valmtr2, pt.porcentage, COALESCE(SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cu.monto + s.monto, 
    if((s.concepto = 'PAGO' OR s.concepto = 'ABONO') AND s.stado = 4, s.monto, 0))), 0) AS Montos, p.status 
    FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc  
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
    INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id 
    LEFT JOIN solicitudes s ON p.lote = s.lt WHERE p.tipobsevacion IS NULL AND p.id = ?
    GROUP BY p.id`; //s.concepto NOT IN('COMISION DIRECTA', 'COMISION INDIRECTA', 'BONO') 

    sql2 = `SELECT SUM(IF(c.tipo = 'SEPARACION', 1, '')) AS SEPARACION,
    SUM(IF(c.tipo = 'INICIAL', 1, '')) AS INICIAL,
    SUM(IF(c.tipo = 'FINANCIACION', 1, '')) AS FINANCIACION
    FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id 
    WHERE p.tipobsevacion IS NULL AND p.id = ?`;
    const orden = await pool.query(sql, id);
    const cuotas = await pool.query(sql2, id);
    /*var abono = 0;
    orden.map((x) => {
        if (x.concepto === 'ABONO' && x.stado == 4) {
            abono = 1;
        }
    })
    if (abono === 1) {
        req.flash('error', 'Esta separacion no es posible editarla ya que tiene un ABONO aprobado');
        res.redirect('/links/reportes');
    } else {
        //console.log(orden)
        res.render('links/editordn', { orden, id });
    }*/
    res.render('links/editordn', { id, orden, cuotas });
})
router.post('/ordn/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    sql = `SELECT * FROM cuotas WHERE separacion = ? ORDER BY tipo DESC, ncuota ASC`
    const orden = await pool.query(sql, id);
    console.log(orden)
    body = { "data": orden };
    res.send(body);
})
router.post('/ordne/', isLoggedIn, async (req, res) => {
    const { cuot, idbono, lt, asesor, clientes, vmtr2, promesa, idcuota, porcentage, inicial,
        xcntag, ahorro, inicialcuotas, financiacion, id, fecha, n, tipo, mtr2, total, lote,
        cuota, rcuota, std, preventa, uno, dos, tres, directa, otro, valmtr2 } = req.body;
    var vr = parseFloat(vmtr2.replace(/\./g, ''));
    var ini = parseFloat(inicial.replace(/\./g, ''));
    var tot = parseFloat(total.replace(/\./g, ''));
    var orden = {
        'p.lote': lt, 'p.vrmt2': vr,
        'p.cliente': Array.isArray(clientes) ? clientes[0] : clientes,
        'p.asesor': asesor, 'p.numerocuotaspryecto': parseFloat(inicialcuotas) + parseFloat(financiacion),
        'p.cupon': idbono ? idbono : 1,
        'p.inicialdiferida': inicialcuotas,
        'p.ahorro': ahorro ? ahorro.replace(/\./g, '') : 0,
        'p.separar': rcuota[0].replace(/\./g, ''),
        'p.iniciar': xcntag, 'p.cuot': Math.round(cuot)
    }
    if (otro) {
        orden["l.uno"] = null;
        orden["l.dos"] = null;
        orden["l.tres"] = null;
        orden["l.directa"] = null;
        orden["l.estado"] = 9;
        orden["l.mtr"] = valmtr2;
        orden["l.valor"] = Math.round(valmtr2 * mtr2);
        orden["l.inicial"] = Math.round((valmtr2 * mtr2) * porcentage / 100);
    } else {
        const r = await Estados(preventa);
        var estado = r.pendients ? 8 : r.std
        orden["l.mtr"] = vr;
        orden["l.valor"] = tot;
        orden["l.inicial"] = ini;
        orden["l.estado"] = estado;
    }

    if (promesa) {
        orden["p.promesa"] = promesa;
        orden["p.autoriza"] = req.user.fullname;
        orden["p.status"] = promesa;
    }

    if (Array.isArray(clientes)) {
        switch (clientes.length) {
            case 2:
                orden["p.cliente2"] = clientes[1];
                break;
            case 3:
                orden["p.cliente2"] = clientes[1];
                orden["p.cliente3"] = clientes[2];
                break;
            case 4:
                orden["p.cliente2"] = clientes[1];
                orden["p.cliente3"] = clientes[2];
                orden["p.cliente4"] = clientes[3];
                break;
        }
    }
    await pool.query(`UPDATE preventa p INNER JOIN productosd l ON l.id = p.lote SET ? WHERE p.id = ?`, [orden, preventa]);
    await pool.query(`UPDATE solicitudes SET lt = ${lt} WHERE lt = ?`, lote);
    //`UPDATE preventa SET ? WHERE id = ?`

    var ID = '', kuotas = 'UPDATE cuotas SET cuota = CASE id ',
        numeros = '', rkuotas = '', fechas = '', stds = '', kuot = false;
    var cuotas = 'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, estado, proyeccion) VALUES ';

    id.map((c, i) => {
        if (c == '0') {
            kuot = true;
            cuotas += `(${preventa}, '${tipo[i]}', ${n[i]}, '${fecha[i]}', ${rcuota[i].replace(/\./g, '')}, ${std[i]}, ${cuota[i].replace(/\./g, '')}),`;
        } else {
            ID += c + ', ';
            kuotas += ' WHEN ' + c + ' THEN ' + rcuota[i].replace(/\./g, '');
            numeros += ' WHEN ' + c + ' THEN ' + n[i];
            rkuotas += ' WHEN ' + c + ' THEN ' + cuota[i].replace(/\./g, '');
            fechas += ' WHEN ' + c + ' THEN ' + `'${fecha[i]}'`;
            stds += ' WHEN ' + c + ' THEN ' + std[i];
        }
    });
    ID = ID.slice(0, -2);
    kuotas += ' END, ncuota = CASE id ' + numeros + ' END, proyeccion = CASE id ' + rkuotas + ' END, fechs = CASE id ' + fechas + ' END, estado = CASE id ' + stds + ' END WHERE id IN(' + ID + ')';

    var eli = 'DELETE FROM cuotas WHERE ';
    if (Array.isArray(idcuota)) {
        idcuota.map((c, i) => {
            i === 0 ? eli += 'id IN(' + c + ', ' : eli += c + ', ';
        });
        eli = eli.slice(0, -2) + ')';
    } else {
        eli += 'id = ' + idcuota;
    }
    //console.log(req.body, kuotas, cuotas, orden, eli, idcuota ? idcuota : 'nada')
    await pool.query(kuotas);
    kuot ? await pool.query(cuotas.slice(0, -1)) : '';
    idcuota ? await pool.query(eli) : '';
    if (otro) {
        const r = await Estados(preventa);
        var estado = r.pendients ? 8 : r.std
        var ip = uno ? 'uno = ' + uno + ', ' : '';
        ip += dos ? 'dos = ' + dos + ', ' : '';
        ip += tres ? 'tres = ' + tres + ', ' : '';
        ip += directa ? 'directa = ' + directa + ', ' : '';
        ip += 'estado = ' + estado + ', mtr = ' + vr + ', valor = ' + tot + ', inicial = ' + ini;
        await pool.query(`UPDATE productosd SET ${ip} WHERE id = ?`, lt);
    }
    res.send(true);
})
router.post('/separacion/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const fila = await pool.query(`SELECT p.extraordinariameses, p.cuotaextraordinaria, p.extran, 
    p.separar, p.vrmt2, p.iniciar, p.cupon, p.ahorro, p.obsevacion, c.descuento, c.pin FROM preventa p  
    LEFT JOIN cupones c ON p.cupon = c.id WHERE p.id = ?`, id);
    res.send(fila[0]);
});
router.post('/prodlotes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const productos = await pool.query(`SELECT p.*, l.* FROM productos p INNER JOIN productosd l ON l.producto = p.id LEFT JOIN preventa v ON v.lote = l.id 
    WHERE l.estado IN('9', '15') AND v.tipobsevacion = 'ANULADA' OR v.id = ? OR v.id IS NULL ORDER BY p.proyect DESC, l.mz ASC, l.n ASC`, id);
    const asesores = await pool.query(`SELECT * FROM users ORDER BY fullname ASC`);
    const clientes = await pool.query(`SELECT * FROM clientes ORDER BY nombre ASC`);
    const orden = await pool.query(`SELECT * FROM cuotas WHERE separacion = ? ORDER BY tipo DESC, ncuota ASC`, id);
    res.send({ productos, asesores, clientes, orden });

});
router.post('/editarorden', isLoggedIn, async (req, res) => {
    //console.log(req.body);
    const { orden, separacion, cuotaInicial, vrm2, cuotaFinanciacion, separar,
        ahorro, idpin, mxr, mss, porcentage, inicial, valor } = req.body;
    const actualizar = {
        'p.extran': mxr, 'p.extraordinariameses': mss, 'p.vrmt2': vrm2, 'p.iniciar': porcentage, 'p.ahorro': ahorro,
        'p.cuot': cuotaFinanciacion, 'l.inicial': inicial, 'l.valor': valor, 'c.cuota': cuotaFinanciacion//'p.obsevacion',
    }
    if (separar > 0) {
        actualizar['p.separar'] = separacion;
        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND estado = 3 AND tipo = 'SEPARACION'`,
            [{ cuota: separacion }, orden]);
    }
    if (cuotaInicial > 0) {
        await pool.query(`UPDATE cuotas SET ? WHERE separacion = ? AND estado = 3 AND tipo = 'INICIAL'`,
            [{ cuota: cuotaInicial }, orden]);
    }
    idpin ? actualizar['p.cupon'] = idpin : '';

    var cf = mss == 3 ? `AND c.estado = 3 AND c.tipo = 'FINANCIACION' AND MONTH(c.fechs) != 6 AND MONTH(c.fechs) != 12`
        : mss == 2 ? `AND c.estado = 3 AND c.tipo = 'FINANCIACION' AND MONTH(c.fechs) != 12`
            : mss == 1 ? `AND c.estado = 3 AND c.tipo = 'FINANCIACION' AND MONTH(c.fechs) != 6`
                : `AND c.estado = 3 AND c.tipo = 'FINANCIACION'`;

    await pool.query(`UPDATE cuotas c 
    INNER JOIN preventa p ON c.separacion = p.id
    INNER JOIN productosd l ON p.lote = l.id SET ? 
    WHERE c.separacion = ? ${cf}`,
        [actualizar, orden]);

    sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto, 
    p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.cupon, p.ahorro, p.fecha, p.obsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, pd.valor, pt.proyect, 
    c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento 
    FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id 
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
    INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id WHERE p.id = ?`

    const ordn = await pool.query(sql, orden);
    //console.log(ordn)
    res.send(ordn);
});
router.post('/ordendeseparacion/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    let { p, i } = req.body;
    p = parseFloat(p);
    i = parseFloat(i);
    sql = `SELECT * FROM cuotas WHERE separacion = ? ORDER BY tipo DESC, ncuota ASC`
    const orden = await pool.query(sql, id); console.log(orden)
    var y = [orden[0]], o = [orden[0]];
    var e = Math.round(i / 2);
    var u = Math.round((p - i) / 2);
    var m = (p - i) / 2;
    var v = i / 2;
    //console.log(orden)
    w = await orden
        .map((t, c) => {
            if ((t.tipo === 'INICIAL' && i === 0) || (t.tipo === 'FINANCIACION' && p === 0)) {
                s = {
                    id2: '',
                    ncuota2: '',
                    fecha2: '',
                    cuota2: '',
                    estado2: ''
                };
                return Object.assign(t, s);
            }
            if (t.tipo === 'SEPARACION') {
                s = {
                    id2: '',
                    ncuota2: '',
                    fecha2: '',
                    cuota2: '',
                    estado2: ''
                }
                return Object.assign(orden[0], s);
            }
            if (t.tipo === 'INICIAL' && i === 1) {
                s = {
                    id2: '',
                    ncuota2: '',
                    fecha2: '',
                    cuota2: '',
                    estado2: ''
                }
                return Object.assign(t, s);

            } else if (t.tipo === 'INICIAL' && t.ncuota > e) {
                s = {
                    id2: t.id,
                    ncuota2: t.ncuota,
                    fecha2: t.fechs,
                    cuota2: t.cuota,
                    estado2: t.estado
                };
                return Object.assign(y[t.ncuota - e], s);

            } else if (t.tipo === 'INICIAL') {
                y.push(t)
                if (v !== e && t.ncuota === e) {
                    h = {
                        id2: '',
                        ncuota2: '',
                        fecha2: '',
                        cuota2: '',
                        estado2: ''
                    }
                    return Object.assign(y[e], h)
                }
            }
            if (t.tipo === 'FINANCIACION' && p < 3) {
                s = {
                    id2: '',
                    ncuota2: '',
                    fecha2: '',
                    cuota2: '',
                    estado2: ''
                }
                return Object.assign(t, s);

            } else if (t.tipo === 'FINANCIACION' && t.ncuota > u) {
                s = {
                    id2: t.id,
                    ncuota2: t.ncuota,
                    fecha2: t.fechs,
                    cuota2: t.cuota,
                    estado2: t.estado
                }
                return Object.assign(o[t.ncuota - u], s);

            } else if (t.tipo === 'FINANCIACION') {
                o.push(t)
                if (m !== u && t.ncuota === u) {
                    h = {
                        id2: '',
                        ncuota2: '',
                        fecha2: '',
                        cuota2: '',
                        estado2: ''
                    }
                    return Object.assign(o[u], h)
                }
            }
        })
    //console.log(w.filter(Boolean))
    respuesta = { "data": w.filter(Boolean) };
    res.send(respuesta);
})
//////////////* REPORTES *//////////////////////////////////
router.get('/reportes', isLoggedIn, (req, res) => {
    res.render('links/reportes');
});
var CODE = null;
router.post('/anular', isLoggedIn, async (req, res) => {
    const { id, lote, proyecto, mz, n, estado, nombre, movil, documento,
        fullname, cel, idc, qhacer, causa, motivo, asesor } = req.body
    var bonoanular = null;
    if (estado == 1) {
        return res.send(false)
    }
    const u = await pool.query(`SELECT * FROM solicitudes WHERE stado = 3 AND concepto IN('PAGO', 'ABONO') AND lt = ${lote}`);
    if (u.length > 0) {
        req.flash('error', 'Esta orden aun tiene un pago indefinido, defina el estado del pago primero para continuar con la aunulacion');
        res.redirect('/links/reportes');
    } else {
        const r = await pool.query(`SELECT SUM(s.monto) AS monto1, p.separar, l.valor, p.ahorro,
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto, p.status, COUNT(s.monto) pagos
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id INNER JOIN preventa p ON s.lt = p.lote 
        INNER JOIN productosd l ON s.lt = l.id WHERE s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL 
        AND s.stado = 4 AND s.lt = ${lote} GROUP BY p.status, p.separar, l.valor, p.ahorro`);
        const l = r[0].monto1 || 0,
            k = r[0].monto || 0,
            t = r[0];
        const acumulado = l + k;

        if (qhacer === 'BONO' && acumulado > 0) {
            var pin = ID(5);
            const bono = {
                pin, descuento: 0, producto: id, estado: 9, clients: idc,
                tip: qhacer, monto: acumulado, motivo, concept: causa
            }
            const a = await pool.query('INSERT INTO cupones SET ? ', bono);
            bonoanular = a.insertId;
            var nombr = nombre.split(" ")[0],
                fullnam = fullname.split(" ")[0],
                body = `_*${nombr}* se te genero un *BONO de Dto. ${pin}* por un valor de *$${Moneda(acumulado)}* para que lo uses en uno de nuestros productos._\n_Comunicate ahora con tu asesor a cargo *${fullname}* su movil es *${cel}* y preguntale por el producto de tu interes._\n\n_*GRUPO ELITE FICA RAÍZ*_`,
                body2 = `_*${fullnam}* se genero un *BONO* para el cliente *${nombre}* por consepto de *${causa} - ${motivo}*_\n\n_*GRUPO ELITE FICA RAÍZ*_`;
            EnviarWTSAP(movil, body)
            EnviarWTSAP(cel, body2)

        } else if (qhacer === 'DEVOLUCION' && acumulado > 0) {
            const porciento = t.status == 2 || t == 3 ? 0.20 : 1;
            const total = porciento < 1 ? (t.valor - t.ahorro) * porciento : t.separar;
            const monto = acumulado;
            const facturasvenc = t.pagos;
            const fech = moment(new Date()).format('YYYY-MM-DD');
            bonoanular = null;
            const devolucion = {
                fech, monto, concepto: qhacer, stado: 3, descp: causa, orden: id, asesor,
                porciento, total, lt: lote, retefuente: 0, facturasvenc, recibo: 'NO APLICA',
                reteica: 0, pagar: Math.round(monto - total), formap: porciento < 1 ? 'JARRA-TOTAL' : 'JARRA-SEPARACION'
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, devolucion);
        }
        const sql = `UPDATE cuotas c  
        INNER JOIN preventa p ON c.separacion = p.id
        INNER JOIN productosd l ON p.lote = l.id 
        INNER JOIN productos d ON l.producto  = d.id
        LEFT JOIN solicitudes s ON s.lt = l.id
        LEFT JOIN cupones cp ON p.cupon = cp.id 
        SET s.stado = 6, c.estado = 6, l.estado = 9, 
        l.valor = CASE WHEN d.valmtr2 > 0 THEN d.valmtr2 * l.mtr2 ELSE l.mtr * l.mtr2 END,
        l.inicial = CASE WHEN d.valmtr2 > 0 THEN (d.valmtr2 * l.mtr2) * d.porcentage / 100 
        ELSE (l.mtr * l.mtr2) * d.porcentage / 100 END, cp.estado = 6, p.tipobsevacion = 'ANULADA', 
        l.uno = NULL, l.dos = NULL, l.tres = NULL, l.directa = NULL,
        ${bonoanular ? 's.bonoanular = ' + bonoanular + ',' : ''} p.descrip = '${causa} - ${motivo}', 
        s.orden = p.id WHERE l.id = ? AND s.concepto != 'DEVOLUCION'`; console.log(sql)
        await pool.query(sql, lote);
        res.send(true);
    }
    //respuesta = { "data": ventas };
});
router.post('/reportes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id == 'table2') {

        d = req.user.admin > 0 ? `WHERE p.tipobsevacion IS NULL` : `WHERE p.tipobsevacion IS NULL AND p.asesor = ?`;

        sql = `SELECT p.id, pd.id lote, pt.proyect proyecto, pd.mz, pd.n, c.imags, p.promesa, p.status, p.asesor,
            pd.estado, c.idc, c.nombre, c.movil, c.documento, u.fullname, u.cel, p.fecha, p.autoriza, p.obsevacion,
            CASE WHEN e.estado = 6 AND e.tip = 'CUPON' THEN 1 ELSE 0 END kupn FROM preventa p INNER JOIN productosd pd 
            ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id INNER JOIN clientes c ON p.cliente = c.idc 
            INNER JOIN users u ON p.asesor = u.id LEFT JOIN cupones e ON p.id = e.producto ${d}`

        const ventas = await pool.query(sql, req.user.id);
        respuesta = { "data": ventas };
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

        sql = `SELECT pd.valor - p.ahorro AS total, pt.proyect,
        SUM(s.monto) + SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) 
        AS montos, p.ahorro, pd.mz, pd.n, pd.mtr2, pd.valor, pd.inicial, p.vrmt2, p.fecha,
        cu.descuento, c.nombre FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id 
        INNER JOIN productos pt ON pd.producto = pt.id LEFT JOIN cupones cu ON cu.id = p.cupon 
        INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id 
        INNER JOIN solicitudes s ON pd.id = s.lt LEFT JOIN cupones cp ON s.bono = cp.id
        WHERE s.stado = 4 AND s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL
        GROUP BY p.id`

        const solicitudes = await pool.query(sql);
        respuesta = { "data": solicitudes };
        res.send(respuesta);

    } else if (id == 'estadosc2') {
        d = req.user.admin > 0 ? `` : `AND p.asesor = ?`;

        /*sql = `SELECT pd.valor - p.ahorro AS total, pt.proyect, cu.pin AS cupon, cp.pin AS bono, 
        p.ahorro, pd.mz, pd.n, pd.valor, p.vrmt2, p.fecha, s.fech, s.ids, s.formap, s.descp, s.monto,
        cu.descuento, c.nombre, cp.monto mtb FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN productos pt ON pd.producto = pt.id INNER JOIN preventa p ON pd.id = p.lote 
        LEFT JOIN cupones cu ON cu.id = p.cupon LEFT JOIN cupones cp ON s.bono = cp.id
        INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id 
        WHERE s.stado = 4 AND s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL ${d}`*/

        sql = `SELECT pd.valor - p.ahorro AS total, pt.proyect, cu.pin AS cupon, cp.pin AS bono, 
        p.ahorro, pd.mz, pd.n, pd.valor, p.vrmt2, p.fecha, s.fech, s.ids, s.formap, s.descp, 
        s.monto, s.img, cu.descuento, c.nombre, cp.monto mtb, r.id, r.date, r.formapg, r.rcb, 
        r.monto mounto, r.observacion, r.baucher, r.bono bonus FROM solicitudes s 
        LEFT JOIN recibos r ON s.ids = r.registro INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN productos pt ON pd.producto = pt.id INNER JOIN preventa p ON pd.id = p.lote 
        LEFT JOIN cupones cu ON cu.id = p.cupon LEFT JOIN cupones cp ON s.bono = cp.id
        INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id 
        WHERE s.stado = 4 AND s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL ${d}`
        const solicitudes = await pool.query(sql, req.user.id);
        respuesta = { "data": solicitudes };

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
        await pool.query(`UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
            [{ 'l.estado': R.std }, k]
        );
        const i = await pool.query(`SELECT pd.estado, p.lote, p.id, pd.n, pd.mz, pl.proyect 
        FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id 
        INNER JOIN productos pl ON pd.producto = pl.id 
        WHERE pd.estado != 9 AND p.id = ?`, k);

        if (i[0].estado !== 1) {
            var D = () => {
                var imagenes = U.img === null ? '' : U.img.indexOf(",") > 0 ? U.img.split(",") : U.img
                if (Array.isArray(imagenes)) {
                    imagenes.map((e) => {
                        Eli(e);
                    })
                } else {
                    Eli(imagenes);
                };
            };
            const u = await pool.query(`SELECT * FROM preventa p INNER JOIN productosd l ON p.lote = l.id 
            INNER JOIN productos pl ON l.producto = pl.id LEFT JOIN solicitudes s ON l.id = s.lt WHERE s.stado != 6 AND p.id = ?`, k);
            if (!CODE) {
                CODE = ID(7);
                var mensaje = `_*${req.user.fullname}* intenta eliminar la orden de separacion *${k}* la cual corresponde al LT: *${u[0].n}* ${u[0].mz === 'no' ? 'DE' : 'MZ: *' + u[0].mz + '* DE'} *${u[0].proyect}*_\n\n`;
                var concept = '';
                u.map((x) => {
                    if (x.concepto) {
                        concept += `_MONTO: *$${Moneda(x.monto)}* CONCEPTO: *${x.concepto}*,_\n`
                    }
                })
                mensaje += concept ? `_Estas son las solicitudes que se veran afectadas si se elimina esta orden_\n${concept}\n` : '';
                mensaje += `_Codigo de autorizacion para la eliminacion total de la orden y todo aquello que incluya *${CODE}*_`;
                await EnviarWTSAP('57 3002851046', mensaje);
                res.send({ r: false, m: 'Codigo enviado' });

            } else if (CODE === code.toUpperCase()) {
                CODE = null;
                await pool.query(`UPDATE productosd l
                INNER JOIN productos p ON l.producto  = p.id 
                SET l.estado = 9, l.valor = if (p.valmtr2 != 0, p.valmtr2 * l.mtr2, l.mtr * l.mtr2),
                l.inicial = if (p.valmtr2 != 0, (p.valmtr2 * l.mtr2) * p.porcentage / 100, (l.mtr * l.mtr2) * p.porcentage / 100),
                l.uno = NULL, l.dos = NULL, l.tres = NULL, l.directa = NULL WHERE l.id = ?`, u[0].lote);

                await pool.query(`DELETE p, s FROM preventa p LEFT JOIN solicitudes s ON s.lt = p.lote WHERE p.id = ?`, k);
                await EnviarWTSAP('57 3002851046', `Orden de separacion *${k}* eliminada correctamente`);
                res.send({ r: true, m: 'El reporte fue eliminado de manera exitosa' });
            } else {
                res.send({ r: false, m: `Codigo de autorizacion invalido` });
            }
        } else {
            await pool.query(`UPDATE productosd l
            INNER JOIN productos p ON l.producto  = p.id 
            SET l.estado = 9, l.valor = if (p.valmtr2 != 0, p.valmtr2 * l.mtr2, l.mtr * l.mtr2),
            l.inicial = if (p.valmtr2 != 0, (p.valmtr2 * l.mtr2) * p.porcentage / 100, (l.mtr * l.mtr2) * p.porcentage / 100),
            l.uno = NULL, l.dos = NULL, l.tres = NULL, l.directa = NULL WHERE l.id = ?`, i[0].lote);

            await pool.query(`DELETE p, s FROM preventa p LEFT JOIN solicitudes s ON s.lt = p.lote WHERE p.id = ?`, k);
            await EnviarWTSAP('57 3002851046', `_*${req.user.fullname}* elimino el LT: *${i[0].n}* ${i[0].mz === 'no' ? 'DE' : 'MZ: *' + i[0].mz + '* DE'} ${i[0].proyect}_`);
            res.send({ r: true, m: 'El reporte fue eliminado de manera exitosa' });
        }

    } else if (id === 'proyectos') {
        sql = `SELECT DISTINCT pt.proyect FROM preventa p 
        INNER JOIN productosd pd ON p.lote = pd.id 
        INNER JOIN productos pt ON pd.producto = pt.id`
        const proyectos = await pool.query(sql);
        res.send(proyectos);
    } else if (id === 'verificar') {
        const { k, h } = req.body;
        const r = await Estados(k);
        var estado = r.pendients ? 8 : r.std
        await pool.query(`UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
        SET ? WHERE p.id = ?`, [{ 'l.estado': estado }, k]
        );
        res.send(true);

    } else if (id === 'restkupon') {
        const { k } = req.body;
        await RestablecerCupon(k)
        const r = await Estados(k);
        var estado = r.pendients ? 8 : r.std
        await pool.query(`UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
        SET ? WHERE p.id = ?`, [{ 'l.estado': estado }, k]);
        res.send(true);

    } else if (id === 'proyeccion') {
        const { k, h } = req.body;
        await ProyeccionPagos(k)
        const r = await Estados(k);
        var estado = r.pendients ? 8 : r.std
        await pool.query(`UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
        SET ? WHERE p.id = ?`, [{ 'l.estado': estado }, k]);
        res.send(true);

    } else if (id === 'estadopromesas') {
        const { k, h, f } = req.body;
        //h = parseFloat(h);
        sql = `SELECT * FROM preventa p
        INNER JOIN productosd l ON p.lote = l.id 
        INNER JOIN clientes c ON p.cliente = c.idc 
        INNER JOIN users u ON p.asesor = u.id WHERE p.id = ?`
        const pers = await pool.query(sql, k);
        const p = pers[0];
        if (!p.directa || h >= 2) {
            await pool.query(`UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id SET ? WHERE p.id = ?`,
                [{
                    'p.status': h,
                    'p.promesa': h,
                    'p.autoriza': req.user.fullname,
                    'l.fechar': h == 2 && !p.directa ? f : p.fechar
                }, k]
            );
            if (h == 1) {
                var bod = `_*${p.nombre}*. RED ELITE a generado tu *PROMESA DE COMPRA VENTA* la cual te sera enviada al correo *${p.email}* una ves la halla autenticado dirijase a una de nuestras oficinas con el documento_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
                var bo = `_*${p.fullname.split(' ')[0]}* se a generado la *PROMESA DE COMPRA VENTA* de *${p.nombre}*. *MZ ${p.mz} LT ${p.n}* la cual le sera enviada al correo *${p.email}*, se recomienda realizar seguimiento al cliente para que haga la autenticacion en el menor tiempo posible_\n\n*_GRUPO ELITE FINCA RAÍZ_*`;
                await EnviarWTSAP(p.movil, bod);
                await EnviarWTSAP(p.cel, bo);
            } else if (h > 1) {
                const r = await Estados(k);
                var estado = r.pendients ? 8 : r.std
                await pool.query(`UPDATE preventa p INNER JOIN productosd l ON p.lote = l.id 
                    SET ? WHERE p.id = ?`, [{ 'l.estado': estado }, k]
                );
            }
            res.send(true);
        } else {
            res.send(false);
        }
    } else if (id === 'cartera') {
        const { k, h } = req.body;
        var f = k ? `AND p.id = ${k}` : ''
        sql = `SELECT p.id, pd.id lote, pt.proyect proyecto, pd.mz, pd.n, c.imags, p.promesa, p.status,   
            pd.estado, c.idc, c.nombre, c.movil, c.documento, u.fullname, u.cel, p.fecha, p.autoriza, 
            t.estado std, t.tipo, t.ncuota, t.fechs, t.cuota, t.abono, t.mora, t.id idcuota
            FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id INNER JOIN cuotas t ON t.separacion = p.id WHERE p.tipobsevacion IS NULL 
            AND t.estado IN(3,5) AND t.fechs < '${h}' ${f}`
        const cuotas = await pool.query(sql);
        respuesta = { "data": cuotas };
        res.send(respuesta);
    } else if (id === 'comision') {
        const solicitudes = await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, c.idc i,
        s.descp, c.bank, c.documento docu, s.porciento, s.total, u.id idu, u.fullname nam, u.cel clu, 
        u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar, c.tipocta, us.id, us.fullname,
        cl.nombre, c.numerocuenta, p.proyect FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users us ON pr.asesor = us.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc INNER JOIN clientes c ON u.cli = c.idc 
        WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'BONO EXTRA')
        AND pr.tipobsevacion IS NULL ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`); //${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id} 

        respuesta = { "data": solicitudes };
        res.send(respuesta);
    } else if (id === 'comisionOLD') {
        if (req.user.admin == 1) {
            const solicitudes = await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, c.idc i,
        s.descp, c.bank, c.documento docu, s.porciento, s.total, u.id idu, u.fullname nam, u.cel clu, 
        u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar, c.tipocta, us.id, us.fullname,
        cl.nombre, c.numerocuenta, p.proyect FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN users u ON s.asesor = u.id  LEFT JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id LEFT JOIN users us ON pr.asesor = us.id 
        LEFT JOIN clientes cl ON pr.cliente = cl.idc INNER JOIN clientes c ON u.cli = c.idc 
        WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONOS', 'BONO EXTRA') AND pd.estado IN(9, 15)`); //${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id} 

            respuesta = { "data": solicitudes };
            res.send(respuesta);
        }
    } else if (id === 'bank') {
        const { banco, cta, idbank, numero } = req.body;
        await pool.query(`UPDATE clientes SET ? WHERE idc = ?`, [{ bank: banco, tipocta: cta, numerocuenta: numero }, idbank]);
        //console.log(req.body)
        res.send(true);
    } else if (id === 'std') {
        const { ids, std } = req.body;
        console.log(ids, std)
        await pool.query(`UPDATE solicitudes SET ? WHERE ids = ?`, [{ stado: std }, ids]);
        res.send(true);
    } else if (id === 'registrarcb') {
        const { img, id, nrecibo, montos, feh, formap, observacion, j } = req.body; console.log(req.body, j)
        if (j) {
            const rcb = { date: feh, formapg: formap, rcb: nrecibo, monto: montos.replace(/\./g, ''), observacion, baucher: img }
            await pool.query(`UPDATE recibos SET ? WHERE id = ?`, [rcb, j]);
        } else {
            var sql1 = 'INSERT INTO cupones (pin, descuento, estado, tip, monto, motivo, concept) VALUES ';
            var sql2 = 'INSERT INTO recibos (registro, date, formapg, rcb, monto, observacion, baucher) VALUES ';
            var sql3 = '';
            id.map((x, i) => {
                if (formap[i].indexOf('BONO') === 0) {
                    sql3 += `('${nrecibo[i]}', 0, 14, 'BONO', ${montos[i].replace(/\./g, '')}, '${observacion[i]}', '${formap[i]}'),`;
                    sql2 += `(${x}, '${feh[i]}', '${formap[i]}', '${nrecibo[i]}', ${montos[i].replace(/\./g, '')}, '${observacion[i]}', '/img/bonos.png'),`;
                } else {
                    sql2 += `(${x}, '${feh[i]}', '${formap[i]}', '${nrecibo[i]}', ${montos[i].replace(/\./g, '')}, '${observacion[i]}', '${img[i]}'),`;
                }
            });

            //console.log(req.body, sql1 + sql3, sql2)
            sql3 ? await pool.query(sql1 + sql3.slice(0, -1)) : '';
            await pool.query(sql2.slice(0, -1));
        }
        res.send(true);
    } else if (id === 'fechas') {
        const { id, fecha } = req.body; console.log(req.body)
        const date = { fecha };
        await pool.query(`UPDATE preventa SET ? WHERE id = ?`, [date, id]);
        res.send(true);
    }
});
router.post('/std/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id === 'bank') {

    } else if (id === 'bank') {
        res.send(true);
    }
})
//////////////* SOLICITUDES || CONSULTAS *//////////////////////////////////
router.get('/solicitudes', isLoggedIn, (req, res) => {
    res.render('links/solicitudes');
});
router.post('/solicitudes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id === 'pago') {
        /*const u = await pool.query(`SELECT lt, fech FROM solicitudes WHERE concepto IN('PAGO', 'ABONO')`);
        for (x = 0; x < u.length; x++) {
            const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
            SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
            FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
            WHERE s.concepto IN('PAGO', 'ABONO') AND s.lt = ? AND s.fech < ?`, [u[x].lt, u[x].fech]);
            var l = r[0].monto1 || 0,
                k = r[0].monto || 0;
            var total = l + k;
            await pool.query('UPDATE solicitudes SET ? WHERE lt = ? AND fech = ?', [{ acumulado: total }, u[x].lt, u[x].fech]);
        }*/
        var n = req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id;
        /*const so = await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, s.img, pd.valor,
        pr.ahorro, cl.email, s.facturasvenc, cp.producto, s.pdf, s.acumulado, u.fullname, s.aprueba,
        cl.documento, cl.idc, cl.movil, cl.nombre, s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, u.cel, 
        pd.n, s.stado, cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto, pd.id,
        s.ids, s.descp, pr.id cparacion FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id 
        INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON pr.lote = pd.id
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc LEFT JOIN cupones cp ON s.bono = cp.id
        WHERE s.concepto IN ('PAGO','ABONO') ${n}`); // AND pr.tipobsevacion IS NULL*/
        //console.log(so)
        const so = await pool.query(`SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, s.img, pd.valor, cpb.monto montoa,
        pr.ahorro, cl.email, s.facturasvenc, cp.producto, s.pdf, s.acumulado, u.fullname, s.aprueba, pr.descrip, cpb.producto ordenanu, 
        cl.documento, cl.idc, cl.movil, cl.nombre, s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, u.cel, pr.tipobsevacion,
        pd.n, s.stado, cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto, pd.id, pr.lote,
        s.ids, s.descp, pr.id cparacion, pd.estado, s.bonoanular FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id 
        INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON pr.lote = pd.id
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc LEFT JOIN cupones cp ON s.bono = cp.id 
        LEFT JOIN cupones cpb ON s.bonoanular = cpb.id WHERE s.concepto IN ('PAGO','ABONO') ${n} ORDER BY s.ids`); // AND (pd.estado IN(9, 15) OR pr.tipobsevacion IS NOT NULL)
        respuesta = { "data": so };
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
        respuesta = { "data": so }; //console.log(respuesta);
        res.send(respuesta);

    } else if (id === 'devoluciones') {
        const solicitudes = await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, 
        s.stado, s.formap, s.facturasvenc, s.descp, s.porciento, s.total, u.fullname, s.orden,
        l.mz, l.n, s.pagar, c.movil, c.email, p.descrip, c.nombre, d.proyect FROM solicitudes s 
        INNER JOIN productosd l ON s.lt = l.id INNER JOIN users u ON s.asesor = u.id  
        INNER JOIN preventa p ON s.orden = p.id INNER JOIN productos d ON l.producto = d.id 
        INNER JOIN clientes c ON p.cliente = c.idc WHERE s.concepto = 'DEVOLUCION' 
        ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`);
        respuesta = { "data": solicitudes }; //console.log(solicitudes)
        res.send(respuesta);
    } else if (id === 'comision') {
        const solicitudes = await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, s.descp, s.porciento, pg.stads, s.cuentadecobro,
        s.total, u.id idu, u.fullname nam, u.cel clu, u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar, pg.deuda, pg.cuentacobro,
        pg.fechas, pg.descuentos, us.id, us.fullname, cl.nombre, p.proyect FROM pagos pg INNER JOIN solicitudes s ON s.cuentadecobro = pg.id
        INNER JOIN productosd pd ON s.lt = pd.id INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users us ON pr.asesor = us.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc WHERE s.concepto IN('COMISION DIRECTA','COMISION INDIRECTA', 'BONO EXTRA')  
        AND pr.tipobsevacion IS NULL AND s.cuentadecobro IS NOT NULL ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`);//AND stado = 3
        respuesta = { "data": solicitudes }; //console.log(solicitudes)
        res.send(respuesta);
    } else if (id === 'bono') {
        const solicitudes = await pool.query(`SELECT * FROM solicitudes s  
        INNER JOIN users u ON s.asesor = u.id WHERE s.concepto = 'BONO'
        ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`);
        respuesta = { "data": solicitudes };
        //console.log(solicitudes)
        res.send(respuesta);
    } else if (id === 'saldo') {
        const { lote, solicitud, fecha } = req.body;
        const u = await pool.query(`SELECT * FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') 
        AND lt = ${lote} AND stado = 3 AND TIMESTAMP(fech) < '${fecha}' AND ids != ${solicitud}`);
        //console.log(u)
        if (u.length > 0) {
            return res.send(false);
        }
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
            var pdf = '/uploads/' + req.files[0].filename;  //'https://grupoelitered.com.co/uploads/' + 
            await pool.query(`UPDATE pagos SET ? WHERE id = ?`, [{ cuentacobro: pdf }, ID]);
            res.send(true);
        } else {
            var cuenta = {
                acredor: usuario, deuda: total, fechas, descuentos//, cuentacobro: pdf
            }
            var ctas = await pool.query(`INSERT INTO pagos SET ?`, cuenta);
            await pool.query(`UPDATE solicitudes SET ? WHERE ids IN(${solicitudes})`, { cuentadecobro: ctas.insertId, stado: 3 });
            console.log(ctas.insertId)
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
        if (req.user.admin != 1) {
            return res.send(false);
        };
        const solicitudes = await pool.query(`SELECT e.*, s.ids, s.fech, s.monto, s.concepto, cl.nombre, p.proyect, pd.mz, pd.n, s.excdnt, x.xtrabank, x.pagos
        FROM extrabanco e LEFT JOIN extratos x ON x.xtrabank = e.id LEFT JOIN solicitudes s ON x.pagos = s.ids LEFT JOIN productosd pd ON s.lt = pd.id 
        LEFT JOIN preventa pr ON pr.lote = pd.id LEFT JOIN productos p ON pd.producto = p.id LEFT JOIN clientes cl ON pr.cliente = cl.idc`);
        //console.log(solicitudes)
        respuesta = { "data": solicitudes };
        res.send(respuesta);
    } else if (id == 'rcbcc') {
        if (req.user.admin != 1) {
            return res.send(false);
        };
        const { ids, montorcb, recibos } = req.body;
        var t = {
            rcbs: '/uploads/' + req.files[0].filename, stads: 4, rbc: recibos, monto: montorcb
        }
        await pool.query('UPDATE pagos p INNER JOIN solicitudes s ON p.id = s.cuentadecobro SET ? WHERE p.id = ?',
            [
                {
                    'p.rcbs': '/uploads/' + req.files[0].filename, 'p.stads': 4,
                    'p.rbc': recibos, 'p.monto': montorcb, 's.stado': 4
                }, ids
            ]
        );
        res.send(true);
    }
});
router.put('/solicitudes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (req.user.admin != 1) {
        return res.send(false);
    };
    //console.log(req.body, req.files)
    //return res.send(true);
    if (id === 'Declinar') {
        const { ids, img, por, cel, fullname, mz, n, proyect, nombre } = req.body
        const r = await Estados(null, null, ids);

        await pool.query(`UPDATE solicitudes s 
            LEFT JOIN cuotas c ON s.pago = c.id 
            LEFT JOIN cupones cp ON s.bono = cp.id
            INNER JOIN productosd l ON s.lt = l.id SET ? WHERE s.ids = ?`,
            [{ 'l.estado': r.std, 'c.estado': 3, 'cp.producto': null, 'cp.estado': 9 }, ids]
        );

        await pool.query(`DELETE FROM solicitudes WHERE ids = ?`, ids);

        var imagenes = img.indexOf(",") > 0 ? img.split(",") : img
        if (Array.isArray(imagenes)) {
            imagenes.map((e) => {
                Eli(e);
            })
        } else {
            Eli(imagenes);
        }
        if (cel) {
            //console.log(cel)
            var body = `_*${fullname.split(" ")[0]}*_\n_Solicitud de pago *RECHAZADA*_\n_Proyecto *${proyect}*_\n_Manzana *${mz}* Lote *${n}*_\n_Cliente *${nombre}*_\n\n_*DESCRIPCIÓN*:_\n_${por}_\n\n_*GRUPO ELITE FICA RAÍZ*_`;
            var sm = `${fullname.split(",")[0]} tu solicitud de pago fue RECHAZADA MZ${mz} LT${n} ${por}`;
            await EnviarWTSAP(cel, body, sm);
        }
        res.send(true);

    } else if (id === 'Enviar') {

        const { ids, movil, nombre, pdef } = req.body;
        var pdf = '';
        if (!req.files[0]) {
            pdf = pdef;
        } else {
            pdf = 'https://grupoelitered.com.co/uploads/' + req.files[0].filename;
            await pool.query('UPDATE solicitudes SET ? WHERE ids = ?', [{ pdf }, ids]);
        }
        //console.log(pdf)
        var bod = `_*${nombre}*. Hemos procesado tu *PAGO* de manera exitoza. Adjuntamos recibo de pago *#${ids}*_\n\n*_GRUPO ELITE FINCA RAÍZ_*\n\n${pdf}`;
        await EnviarWTSAP(movil, bod);
        await EnvWTSAP_FILE(movil, pdf, 'RECIBO DE CAJA ' + ids, 'PAGO EXITOSO');
        res.send(true);

    } else if (id === 'Asociar') {

        const { ids, acumulado, extr } = req.body
        let valu = [];
        extr.split(',').map((x) => {
            valu.push([x, ids])
        })
        await pool.query("INSERT INTO extratos (xtrabank, pagos) VALUES ?", [valu])
        res.send(true);

    } else if (id === 'Desasociar') {
        const { ids, extr } = req.body
        //console.log(extr)
        await pool.query(`DELETE FROM extratos WHERE xtrabank IN(${extr}) AND pagos = ${ids}`);
        res.send(true);

    } else {
        const { ids, acumulado, extr } = req.body
        let valu = [];
        extr.split(',').map((x) => {
            valu.push([x, ids])
        })
        const pdf = 'https://grupoelitered.com.co/uploads/' + req.files[0].filename;
        const R = await PagosAbonos(ids, pdf, req.user.fullname);
        if (R) {
            //await pool.query("INSERT INTO extratos (xtrabank, pagos) VALUES ?", [valu])
            await pool.query('UPDATE solicitudes SET ? WHERE ids = ?', [{ acumulado }, ids]);
        }
        res.send(R);
        //res.send(true);
    }
});
/////////////////////////* AFILIACION *////////////////////////////////////////
router.post('/afiliado', async (req, res) => {
    const { movil, cajero } = req.body;
    var pin = ID(13);
    var cel = movil.replace(/-/g, "");
    var boidy = `*_¡ Felicidades !_* \n_ya eres parte de nuestro equipo_ *_ELITE_* _tu_ *ID* _es_ *_${pin}_* \n
    *_Registrarte_* _en:_\n*${req.headers.origin}/signup?id=${pin}* \n\n_¡ Si ya te registraste ! y lo que quieres es iniciar sesion ingresa a_ \n*${req.headers.origin}/signin* \n\nPara mas informacion puedes escribirnos al *3007753983* \n\n*Bienvenido a* *_GRUPO ELITE FINCA RAÍZ_* _El mejor equipo de emprendimiento empresarial del país_`

    const h = await pool.query('SELECT * FROM pines WHERE celular = ? ', cel);
    if (h.length > 0) {
        pin = h[0].id
        boidy = `*_¡ Felicidades !_* \n_ya eres parte de nuestro equipo_ *_ELITE_* _tu_ *ID* _es_ *_${pin}_* \n
                *_Registrarte_* _en:_\n*${req.headers.origin}/signup?id=${pin}* \n\n_¡ Si ya te registraste ! y lo que quieres es iniciar sesion ingresa a_ \n*${req.headers.origin}/signin* \n\nPara mas informacion puedes escribirnos al *3007753983* \n\n*Bienvenido a* *_GRUPO ELITE FINCA RAÍZ_* _El mejor equipo de emprendimiento empresarial del país_`

        if (h[0].acreedor !== null) {
            boidy = `*_¡ De nuevo !_* \n_Tu registro fue satisfactorio ya eres parte de nuestro equipo_ *_ELITE_* _tu_ *ID* _es_ *_${pin}_* \n\n_¡ Inicia Sesion ! ingresando a_ \n*${req.headers.origin}/signin*\n\n*Bienvenido a* *_GRUPO ELITE FINCA RAÍZ_* _El mejor equipo de emprendimiento empresarial del país_`
        }
    } else {
        const nuevoPin = {
            id: pin,
            categoria: 1,
            usuario: req.user.id,
            celular: cel
        }
        await pool.query('INSERT INTO pines SET ? ', nuevoPin);
    }
    EnviarWTSAP(movil, boidy,
        `Felicidades ya eres parte de nuestro equipo ELITE ingresa a https://grupoelitered.com.co/signup?id=${pin} y registrarte o canjeando este ID ${pin} de registro`
    )
    req.flash('success', 'Pin enviado satisfactoriamente, comuniquese con el afiliado para que se registre');
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
    let chars = "0A1B2C3D4E5F6G7H8I9J0KL1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z",
        code = "";
    for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
    };
    return code;
};
//Eli('uploads/3xcy-02nj3ptv8wt7r5-7235y48fk7ihmz.pdf');
function ID2(lon) {
    let chars = "1234567890",
        code = "";
    for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
    };
    return code;
};
async function usuario(id) {
    const usuario = await pool.query(`SELECT p.categoria, p.usuario FROM pines p WHERE p.acreedor = ? `, id);
    if (usuario.length > 0 && usuario[0].categoria == 2) {
        return usuario[0].usuario;
    } else {
        return id
    }
};
async function saldo(producto, rango, id, monto) {
    var operacion;
    if (!producto && monto) {
        operacion = monto;
    } else if (!producto && !monto) {
        return 'NO'
    } else {
        const produ = await pool.query(`SELECT precio, utilidad, stock FROM products WHERE id_producto = ?`, producto);
        const rang = await pool.query(`SELECT comision FROM rangos WHERE id = ?`, rango);
        operacion = produ[0].precio - (produ[0].utilidad * rang[0].comision / 100);
    }
    const saldo = await pool.query(`SELECT IF(saldoactual < ${operacion} OR saldoactual IS NULL,'NO','SI') Respuesta FROM users WHERE id = ? `, id);
    return saldo[0].Respuesta
};
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
};
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
async function RestablecerCupon(S) {

    const W = await pool.query(`SELECT c.id, p.numerocuotaspryecto, p.extraordinariameses, 
    p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.ahorro, p.fecha, p.obsevacion, p.cuot, c.separacion, c.tipo, c.ncuota, c.fechs, 
    c.proyeccion, c.cuota, c.estado, l.mtr2, e.id idcupon, e.descuento FROM preventa p 
    INNER JOIN cuotas c ON c.separacion = p.id INNER JOIN productosd l ON p.lote = l.id 
    INNER JOIN cupones e ON p.id = e.producto WHERE p.id = ? AND p.tipobsevacion IS NULL 
    AND e.tip = 'CUPON' ORDER BY TIMESTAMP(c.fechs) ASC`, S);


    const x = W[0];
    const separa = x.separar;
    const valor = Math.round(x.vrmt2 * x.mtr2);
    const ahorro = Math.round(valor * x.descuento / 100);
    const total = Math.round(valor - ahorro);
    const incl = Math.round((total * x.iniciar / 100) - separa)
    const inicial = Math.sign(incl) >= 0 ? incl : 0;
    const nini = x.inicialdiferida ? x.inicialdiferida : 0;
    const cuotaini = inicial ? Math.round(inicial / nini) : 0;
    const financiacion = Math.round(total - (inicial + separa));

    if (x.proyeccion > 0) {

        var Extra = 0, cont = 0;
        W.filter((c) => {
            return c.proyeccion !== x.cuot && c.tipo === 'FINANCIACION';
        }).map((c) => {
            Extra += c.proyeccion;
            cont++
        });

        const nfncn = x.numerocuotaspryecto - nini - cont;
        const cuotafncn = Math.round((financiacion - Extra) / nfncn);

        const r = await pool.query(`UPDATE cuotas c INNER JOIN preventa p ON p.id = c.separacion 
        INNER JOIN cupones u ON u.id = p.cupon SET u.estado = 14, p.cupon = ${x.idcupon}, 
        p.ahorro = ${ahorro}, p.cuot = ${cuotafncn}, c.proyeccion = CASE WHEN c.tipo = 'SEPARACION' 
        THEN ${separa} WHEN c.tipo = 'INICIAL' THEN ${cuotaini} WHEN c.tipo = 'FINANCIACION' 
        AND c.proyeccion = ${x.cuot} THEN ${cuotafncn} ELSE c.proyeccion END, c.cuota = CASE  
        WHEN c.tipo = 'SEPARACION' THEN ${separa} WHEN c.tipo = 'INICIAL' THEN ${cuotaini}
        WHEN c.tipo = 'FINANCIACION' AND c.proyeccion = ${x.cuot} THEN ${cuotafncn}
        ELSE c.proyeccion END WHERE c.separacion = ?`, S);
        if (r.affectedRows) {
            await ProyeccionPagos(S);
        }
        return r.affectedRows
    }
}
async function QuitarCupon(S) {

    const W = await pool.query(`SELECT c.id, p.numerocuotaspryecto, p.extraordinariameses,
    p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida,
    p.ahorro, p.fecha, p.obsevacion, p.cuot, c.separacion, c.tipo, c.ncuota, c.fechs, c.proyeccion,
    c.cuota, c.estado, l.mtr2 FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id
    INNER JOIN productosd l ON p.lote = l.id WHERE p.id = ? AND p.tipobsevacion IS NULL 
    ORDER BY TIMESTAMP(c.fechs) ASC`, S);

    const x = W[0];
    const separa = x.separar;
    const total = Math.round(x.vrmt2 * x.mtr2);
    const incl = Math.round((total * x.iniciar / 100) - separa)
    const inicial = Math.sign(incl) >= 0 ? incl : 0;
    const nini = x.inicialdiferida ? x.inicialdiferida : 0;
    const cuotaini = inicial ? Math.round(inicial / nini) : 0;
    const financiacion = Math.round(total - (inicial + separa));

    if (x.proyeccion > 0) {

        var Extra = 0, cont = 0;
        W.filter((c) => {
            return c.proyeccion !== x.cuot && c.tipo === 'FINANCIACION';
        }).map((c) => {
            Extra += c.proyeccion;
            cont++
        });

        const nfncn = x.numerocuotaspryecto - nini - cont;
        const cuotafncn = Math.round((financiacion - Extra) / nfncn);

        const r = await pool.query(`UPDATE cuotas c INNER JOIN preventa p ON p.id = c.separacion 
        INNER JOIN cupones u ON u.id = p.cupon SET u.estado = 6, p.cupon = 1, p.ahorro = 0, 
        p.cuot = ${cuotafncn}, c.proyeccion = CASE WHEN c.tipo = 'SEPARACION' THEN ${separa} 
        WHEN c.tipo = 'INICIAL' THEN ${cuotaini} WHEN c.tipo = 'FINANCIACION' 
        AND c.proyeccion = ${x.cuot} THEN ${cuotafncn} ELSE c.proyeccion END, c.cuota = CASE  
        WHEN c.tipo = 'SEPARACION' THEN ${separa} WHEN c.tipo = 'INICIAL' THEN ${cuotaini}
        WHEN c.tipo = 'FINANCIACION' AND c.proyeccion = ${x.cuot} THEN ${cuotafncn}
        ELSE c.proyeccion END WHERE c.separacion = ?`, S);
        if (r.affectedRows) {
            await ProyeccionPagos(S);
        }
        return r.affectedRows

    } else {
        const extraordinarias = Math.round(x.cuotaextraordinaria * x.extran);
        const cuotaordi = x.cuotaextraordinaria;
        const nfnc = x.numerocuotaspryecto - nini - x.extran;
        const cuotafnc = Math.round((financiacion - extraordinarias) / nfnc);
        const cf = x.extraordinariameses;
        mes6 = cuotafnc;
        mes12 = cuotafnc;

        if (cuotaordi) {
            cf == 1 ? mes6 = cuotaordi
                : cf == 2 ? mes12 = cuotaordi
                    : mes6 = cuotaordi, mes12 = cuotaordi;
        };

        const r = await pool.query(`UPDATE cuotas c INNER JOIN preventa p ON p.id = c.separacion 
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
        WHERE c.separacion = ?`, S);

        if (r.affectedRows) {
            await ProyeccionPagos(S);
        }
        return r.affectedRows
    };
}
async function ProyeccionPagos(S) {

    const Pagos = await pool.query(`SELECT SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, cp.monto, 0)) AS BONOS, 
    SUM(s.monto) AS MONTO, pr.asesor FROM solicitudes s INNER JOIN preventa pr ON s.lt = pr.lote INNER JOIN productosd pd ON s.lt = pd.id
    LEFT JOIN cupones cp ON s.bono = cp.id WHERE s.stado = 4 AND pr.tipobsevacion IS NULL AND s.concepto IN('PAGO', 'ABONO') AND pr.id = ?`, S);

    const W = await pool.query(`SELECT c.id, p.numerocuotaspryecto, p.extraordinariameses,
    p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida,
    p.ahorro, p.fecha, p.obsevacion, p.cuot, c.separacion, c.tipo, c.ncuota, c.fechs, c.proyeccion,
    c.cuota, c.estado, l.mtr2 FROM preventa p INNER JOIN cuotas c ON c.separacion = p.id
    INNER JOIN productosd l ON p.lote = l.id WHERE p.id = ? AND p.tipobsevacion IS NULL 
    ORDER BY TIMESTAMP(c.fechs) ASC`, S); // p.proyect DESC

    const x = W[0];
    const Pg = Pagos[0];
    const pagos = Pg.BONOS + Pg.MONTO; //console.log(pagos)
    const Cartera = x.obsevacion;
    const Proyeccion = x.proyeccion;
    const separa = x.separar;
    const total = Math.round((x.vrmt2 * x.mtr2) - x.ahorro);
    const inicial = Math.round((total * x.iniciar / 100) - x.separar);
    const financiacion = Math.round(total - (inicial + x.separar));

    if (Proyeccion > 0) {
        await pool.query(`UPDATE cuotas SET estado = 3, mora = 0, abono = 0, cuota = proyeccion WHERE separacion = ?`, S);
    } else if (Cartera !== 'CARTERA') {
        const extraordinarias = Math.round(x.cuotaextraordinaria * x.extran);
        const cuotaordi = x.cuotaextraordinaria;
        const nini = x.inicialdiferida ? x.inicialdiferida : 0;
        const nfnc = x.numerocuotaspryecto - nini - x.extran;
        const cuotaini = inicial ? Math.round(inicial / nini) : 0;
        const cuotafnc = Math.round((financiacion - extraordinarias) / nfnc);
        const cf = x.extraordinariameses;
        mes6 = cuotafnc;
        mes12 = cuotafnc;
        //console.log(x.inicialdiferida, nfnc, x.numerocuotaspryecto, x.extran, financiacion, extraordinarias, inicial, total, x.vrmt2, x.mtr2, x.ahorro)

        if (cuotaordi) {
            cf == 1 ? mes6 = cuotaordi
                : cf == 2 ? mes12 = cuotaordi
                    : mes6 = cuotaordi, mes12 = cuotaordi;
        };

        await pool.query(`UPDATE cuotas SET 
        estado = 3, mora = 0, abono = 0, cuota = CASE 
        WHEN tipo = 'SEPARACION' THEN ${separa} 
        WHEN tipo = 'INICIAL' THEN ${cuotaini}
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 6 THEN ${mes6}
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 12 THEN ${mes12}
        ELSE ${cuotafnc} END, proyeccion = CASE 
        WHEN tipo = 'SEPARACION' THEN ${separa} 
        WHEN tipo = 'INICIAL' THEN ${cuotaini}
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 6 THEN ${mes6}
        WHEN tipo = 'FINANCIACION' AND 
        MONTH(fechs) = 12 THEN ${mes12}
        ELSE ${cuotafnc} END 
        WHERE separacion = ?`, S);

    } else {
        var pagados = 0, nopagados = 0, cuotaa = 0, ID = '', proy = '', sql = 'UPDATE cuotas SET estado = 3, mora = 0, abono = 0, cuota = CASE id ';

        W.map((c) => {
            if (c.estado != 13) {
                nopagados += c.cuota;
            } else if (c.estado == 13) {
                pagados += c.cuota;
            }
        })
        var tol = pagados + nopagados;
        if (tol === total) {
            pool.query(`UPDATE cuotas SET estado = 3, mora = 0, abono = 0, proyeccion = cuota WHERE separacion = ?`, S);
        } else if (total > tol) {
            tol = total - tol;
            W.map((c) => {
                ID += c.id.toString() + ', ';
                if (!cuotaa && c.estado != 13) {
                    cuotaa = Math.round(tol + c.cuota);
                    sql += ' WHEN ' + c.id + ' THEN ' + cuotaa;
                    proy += ' WHEN ' + c.id + ' THEN ' + cuotaa;
                } else {
                    sql += ' WHEN ' + c.id + ' THEN ' + c.cuota;
                    proy += ' WHEN ' + c.id + ' THEN ' + c.cuota;
                }
            });
            //console.log(sql, tol, total, pagados, nopagados)
            ID = ID.slice(0, -2);
            sql += ' END, proyeccion = CASE id ' + proy + ' END WHERE id IN(' + ID + ')';
            await pool.query(sql);
        }
    }

    if (pagos > 0) {
        var sql = 'UPDATE cuotas SET estado = CASE id';
        var ID = '';
        var montocuotas = pagos;
        var cuotaa = '';

        W.map((c) => {
            if (montocuotas >= c.cuota) {
                ID += c.id.toString() + ', ';
                sql += ' WHEN ' + c.id + ' THEN ' + 13;
                montocuotas = montocuotas - c.cuota;
            } else if (montocuotas > 0) {
                montocuotas = c.cuota - montocuotas;
                ID += c.id.toString() + ', ';
                sql += ' WHEN ' + c.id + ' THEN ' + 3;
                cuotaa = ', cuota = CASE id WHEN ' + c.id + ' THEN ' + montocuotas + ' ELSE cuota END';
                montocuotas = 0;
            }
        })
        ID = ID.slice(0, -2);
        sql += ' END' + cuotaa + ' WHERE id IN(' + ID + ')';
        await pool.query(sql);
    }
}
async function Prueva(S) {
    /*const directas = await pool.query(`SELECT * FROM preventa p 
            INNER JOIN productosd l ON p.lote = l.id
            INNER JOIN productos o ON l.producto = o.id
            INNER JOIN users u ON p.asesor = u.id
            INNER JOIN clientes c ON p.cliente = c.idc
            WHERE l.estado IN(10, 13) 
            AND p.tipobsevacion IS NULL LIMIT 1`);*/
    const asesor = await pool.query(`SELECT u.*, r.venta, r.bono FROM users u 
        INNER JOIN rangos r ON u.nrango = r.id WHERE u.sucursal IS NULL LIMIT 1`);
    //console.log(asesor)
    //await pool.query(`UPDATE productosd SET ? WHERE estado IN(10, 13)`, { fechar: S, uno: null, dos: null, tres: null, directa: null });
    return asesor
}
async function Pa(S, fn) {
    var month = moment().subtract(S, 'month').format('YYYY-MM-DD HH:mm')
    var u = await fn(month)
    console.log(u)
}
//Pa(1, Prueva)
//SELECT * FROM `cuotas` WHERE `separacion` = 275 AND (`fechs` LIKE '%-12-%' OR `fechs` LIKE '%-06-%')
//Pa(2, Prueva);
//Desendentes('15', 10)

async function PagosAbonos(Tid, pdf, user) {
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
    var estados = 0, resp = true;
    const fech = moment(S.fechs).format('YYYY-MM-DD');
    const fech2 = moment(S.fech).format('YYYY-MM-DD HH:mm');
    const monto = S.bono && S.formap !== 'BONO' ? S.monto + S.mount : S.monto;
    //console.log(S, monto)
    if (S.stado === 4 || S.stado === 6) {
        Eli(pdf)
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
            Eli(pdf);
            return false;
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
                'l.estado': st.std, 's.pdf': pdf
            }, Tid
        ]
    );

    var bod = `_*${S.nombre}*. Hemos procesado tu *${S.concepto}* de manera exitosa. Recibo *${S.recibo}* Monto *${Moneda(monto)}* Adjuntamos recibo de pago *#${Tid}*_\n\n*_GRUPO ELITE FINCA RAÍZ_*\n\n${pdf}`;
    var smsj = `hemos procesado tu pago de manera exitosa Recibo: ${S.recibo} Bono ${S.bono} Monto: ${Moneda(monto)} Concepto: ${S.proyect} MZ ${S.mz} LOTE ${S.n}`

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
var normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnCc",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');
    }

})();
//Desendentes('97890290003800000154', 10)
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
                sqlUPDATE += sqlDIRECTA + ' END WHERE id IN(' + IDS + ')'; //console.log(sqlINSERT.slice(0, -1), sqlUPDATE)
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
                    /*var f = {
                        fech: hoy, monto, concepto: 'COMISION DIRECTA', stado: std, descp: 'VENTA DIRECTA',
                        asesor: j.acreedor, porciento: a.comision, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica)
                    }
                    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ directa: j.acreedor }, a.lote]);
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);*/
                    if (a.bonoextra > 0.0000) {
                        monto = val * a.bonoextra;
                        retefuente = monto * 0.10;
                        reteica = monto * 8 / 1000;
                        /*var g = {
                            fech: hoy, monto, concepto: 'BONO EXTRA', stado: std, descp: 'VENTA DIRECTA',
                            asesor: j.acreedor, porciento: a.bonoextra, total: val, lt: a.lote, retefuente,
                            reteica, pagar: monto - (retefuente + reteica)
                        }*/
                        //await pool.query(`INSERT INTO solicitudes SET ?`, g);
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
                        /*var f = {
                            fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: std, descp: 'PRIMERA LINEA',
                            asesor: j.acreedor, porciento: a.linea1, total: val, lt: a.lote, retefuente,
                            reteica, pagar: monto - (retefuente + reteica)
                        }
                        await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ uno: j.acreedor }, a.lote]);
                        await pool.query(`INSERT INTO solicitudes SET ?`, f);*/
                    }
                    if (a.mes === mes) {
                        cort += val;
                    }
                    repor1.push(a.nrango)
                    //return a.nrango
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
                            /*var f = {
                                fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: std, descp: 'SEGUNDA LINEA',
                                asesor: j.acreedor, porciento: a.linea2, total: val, lt: a.lote, retefuente,
                                reteica, pagar: monto - (retefuente + reteica)
                            }
                            await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ dos: j.acreedor }, a.lote]);
                            await pool.query(`INSERT INTO solicitudes SET ?`, f);*/
                        }
                        if (a.mes === mes) {
                            cort += val;
                        }
                        repor2.push(a.nrango)
                        //return a.nrango
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
                            /*var f = {
                                fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: std, descp: 'TERCERA LINEA',
                                asesor: j.acreedor, porciento: a.linea3, total: val, lt: a.lote, retefuente,
                                reteica, pagar: monto - (retefuente + reteica)
                            }
                            await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ tres: j.acreedor }, a.lote]);
                            await pool.query(`INSERT INTO solicitudes SET ?`, f);*/
                        }
                        if (a.mes === mes) {
                            cort += val;
                        }
                        repor3.push(a.nrango)
                        //return a.nrango
                    });
                    sqlTRES += ' END'
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
async function Eli(img) {
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
    valor = valor.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
    return valor;
}
async function EnviarWTSAP(movil, body, smsj, chatid, q) {
    var cel = 0;
    movil ? cel = movil.indexOf("-") > 0 ? '57' + movil.replace(/-/g, "") : movil.indexOf(" ") > 0 ? movil : '57' + movil : '';
    var options = {
        method: 'POST',
        url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
        form: {
            //phone: desarrollo ? '57 3012673944' : cel,
            body
        }
    };
    q ? options.form.quotedMsgId = q : '';
    chatid ? options.form.chatId = chatid : options.form.phone = cel; //'573012673944' //cel; //
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });
    smsj ? await sms(desarrollo ? '57 3012673944' : cel, smsj) : '';
}
function EnvWTSAP_FILE(movil, body, filename, caption) {
    //console.log(movil, body, filename, caption)
    var cel = movil.indexOf("-") > 0 ? '57' + movil.replace(/-/g, "") : movil.indexOf(" ") > 0 ? movil : '57' + movil;
    var options = {
        method: 'POST',
        url: 'https://eu89.chat-api.com/instance107218/sendFile?token=5jn3c5dxvcj27fm0',
        form: {
            phone: cel,
            body,           //`https://grupoelitered.com.co/uploads/0erdlw-york61mn26n46v141lap-gvk-ro.pdf`,
            filename,
            caption
        }
    };
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });
}
/*const SCOPES = ['https://www.googleapis.com/auth/contacts'];
const TOKEN_PATH = 'token.json';
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listConnectionNames);
});*/
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = Contactos;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris);

    // Comprueba si previamente hemos almacenado un token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Autorice esta aplicación visitando esta url: ', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Ingrese el código de esa página aquí: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Almacenar el token en el disco para posteriores ejecuciones del programa
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token almacenado en', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
function listConnectionNames(auth) {
    const service = google.people({ version: 'v1', auth });
    service.people.connections.list({
        resourceName: 'people/me',
        pageSize: 100,
        personFields: 'biographies,birthdays,coverPhotos,emailAddresses,events,genders,imClients,interests,locales,memberships,metadata,names,nicknames,occupations,organizations,phoneNumbers,photos,relations,residences,sipAddresses,skills,urls,userDefined'
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const connections = res.data.connections;
        if (connections) {
            console.log('Connections:');
            connections.forEach((person) => {
                if (person.names && person.names.length > 0) {
                    console.log(person.names);
                } else {
                    console.log('No display name found for connection.');
                }
            });
        } else {
            console.log('No connections found.');
        }
    });
}
module.exports = router;