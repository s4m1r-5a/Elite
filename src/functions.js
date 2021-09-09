const nodemailer = require('nodemailer')
const pool = require('./database');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake')
const Roboto = require('./public/fonts/Roboto');
const moment = require('moment');
const e = require('connect-flash');
const puppeteer = require('puppeteer');

moment.locale('es');
const transpoter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 80,
    secure: false,
    auth: {
        user: 'info@grupoelitefincaraiz.co',
        pass: 'C0l0mb1@1q2w3e4r5t*'
    },
    tls: {
        rejectUnauthorized: false
    }
});

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
//////////////* CIFRAS EN LETRAS *///////////////////
function Unidades(num) {

    switch (num) {
        case 1:
            return "UN";
        case 2:
            return "DOS";
        case 3:
            return "TRES";
        case 4:
            return "CUATRO";
        case 5:
            return "CINCO";
        case 6:
            return "SEIS";
        case 7:
            return "SIETE";
        case 8:
            return "OCHO";
        case 9:
            return "NUEVE";
    }

    return "";
} //Unidades()
function Decenas(num) {

    decena = Math.floor(num / 10);
    unidad = num - (decena * 10);

    switch (decena) {
        case 1:
            switch (unidad) {
                case 0:
                    return "DIEZ";
                case 1:
                    return "ONCE";
                case 2:
                    return "DOCE";
                case 3:
                    return "TRECE";
                case 4:
                    return "CATORCE";
                case 5:
                    return "QUINCE";
                default:
                    return "DIECI" + Unidades(unidad);
            }
        case 2:
            switch (unidad) {
                case 0:
                    return "VEINTE";
                default:
                    return "VEINTI" + Unidades(unidad);
            }
        case 3:
            return DecenasY("TREINTA", unidad);
        case 4:
            return DecenasY("CUARENTA", unidad);
        case 5:
            return DecenasY("CINCUENTA", unidad);
        case 6:
            return DecenasY("SESENTA", unidad);
        case 7:
            return DecenasY("SETENTA", unidad);
        case 8:
            return DecenasY("OCHENTA", unidad);
        case 9:
            return DecenasY("NOVENTA", unidad);
        case 0:
            return Unidades(unidad);
    }
} //Decenas()
function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + " Y " + Unidades(numUnidades)

    return strSin;
} //DecenasY()
function Centenas(num) {

    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);

    switch (centenas) {
        case 1:
            if (decenas > 0)
                return "CIENTO " + Decenas(decenas);
            return "CIEN";
        case 2:
            return "DOSCIENTOS " + Decenas(decenas);
        case 3:
            return "TRESCIENTOS " + Decenas(decenas);
        case 4:
            return "CUATROCIENTOS " + Decenas(decenas);
        case 5:
            return "QUINIENTOS " + Decenas(decenas);
        case 6:
            return "SEISCIENTOS " + Decenas(decenas);
        case 7:
            return "SETECIENTOS " + Decenas(decenas);
        case 8:
            return "OCHOCIENTOS " + Decenas(decenas);
        case 9:
            return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
} //Centenas()
function Seccion(num, divisor, strSingular, strPlural) {
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
} //Seccion()
function Miles(num) {
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMiles = Seccion(num, divisor, "MIL", "MIL");
    strCentenas = Centenas(resto);

    if (strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;

    //return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
} //Miles()
function Millones(num) {
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)

    strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
    strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;

    //return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
} //Millones()
function NumeroALetras(num, centavos) {
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
    };
    if (centavos == undefined || centavos == false) {
        data.letrasMonedaPlural = "PESOS";
        data.letrasMonedaSingular = "PESO";
    } else {
        data.letrasMonedaPlural = "CENTAVOS";
        data.letrasMonedaSingular = "CENTAVO";
    }

    if (data.centavos > 0)
        data.letrasCentavos = "CON " + NumeroALetras(data.centavos, true);

    if (data.enteros == 0)
        return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1) {
        res = Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
        if (res.indexOf('UN MILLON  PESO') > 0) return res.replace('UN MILLON  PESO', 'UN MILLON DE PESO');
        return res;
    } else {
        res = Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
        if (res.indexOf('MILLONES  PESOS') > 0) return res.replace('MILLONES  PESOS', 'MILLONES DE PESOS');
        return res;
    }
} //NumeroALetras()
//////////////* CIFRAS EN LETRAS END *///////////////////

