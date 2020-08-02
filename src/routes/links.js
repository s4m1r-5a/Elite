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
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const moment = require('moment');
const nodemailer = require('nodemailer')
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
cron.schedule("50 23 * * *", async () => {
    await pool.query(`UPDATE productosd p INNER JOIN preventa pr ON p.id = pr.lote 
    SET p.estado = 9, p.tramitando = NULL, pr.cupon = NULL 
    WHERE MONTH(pr.fecha) = MONTH(NOW()) AND DAY(pr.fecha) < DAY(NOW()) AND p.estado = 1`);
    await pool.query(`DELETE c, p FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id     
    WHERE p.cupon IS NULL`)
});
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});
router.get('/prueba', async (req, res) => {
    res.send(true);
})
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
        const fila = await pool.query('SELECT * FROM productos WHERE id = ?', id);
        res.send(fila[0]);
    } else if (id === 'nuevo') {
        const { producto, mz, n, mtr2, estado, valor, inicial, descripcion } = req.body;
        console.log(req.body)
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
        const { id, mz, n, mtr2, estado, valor, inicial, descripcion } = req.body;
        d = {
            mz, n, mtr2, estado, valor: valor.replace(/\./g, ''),
            inicial: inicial.replace(/\./g, ''), descripcion
        }
        await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [d, id])
        res.send(true);
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
    SET pd.valor= pd.mtr2 * ${valor}, pd.inicial = (pd.mtr2 * ${valor}) * p.porcentage /100, p.valmtr2 = ${valor}, 
    p.valproyect = p.totalmtr2 * ${valor}  WHERE pd.producto = ${id} AND pd.estado = 9`)
    res.send(respuesta);
});
router.post('/actualiza', isLoggedIn, async (req, res) => {
    const { categoria, title, porcentage, totalmtr2, valmtr2, valproyect, mzs, cantidad, estado, separacion, incentivo, fecha,
        fechafin, socio, proveedor, documento, nombres, mercantil, fechaM, empresa, nit, banco, cta, numero, mail, direccion, tel, web } = req.body;

});
router.post('/regispro', isLoggedIn, async (req, res) => {
    const { categoria, title, porcentage, totalmtr2, valmtr2, valproyect, mzs, cantidad, estado, mz, n, mtr2, valor, inicial,
        separacion, incentivo, fecha, fechafin, socio, proveedor, documento, nombres, mercantil, fechaM, empresa, nit, banco,
        cta, numero, mail, direccion, tel, web, descripcion, editar } = req.body;
    //console.log(req.body)
    const produc = {
        categoria, proveedor, socio, proyect: title.toUpperCase(),
        porcentage, totalmtr2, valmtr2: valmtr2.length > 3 ? valmtr2.replace(/\./g, '') : valmtr2,
        valproyect, mzs: mzs ? mzs : 0, cantidad, estados: 7, fechaini: fecha, fechafin, separaciones: separacion.replace(/\./g, ''),
        incentivo: incentivo.length > 3 ? incentivo.replace(/\./g, '') : ''
    };
    if (proveedor == '0' || socio == '0') {
        const proveedr = {
            representante: null,
            matricula: mercantil,
            fecha: fechaM,
            empresa: empresa.toUpperCase(),
            nit, banco: banco.toUpperCase(),
            cta, numero,
            mail: mail.toLowerCase(),
            direccion, tel: tel.replace(/-/g, ""),
            web: web.toLowerCase()
        }
        const newclient = await pool.query('SELECT * FROM clientes WHERE documento = ?', documento);
        if (newclient.length > 0) {
            proveedr.representante = newclient[0].id
        } else {
            const cliente = {
                nombre: nombres.toUpperCase(),
                documento,
                movil: tel.replace(/-/g, ""),
                email: mail.toLowerCase(),
                direccion: direccion.toLowerCase()
            }
            const newcliente = await pool.query('INSERT INTO clientes SET ? ', cliente);
            proveedr.representante = newcliente.insertId
        }

        const newprovee = await pool.query('INSERT INTO proveedores SET ? ', proveedr);
        if (proveedor == '0') {
            produc.proveedor = newprovee.insertId
        } else if (socio == '0') {
            produc.socio = newprovee.insertId
        }
    }
    if (editar) {
        await pool.query(`UPDATE productos SET ? WHERE id = ?`, [produc, editar]);
        res.send(true);
    } else {
        const datos = await pool.query('INSERT INTO productos SET ? ', produc);
        var producdata = 'INSERT INTO productosd (producto, mz, n, mtr2, descripcion, estado, valor, inicial) VALUES ';
        await n.map((t, i) => {
            producdata += `(${datos.insertId}, '${mz ? mz[i].toUpperCase() : 'no'}', ${t}, ${mtr2[i]}, '${descripcion[i]}', ${estado[i] === undefined ? 15 : estado[i]}, ${valor[i]}, ${inicial[i]}),`;
        });
        await pool.query(producdata.slice(0, -1));
        req.flash('success', 'Producto registrado exitosamente');
        res.redirect('/links/productos');
    }
});
//////////////* RED *//////////////////////////////////
router.get('/red', isLoggedIn, (req, res) => {
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
        fechanacimiento, estadocivil, email, movil, direccion, asesors
    } = req.body;

    const clit = {
        nombre: nombres.toUpperCase(), documento: documento.replace(/\./g, ''), fechanacimiento,
        lugarexpedicion, fechaexpedicion, estadocivil, movil: movil.replace(/-/g, ""), agendado: 1,
        email: email.toLowerCase(), direccion: direccion.toLowerCase(), tipo,
        acsor: req.user.id, tiempo: ahora, google: ''
    }
    if (req.params.id === 'agregar') {
        const cliente = await pool.query(`SELECT * FROM clientes WHERE documento = ?`, documento);
        if (!cliente.length) {
            var person = {
                "resource": {
                    "names": [{ "familyName": nombres.toUpperCase() }],
                    "emailAddresses": [{ "value": email.toLowerCase() }],
                    "phoneNumbers": [{ "value": movil.replace(/-/g, ""), "type": "Personal" }],
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
                    cel: movil.replace(/-/g, ""), username: email.toLowerCase(), cli: ir.insertId
                }
                await pool.query('UPDATE users SET ? WHERE id = ?', [asr, req.user.id]);
            }
            res.send({ code: ir.insertId });

        } else if (cliente.length > 0 && asesors) {
            const asr = {
                fullname: nombres.toUpperCase(), document: documento,
                cel: movil.replace(/-/g, ""), username: email.toLowerCase(), cli: cliente[0].idc
            }
            await pool.query('UPDATE users SET ? WHERE id = ?', [asr, req.user.id]);
            res.send(true);
        }
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
router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});
router.post('/movil', async (req, res) => {
    const { movil } = req.body;
    const cliente = await pool.query('SELECT * FROM clientes WHERE movil = ?', movil);
    res.send(cliente);
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
        INNER JOIN productos pr ON pd.producto = pr.id WHERE p.cliente = ? OR p.cliente2 = ?`, [client.idc, client.idc]);
        var c = ''
        if (d.length > 0) {

            d.length > 1 ? d.map((b, x) => {
                c += `${x > 0 ? ' OR ' : ''}separacion = ${b.id}`
            }) : c = `separacion = ${d[0].id}`;

            const cuotas = await pool.query(`SELECT * FROM cuotas WHERE (estado = 3 OR estado = 5) AND fechs <= CURDATE() AND (${c})`);
            res.send({ d, client, cuotas, status: true });
        } else {
            res.send({ paquete: 'Aun no realiza una separacion, comuniiquece con un asesor', status: false });
        }
    } else {
        res.send({ paquete: 'No existe un registro con este numero de documeto, comuniiquece con un asesor', status: false });
    }
});
router.post('/pagos', async (req, res) => {
    const { merchantId, amount, referenceCode } = req.body;
    //var nombre = normalize(buyerFullName).toUpperCase();
    var APIKey = '4Vj8eK4rloUd272L48hsrarnUA' //para pruebas
    //var APIKey = 'pGO1M3MA7YziDyS3jps6NtQJAg'
    var key = APIKey + '~' + merchantId + '~' + referenceCode + '~' + amount + '~COP'
    var hash = crypto.createHash('md5').update(key).digest("hex");
    res.send(hash);
});
router.post('/recibo', async (req, res) => {
    const { total, factrs, id, recibo, ahora, concpto, lt } = req.body;
    const recibe = await pool.query(`SELECT * FROM solicitudes WHERE recibo = ? OR pago = ?`, [recibo, id]);
    if (recibe.length > 0) {
        req.flash('error', 'Solicitud de pago rechazada, recibo o factura duplicada');
        res.redirect('/links/pagos');
    } else {
        var imagenes = ''
        req.files.map((e) => {
            imagenes += `/uploads/${e.filename},`
        })
        const pago = {
            fech: ahora, monto: total, recibo, facturasvenc: factrs, lt,
            concepto: 'PAGO', stado: 3, img: imagenes, descp: concpto
        }
        concpto === 'ABONO' ? pago.concepto = concpto : pago.pago = id,
            await pool.query('UPDATE cuotas SET estado = 1 WHERE id = ?', id);
        await pool.query('UPDATE productosd SET estado = 8 WHERE id = ?', lt);
        await pool.query('INSERT INTO solicitudes SET ? ', pago);
        req.flash('success', 'Solicitud de pago enviada correctamente');
        res.redirect('/links/pagos');
    }

    //uploads/

});
//////////////* CUPONES *//////////////////////////////////
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
        var cl = en.cel.indexOf(" ") > 0 ? en.cel : '57' + en.cel

        var options = {
            method: 'POST',
            url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
            form: {
                "phone": cl,
                "body": `_*${nom}* tienes una solicitu de un *CUPON ${pin}* del *${cupon.descuento}%* por aprobar de *${klint[0].nombre}*_\n\n_*GRUPO ELITE FICA RAÍZ*_`
            }
        };
        request(options, function (error, response, body) {
            if (error) return console.error('Failed: %s', error.message);
            console.log('Success: ', body);
        });
        await sms(cl, `${nom} tienes una solicitu de un CUPON ${pin} ${cupon.descuento}% por aprobar de ${klint[0].nombre}`);
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
    const { id, pin, descuento, fecha, estado, ahorro, mz, n, proyect, nombre, movil, email } = req.body;
    if (d === 'Aprobar') {
        var cel = movil.indexOf(" ") > 0 ? movil : '57' + movil
        await pool.query('UPDATE cupones set ? WHERE id = ?', [{ estado: 9 }, id]);
        var options = {
            method: 'POST',
            url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
            form: {
                "phone": cel,
                "body": `_*${nombre.split(" ")[0]}* tienes un cupon *${pin}* aprobado del *${descuento}%* de descuento para lotes *Campestres*_\n\n_Debes tener presente que estos descuentos estan sujetos a terminos y condiciones establecidos por *Grupo Elite.*_\n\n_para mas información cominicate con un una persona del area encargada_\n\n_*GRUPO ELITE FICA RAÍZ*_`
            }
        };
        request(options, function (error, response, body) {
            if (error) return console.error('Failed: %s', error.message);
            console.log('Success: ', body);
        });
        await sms(cel, `${nombre.split(" ")[0]} tienes un cupon ${pin} aprobado de ${descuento}% GRUPO ELITE FICA RAÍZ`);
        res.send(true);
    }
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
        estado, ncuota, tipo, tipobsevacion, obsevacion, separacion, extran, vrmt2, iniciar } = req.body;
    console.log(req.body)
    const separ = {
        lote,
        cliente: client[0],
        cliente2: client[1] ? client[1] : null,
        cliente3: client[2] ? client[2] : null,
        cliente4: client[3] ? client[3] : null,
        asesor: req.user.id,
        numerocuotaspryecto,
        extraordinariameses: extraordinariameses ? extraordinariameses : 0,
        cuotaextraordinaria: cuotaextraordinaria ? cuotaextraordinaria.replace(/\./g, '') : 0,
        cupon: cupon ? cupon : 1,
        inicialdiferida: inicialdiferida || null,
        tipobsevacion, obsevacion,
        ahorro: ahorro !== '$0' ? ahorro.replace(/\./g, '') : 0,
        separar: separacion.replace(/\./g, ''),
        extran: extran ? extran : 0, vrmt2: vrmt2.replace(/\./g, ''),
        iniciar, cuot
    };
    console.log(separ)
    const h = await pool.query('INSERT INTO preventa SET ? ', separ);
    await pool.query('UPDATE productosd set ? WHERE id = ?', [{ estado: 1, tramitando: ahora }, lote]);
    cupon ? await pool.query('UPDATE cupones set ? WHERE id = ?', [{ estado: 14, producto: h.insertId }, cupon]) : '';


    var cuotas = 'INSERT INTO cuotas (separacion, tipo, ncuota, fechs, cuota, estado) VALUES ';
    await ncuota.map((t, i) => {
        cuotas += `(${h.insertId}, '${tipo[i]}', ${t}, '${fecha[i]}', ${cuota[i]}, ${estado[i]}),`;
    });
    await pool.query(cuotas.slice(0, -1));

    req.flash('success', 'Separación realizada exitosamente');
    res.redirect('/links/reportes');
});
router.get('/cel/:id', async (req, res) => {
    const { id } = req.params
    const datos = await pool.query(`SELECT * FROM clientes WHERE movil LIKE '%${id}%' OR documento = '${id}'`)
    res.send(datos);
});
router.post('/codigo', isLoggedIn, async (req, res) => {
    const { movil } = req.body;
    var cel = movil.indexOf(" ") > 0 ? movil : '57' + movil
    const codigo = ID2(5);
    var options = {
        method: 'POST',
        url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
        form: {
            "phone": cel,
            "body": `_*Grupo Elite* te da la Bienvenida, usa este codigo *${codigo}* para confirmar tu separacion_ \n\n_*GRUPO ELITE FICA RAÍZ*_`
        }
    };
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });
    await sms(cel, `GRUPO ELITE te da la Bienvenida, usa este codigo ${codigo} para confirmar tu separacion`);
    res.send(codigo);
});
router.get('/bono/:id', async (req, res) => {
    const bono = await pool.query('SELECT * FROM cupones WHERE pin = ?', req.params.id)
    res.send(bono);
});
router.post('/tabla/:id', async (req, res) => {
    if (req.params.id == 1) {
        var data = new Array();
        dataSet.data = data
        const { fcha, fcha2, cuota70, cuota30, oficial70, oficial30, N, u, mesesextra, extra, separacion } = req.body;
        var v = Math.round((parseFloat(N) - parseFloat(u)) / 2);
        var p = (parseFloat(N) - parseFloat(u)) / 2
        var j = Math.round(parseFloat(u) / 2);
        var o = parseFloat(u) / 2;
        var y = 0;
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
    console.log(req.params)
    const { id } = req.params
    sql = `SELECT * FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id WHERE p.id = ?`

    const orden = await pool.query(sql, id);
    //console.log(orden)
    res.render('links/ordendeseparacion', { orden, id });
})
router.get('/ordn/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    sql = `SELECT p.id, p.lote, p.cliente, p.cliente2, p.cliente3, p.cliente4, p.numerocuotaspryecto, 
    p.extraordinariameses, p.cuotaextraordinaria, p.extran, p.separar, p.vrmt2, p.iniciar, p.inicialdiferida, 
    p.cupon, p.ahorro, p.fecha, p.obsevacion, p.tipobsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, 
    pd.valor, pt.proyect, c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento 
    FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id 
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
    INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id WHERE p.id = ?`

    const orden = await pool.query(sql, id);
    res.render('links/ordn', { orden, id });
})
router.post('/editarorden', isLoggedIn, async (req, res) => {
    console.log(req.body);
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
    p.cupon, p.ahorro, p.fecha, p.obsevacion, p.tipobsevacion, p.cuot, pd.mz, pd.n, pd.mtr2, pd.inicial, 
    pd.valor, pt.proyect, c.nombre, c2.nombre n2, c3.nombre n3, c4.nombre n4, u.fullname, cu.pin, cu.descuento 
    FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id 
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc 
    INNER JOIN users u ON p.asesor = u.id INNER JOIN cupones cu ON p.cupon = cu.id WHERE p.id = ?`

    const ordn = await pool.query(sql, orden);
    console.log(ordn)
    res.send(ordn);
});
router.post('/ordendeseparacion/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { p, i } = req.body;
    sql = `SELECT * FROM cuotas WHERE separacion = ?`
    const orden = await pool.query(sql, id);
    var y = [orden[0]], o = [orden[0]];
    var e = Math.round(i / 2);
    var u = Math.round((p - i) / 2);
    var m = (p - i) / 2;
    var v = i / 2;
    //console.log(orden)
    w = await orden
        .map((t, c) => {
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
            if (t.tipo === 'INICIAL' && i === '1') {
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
                }
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
            if (t.tipo === 'FINANCIACION' && t.ncuota > u) {
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
    //Desendentes(15)
    res.render('links/reportes');
});
router.put('/reportes', isLoggedIn, async (req, res) => {

});
router.post('/reportes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id == 'table2') {

        d = req.user.admin > 0 ? '' : 'WHERE p.asesor = ?';

        sql = `SELECT p.id, pt.proyect proyecto, pd.mz, pd.n, pd.estado, c.nombre, c.documento, u.fullname, p.fecha
            FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.idc INNER JOIN users u ON p.asesor = u.id ${ d} `

        const ventas = await pool.query(sql, req.user.id);
        respuesta = { "data": ventas };
        res.send(respuesta);

    } else if (id == 'table3') {

        d = req.user.id == 15 ? '' : 't.acreedor = ?  AND';

        sql = `SELECT t.id, u.fullname, us.id tu, us.fullname venefactor,
                t.fecha, t.monto, m.metodo, t.creador, t.estado idestado, e.estado, t.recibo, r.id idrecarga,
                    r.transaccion, r.fecha fechtrans, r.saldoanterior, r.numeroventas FROM transacciones t
            INNER JOIN users u ON t.remitente = u.id INNER JOIN users us ON t.acreedor = us.id
            INNER JOIN recargas r ON r.transaccion = t.id INNER JOIN metodos m ON t.metodo = m.id
            INNER JOIN estados e ON t.estado = e.id WHERE ${ d} YEAR(t.fecha) = YEAR(CURDATE())
            AND MONTH(t.fecha) BETWEEN 1 and 12`

        const solicitudes = await pool.query(sql, req.user.id);
        respuesta = { "data": solicitudes };
        res.send(respuesta);

    } else if (id == 'table4') {

        d = req.user.id == 15 ? '' : 'v.vendedor = ? AND';

        sql = `SELECT v.id, v.fechadecompra, p.producto, v.transaccion, u.fullname, t.fecha fechsolicitud,
                t.monto, m.metodo, t.estado FROM ventas v INNER JOIN products p ON v.product = p.id_producto
            INNER JOIN transacciones t ON v.transaccion = t.id INNER JOIN users u ON t.acreedor = u.id INNER JOIN metodos m ON t.metodo = m.id
            WHERE ${ d} v.product = 25 AND YEAR(v.fechadecompra) = YEAR(CURDATE())
            AND MONTH(v.fechadecompra) BETWEEN 1 and 12`

        const ventas = await pool.query(sql, req.user.id);
        respuesta = { "data": ventas };
        res.send(respuesta);
    }

});
//////////////* SOLICITUDES || CONSULTAS *//////////////////////////////////
router.get('/solicitudes', isLoggedIn, (req, res) => {
    res.render('links/solicitudes');
});
router.post('/solicitudes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id === 'pago') {
        const solicitudes = await pool.query(`SELECT * FROM solicitudes s INNER JOIN cuotas c ON s.pago = c.id 
        INNER JOIN preventa pr ON c.separacion = pr.id INNER JOIN productosd pd ON pr.lote = pd.id
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users u ON pr.asesor = u.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc WHERE s.concepto = 'PAGO' 
        ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`);
        respuesta = { "data": solicitudes };
        //console.log(solicitudes) 
        res.send(respuesta);
    } else if (id === 'abono') {
        const solicitudes = await pool.query(`SELECT * FROM solicitudes s
        INNER JOIN productosd pd ON s.lt = pd.id INNER JOIN productos p ON pd.producto = p.id 
        INNER JOIN preventa pr ON pr.lote = pd.id INNER JOIN clientes cl ON pr.cliente = cl.idc WHERE s.concepto = 'ABONO' 
        ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`);
        respuesta = { "data": solicitudes };
        //console.log(solicitudes)
        res.send(respuesta);
    } else if (id === 'comision') {
        const solicitudes = await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, s.stado, s.descp, s.porciento, 
        s.total, u.id idu, u.fullname nam, u.cel clu, u.username mail, pd.mz, pd.n, s.retefuente, s.reteica, pagar,
        us.id, us.fullname, cl.nombre, p.proyect FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
        INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
        INNER JOIN productos p ON pd.producto = p.id INNER JOIN users us ON pr.asesor = us.id 
        INNER JOIN clientes cl ON pr.cliente = cl.idc WHERE (s.concepto = 'COMISION DIRECTA' OR s.concepto = 'COMISION INDIRECTA')
        ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`);
        respuesta = { "data": solicitudes };
        //console.log(solicitudes)
        res.send(respuesta);
    } else if (id === 'bono') {
        const solicitudes = await pool.query(`SELECT * FROM solicitudes s  
        INNER JOIN users u ON s.asesor = u.id WHERE s.concepto = 'BONO'
        ${req.user.admin == 1 ? '' : 'AND u.id = ' + req.user.id}`);
        respuesta = { "data": solicitudes };
        //console.log(solicitudes)
        res.send(respuesta);
    }
});
router.put('/solicitudes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id === 'Declinar') {
        await pool.query(
            `UPDATE solicitudes s INNER JOIN cuotas c ON s.pago = c.id SET ? WHERE s.ids = ?`,
            [
                {
                    's.stado': 6,
                    'c.estado': 6
                }, req.body.ids
            ]
        );

        res.send(true);

    } else {
        const fech = moment(req.body.fechs).format('YYYY-MM-DD')
        const fech2 = moment(req.body.fech).format('YYYY-MM-DD HH:mm')
        var cuot = parseFloat(req.body.cuota), aidi = '', estados = 0, resp = true;
        //console.log(req.body)
        if (req.body.concepto === 'ABONO') {
            const abonoi = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
            INNER JOIN users u ON p.asesor = u.id WHERE c.separacion = ${req.body.id} AND c.tipo = 'INICIAL' AND c.estado = 3`)
            if (abonoi.length > 0) {
                var vr = 0, monto = parseFloat(req.body.monto), pin, w = 0, valorcuota = abonoi[0].cuota;
                abonoi.map((c, x) => {
                    vr += parseFloat(c.cuota)
                    pin = c.pin
                })
                if (monto >= vr) {
                    estados = 10
                    //await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.id} AND tipo = 'INICIAL' AND estado = 3`, { estado: 10, fechapago: fech2 });
                    await pool.query(
                        `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.separacion = ? 
                                AND c.tipo = 'INICIAL' AND c.estado = 3`,
                        [
                            {
                                's.stado': 4,
                                'c.estado': 13,
                                'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                'l.estado': estados
                            }, req.body.ids, req.body.id
                        ]
                    );
                    if (monto > vr) {
                        var cut = Math.round(monto - vr), v = 0, cuota = 0, o = 0;
                        const abonof = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
                        WHERE c.separacion = ${req.body.id} AND c.tipo = 'FINANCIACION' AND c.estado = 3`)
                        var valor2 = abonof[0].cuotaextraordinaria, valorcuota2 = abonof[0].cuota;
                        abonof
                            .filter((c) => {
                                return c.cuota !== c.cuotaextraordinaria
                            })
                            .map((c, x) => {
                                v += parseFloat(c.cuota)
                                o = x
                            })
                        cuota = valorcuota2 - Math.round(cut / o + 1)
                        /*await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.id} 
                        AND tipo = 'FINANCIACION' AND cuota != ${valor2} AND estado = 3`, { cuota });*/
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE s.ids = ? AND c.separacion = ? 
                                    AND c.tipo = 'FINANCIACION' AND c.cuota != ${valor2} AND c.estado = 3`,
                            [
                                {
                                    's.stado': 4,
                                    'c.cuota': cuota
                                }, req.body.ids, req.body.id
                            ]
                        );
                    }
                    await Desendentes(pin, estados)

                } else {
                    console.log(w + 1)
                    var cuota = valorcuota - Math.round(monto / abonoi.length)
                    /*await pool.query(`UPDATE cuotas SET WHERE separacion = ${req.body.id} 
                    AND tipo = 'INICIAL' AND estado = 3`, { cuota });*/
                    await pool.query(
                        `UPDATE cuotas c 
                                INNER JOIN preventa p ON c.separacion = p.id 
                                INNER JOIN productosd l ON p.lote = l.id 
                                INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                WHERE s.ids = ? AND c.separacion = ? 
                                AND c.tipo = 'INICIAL' AND c.estado = 3`,
                        [
                            {
                                's.stado': 4,
                                'c.cuota': cuota
                            }, req.body.ids, req.body.id
                        ]
                    );
                }

            } else {
                const abonof = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
                WHERE c.separacion = ${req.body.id} AND c.estado = 3`)
                if (abonof.length > 0) {
                    var vr = 0, monto = parseFloat(req.body.monto), o = 0, valor = abonof[0].cuotaextraordinaria, valorcuota = abonof[0].cuota;
                    abonof
                        .filter((c) => {
                            return c.cuota !== c.cuotaextraordinaria
                        })
                        .map((c, x) => {
                            vr += parseFloat(c.cuota)
                            o = x
                        })
                    if (monto > vr) {
                        resp = 'El monto consignado es mayor al del valor total del producto, verifica'
                    } else if (monto === vr) {
                        //await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.id} AND estado = 3`, { estado: 13, fechapago: fech2 });
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE s.ids = ? AND c.separacion = ? AND c.estado = 3`,
                            [
                                {
                                    's.stado': 4,
                                    'c.estado': 13,
                                    'c.fechapago': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.fechar': moment(fech2).format('YYYY-MM-DD HH:mm'),
                                    'l.estado': 13
                                }, req.body.ids, req.body.id
                            ]
                        );
                    } else {
                        o++
                        console.log(o, Math.round(monto / o))
                        var cuota = valorcuota - Math.round(monto / o)
                        /*await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.id} 
                        AND cuota != ${valor} AND estado = 3`, { cuota });*/
                        await pool.query(
                            `UPDATE cuotas c 
                                    INNER JOIN preventa p ON c.separacion = p.id 
                                    INNER JOIN productosd l ON p.lote = l.id 
                                    INNER JOIN solicitudes s ON s.lt = l.id SET ? 
                                    WHERE s.ids = ? AND c.separacion = ? 
                                    AND c.tipo = 'FINANCIACION' AND c.cuota != ${valor} AND c.estado = 3`,
                            [
                                {
                                    's.stado': 4,
                                    'c.cuota': cuota
                                }, req.body.ids, req.body.id
                            ]
                        );
                    }
                }
            }
        } else {
            var Ps = async (cuot, aidi) => {
                if (req.body.cuota === req.body.monto && req.body.facturasvenc > 1) {
                    estados = req.body.estado
                } else if (req.body.tipo === 'SEPARACION') {
                    var precio = (parseFloat(req.body.valor) - parseFloat(req.body.ahorro)) * parseFloat(req.body.iniciar) / 100
                    if (parseFloat(req.body.monto) >= precio) {
                        estados = 10
                    } else {
                        estados = 12
                    }
                    if (req.body.incentivo) {
                        var retefuente = req.body.incentivo * 0.10
                        var reteica = req.body.incentivo * 8 / 1000
                        var f = {
                            fech: fech2, monto: req.body.incentivo, concepto: 'COMISION DIRECTA', stado: 9, descp: 'SEPARACION',
                            asesor: req.body.asesor, porciento: 0, total: req.body.cuota, lt: req.body.lote, retefuente,
                            reteica, pagar: req.body.incentivo - (retefuente + reteica)
                        }
                        await pool.query(`INSERT INTO solicitudes SET ?`, f);
                    }
                } else if (parseFloat(req.body.estado) != 10) {
                    var precio = (parseFloat(req.body.valor) - parseFloat(req.body.ahorro)) * parseFloat(req.body.iniciar) / 100
                    var valr = parseFloat(req.body.monto)
                    const pagos = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${req.body.separacion} 
                        AND tipo = 'INICIAL' AND estado = 13 AND fechs < '${fech}'`)
                    if (pagos.length > 0) {
                        pagos.map((c, x) => {
                            valr += parseFloat(c.cuota)
                        })
                    }
                    valr >= precio ? estados = 10 : estados = 12
                } else {
                    estados = req.body.estado
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
                            'o.estado': estados
                        }, req.body.ids
                    ]
                );
                if (aidi) {
                    await pool.query(`UPDATE cuotas SET ? WHERE ${aidi}`, { estado: 13 });
                }

                if (req.body.monto > cuot) {
                    console.log('si es mayor')
                    const d = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${req.body.separacion} 
                                        AND tipo = 'INICIAL' AND estado = 3 AND fechs > '${fech}'`);
                    if (d.length > 0) {
                        var vr = 0, mont = parseFloat(req.body.monto) - cuot, valorcuota = d[0].cuota, cuotas = 0;
                        d.map((c, x) => {
                            vr += parseFloat(c.cuota)
                        })
                        if (mont > vr) {
                            await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.separacion} 
                                                AND tipo = 'INICIAL' AND estado = 3 AND fechs > '${fech}'`, { estado: 13, fechapago: fech2 });
                            estados = 10
                            const a = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id 
                                            WHERE c.separacion = ${req.body.separacion} AND c.tipo = 'FINANCIACION' AND c.estado = 3 AND c.fechs > '${fech}'`)
                            var cut = Math.round(mont - vr), v = 0, cuota = 0, w = 0, valor2 = a[0].cuotaextraordinaria;
                            if (a.length > 0) {
                                a.filter((c) => {
                                    return c.cuota !== c.cuotaextraordinaria
                                }).map((c, x) => {
                                    vr += parseFloat(c.cuota)
                                    v = parseFloat(c.cuota)
                                    w = x
                                })
                                w++
                                if (mont > vr) {
                                    resp = 'El monto consignado es mayor al del valor total del producto, verifica'
                                } else {
                                    cuota = v - Math.round(cut / w)
                                    console.log(cuota, valor2)
                                    await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.separacion} 
                                                        AND tipo = 'FINANCIACION' AND estado = 3 AND cuota != ${valor2} AND fechs > '${fech}'`, { cuota });
                                }
                            } else {
                                resp = 'No existen cuotas a la cual abonarle saldo, verifica'
                            }
                        } else if (mont === vr) {
                            estados = 10
                            await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.separacion} 
                                                AND tipo = 'INICIAL' AND estado = 3 AND fechs > '${fech}'`, { estado: 13, fechapago: fech2 });
                        } else {
                            estados = 12
                            cuotas = valorcuota - Math.round(mont / d.length)
                            await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.separacion} 
                                                AND tipo = 'INICIAL' AND estado = 3 AND fechs > '${fech}'`, { cuotas });
                        }
                    } else {
                        const a = await pool.query(`SELECT * FROM cuotas c INNER JOIN preventa p ON c.separacion = p.id
                                        WHERE separacion = ${req.body.separacion} AND tipo = 'FINANCIACION' AND estado = 3 AND fechs > '${fech}'`)
                        var vr = 0, mont = parseFloat(req.body.monto) - cuot, v = 0, cuota = 0, w = 0, valor2 = a[0].cuotaextraordinaria;
                        a.filter((c) => {
                            return c.cuota !== c.cuotaextraordinaria
                        }).map((c, x) => {
                            vr += parseFloat(c.cuota)
                            v = parseFloat(c.cuota)
                            w = x
                        })
                        w++
                        if (mont > vr) {
                            resp = 'El monto consignado es mayor al del valor total del producto, verifica'
                        } else {
                            //estados = req.body.estado
                            cuota = v - Math.round(mont / w)
                            console.log(cuota, valor2)
                            await pool.query(`UPDATE cuotas SET ? WHERE separacion = ${req.body.separacion} 
                                                AND tipo = 'FINANCIACION' AND estado = 3 AND cuota != ${valor2} AND fechs > '${fech}'`, { cuota });
                        }
                    }
                }
                console.log(req.body.pin, estados)
                await Desendentes(req.body.pin, estados)
                var cel = req.body.movil.indexOf(" ") > 0 ? req.body.movil : '57' + req.body.movil
                var options = {
                    method: 'POST',
                    url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
                    form: {
                        "phone": cel,
                        "body": `*_${req.body.nombre}_* \n_hemos procesado tu pago de manera exitoza_\n_Recibo *${req.body.recibo}*_\n_Monto *${req.body.monto}*_\n_Factura(s) *${req.body.facturasvenc}*_\n_Tipo *${req.body.tipo}*_\n_N° cuota *${req.body.ncuota}*_\n_Fecha *${req.body.fech}*_\n_Concepto *${req.body.proyect} LOTE ${req.body.n}*_
                                 \n\n*_GRUPO ELITE FINCA RAÍZ_*`
                    }
                };
                request(options, function (error, response, body) {
                    if (error) return console.error('Failed: %s', error.message);
                    console.log('Success: ', body);
                });
                sms(cel, `hemos procesado tu pago de manera exitoza Recibo: ${req.body.recibo} Monto: ${req.body.monto} Concepto: ${req.body.proyect} LOTE ${req.body.n}`);
                //Rango(separacion, tipo, valor, ahorro,)
            }

            const pas = await pool.query(`SELECT * FROM cuotas WHERE separacion = ${req.body.separacion} AND (estado = 3 OR estado = 5) AND fechs < '${fech}'`)

            if (pas.length > 0 && parseFloat(req.body.monto) > parseFloat(req.body.cuota) && req.body.facturasvenc > 1) {
                pas.map((c, x) => {
                    cuot += parseFloat(c.cuota) + parseFloat(c.mora)
                    aidi += x === 0 ? `id = ${c.id}` : ` AND id = ${c.id}`;
                })
                Ps(cuot, aidi)
            } else {
                Ps(cuot, aidi)
            }
        }
        res.send(resp);
    }
});
//Desendentes('ABCDE12345678')
router.post('/cuenta', isLoggedIn, async (req, res) => {
    const { desti, bank } = req.body;
    if (bank !== undefined) {
        const banco = await pool.query(`SELECT * FROM bancos WHERE id_banco = ? `, bank);
        res.send(banco);
    } else {
        const cuentas = await pool.query(`SELECT DISTINCT cuenta FROM transferencias WHERE destinatario = ? `, desti);
        res.send(cuentas);
    }
})
router.post('/cedulav', isLoggedIn, async (req, res) => {
    const { cedula, o } = req.body;
    const APPID_CEDULA = '408';
    const TOKEN_CEDULA = '3cd80102dd1dbb7ba19c58a34eb1b05c';

    function En(datos) {
        res.send(datos);
    };
    var getCI = (cedula) => {
        request({
            url: 'https://cuado.co:444/api/v1?app_id=' + APPID_CEDULA + '&token=' + TOKEN_CEDULA + '&cedula=' + cedula,
            json: true,
            rejectUnauthorized: false
        }, function (error, response, body) {
            var datos;
            if (!error && response.statusCode === 200) {
                if (body.data)
                    datos = body.data;
                else
                    datos = body.error_str;
            } else {
                datos = 'Error de coneccion';
            }
            En(datos)
            return datos
        });
    }
    const documento = await pool.query(`SELECT DISTINCT * FROM clientes WHERE documento = ? `, cedula);

    if (documento.length && o != 1) {
        const dat = await pool.query(`SELECT * FROM transferencias t INNER JOIN clientes c ON t.destinatario = c.id WHERE t.remitente = ? GROUP BY t.destinatario`, documento[0].id);
        res.send([documento, dat]);
    } else if (documento.length && o == 1) {
        const dato = await pool.query(`SELECT DISTINCT * FROM transferencias t INNER JOIN clientes c ON t.destinatario = c.id WHERE t.destinatario = ? `, documento[0].id);
        res.send([documento, dato]);
    } else {
        getCI(cedula)
    }

});
/////////////* VENTAS */////////////////////////////////////
router.get('/ventas2', isLoggedIn, async (req, res) => {
    res.render('links/ventas2');
});
router.get('/ventas', isLoggedIn, async (req, res) => {
    res.render('links/ventas');
});
router.post('/ventas', isLoggedIn, async (req, res) => {
    const { prod, product, nombre, user, movil, nompro } = req.body;
    const result = await rango(req.user.id);
    const usua = await usuario(req.user.id);
    var sald;
    if (product.charAt(2) !== "") {
        sald = await saldo(product.split(" ")[1], result, req.user.id);
    } else {
        sald = await saldo(product, result, req.user.id);
    }

    let cel = movil.replace(/-/g, "")

    if (cel.length !== 10) {
        req.flash('error', 'Numero movil invalido');
        res.redirect('/links/ventas');
    } else if (sald === 'NO') {
        req.flash('error', 'Transacción no realizada, saldo insuficiente');
        res.redirect('/links/ventas');
    } else {
        if (prod == 'IUX') {
            let producto = product.split(" "),
                pin = producto[0] + ID(8)
            const venta = {
                fechadecompra: new Date(),
                pin,
                vendedor: usua,
                cajero: req.user.fullname,
                idcajero: req.user.id,
                product: producto[1],
                rango: result,
                movildecompra: cel
            }
            await pool.query('INSERT INTO ventas SET ? ', venta);
            sms('57' + cel, 'Bienvenido a IUX, ingrese a https://iux.com.co/app/login y canjea este Pin ' + pin);
            req.flash('success', 'Pin generado exitosamente');
            res.redirect('/links/ventas');
        } else if (product == '' || nombre == '' || movil == '') {
            req.flash('error', 'Existe un un error en la solicitud');
            res.redirect('/links/ventas');
        } else if (prod == 'NTFX') {
            let nombr = nombre.split(" ");
            var correo = nombre.replace(/ /g, "").slice(0, 9) + ID(3) + '@yopmail.com';
            correo = correo.toLowerCase();
            const venta2 = {
                fechadecompra: new Date(),
                vendedor: usua,
                cajero: req.user.fullname,
                idcajero: req.user.id,
                client: user,
                product,
                correo,
                rango: result,
                movildecompra: cel
            }
            if (!user) {
                const persona = { nombre, movil: cel, email1: correo };
                const clien = await pool.query('INSERT INTO clientes SET ? ', persona);
                venta2.client = clien.insertId;
            }
            const cliente = await pool.query('SELECT * FROM ventas WHERE client = ? AND fechadevencimiento >= ?', [user, new Date()]);
            if (cliente.length) {
                fech = moment(cliente[0].fechadevencimiento).format('YYYY-MM-DD');
                venta2.fechadevencimiento = fech;
                sms('57' + cel, `${nombr[0].toUpperCase()} tu actual membresia aun no vence, el dia ${fech} activaremos esta recarga que estas realizando, para mas info escribenos al 3012673944. RedFlix`);
            } else {
                sms('57' + cel, `${nombr[0].toUpperCase()} adquiriste ${prod} ${nompro} en el lapso del día recibirás  tus datos.Si tenes alguna duda escríbenos al 3012673944 Whatsapp.RedFlix`);
            }
            await pool.query('INSERT INTO ventas SET ? ', venta2);
            req.flash('success', 'Transacción realizada correctamente');
            res.redirect('/links/ventas');
        }
    }
});
router.post('/transferencia', isLoggedIn, async (req, res) => {
    const y = req.body;
    const range = await rango(req.user.id);
    const usua = await usuario(req.user.id);
    const dinero = await saldo('', range, req.user.id, y.monto.replace(/\./g, ''));

    if (dinero === 'NO') {
        req.flash('error', 'Transacción no realizada, saldo insuficiente');
        res.redirect('/links/ventas');
    } else {
        if (!y.remitente.length) {
            const clien = { nombre: y.nombre[0], movil: y.movil[0].replace(/-/g, ""), documento: y.documento[0] };
            const u = await pool.query('INSERT INTO clientes SET ? ', clien);
            y.remitente = u.insertId;
        }
        if (isNaN(y.nombre[1])) {
            const client = { nombre: y.nombre[1], movil: y.movil[1].replace(/-/g, ""), documento: y.documento[1] };
            const p = await pool.query('INSERT INTO clientes SET ? ', client);
            y.nombre[1] = p.insertId;
        }
        const trans = {
            cuenta: y.cuenta,
            banco: y.banco[0],
            remitente: y.remitente,
            destinatario: y.nombre[1],
            tasa: y.tasa,
            monto: y.monto.replace(/\./g, ''),
            cambio: y.cambio.replace(/\./g, ''),
            utilidad: y.utilidads[0],
            uneta: y.utilidads[1]
        };
        const vnta = await pool.query('INSERT INTO transferencias SET ? ', trans);
        const venta = {
            fechadecompra: new Date(),
            pin: y.cuenta,
            vendedor: usua,
            cajero: req.user.fullname,
            idcajero: req.user.id,
            product: 30,
            rango: range,
            movildecompra: y.movil[0].replace(/-/g, ""),
            transferencia: vnta.insertId
        }
        await pool.query('INSERT INTO ventas SET ? ', venta);
        req.flash('success', 'Transacción realizada correctamente');
        res.redirect('/links/ventas');
    }
});
//////////////////////* RECARGAS *//////////////////////////
router.post('/patro', isLoggedIn, async (req, res) => {
    const { quien } = req.body;
    if (quien == "Patrocinador") {
        const fila = await pool.query('SELECT pi.id, p.usuario FROM pines p INNER JOIN pines pi ON p.usuario = pi.acreedor WHERE p.id = ?', req.user.pin);
        res.send(fila);
    }
});
router.get('/recarga', isLoggedIn, (req, res) => {
    res.render('links/recarga');
});
router.post('/recarga', isLoggedIn, async (req, res) => {
    const { monto, metodo, id, quien, pin } = req.body;
    const Transaccion = {
        acreedor: req.user.id,
        fecha: new Date(),
        monto,
        metodo,
        creador: req.user.id,
    };
    if (monto < 600000) {
        Transaccion.rango = 5;
    } else if (monto >= 600000 || monto < 1500000) {
        Transaccion.rango = 4;
    } else if (monto >= 1500000 || monto < 3000000) {
        Transaccion.rango = 3;
    } else if (monto >= 3000000 || monto < 10000000) {
        Transaccion.rango = 2;
    } else if (monto >= 10000000) {
        Transaccion.rango = 1;
    }
    if (quien === 'Patrocinador') {
        Transaccion.remitente = id;
    } else if (quien === 'Redflix') {
        Transaccion.remitente = 15;
        Transaccion.recibo = pin;
    } else {
        const quins = await pool.query('SELECT * FROM pines WHERE id = ?', pin);
        if (quins.length) {
            Transaccion.remitente = quins[0].acreedor;
        } else {
            req.flash('error', 'ID no existe porfavor verifique el ID que esta ingresando e intentelo nuevamente');
            res.redirect('/links/recarga');
        };
    };
    await pool.query('INSERT INTO transacciones SET ? ', Transaccion);
    req.flash('success', 'Solicitud de saldo exitosa exitosa');
    res.redirect('/links/recarga');
});
/////////////////////////* AFILIACION *////////////////////////////////////////
router.post('/afiliado', async (req, res) => {
    //const result = await rango(req.user.id);
    const { movil, cajero } = req.body, pin = ID(13);

    const nuevoPin = {
        id: pin,
        categoria: 1,
        usuario: req.user.id
    }
    var cel = movil.replace(/-/g, "");
    await pool.query('INSERT INTO pines SET ? ', nuevoPin);

    var options = {
        method: 'POST',
        url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
        form: {
            "phone": '57' + movil,
            "body": `*_¡ Felicidades !_* \n_ya eres parte de nuestro equipo_ *_ELITE_* _tu_ *ID* _es_ *_${pin}_* \n
                *_Registrarte_* _en:_\n*https://grupoelitered.com.co/signup?id=${pin}* \n\n_¡ Si ya te registraste ! y lo que quieres es iniciar sesion ingresa a_ \n*https://grupoelitered.com.co/signin* \n\nPara mas informacion puedes escribirnos al *3007753983* \n\n*Bienvenido a* *_GRUPO ELITE FINCA RAÍZ_* _El mejor equipo de emprendimiento empresarial del país_`
        }
    };

    ////////////////////* chat-api *////////////////////////////
    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);
        console.log('Success: ', body);
    });

    sms('57' + movil, `Felicidades ya eres parte de nuestro equipo ELITE ingresa a https://grupoelitered.com.co/signup?id=${pin} y registrarte o canjeando este ID ${pin} de registro`);
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
///////////////////////* */////////////////////////////////////////////////////////
router.post('/canjear', async (req, res) => {
    const { pin } = req.body;
    const rows = await pool.query(`SELECT v.pin, v.client, p.producto, p.precio, p.dias
            FROM ventas v INNER JOIN products p ON v.product = p.id_producto WHERE pin = ? `, pin);
    if (rows.length > 0 && rows[0].client === null) {
        res.send(rows);
    } else if (rows.length > 0 && rows[0].client !== null) {
        res.send('Este pin ya fue canjeado!');
    } else {
        res.send('Pin invalido!');
    }
});
router.post('/cliente', async (req, res) => {
    let respuesta = "",
        dat;
    const { telephone, buyerFullName, buyerEmail, merchantId, amount, referenceCode, actualizar } = req.body;

    var nombre = normalize(buyerFullName).toUpperCase();
    const newLink = {
        nombre: nombre,
        movil: telephone,
        email: buyerEmail
    };
    let url = `https://iux.com.co/x/venta.php?name=${buyerFullName}&movil=${telephone}&email=${buyerEmail}&ref=cliente&actualiza=${actualizar}`;
    /*request({
        url,
        json: true
    }, async (error, res, body) => {
        if (error) {
            return;
        }

        if (body.length > 0) {
            dat = await body.map((re) => {
                if (re.id === telephone && re.email === buyerEmail) {
                    respuesta = `Todo bien`;
                } else if (re.email !== buyerEmail && re.id === telephone) {
                    respuesta += `Esta cuenta <mark>${buyerEmail}</mark> no coincide con movil <mark>${telephone}</mark>, la cuenta regitrada con este movil es <mark>${re.email}</mark>. `;
                } else if (re.id !== telephone && re.email === buyerEmail) {
                    respuesta += `Este movil <mark>${telephone}</mark> no coincide con la cuenta <mark>${re.email}</mark> el movil registrado con esta cuenta es <mark>${re.id}</mark>. `;
                } else {
                    respuesta = `Todo bien`;
                }
                return re;
            });
        } else {
            respuesta = `Todo bien`;
        }
    });*/
    respuesta = `Todo bien`;
    var saludo = async function () {
        if (respuesta !== "") {
            clearInterval(time);
            if (respuesta === 'Todo bien') {
                const rows = await pool.query('SELECT * FROM clientes WHERE movil = ? OR email = ?', [telephone, buyerEmail]);
                if (rows.length > 0) {
                    await pool.query('UPDATE clientes SET ? WHERE movil = ? OR email = ?', [newLink, telephone, buyerEmail]);
                } else {
                    await pool.query('INSERT INTO clientes SET ? ', newLink);
                }
                var pin = referenceCode + ID(8),
                    //APIKey = '4Vj8eK4rloUd272L48hsrarnUA',
                    APIKey = 'pGO1M3MA7YziDyS3jps6NtQJAg',
                    key = APIKey + '~' + merchantId + '~' + pin + '~' + amount + '~COP',
                    hash = crypto.createHash('md5').update(key).digest("hex"),
                    cdo;
                cdo = [hash, pin, dat];
                res.send(cdo);
            } else {
                res.send(['smg', respuesta, dat]);
            }
        }
    };
    let time = setInterval(saludo, 10);
});
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ? ', [req.user.id]);
    res.render('links/list', { links });
});
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});
router.get('/edit/:id', async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    const { id } = req.params;
    res.render('/links/edit', { link: links[0] });
});
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
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
async function Desendentes(pin, stados) {

    if (stados != 10) {
        return false
    }
    let linea = '', lDesc = '';
    var hoy = moment().format('YYYY-MM-DD')
    var month = moment().subtract(3, 'month').format('YYYY-MM-DD')
    var venta = 0, bono = 0, bonop = 0, personal = 0

    const asesor = await pool.query(`SELECT * FROM pines p INNER JOIN users u ON p.acreedor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id WHERE p.id = ? LIMIT 1`, pin);

    var j = asesor[0]
    const directas = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE p.asesor = ? AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`, j.acreedor);

    if (directas.length > 0) {
        await directas.map(async (a, x) => {
            var val = a.valor - a.ahorro
            var monto = val * j.comision
            var retefuente = monto * 0.10
            var reteica = monto * 8 / 1000
            personal += val
            if (a.directa === null) {
                bonop += val
                var f = {
                    fech: hoy, monto, concepto: 'COMISION DIRECTA', stado: 9, descp: 'VENTA DIRECTA',
                    asesor: j.acreedor, porciento: j.comision, total: val, lt: a.lote, retefuente,
                    reteica, pagar: monto - (retefuente + reteica)
                }
                await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ directa: j.acreedor }, a.lote]);
                await pool.query(`INSERT INTO solicitudes SET ?`, f);
            }
        })
    }

    const lineaUno = await pool.query(`SELECT * FROM pines WHERE usuario = ? AND usuario IS NOT NULL`, j.acreedor);

    if (lineaUno.length > 0) {
        await lineaUno.map((p, x) => {
            lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
            linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
        });

        const reporte = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

        if (reporte.length > 0) {
            await reporte.map(async (a, x) => {
                var val = a.valor - a.ahorro
                var monto = val * j.nivel1
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                venta += val
                if (a.uno === null) {
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: 9, descp: 'PRIMERA LINEA',
                        asesor: j.acreedor, porciento: j.nivel1, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica)
                    }
                    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ uno: j.acreedor }, a.lote]);
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
            })
        }

        const lineaDos = await pool.query(`SELECT * FROM pines WHERE ${linea}`);
        lDesc = '', linea = '';
        await lineaDos.map((p, x) => {
            lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
            linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`
        });

        const reporte2 = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

        if (reporte2.length > 0) {
            await reporte2.map(async (a, x) => {
                var val = a.valor - a.ahorro
                var monto = val * j.nivel2
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                venta += val
                if (a.dos === null) {
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: 9, descp: 'SEGUNDA LINEA',
                        asesor: j.acreedor, porciento: j.nivel2, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica)
                    }
                    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ dos: j.acreedor }, a.lote]);
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
            })
        }

        const lineaTres = await pool.query(`SELECT * FROM pines WHERE ${linea}`);
        lDesc = '', linea = '';
        await lineaTres.map((p, x) => {
            lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
        });
        const reporte3 = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

        if (reporte3.length > 0) {
            await reporte3.map(async (a, x) => {
                var val = a.valor - a.ahorro
                var monto = val * j.nivel3
                var retefuente = monto * 0.10
                var reteica = monto * 8 / 1000
                venta += val
                if (a.tres === null) {
                    bono += val
                    var f = {
                        fech: hoy, monto, concepto: 'COMISION INDIRECTA', stado: 9, descp: 'TERCERA LINEA',
                        asesor: j.acreedor, porciento: j.nivel3, total: val, lt: a.lote, retefuente,
                        reteica, pagar: monto - (retefuente + reteica)
                    }
                    await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ tres: j.acreedor }, a.lote]);
                    await pool.query(`INSERT INTO solicitudes SET ?`, f);
                }
            })
        }
    }
    var rango = j.nrango;
    var tot = venta + personal
    if (personal >= j.venta && tot >= j.ventas) {
        if (tot >= 500000000 && tot < 1000000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A DIRECTOR', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 4 }, j.acreedor]);
            rango = 4

        } else if (tot >= 1000000000 && tot < 2000000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A GERENTE', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 3 }, j.acreedor]);
            rango = 3

        } else if (tot >= 2000000000 && tot < 3000000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A VICEPRESIDENTE', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 2 }, j.acreedor]);
            rango = 2

        } else if (tot >= 300000000) {
            var retefuente = j.premio * 0.10
            var reteica = j.premio * 8 / 1000
            var f = {
                fech: hoy, monto: j.premio, concepto: 'PREMIACION', stado: 9,
                descp: 'ASENSO A PRESIDENTE', asesor: j.acreedor, total: tot, retefuente,
                reteica, pagar: j.premio - (retefuente + reteica)
            }
            await pool.query(`INSERT INTO solicitudes SET ?`, f);
            await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 1 }, j.acreedor]);
            rango = 1
        }
    }
    var bonus = j.bono
    if (rango !== j.nrango) {
        const ucr = await pool.query(`SELECT * FROM users WHERE id = ?`, j.acreedor);
        rango = ucr[0].nrango
        bonus = ucr[0].bono
    }

    if (rango === 5) {
        await pool.query(`DELETE FROM solicitudes WHERE concepto = 'COMISION INDIRECTA' AND asesor = ?`, j.acreedor);

    } else if (rango === 3) {
        var monto = bonop * bonus
        var retefuente = monto * 0.10
        var reteica = monto * 8 / 1000
        var f = {
            fech: hoy, monto, concepto: 'BONO', stado: 9, porciento: bonus,
            descp: 'BONO GERENCIAL', asesor: j.acreedor, total: bonop, retefuente,
            reteica, pagar: monto - (retefuente + reteica)
        }
        await pool.query(`INSERT INTO solicitudes SET ?`, f);

    } else if (rango === 2 || rango === 1) {
        var monto = (bonop + bono) * bonus
        var retefuente = monto * 0.10
        var reteica = monto * 8 / 1000
        var f = {
            fech: hoy, monto, concepto: 'BONO', stado: 9, porciento: bonus,
            descp: 'BONO PRESIDENCIAL', asesor: j.acreedor, total: bonop + bono, retefuente,
            reteica, pagar: monto - (retefuente + reteica)
        }
        await pool.query(`INSERT INTO solicitudes SET ?`, f);
    }
    return true
};
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