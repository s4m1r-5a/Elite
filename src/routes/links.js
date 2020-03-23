const express = require('express');
//const {Builder, By, Key, until} = require('selenium-webdriver');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../database');
const { isLoggedIn, isLogged, Admins } = require('../lib/auth');
const sms = require('../sms.js');
const { registro, dataSet } = require('../keys');
const request = require('request');
const axios = require('axios');
const moment = require('moment');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});
//////////////////* PRODUCTOS */////////////////////
router.get('/productos', isLoggedIn, (req, res) => {
    res.render('links/productos');
});
router.post('/productos', isLoggedIn, async (req, res) => {
    const fila = await pool.query('SELECT * FROM productos');
    respuesta = { "data": fila };
    res.send(respuesta);
});
router.post('/productos/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const fila = await pool.query('SELECT * FROM productosd WHERE producto = ?', id);
    respuesta = { "data": fila };
    res.send(respuesta);
});
router.post('/regispro', isLoggedIn, async (req, res) => {
    const { categoria, title, porcentage, totalmtr2, valmtr2, valproyect, mzs, cantidad, estado, mz, n, mtr2, valor, inicial } = req.body;
    const produc = { categoria, nombre: title.toUpperCase(), porcentage, totalmtr2, valmtr2, valproyect, mzs, cantidad, estado };
    const datos = await pool.query('INSERT INTO productos SET ? ', produc);
    var producdata = 'INSERT INTO productosd (producto, mz, n, mtr2, estado, valor, inicial) VALUES ';
    await n.map((t, i) => {
        producdata += `(${datos.insertId}, ${mz[i] || 0}, ${t}, ${mtr2[i] || 0}, 9, ${valor[i].replace(/\./g, '')}, ${inicial[i].replace(/\./g, '')}),`;
    });
    await pool.query(producdata.slice(0, -1));
    req.flash('success', 'Producto registrado exitosamente');
    res.redirect('/links/productos');
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
router.get('/pagos', isLoggedIn, async (req, res) => {
    /*const { id } = req.query;
    const proyecto = await pool.query(`SELECT * FROM  productosd pd INNER JOIN productos p ON pd.producto = p.id WHERE pd.id = ?`, id);
    console.log({ proyecto, id })*/
    res.render('links/pagos');
});
router.get('/pagos/:id', async (req, res) => {
    const cliente = await pool.query('SELECT * FROM clientes WHERE documento = ?', req.params.id)
    if (cliente.length > 0) {
        const d = await pool.query(`SELECT p.id, p.numerocuotaspryecto, p.extraordinariameses, p.cuotaextraordinaria, p.inicialdiferida, pd.n, pr.nombre, 
        p.fecha, pd.valor, c.pin, c.descuento, c.estado FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN cupones c ON p.cupon = c.id 
        INNER JOIN productos pr ON pd.producto = pr.id WHERE p.cliente = ? OR p.cliente2 = ?`, [cliente[0].id, cliente[0].id]);
        if (d.length > 0) {
            const { id, n, nombre, numerocuotaspryecto, extraordinariameses, cuotaextraordinaria, inicialdiferida, fecha, valor, pin, descuento, estado } = d[0]
            const vr = valor
            const ahorro = descuento > 0 ? valor * descuento / 100 : 0;
            descuento > 0 ? valor = valor - ahorro : '';
            const cuotainicial = valor * 30 / 100;
            const proyecto = valor - cuotainicial;
            var concepto, cuota, mora = 0, total;
            function H() {
                paquete = {
                    id,
                    cliente: cliente[0].nombre,
                    idcliente: cliente[0].id,
                    n,
                    nombre,
                    concepto,
                    cuota,
                    ahorro,
                    vr,
                    valor,
                    descuento,
                    mora,
                    total,
                    pin,
                    estado
                }
            }
            const a = await pool.query(`SELECT * FROM payu WHERE state_pol = 4 AND reference_sale = ?`, id);
            if (a.length > 0) {
                var j = cuotaextraordinaria ? parseFloat(numerocuotaspryecto.slice(-2, -1)) : 0;
                var nxmes = extraordinariameses > 2 ? j * 2 : j;
                var extraordinaria = cuotaextraordinaria * nxmes;
                cuota = (proyecto - extraordinaria) / (numerocuotaspryecto - nxmes)
                H();
                res.send({ paquete, status: true });
            } else {
                concepto = 'Separacion';
                cuota = '1000000'
                total = cuota
                H();
                res.send({ paquete, status: true });
            }
        } else {
            res.send({ paquete: 'Aun no se genera ninguna orden de separacion, comuniiquece con un asesor', status: false });
        }
    } else {
        res.send({ paquete: 'No existe un registro con este numero de documeto, comuniiquece con un asesor', status: false });
    }
});
//////////////* ORDEN *//////////////////////////////////
router.get('/orden', isLoggedIn, async (req, res) => {
    const { id } = req.query;
    const proyecto = await pool.query(`SELECT * FROM  productosd pd INNER JOIN productos p ON pd.producto = p.id WHERE pd.id = ? `, id);
    console.log({ proyecto, id })
    res.render('links/orden', { proyecto, id });
});
router.post('/orden', isLoggedIn, async (req, res) => {
    const { nombres, documento, lugarexpedicion, fechaexpedicion,
        fechanacimiento, estadocivil, email, movil, direccion, parentesco,
        numerocuotaspryecto, extraordinariameses, lote, client,
        cuotaextraordinaria, cupon, inicialdiferida, ahorro } = req.body;
    console.log(req.body)
    function Cliente(N) {
        cliente = {
            nombre: nombres[N],
            documento: documento[N],
            lugarexpedicion: lugarexpedicion[N],
            fechaexpedicion: fechaexpedicion[N],
            fechanacimiento: fechanacimiento[N],
            estadocivil: estadocivil[N],
            email: email[N],
            movil: movil[N].replace(/-/g, ""),
            direccion: direccion[N],
            parentesco
        };
    };
    Cliente(0);
    if (client[0]) {
        await pool.query('UPDATE clientes set ? WHERE id = ?', [cliente, client[0]]);
    } else {
        clie = await pool.query('INSERT INTO clientes SET ? ', cliente);
        client[0] = clie.insertId
    }

    if (documento[1]) {
        Cliente(1);
        if (client[1]) {
            await pool.query('UPDATE clientes set ? WHERE id = ?', [cliente, client[1]]);
        } else {
            clie = await pool.query('INSERT INTO clientes SET ? ', cliente);
            client[1] = clie.insertId
        }
    };
    const separacion = {
        lote,
        cliente: client[0],
        cliente2: documento[1] ? client[1] : null,
        asesor: req.user.id,
        numerocuotaspryecto,
        extraordinariameses,
        cuotaextraordinaria: cuotaextraordinaria ? cuotaextraordinaria.replace(/\./g, '') : '',
        cupon: cupon ? cupon : 1,
        inicialdiferida,
        ahorro: ahorro ? ahorro.replace(/\./g, '') : ''
    };
    //documento[1] ? separacion.cliente2 = client[1] : '';
    const h = await pool.query('INSERT INTO preventa SET ? ', separacion);
    await pool.query('UPDATE productosd set ? WHERE id = ?', [{ estado: 1 }, lote]);
    cupon ? await pool.query('UPDATE cupones set ? WHERE id = ?', [{ estado: 14, producto: h.insertId }, cupon]) : '';
    req.flash('success', 'Separación realizada exitosamente');
    res.redirect('/links/reportes');
});
router.get('/cel/:id', async (req, res) => {
    const datos = await pool.query('SELECT * FROM clientes WHERE movil = ?', req.params.id)
    console.log(datos)
    res.send(datos);
});
router.post('/codigo', isLoggedIn, async (req, res) => {
    const { movil } = req.body;
    const codigo = ID2(5);
    await sms('57' + movil, `GRUPO ELITE te da la Bienvenida, usa este codigo ${codigo} para confirmar tu separacion`);
    console.log(codigo)
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
        const { fcha, cuota70, cuota30, oficial70, oficial30, N, u, mesesextra, extra } = req.body;
        var v = N / 2;
        var j = Math.round(parseFloat(u) / 2);
        var o = parseFloat(u) / 2;
        var y = 0;
        l = {
            n: 1,
            fecha: fcha,
            oficial: '<span class="badge badge-dark text-center text-uppercase">Cuota Separacion $</span>',
            cuota: '1.000.000',
            stado: '<span class="badge badge-success">Pagada</span>',
            n2: '',
            fecha2: '',
            cuota2: '',
            stado2: ''
        }
        dataSet.data.push(l);

        for (i = 1; i <= v; i++) {
            y = o < 1 ? j + i : u > 3 ? j + i + 2 : i + j + 1;

            if (i <= j) {
                x = {
                    n: i,
                    fecha: moment(fcha).add(i, 'month').startOf('month'),
                    oficial: `< span class="badge badge-dark text-center text-uppercase" > Inicial 30 % ${oficial30}</span > `,
                    cuota: cuota30,
                    stado: '<span class="badge badge-primary">Pendiente</span>',
                    n2: i > o ? '' : i + j,
                    fecha2: i > o ? '' : moment(fcha).add(i + j, 'month').startOf('month'),
                    cuota2: i > o ? '' : cuota30,
                    stado2: i > o ? '' : '<span class="badge badge-primary">Pendiente</span>'
                }
                dataSet.data.push(x);
            };

            d = {
                n: i,
                fecha: moment(fcha).add(y, 'month').startOf('month'),
                oficial: `< span class="badge badge-dark text-center text-uppercase" > Poyecto 70 % ${oficial70}</span > `,
                cuota: cuota70,
                stado: '<span class="badge badge-info">Pendiente</span>',
                n2: v + i,
                fecha2: moment(fcha).add(y + v, 'month').startOf('month'),
                cuota2: cuota70,
                stado2: '<span class="badge badge-info">Pendiente</span>'
            };
            d.fecha._d.getMonth() == 5 && (mesesextra == 6 || mesesextra == 2) ? d.cuota = `< mark > ${extra}</mark > ` : '';
            d.fecha._d.getMonth() == 11 && (mesesextra == 12 || mesesextra == 2) ? d.cuota = `< mark > ${extra}</mark > ` : '';
            d.fecha2._d.getMonth() == 5 && (mesesextra == 6 || mesesextra == 2) ? d.cuota2 = `< mark > ${extra}</mark > ` : '';
            d.fecha2._d.getMonth() == 11 && (mesesextra == 12 || mesesextra == 2) ? d.cuota2 = `< mark > ${extra}</mark > ` : '';
            dataSet.data.push(d);
        };
        res.send(true);
    } else {
        res.send(dataSet);
    }
});
//////////////* REPORTES *//////////////////////////////////
router.get('/reportes', isLoggedIn, (req, res) => {
    //Desendentes(15)
    res.render('links/reportes');
});
router.put('/reportes', isLoggedIn, async (req, res) => {
    const { id_venta, correo, clave, client, smss, movil, fechadevencimiento, fechadeactivacion } = req.body
    const venta = { correo, fechadeactivacion, fechadevencimiento }
    const cliente = await pool.query('SELECT * FROM clientes WHERE id = ?', client);
    const nombre = cliente[0].nombre.split(" ")
    const msg = `${nombre[0]} tu usuario sera ${correo} clave ${clave}, ${smss} `
    sms('57' + movil, msg);
    await pool.query('UPDATE ventas set ? WHERE id = ?', [venta, id_venta]);
    res.send(true);
});
router.post('/reportes/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (id == 'table2') {

        d = req.user.admin > 0 ? '' : 'WHERE p.asesor = ?';

        sql = `SELECT p.id, pt.nombre proyecto, pd.mz, pd.n, pd.estado, c.nombre, c.documento, u.fullname, p.fecha
            FROM preventa p INNER JOIN productosd pd ON p.lote = pd.id INNER JOIN productos pt ON pd.producto = pt.id
            INNER JOIN clientes c ON p.cliente = c.id INNER JOIN users u ON p.asesor = u.id ${ d} `

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
////////////////////////////* SOAT *////////////////////////////////////////
router.post('/soat', isLoggedIn, (req, res) => {
    var options = {
        method: 'GET',
        url: 'https://sbapi.bancolombia.com/v1/reference-data/party/party-data-management/vehicles/EXC98E',
        headers:
        {
            accept: 'application/vnd.bancolombia.v1+json',
            authorization: 'Bearer sT6rX2wH4iL4jJ8qQ8eV6bL5iJ8cM2gS1eL8sY2pY0hL5vX4eM'
        }
    };

    request(options, function (error, response, body) {
        if (error) return console.error('Failed: %s', error.message);

        console.log('Success: ', body);
    });
});
//////////////* SOLICITUDES || CONSULTAS *//////////////////////////////////
router.get('/solicitudes', isLoggedIn, (req, res) => {
    res.render('links/solicitudes');
});
router.post('/solicitudes', isLoggedIn, async (req, res) => {
    const solicitudes = await pool.query(`SELECT t.id, u.fullname, us.id tu, us.fullname venefactor, t.fecha, t.monto, m.metodo, t.creador, t.estado idestado, e.estado, t.recibo
            FROM transacciones t INNER JOIN users u ON t.remitente = u.id INNER JOIN users us ON t.acreedor = us.id INNER JOIN metodos m ON t.metodo = m.id
            INNER JOIN estados e ON t.estado = e.id WHERE t.remitente = ? OR t.acreedor = ? `, [req.user.id, req.user.id]);
    //YEAR(v.fechadecompra) = YEAR(CURDATE()) AND MONTH(v.fechadecompra) BETWEEN 1 AND 12
    respuesta = { "data": solicitudes };
    res.send(respuesta);
});
router.put('/solicitudes', isLoggedIn, async (req, res) => {
    const { id, estado, mg, monto } = req.body;
    const result = await rango(req.user.id);
    const sald = await saldo('', result, req.user.id, monto);

    if (sald === 'NO') {
        res.send(false);
    } else {
        const d = { estado }
        await pool.query('UPDATE transacciones set ? WHERE id = ?', [d, id]);
        res.send(true);
    }
});
router.post('/cuenta', isLoggedIn, async (req, res) => {
    const { desti, bank } = req.body;
    if (bank !== undefined) {
        const banco = await pool.query(`SELECT * FROM bancos WHERE id_banco = ? `, bank);
        console.log(bank)
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
    console.log(req.body)
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
    const result = await rango(req.user.id);
    const sald = await saldo(26, result, req.user.id);

    if (sald === 'NO') {

        req.flash('error', 'Afiliacion no realizada, saldo insuficiente');
        res.redirect('/links/recarga');

    } else {

        const usua = await usuario(req.user.id);
        const { movil, cajero } = req.body, pin = ID(13);
        const nuevoPin = {
            id: pin,
            categoria: 1,
            usuario: req.user.id
        }
        var cel = movil.replace(/-/g, "");
        if (cajero !== undefined) {
            nuevoPin.categoria = 2
        } else {
            const venta = {
                fechadecompra: new Date(),
                pin,
                vendedor: usua,
                cajero: req.user.fullname,
                idcajero: req.user.id,
                product: 26,
                rango: result,
                movildecompra: cel
            }
            await pool.query('INSERT INTO ventas SET ? ', venta);
        }
        await pool.query('INSERT INTO pines SET ? ', nuevoPin);
        sms('57' + movil, 'Bienvenido a ser parte de nuestro equipo RedFlix ingresa a https://redflixx.herokuapp.com/signup y registrarte canjeando este ID ' + pin);
        req.flash('success', 'Pin enviado satisfactoriamente, comuniquese con el afiliado para que se registre');
        res.redirect('/tablero');
    }
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
    request({
        url,
        json: true
    }, async (error, res, body) => {
        if (error) {
            console.error(error);
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
    });
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
    let time = setInterval(saludo, 500);
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
async function rango(id) {
    if (id == 15) { return 1 }
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
async function Desendentes(id) {
    let reportes = new Array(4)
    let linea = '', lDesc = '';

    const lineaUno = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario = ?`, id);
    await lineaUno.map((primera) => { lDesc += ` OR pi.acreedor = ${primera.acreedor}`; linea += ` OR pines.usuario = ${primera.acreedor}` });
    const reporte = await pool.query(`SELECT YEAR(v.fechadecompra) Año, MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, ((p.utilidad*r.comision/100)*100/p.utilidad) Porcentag, SUM((p.utilidad*r.comision/100)) Comision, SUM(p.precio) venta, SUM(p.utilidad) utilidad
    FROM ventas v 
    INNER JOIN clientes c ON v.client = c.id 
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id
    INNER JOIN pines pi ON u.pin = pi.id
    WHERE pi.acreedor = 1${lDesc}
    AND MONTH(v.fechadecompra) BETWEEN 1 and 12
    GROUP BY YEAR(v.fechadecompra), MONTH(v.fechadecompra) ASC
    ORDER BY 1`);

    const lineaDos = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario = 1${linea}`);
    lDesc = '', linea = '';
    await lineaDos.map((primera) => { lDesc += ` OR pi.acreedor = ${primera.acreedor}`; linea += ` OR pines.usuario = ${primera.acreedor}` });
    const reporte2 = await pool.query(`SELECT YEAR(v.fechadecompra) Año, MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, SUM(((p.utilidad*90/100)-(p.utilidad*r.comision/100))) Rango, SUM(p.precio) venta, SUM(p.utilidad) utilidad
    FROM ventas v 
    INNER JOIN clientes c ON v.client = c.id 
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id
    INNER JOIN pines pi ON u.pin = pi.id
    WHERE pi.acreedor = 1${lDesc}
    AND MONTH(v.fechadecompra) BETWEEN 1 and 12
    GROUP BY YEAR(v.fechadecompra), MONTH(v.fechadecompra) ASC
    ORDER BY 1`);

    const lineaTres = await pool.query(`SELECT acreedor FROM pines WHERE pines.usuario =  1${linea}`);
    lDesc = '', linea = '';
    await lineaTres.map((primera) => { lDesc += ` OR pi.acreedor = ${primera.acreedor}` });
    const reporte3 = await pool.query(`SELECT YEAR(v.fechadecompra) Año, MONTH(v.fechadecompra) Mes, COUNT(*) CantMes, SUM(((p.utilidad*90/100)-(p.utilidad*r.comision/100))) Rango, SUM((p.utilidad*r.comision/100)) Comision, SUM(p.precio) venta, SUM(p.utilidad) utilidad
    FROM ventas v 
    INNER JOIN clientes c ON v.client = c.id 
    INNER JOIN users u ON v.vendedor = u.id
    INNER JOIN products p ON v.product = p.id_producto
    INNER JOIN rangos r ON v.rango = r.id
    INNER JOIN pines pi ON u.pin = pi.id
    WHERE pi.acreedor = 1${lDesc}
    AND MONTH(v.fechadecompra) BETWEEN 1 and 12
    GROUP BY YEAR(v.fechadecompra), MONTH(v.fechadecompra) ASC
    ORDER BY 1`);
    mapa = [reporte, reporte2, reporte3]
    if (reporte.length > 0) {
        await mapa.map((r) => {
            console.log(r)
        });

        /*await reporte.filter((re) => {
            return re.Mes !== m.getMonth() + 1;
        }).map((re) => {
            
        });*/

        return Math.min(...reportes);
    } else {
        return 5;
    };
};
module.exports = router;