//////////////* EMAILS *////////////////////////////////
async function EnviarEmail(email, asunto, destinatario, html, texto, archivos) {
    let data = {
        from: "'GRUPO ELITE' <info@grupoelitefincaraiz.co>",
        to: email,
        subject: asunto,
    };
    html ? data.html = texto : data.text = destinatario + ' ' + texto;
    if (Array.isArray(archivos) && archivos.length) {
        data.attachments = archivos.map((e, i) => {
            return {   // file on disk as an attachment
                filename: e.fileName,
                path: e.ruta // stream this file
            }
        })
    };
    console.log(data)
    envio = await transpoter.sendMail(data);
    //console.log(envio)
};
//////////////* EMAILS END *////////////////////////////////
async function QuienEs(document, chatId) {
    const cliente = await pool.query(`SELECT * FROM clientes WHERE documento = ?`, document);
    if (cliente.length) {
        const Id = ID(5) + '@7';
        EnviarEmail(
            cliente[0].email,
            "Comprobacion de identidad",
            cliente[0].nombre,
            false,
            `Su codigo de comprobacion es ${Id}`
        );
        let email = cliente[0].email.split("@");
        encrip = email[0].slice(0, 2) + '****' + email[0].slice(-3) + '@' + email[1];
        await pool.query(`UPDATE clientes SET code = ? WHERE  documento = ?`, [Id, document]);
        apiChatApi('message', { chatId: chatId, body: `_🙂 Muy bien *${cliente[0].nombre.split(" ")[0]}*, para terminar con la verificación, ve a tu *correo* electrónico 📧 y escríbenos *aquí* 👇🏽 el *código de comprobación* 🔐 que te enviamos al ${encrip}, recuerda que si no lo ves en tu *bandeja de entrada* puede que este en tus *"Spam"* o *"Correo no deseado"*_` });
        return true;
    } else {
        await pool.query(`UPDATE clientes SET code = NULL WHERE  documento = ?`, document);
        apiChatApi('message', { chatId: chatId, body: `😞 Lo sentimos no encontramos a nadie con ese numero de documento en nuestro sistema` });
    }
}
async function EstadoCuenta(movil, nombre, author) {
    const cel = movil.slice(-10);
    const estado = await pool.query(`SELECT pd.valor - p.ahorro AS total, pt.proyect, cu.pin AS cupon, cp.pin AS bono, s.stado, 
    p.ahorro, pd.mz, pd.n, pd.valor, p.vrmt2, p.fecha, s.fech, s.ids, s.formap, s.descp,s.monto, s.img, cu.descuento, p.id cparacion,
    c.nombre, c.documento, c.email, c.movil, cp.monto mtb, pd.mtr2 FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
    INNER JOIN productos pt ON pd.producto = pt.id INNER JOIN preventa p ON pd.id = p.lote 
    LEFT JOIN cupones cu ON cu.id = p.cupon LEFT JOIN cupones cp ON s.bono = cp.id
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc
    WHERE s.stado != 6 AND s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL 
    AND (c.movil LIKE '%${cel}%' OR c.code LIKE '%${cel}%' OR c.nombre = '${nombre}'
    OR c2.movil LIKE '%${cel}%' OR c2.code LIKE '%${cel}%' OR c2.nombre = '${nombre}'
    OR c3.movil LIKE '%${cel}%' OR c3.code LIKE '%${cel}%' OR c3.nombre = '${nombre}'
    OR c4.movil LIKE '%${cel}%' OR c4.code LIKE '%${cel}%' OR c4.nombre = '${nombre}')`);
    if (estado.length) {
        const cuerpo = []
        let totalAbonado = 0;
        estado.map((e, i) => {
            totalAbonado += e.stado === 4 ? e.monto : 0;
            if (!i) {
                cuerpo.push(
                    [
                        { text: `Area: ${e.mtr2} mt2`, style: 'tableHeader', colSpan: 2, alignment: 'center' },
                        {}, { text: `Vr Mt2: $${Moneda(e.vrmt2)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {},
                        { text: '$' + Moneda(e.valor), style: 'tableHeader', alignment: 'center', colSpan: 2 }, {}
                    ],
                    [
                        'Cupon', 'Dsto', { text: 'Ahorro', colSpan: 2 }, {},
                        { text: `Total lote`, colSpan: 2 }, {}
                    ],
                    [
                        { text: e.cupon, style: 'tableHeader', alignment: 'center' },
                        { text: `${e.descuento}%`, style: 'tableHeader', alignment: 'center' },
                        { text: `-$${Moneda(e.ahorro)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {},
                        { text: `$${Moneda(e.total)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}
                    ],
                    ['Fecha', 'Recibo', 'Estado', 'Forma de pago', 'Tipo', 'Monto'],
                    [moment(e.fech).format('L'), `RC${e.ids}`,
                    { text: e.stado === 4 ? 'Aprobado' : 'Pendiente', color: e.stado === 4 ? 'green' : 'blue' },
                    e.formap, e.descp, {
                        text: '$' + Moneda(e.monto),
                        color: e.stado === 4 ? 'green' : 'blue',
                        decoration: e.stado !== 4 && 'lineThrough',
                        decorationStyle: e.stado !== 4 && 'double'
                    }]);
            } else {
                cuerpo.push([moment(e.fech).format('L'), `RC${e.ids}`,
                { text: e.stado === 4 ? 'Aprobado' : 'Pendiente', color: e.stado === 4 ? 'green' : 'blue' },
                e.formap, e.descp, {
                    text: '$' + Moneda(e.monto),
                    color: e.stado === 4 ? 'green' : 'blue',
                    decoration: e.stado !== 4 && 'lineThrough',
                    decorationStyle: e.stado !== 4 && 'double'
                }]);
            }
        })
        cuerpo.push(
            [
                { text: 'TOTAL ABONADO', style: 'tableHeader', alignment: 'center', colSpan: 4 }, {}, {}, {},
                { text: '$' + Moneda(totalAbonado), style: 'tableHeader', alignment: 'center', colSpan: 2 }, {}
            ],
            [
                { text: NumeroALetras(totalAbonado), style: 'small', colSpan: 6 },
                {}, {}, {}, {}, {}
            ],
            [
                { text: 'SALDO A LA FECHA', style: 'tableHeader', alignment: 'center', colSpan: 4 }, {}, {}, {},
                { text: '$' + Moneda(estado[0].total - totalAbonado), style: 'tableHeader', alignment: 'center', colSpan: 2 }, {}
            ],
            [
                { text: NumeroALetras(estado[0].total - totalAbonado), style: 'small', colSpan: 6 },
                {}, {}, {}, {}, {}
            ]
        )
        ////////////////////////* CREAR PDF *//////////////////////////////
        const printer = new PdfPrinter(Roboto);
        let docDefinition = {
            background: function (currentPage, pageSize) {
                return { image: path.join(__dirname, '/public/img/avatars/avatar1.png'), width: pageSize.width, opacity: 0.1 } //, height: pageSize.height
            },
            pageSize: {
                width: 595.28,
                height: 'auto'
            },
            /* footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
            header: function (currentPage, pageCount, pageSize) {
                // you can apply any logic and return any valid pdfmake element

                return [
                    { text: 'simple text', alignment: (currentPage % 2) ? 'right' : 'right' },
                    { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
                ]
            }, */
            //watermark: { text: 'Grupo Elite', color: 'blue', opacity: 0.1, bold: true, italics: false, fontSize: 200 }, //, angle: 180
            //watermark: { image: path.join(__dirname, '/public/img/avatars/avatar.png'), width: 100, opacity: 0.3, fit: [100, 100] }, //, angle: 180
            info: {
                title: 'Estado de cuenta',
                author: 'RedElite',
                subject: 'Detallado del estado de los pagos de un producto',
                keywords: 'estado de cuenta',
                creator: 'Grupo Elite',
                producer: 'G.E.'
            },
            content: [ // pageBreak: 'before',
                {
                    columns: [
                        [
                            { text: 'ESTADO DE CUENTA', style: 'header' },
                            'Conoce aqui el estado el estado de tus pagos y montos',
                            { text: estado[0].nombre, style: 'subheader' },
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 9, margin: [0, 0, 0, 5],
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
                            image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                            fit: [100, 100]
                        }
                    ]
                },
                {
                    style: 'tableBody',
                    color: '#444',
                    table: {
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        headerRows: 4,
                        // keepWithHeaderRows: 1,
                        body: cuerpo
                    }
                },
                {
                    fontSize: 11,
                    italics: true,
                    text: [
                        '\nLos montos que se muestran de color ',
                        { text: 'azul ', bold: true, color: 'blue' },
                        'no se suman al total  ',
                        { text: 'abonado, ', bold: true, color: 'green' },
                        'ya que estos montos aun no cuentan con la ',
                        { text: 'aprobacion ', bold: true, color: 'green' },
                        'del area de ',
                        { text: 'contabilidad. ', bold: true },
                        'Una ves se hallan aprobado se sumaran al saldo ',
                        { text: 'abonado.\n\n', bold: true, color: 'green' },
                    ]
                },
                {
                    columns: [
                        {
                            width: 100,
                            qr: 'https://grupoelitefincaraiz.com',
                            fit: '50',
                            foreground: 'yellow', background: 'black'
                        },
                        [
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 10,
                                columns: [
                                    { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                                    { text: 'https://grupoelitefincaraiz.com', link: 'https://grupoelitefincaraiz.com' }
                                ]
                            },
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 10,
                                columns: [
                                    { text: 'Nit: 901311748-3' },
                                    { text: 'info@grupoelitefincaraiz.co' }
                                ]
                            },
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 10,
                                columns: [
                                    { text: 'Mz L lt 17 Urb. la granja, Turbaco' },
                                    { text: '57 300-285-1046', link: 'https://wa.me/573007861987?text=Hola' }
                                ]
                            }
                        ]
                    ]
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
        let ruta = path.join(__dirname, `/public/uploads/estadodecuenta-${estado[0].cparacion}.pdf`);
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(ruta));
        pdfDoc.end();

        var dataFile = {
            phone: author,
            body: `https://grupoelitefincaraiz.co/uploads/estadodecuenta-${estado[0].cparacion}.pdf`,
            filename: `ESTADO DE CUENTA ${estado[0].cparacion}.pdf`
        };
        let r = await apiChatApi('sendFile', dataFile);
        r.msg = estado[0].cparacion;
        await EnviarEmail(
            estado[0].email,
            `Estado de cuenta Lt: ${estado[0].n}`,
            estado[0].nombre,
            false,
            'Grupo Elite te da la bienvenida',
            [{ fileName: `Estado de cuenta ${estado[0].cparacion}.pdf`, ruta }]
        );
        return r  //JSON.stringify(estado);
    } else {
        return { sent: false };
    }
}
async function EstadoDeCuenta(Orden) {
    const Proyeccion = await pool.query(`SELECT c.tipo, c.ncuota, c.fechs, r.montocuota, r.dias, r.tasa, r.dcto, 
    r.totalmora, r.montocuota + r.totalmora totalcuota, s.fech, s.monto, r.saldocuota, l.valor - p.ahorro AS total, 
    o.proyect, k.pin AS cupon, q.pin AS bono, s.stado, p.ahorro, l.mz, l.n, l.valor, p.vrmt2, l.mtr2, p.fecha, s.ids, 
    s.formap, s.descp, k.descuento, p.id cparacion, cl.nombre, cl.documento, cl.email, cl.movil, q.monto mtb, c.mora,
    c.cuota, c.diaspagados, c.diasmora, c.tasa tasamora, c.estado FROM cuotas c LEFT JOIN relacioncuotas r ON r.cuota = c.id 
    LEFT JOIN solicitudes s ON r.pago = s.ids INNER JOIN preventa p ON c.separacion = p.id 
    INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos o ON l.producto = o.id 
    LEFT JOIN cupones k ON k.id = p.cupon LEFT JOIN cupones q ON s.bono = q.id 
    INNER JOIN clientes cl ON p.cliente = cl.idc WHERE p.id = ? ORDER BY TIMESTAMP(c.fechs) ASC;`, Orden);
    if (Proyeccion.length) {
        const cuerpo = []
        let totalAbonado = 0;
        let totalMora = 0;
        let moraAdeudada = 0;
        let totalDeuda = 0;
        let p = false;
        let IDs = null;

        Proyeccion.map((e, i) => {
            totalAbonado += IDs === e.ids ? 0 : e.monto ? e.monto : 0;
            moraAdeudada += e.estado === 3 ? e.mora : 0;
            totalMora += e.totalmora + (e.estado === 3 ? e.mora : 0);
            totalDeuda += e.estado === 3 ? e.cuota + e.mora : 0;
            const PrecioDiaMora = e.mora ? e.mora / e.diasmora : 0;
            const TotalDias = Math.round(e.diasmora - e.diaspagados);
            const TotalMora = Math.round(PrecioDiaMora * TotalDias);
            const TotalCuota = Math.round(e.cuota + TotalMora);
            const Ids = IDs === e.ids && e.monto ? false : true;

            if (!i) {
                cuerpo.push(
                    [
                        { text: `Tipo`, style: 'tableHeader', alignment: 'center' },
                        { text: 'F.Limite', style: 'tableHeader', alignment: 'center' },
                        { text: 'Cuota', style: 'tableHeader', alignment: 'center' },
                        { text: 'Dias', style: 'tableHeader', alignment: 'center' },
                        { text: 'T.Usr', style: 'tableHeader', alignment: 'center' },
                        { text: 'Dcto.', style: 'tableHeader', alignment: 'center' },
                        { text: 'Mora', style: 'tableHeader', alignment: 'center' },
                        { text: 'T.Cuota', style: 'tableHeader', alignment: 'center' },
                        { text: 'F.Pago', style: 'tableHeader', alignment: 'center' },
                        { text: 'Monto', style: 'tableHeader', alignment: 'center' },
                        { text: 'C.Saldo', style: 'tableHeader', alignment: 'center' }
                    ],
                    [e.tipo + '-' + e.ncuota, moment(e.fechs).format('L'),
                    '$' + Moneda(e.montocuota ? e.montocuota : e.cuota),
                    e.montocuota ? e.dias : TotalDias, e.montocuota ? (e.tasa * 100) + '%' : (e.tasamora * 100) + '%',
                    e.montocuota ? (e.dcto * 100) + '%' : '0%', '$' + Moneda(e.montocuota ? e.totalmora : TotalMora),
                    '$' + Moneda(e.montocuota ? e.totalcuota : TotalCuota), e.fech && (Ids ? moment(e.fech).format('L') : '--/--/----'),
                    Ids ? '$' + Moneda(e.monto || 0) : '$---,---,--', '$' + Moneda(e.montocuota ? e.saldocuota : TotalCuota)]);
            } else {
                !e.monto && p && cuerpo.push([p.tipo + '-' + p.ncuota, moment(p.fechs).format('L'),
                '$' + Moneda(p.cuota), p.s.TotalDias, (e.tasamora * 100) + '%', '0%', '$' + Moneda(p.s.TotalMora),
                '$' + Moneda(p.s.TotalCuota), '', '$0', '$' + Moneda(p.s.TotalCuota)]);

                cuerpo.push([e.tipo + '-' + e.ncuota, moment(e.fechs).format('L'),
                '$' + Moneda(e.montocuota ? e.montocuota : e.cuota),
                e.montocuota ? e.dias : TotalDias, e.montocuota ? (e.tasa * 100) + '%' : (e.tasamora * 100) + '%',
                e.montocuota ? (e.dcto * 100) + '%' : '0%', '$' + Moneda(e.montocuota ? e.totalmora : TotalMora),
                '$' + Moneda(e.montocuota ? e.totalcuota : TotalCuota), e.fech && (Ids ? moment(e.fech).format('L') : '--/--/----'),
                Ids ? '$' + Moneda(e.monto || 0) : '$---,---,--', '$' + Moneda(e.montocuota ? e.saldocuota : TotalCuota)]);
            }
            IDs = e.ids;
            p = e.monto && e.saldocuota ? e : false;
            e.monto && e.saldocuota && (p.s = { TotalDias, TotalMora, TotalCuota });
        });
        ////////////////////////* CREAR PDF *//////////////////////////////
        const printer = new PdfPrinter(Roboto);
        let docDefinition = {
            background: function (currentPage, pageSize) {
                return { image: path.join(__dirname, '/public/img/avatars/avatar1.png'), width: pageSize.width, opacity: 0.1 } //, height: pageSize.height
            },
            pageSize: 'a4',
            footer: function (currentPage, pageCount) {
                return {
                    alignment: 'center',
                    margin: [40, 3, 40, 3],
                    columns: [
                        {
                            width: 30,
                            margin: [10, 0, 15, 0],
                            image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                            fit: [30, 30]
                        },
                        [
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                margin: [0, 7, 0, 0],
                                fontSize: 8,
                                columns: [
                                    { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                                    { text: 'info@grupoelitefincaraiz.co' },
                                    { text: 'https://grupoelitefincaraiz.com', link: 'https://grupoelitefincaraiz.com' }
                                ]
                            },
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 8,
                                columns: [
                                    { text: 'Nit: 901311748-3' },
                                    { text: '57 300-285-1046', link: 'https://wa.me/573007861987?text=Hola' },
                                    { text: 'Mz L lt 17 Urb. la granja, Turbaco' }
                                ]
                            }
                        ],
                        {
                            width: 30,
                            //alignment: 'right',
                            margin: [10, 0, 15, 0],
                            image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                            fit: [30, 30]
                        }
                    ]
                };
            },
            header: function (currentPage, pageCount, pageSize) {
                // you can apply any logic and return any valid pdfmake element
                return [
                    {
                        width: 20,
                        alignment: 'right',
                        margin: [10, 3, 10, 3],
                        image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                        fit: [20, 20]
                    }
                ]
            },
            //watermark: { text: 'Grupo Elite', color: 'blue', opacity: 0.1, bold: true, italics: false, fontSize: 200 }, //, angle: 180
            //watermark: { image: path.join(__dirname, '/public/img/avatars/avatar.png'), width: 100, opacity: 0.3, fit: [100, 100] }, //, angle: 180
            info: {
                title: 'Estado de cuenta',
                author: 'RedElite',
                subject: 'Detallado del estado de los pagos de un producto',
                keywords: 'estado de cuenta',
                creator: 'Grupo Elite',
                producer: 'G.E.'
            },
            content: [ // pageBreak: 'before',
                {
                    columns: [
                        [
                            { text: 'ESTADO DE CUENTA', style: 'header' },
                            'Conoce aqui el estado el estado de tus pagos y montos',
                            { text: Proyeccion[0].nombre, style: 'subheader' },
                            {
                                text: `Doc. ${Proyeccion[0].documento}         Movil ${Proyeccion[0].movil}        ${Proyeccion[0].email}`,
                                italics: true, color: 'gray', fontSize: 9
                            },
                            {
                                style: 'tableBody',
                                color: '#444',
                                table: {
                                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                                    body: [
                                        [
                                            { text: Proyeccion[0].proyect, bold: true, fontSize: 10, color: 'blue', colSpan: 5 }, {}, {}, {}, {},
                                            { text: `MZ: ${Proyeccion[0].mz ? Proyeccion[0].mz : 'No aplica'}`, bold: true, fontSize: 10, color: 'blue' },
                                            { text: `LT: ${Proyeccion[0].n}`, bold: true, fontSize: 10, color: 'blue' }
                                        ],
                                        ['Area', 'Vr.mtr2', 'Valor', 'Cupon', 'Dcto.', 'Ahorro', 'Total'],
                                        [
                                            { text: Proyeccion[0].mtr2, style: 'tableHeader', alignment: 'center' },
                                            { text: `$${Moneda(Proyeccion[0].vrmt2)}`, style: 'tableHeader', alignment: 'center' },
                                            { text: `$${Moneda(Proyeccion[0].valor)}`, style: 'tableHeader', alignment: 'center' },
                                            { text: Proyeccion[0].cupon, style: 'tableHeader', alignment: 'center' },
                                            { text: `${Proyeccion[0].descuento}%`, style: 'tableHeader', alignment: 'center' },
                                            { text: `- $${Moneda(Proyeccion[0].ahorro)}`, style: 'tableHeader', alignment: 'center' },
                                            { text: `$${Moneda(Proyeccion[0].total)}`, style: 'tableHeader', alignment: 'center' }
                                        ]
                                    ]
                                }
                            }
                        ],
                        {
                            width: 100,
                            image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                            fit: [100, 100]
                        }
                    ]
                },
                {
                    style: 'tableBody',
                    color: '#444',
                    table: {
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        headerRows: 1,
                        // keepWithHeaderRows: 1,
                        body: cuerpo
                    }
                },
                { text: 'A continuacion se describiran los totales de la tabla anterior', style: 'subheader' },
                {
                    ul: [
                        {
                            text: [
                                { text: 'Total Abonado: ', fontSize: 10, bold: true },
                                { text: `$${Moneda(totalAbonado)}\n`, italics: true, bold: true, fontSize: 11, color: 'green' },
                                { text: NumeroALetras(totalAbonado).toLowerCase(), fontSize: 8, italics: true, color: 'gray' }
                            ]
                        },
                        {
                            text: [
                                { text: 'Total Mora: ', fontSize: 10, bold: true },
                                { text: `$${Moneda(totalMora)}\n`, italics: true, bold: true, fontSize: 11, color: 'gray' },
                                { text: NumeroALetras(totalMora).toLowerCase(), fontSize: 8, italics: true, color: 'gray' }
                            ]
                        },
                        {
                            text: [
                                { text: 'Mora Adeudada: ', fontSize: 10, bold: true },
                                { text: `$${Moneda(moraAdeudada)}\n`, italics: true, bold: true, fontSize: 11, color: 'red' },
                                { text: NumeroALetras(moraAdeudada).toLowerCase(), fontSize: 8, italics: true, color: 'gray' }
                            ]
                        },
                        {
                            text: [
                                { text: 'Total Saldo: ', fontSize: 10, bold: true },
                                { text: `$${Moneda(totalDeuda)}\n`, italics: true, bold: true, fontSize: 11, color: 'blue' },
                                { text: NumeroALetras(totalDeuda).toLowerCase(), fontSize: 8, italics: true, color: 'gray' }
                            ]
                        }
                    ]
                },
                /* {
                    fontSize: 11,
                    italics: true,
                    text: [
                        '\nLos montos que se muestran de color ',
                        { text: 'azul ', bold: true, color: 'blue' },
                        'no se suman al total  ',
                        { text: 'abonado, ', bold: true, color: 'green' },
                        'ya que estos montos aun no cuentan con la ',
                        { text: 'aprobacion ', bold: true, color: 'green' },
                        'del area de ',
                        { text: 'contabilidad. ', bold: true },
                        'Una ves se hallan aprobado se sumaran al saldo ',
                        { text: 'abonado.\n\n', bold: true, color: 'green' },
                    ]
                } */
            ],
            styles: {
                header: {
                    fontSize: 13,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 11,
                    bold: true,
                    margin: [0, 5, 0, 2]
                },
                tableBody: {
                    fontSize: 8,
                    margin: [0, 5, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9,
                    color: 'black'
                },
                small: {
                    fontSize: 8,
                    italics: true,
                    color: 'gray',
                    alignment: 'right'
                }
            }
        }
        let ruta = path.join(__dirname, `/public/uploads/estadodecuenta-${Proyeccion[0].cparacion}.pdf`);
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(ruta));
        pdfDoc.end();

        var dataFile = {
            phone: '573012673944',
            body: `https://grupoelitefincaraiz.co/uploads/estadodecuenta-${Proyeccion[0].cparacion}.pdf`,
            filename: `ESTADO DE CUENTA ${Proyeccion[0].cparacion}.pdf`
        };
        let r = await apiChatApi('sendFile', dataFile);
        r.msg = Proyeccion[0].cparacion;
        await EnviarEmail(
            's4m1r.5a@gmail.com', //Proyeccion[0].email
            `Estado de cuenta Lt: ${Proyeccion[0].n}`,
            Proyeccion[0].nombre,
            false,
            'Grupo Elite te da la bienvenida',
            [{ fileName: `Estado de cuenta ${Proyeccion[0].cparacion}.pdf`, ruta }]
        );
        return r  //JSON.stringify(estado);
    } else {
        return { sent: false };
    }
}
async function ReciboDeCaja(movil, nombre, author) {
    const estado = await pool.query(`SELECT pd.valor - p.ahorro AS total, pt.proyect, cu.pin AS cupon, cp.pin AS bono, s.stado, 
    p.ahorro, pd.mz, pd.n, pd.valor, p.vrmt2, p.fecha, s.fech, s.ids, s.formap, s.descp,s.monto, s.img, cu.descuento, p.id cparacion,
    c.nombre, c.documento, c.email, c.movil, cp.monto mtb, pd.mtr2 FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
    INNER JOIN productos pt ON pd.producto = pt.id INNER JOIN preventa p ON pd.id = p.lote 
    LEFT JOIN cupones cu ON cu.id = p.cupon LEFT JOIN cupones cp ON s.bono = cp.id
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc
    WHERE s.stado != 6 AND s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL 
    AND (c.movil LIKE '%${cel}%' OR c.code LIKE '%${cel}%' OR c.nombre = '${nombre}'
    OR c2.movil LIKE '%${cel}%' OR c2.code LIKE '%${cel}%' OR c2.nombre = '${nombre}'
    OR c3.movil LIKE '%${cel}%' OR c3.code LIKE '%${cel}%' OR c3.nombre = '${nombre}'
    OR c4.movil LIKE '%${cel}%' OR c4.code LIKE '%${cel}%' OR c4.nombre = '${nombre}')`);
    if (estado.length) {
        const cuerpo = []
        let totalAbonado = 0;
        estado.map((e, i) => {
            totalAbonado += e.stado === 4 ? e.monto : 0;
            if (!i) {
                cuerpo.push(
                    [
                        { text: `Area: ${e.mtr2} mt2`, style: 'tableHeader', colSpan: 2, alignment: 'center' },
                        {}, { text: `Vr Mt2: $${Moneda(e.vrmt2)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {},
                        { text: '$' + Moneda(e.valor), style: 'tableHeader', alignment: 'center', colSpan: 2 }, {}
                    ],
                    [
                        'Cupon', 'Dsto', { text: 'Ahorro', colSpan: 2 }, {},
                        { text: `Total lote`, colSpan: 2 }, {}
                    ],
                    [
                        { text: e.cupon, style: 'tableHeader', alignment: 'center' },
                        { text: `${e.descuento}%`, style: 'tableHeader', alignment: 'center' },
                        { text: `-$${Moneda(e.ahorro)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {},
                        { text: `$${Moneda(e.total)}`, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}
                    ],
                    ['Fecha', 'Recibo', 'Estado', 'Forma de pago', 'Tipo', 'Monto'],
                    [moment(e.fech).format('L'), `RC${e.ids}`,
                    { text: e.stado === 4 ? 'Aprobado' : 'Pendiente', color: e.stado === 4 ? 'green' : 'blue' },
                    e.formap, e.descp, {
                        text: '$' + Moneda(e.monto),
                        color: e.stado === 4 ? 'green' : 'blue',
                        decoration: e.stado !== 4 && 'lineThrough',
                        decorationStyle: e.stado !== 4 && 'double'
                    }]);
            } else {
                cuerpo.push([moment(e.fech).format('L'), `RC${e.ids}`,
                { text: e.stado === 4 ? 'Aprobado' : 'Pendiente', color: e.stado === 4 ? 'green' : 'blue' },
                e.formap, e.descp, {
                    text: '$' + Moneda(e.monto),
                    color: e.stado === 4 ? 'green' : 'blue',
                    decoration: e.stado !== 4 && 'lineThrough',
                    decorationStyle: e.stado !== 4 && 'double'
                }]);
            }
        })
        cuerpo.push(
            [
                { text: 'TOTAL ABONADO', style: 'tableHeader', alignment: 'center', colSpan: 4 }, {}, {}, {},
                { text: '$' + Moneda(totalAbonado), style: 'tableHeader', alignment: 'center', colSpan: 2 }, {}
            ],
            [
                { text: NumeroALetras(totalAbonado), style: 'small', colSpan: 6 },
                {}, {}, {}, {}, {}
            ],
            [
                { text: 'SALDO A LA FECHA', style: 'tableHeader', alignment: 'center', colSpan: 4 }, {}, {}, {},
                { text: '$' + Moneda(estado[0].total - totalAbonado), style: 'tableHeader', alignment: 'center', colSpan: 2 }, {}
            ],
            [
                { text: NumeroALetras(estado[0].total - totalAbonado), style: 'small', colSpan: 6 },
                {}, {}, {}, {}, {}
            ]
        )
        ////////////////////////* CREAR PDF *//////////////////////////////
        const printer = new PdfPrinter(Roboto);
        let docDefinition = {
            background: function (currentPage, pageSize) {
                return { image: path.join(__dirname, '/public/img/avatars/avatar1.png'), width: pageSize.width, opacity: 0.1 } //, height: pageSize.height
            },
            pageSize: {
                width: 595.28,
                height: 'auto'
            },
            /* footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
            header: function (currentPage, pageCount, pageSize) {
                // you can apply any logic and return any valid pdfmake element

                return [
                    { text: 'simple text', alignment: (currentPage % 2) ? 'right' : 'right' },
                    { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
                ]
            }, */
            //watermark: { text: 'Grupo Elite', color: 'blue', opacity: 0.1, bold: true, italics: false, fontSize: 200 }, //, angle: 180
            //watermark: { image: path.join(__dirname, '/public/img/avatars/avatar.png'), width: 100, opacity: 0.3, fit: [100, 100] }, //, angle: 180
            info: {
                title: 'Estado de cuenta',
                author: 'RedElite',
                subject: 'Detallado del estado de los pagos de un producto',
                keywords: 'estado de cuenta',
                creator: 'Grupo Elite',
                producer: 'G.E.'
            },
            content: [ // pageBreak: 'before',
                {
                    columns: [
                        [
                            { text: 'ESTADO DE CUENTA', style: 'header' },
                            'Conoce aqui el estado el estado de tus pagos y montos',
                            { text: estado[0].nombre, style: 'subheader' },
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 9, margin: [0, 0, 0, 5],
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
                            image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                            fit: [100, 100]
                        }
                    ]
                },
                {
                    style: 'tableBody',
                    color: '#444',
                    table: {
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        headerRows: 4,
                        // keepWithHeaderRows: 1,
                        body: cuerpo
                    }
                },
                {
                    fontSize: 11,
                    italics: true,
                    text: [
                        '\nLos montos que se muestran de color ',
                        { text: 'azul ', bold: true, color: 'blue' },
                        'no se suman al total  ',
                        { text: 'abonado, ', bold: true, color: 'green' },
                        'ya que estos montos aun no cuentan con la ',
                        { text: 'aprobacion ', bold: true, color: 'green' },
                        'del area de ',
                        { text: 'contabilidad. ', bold: true },
                        'Una ves se hallan aprobado se sumaran al saldo ',
                        { text: 'abonado.\n\n', bold: true, color: 'green' },
                    ]
                },
                {
                    columns: [
                        {
                            width: 100,
                            qr: 'https://grupoelitefincaraiz.com',
                            fit: '50',
                            foreground: 'yellow', background: 'black'
                        },
                        [
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 10,
                                columns: [
                                    { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                                    { text: 'https://grupoelitefincaraiz.com', link: 'https://grupoelitefincaraiz.com' }
                                ]
                            },
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 10,
                                columns: [
                                    { text: 'Nit: 901311748-3' },
                                    { text: 'info@grupoelitefincaraiz.co' }
                                ]
                            },
                            {
                                alignment: 'justify', italics: true, color: 'gray',
                                fontSize: 10,
                                columns: [
                                    { text: 'Mz L lt 17 Urb. la granja, Turbaco' },
                                    { text: '57 300-285-1046', link: 'https://wa.me/573007861987?text=Hola' }
                                ]
                            }
                        ]
                    ]
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
        let ruta = path.join(__dirname, `/public/uploads/estadodecuenta-${estado[0].cparacion}.pdf`);
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(ruta));
        pdfDoc.end();

        var dataFile = {
            phone: author,
            body: `https://grupoelitefincaraiz.co/uploads/estadodecuenta-${estado[0].cparacion}.pdf`,
            filename: `ESTADO DE CUENTA ${estado[0].cparacion}.pdf`
        };
        let r = await apiChatApi('sendFile', dataFile);
        r.msg = estado[0].cparacion;
        await EnviarEmail(
            estado[0].email,
            `Estado de cuenta Lt: ${estado[0].n}`,
            estado[0].nombre,
            false,
            'Grupo Elite te da la bienvenida',
            [{ fileName: `Estado de cuenta ${estado[0].cparacion}.pdf`, ruta }]
        );
        return r  //JSON.stringify(estado);
    } else {
        return { sent: false };
    }
}
async function Saldos(lote, fecha, solicitud) {
    console.log(lote, solicitud, fecha);
    const u = await pool.query(`SELECT * FROM solicitudes WHERE concepto IN('PAGO', 'ABONO') 
        AND lt = ${lote} AND stado = 3 AND TIMESTAMP(fech) < '${fecha}' AND ids != ${solicitud}`);
    //console.log(u)
    if (u.length > 0) return false;

    const r = await pool.query(`SELECT SUM(s.monto) AS monto1, 
        SUM(if (s.formap != 'BONO' AND s.bono IS NOT NULL, c.monto, 0)) AS monto 
        FROM solicitudes s LEFT JOIN cupones c ON s.bono = c.id 
        WHERE s.concepto IN('PAGO', 'ABONO') AND s.stado = 4 AND s.lt = ${lote}
        AND TIMESTAMP(s.fech) < '${fecha}' AND s.ids != ${solicitud}`);
    var l = r[0].monto1 || 0,
        k = r[0].monto || 0;
    var acumulado = l + k;

    return acumulado;
}
async function RecibosCaja(movil, nombre, author, reci) {
    const cel = movil.slice(-10);
    let sql = `SELECT l.valor - p.ahorro AS total, d.proyect, cu.pin AS cupon, cp.pin AS bono, s.stado, p.lote, c.direccion,
    p.ahorro, l.mz, l.n, l.valor, p.vrmt2, p.fecha, s.fech, s.ids, s.formap, s.descp,s.monto, s.img, cu.descuento, p.id cparacion,
    c.nombre, c.documento, c.email, c.movil, cp.monto mtb, l.mtr2, k.ncuota, k.mora, s.concepto FROM solicitudes s INNER JOIN productosd l ON s.lt = l.id 
    INNER JOIN productos d ON l.producto = d.id INNER JOIN preventa p ON l.id = p.lote 
    LEFT JOIN cupones cu ON cu.id = p.cupon LEFT JOIN cupones cp ON s.bono = cp.id 
    LEFT JOIN cuotas k ON k.id = s.pago 
    INNER JOIN clientes c ON p.cliente = c.idc LEFT JOIN clientes c2 ON p.cliente2 = c2.idc 
    LEFT JOIN clientes c3 ON p.cliente3 = c3.idc LEFT JOIN clientes c4 ON p.cliente4 = c4.idc
    WHERE s.stado != 6 AND s.concepto IN('PAGO', 'ABONO') AND p.tipobsevacion IS NULL `;
    sql += reci !== '##' ? 'AND s.ids = ' + reci
        : `AND (c.movil LIKE '%${cel}%' OR c.code LIKE '%${cel}%' OR c.nombre = '${nombre}'
           OR c2.movil LIKE '%${cel}%' OR c2.code LIKE '%${cel}%' OR c2.nombre = '${nombre}'
           OR c3.movil LIKE '%${cel}%' OR c3.code LIKE '%${cel}%' OR c3.nombre = '${nombre}'
           OR c4.movil LIKE '%${cel}%' OR c4.code LIKE '%${cel}%' OR c4.nombre = '${nombre}')`;

    sql += ' ORDER BY s.ids';
    const recibos = await pool.query(sql);
    let archivos = []; console.log(recibos)

    if (recibos.length) {

        const printer = new PdfPrinter(Roboto);
        for (i = 0; i < recibos.length; i++) {
            let e = recibos[i];
            //if (i === 3) { continue; } \n
            const saldo = await Saldos(e.lote, e.fech, e.ids);
            ////////////////////////* CREAR PDF *//////////////////////////////
            let docDefinition = {
                background: function (currentPage, pageSize) {
                    return { image: path.join(__dirname, '/public/img/avatars/avatar1.png'), width: pageSize.width, opacity: 0.1 }
                },
                header: function (currentPage, pageCount, pageSize) {
                    return [
                        {
                            width: 100, margin: [20, 10, 0, 0],
                            image: path.join(__dirname, '/public/img/avatars/logo.png'),
                            fit: [100, 100]
                        }
                    ]
                },
                footer: function (currentPage, pageCount) {
                    return [
                        {
                            columns: [
                                {
                                    margin: [0, 0, 0, 7],
                                    width: 50, alignment: 'center',
                                    image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                                    fit: [30, 30]
                                },
                                [
                                    {
                                        alignment: 'justify', italics: true, color: 'gray',
                                        fontSize: 8, margin: [0, 3, 0, 0],
                                        columns: [
                                            { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.', alignment: 'center' },
                                            { text: 'info@grupoelitefincaraiz.co', alignment: 'center' },
                                            { text: 'https://grupoelitefincaraiz.com', link: 'https://grupoelitefincaraiz.com', alignment: 'center' }
                                        ]
                                    },
                                    {
                                        alignment: 'justify', italics: true, color: 'gray',
                                        fontSize: 8, margin: [0, 0, 0, 7],
                                        columns: [
                                            { text: 'Nit: 901311748-3', alignment: 'center' },
                                            { text: '57 300-285-1046', link: 'https://wa.me/573007861987?text=Hola', alignment: 'center' },
                                            { text: 'Mz L lt 17 Urb. la granja, Turbaco', alignment: 'center' }
                                        ]
                                    }
                                ],
                                {
                                    margin: [0, 0, 0, 7],
                                    alignment: 'center',
                                    width: 50,
                                    qr: 'https://grupoelitefincaraiz.com',
                                    fit: '40',
                                    foreground: 'yellow', background: 'black'
                                }
                            ]
                        }
                    ]
                },
                pageSize: {
                    width: 595.28,
                    height: 297.53
                },
                info: {
                    title: 'Recibo de caja',
                    author: 'RedElite',
                    subject: 'Detallado del pago abonado a un producto',
                    keywords: 'recibo de caja',
                    creator: 'Grupo Elite',
                    producer: 'G.E.'
                },
                content: [
                    { text: 'RECIBO DE CAJA ' + e.ids, style: 'header', alignment: 'right' },
                    { text: moment(e.fech).format('lll'), style: 'small' },
                    {
                        columns: [
                            [
                                { text: e.nombre, style: 'subheader' },
                                {
                                    alignment: 'justify', italics: true, color: 'gray',
                                    fontSize: 9, margin: [0, 0, 0, 5],
                                    columns: [
                                        { text: `Doc. ${e.documento}` },
                                        { text: `Movil ${e.movil}` },
                                        { text: e.email },
                                    ]
                                },
                                {
                                    alignment: 'justify', italics: true,
                                    columns: [
                                        { width: 250, text: e.proyect },
                                        { text: `MZ: ${e.mz ? e.mz : 'No aplica'}` },
                                        { text: `LT: ${e.n}` }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        style: 'tableBody',
                        color: '#444',
                        fontSize: 9,
                        table: {
                            widths: ['*', 'auto', 'auto', '*'],
                            body: [
                                [
                                    { text: `TIPO`, style: 'tableHeader', alignment: 'center' },
                                    { text: `FORMA PAGO`, style: 'tableHeader', alignment: 'center' },
                                    { text: `CONCEPTO`, style: 'tableHeader', alignment: 'center' },
                                    { text: `CUOTA`, style: 'tableHeader', alignment: 'center' }
                                ],
                                [e.concepto, e.formap, e.descp, { text: e.ncuota ? e.ncuota : 'AL DIA', alignment: 'center' }],
                                [
                                    { text: `SLD. FECHA`, style: 'tableHeader' },
                                    { text: NumeroALetras(e.total - saldo), colSpan: 2, italics: true, bold: true },
                                    {}, { text: `$${Moneda(e.total - saldo)}`, italics: true, bold: true }
                                ],
                                [
                                    { text: `MONTO`, style: 'tableHeader' },
                                    { text: NumeroALetras(e.monto), colSpan: 2, italics: true, bold: true },
                                    {}, { text: `$${Moneda(e.monto)}`, italics: true, bold: true }
                                ],
                                [
                                    { text: `TOTAL SLD.`, style: 'tableHeader' },
                                    { text: NumeroALetras(e.total - saldo - e.monto), colSpan: 2, italics: true, bold: true },
                                    {}, { text: `$${Moneda(e.total - saldo - e.monto)}`, italics: true, bold: true }
                                ]
                            ]
                        }
                    },
                ],
                styles: {
                    header: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 0, 0, 1]
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 5, 0, 2]
                    },
                    tableBody: {
                        margin: [0, 5, 0, 5]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 10,
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

            let ruta = path.join(__dirname, `/public/uploads/recibocaja-${e.ids}.pdf`);
            let pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(fs.createWriteStream(ruta));
            pdfDoc.end();

            archivos.push({ fileName: `Recibo de caja-${e.ids}.pdf`, ruta });

            var dataFile = {
                phone: author,
                body: `https://grupoelitefincaraiz.co/uploads/recibocaja-${e.ids}.pdf`,
                filename: `RECIBO DE CAJA ${e.ids}.pdf`
            };
            let r = await apiChatApi('sendFile', dataFile);
            r.msg = e.cparacion;
        }

        await EnviarEmail(
            recibos[0].email,
            `Recibo de caja ${recibos[0].n}`,
            recibos[0].nombre,
            false,
            'Grupo Elite te da la bienvenida',
            archivos
        );
        return true;
    } else {
        return false;
    }
};
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
    //console.log(apiResponse.data)
    return apiResponse.data;
}
async function tasaUsura() {
    //const slow3G = puppeteer.networkConditions['Slow 3G']; 
    const Tex = '#vue-container > div.InternaIndicadores > div > div.flex-grow-1.wrapContentBody > div > div > div.grid-container > div > div > div.d-flex.CardDetailIndicator.multiple > div > div:nth-child(1) > div.priceIndicator > div > div.flex-grow-1 > span.price'
    const browser = await puppeteer.launch({ timeout: 1000000, headless: false });//{ headless: false }
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000000)
    //await page.emulateNetworkConditions(slow3G);
    await page.goto('https://www.larepublica.co/indicadores-economicos/bancos/tasa-de-usura');
    await page.waitForSelector(Tex);
    const tasa = await page.evaluate((Tex) => {
        return parseFloat(document.querySelector(Tex).innerText.slice(0, -2).replace(/,/, '.'));
    }, Tex);
    //console.log('Tasa:', tasa);

    await browser.close();
    return tasa;
}
async function consultarDocumentos(tipo, docu) {

    const pregResp = [
        { pre: "¿ Cuanto es 4 + 3 ?", res: "7" },
        { pre: "¿ Cuanto es 2 X 3 ?", res: "6" },
        { pre: "¿ Cual es la Capital del Vallle del Cauca?", res: "Cali" },
        { pre: "¿ Cual es la Capital de Antioquia (sin tilde)?", res: "Medellin" },
        { pre: "¿ Cual es la Capital del Atlantico?", res: "Barranquilla" },
        { pre: "¿ Cuanto es 9 - 2 ?", res: "7" },
        { pre: "¿ Cuanto es 5 + 3 ?", res: "8" },
        { pre: "¿ Cual es la Capital de Colombia (sin tilde)?", res: "Bogota" },
        { pre: "¿ Cuanto es 3 X 3 ?", res: "9" },
        { pre: "¿Escriba los dos ultimos digitos del documento a consultar?", res: docu.slice(-2) },
        { pre: "¿Escriba los tres primeros digitos del documento a consultar?", res: docu.slice(0, 3) }
    ]
    //const slow3G = puppeteer.networkConditions['Slow 3G']; 
    const tipoDoc = '#ddlTipoID'
    const cc = '#ddlTipoID > option:nth-child(2)'
    const browser = await puppeteer.launch(); //{ headless: false }
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000000)
    //await page.emulateNetworkConditions(slow3G);
    await page.goto("https://apps.procuraduria.gov.co/webcert/inicio.aspx?tpo=1");
    await page.waitForSelector(tipoDoc);
    await page.select(tipoDoc, tipo);
    await page.type('#txtNumID', docu);
    const Query = await page.$eval('#lblPregunta', e => e.innerText);
    let res = pregResp.filter((e) => e.pre === Query)
    //console.log(Query, res[0]?.res);

    while (!res[0]?.res) {
        await page.click('#ImageButton1', { delay: 500 });
        await page.waitForSelector('#lblPregunta');
        const Query = await page.$eval('#lblPregunta', e => e.innerText);
        res = pregResp.filter((e) => e.pre === Query);
        //console.log(Query, res[0]?.res, !!res[0]?.res);
    }
    await page.type('#txtRespuestaPregunta', res[0]?.res);
    await page.click('#btnConsultar');
    await page.waitForTimeout(3000)
    const Nombres = await page.$$eval('#divSec > div > span', e => e.map(r => r.innerText));
    const Antecedentes = await page.$eval('#divSec > h2', e => e.innerText);
    console.log(Nombres, Antecedentes)
    //document.querySelector('#lblPregunta').children[1].selected = true

    await browser.close();
    return { Nombres, Antecedentes };
} //consultarDocumentos('1', '3817359')

module.exports = {
    NumeroALetras,
    EstadoCuenta,
    apiChatApi,
    QuienEs,
    EnviarEmail,
    RecibosCaja,
    tasaUsura,
    consultarDocumentos,
    EstadoDeCuenta
};