const nodemailer = require('nodemailer');
const pool = require('./database');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake');
const Roboto = require('./public/fonts/Roboto');
const moment = require('moment');
const e = require('connect-flash');
//const puppeteer = require('puppeteer');

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

const noCifra = valor => {
  if (!valor) return 0;
  const num = /[^0-9.-]/g.test(valor)
    ? parseFloat(valor.replace(/[^0-9.]/g, ''))
    : parseFloat(valor);
  if (typeof num != 'number') throw TypeError('El argumento no puede ser de tipo string');
  return num;
};
const Cifra = valor => {
  if (!valor) return 0;
  const punto = /\.$/.test(valor);
  const num = /[^0-9.-]/g.test(valor)
    ? parseFloat(valor.replace(/[^0-9.]/g, ''))
    : parseFloat(valor);
  if (typeof num != 'number') throw TypeError('El argumento no puede ser de tipo string');
  return punto
    ? num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '.'
    : num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};
const Percent = valor => {
  if (!valor) return valor;
  const punto = /\.$/.test(valor);
  const num =
    (/[^0-9.]/g.test(valor) ? parseFloat(valor.replace(/[^0-9.]/g, '')) : parseFloat(valor)) / 100;
  if (typeof num != 'number') throw TypeError('El argumento no puede ser de tipo string');
  return punto
    ? num.toLocaleString('en-CO', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }) + '.'
    : num.toLocaleString('en-CO', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
};

function ID(lon) {
  let chars = '0A1B2C3D4E5F6G7H8I9J0KL1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z',
    code = '';
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}
function ID2(lon) {
  let chars = '1234567890',
    code = '';
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}
var normalize = (function () {
  var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
    to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnCc',
    mapping = {};

  for (var i = 0, j = from.length; i < j; i++) mapping[from.charAt(i)] = to.charAt(i);

  return function (str) {
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
      var c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
      else ret.push(c);
    }
    return ret.join('');
  };
})();
async function Desendentes(pin, stados) {
  if (stados != 10) {
    return false;
  }
  let linea = '',
    lDesc = '';
  var hoy = moment().format('YYYY-MM-DD');
  var month = moment().subtract(3, 'month').format('YYYY-MM-DD');
  var venta = 0,
    bono = 0,
    bonop = 0,
    personal = 0;

  const asesor = await pool.query(
    `SELECT * FROM pines p INNER JOIN users u ON p.acreedor = u.id 
    INNER JOIN rangos r ON u.nrango = r.id WHERE p.id = ? LIMIT 1`,
    pin
  );

  var j = asesor[0];
  const directas = await pool.query(
    `SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE p.asesor = ? AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`,
    j.acreedor
  );

  if (directas.length > 0) {
    await directas.map(async (a, x) => {
      var val = a.valor - a.ahorro;
      var monto = val * j.comision;
      var retefuente = monto * 0.1;
      var reteica = (monto * 8) / 1000;
      personal += val;
      if (a.directa === null) {
        bonop += val;
        var f = {
          fech: hoy,
          monto,
          concepto: 'COMISION DIRECTA',
          stado: 9,
          descp: 'VENTA DIRECTA',
          asesor: j.acreedor,
          porciento: j.comision,
          total: val,
          lt: a.lote,
          retefuente,
          reteica,
          pagar: monto - (retefuente + reteica)
        };
        await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ directa: j.acreedor }, a.lote]);
        await pool.query(`INSERT INTO solicitudes SET ?`, f);
      }
    });
  }

  const lineaUno = await pool.query(
    `SELECT * FROM pines WHERE usuario = ? AND usuario IS NOT NULL`,
    j.acreedor
  );

  if (lineaUno.length > 0) {
    await lineaUno.map((p, x) => {
      lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
      linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`;
    });

    const reporte = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

    if (reporte.length > 0) {
      await reporte.map(async (a, x) => {
        var val = a.valor - a.ahorro;
        var monto = val * j.nivel1;
        var retefuente = monto * 0.1;
        var reteica = (monto * 8) / 1000;
        venta += val;
        if (a.uno === null) {
          bono += val;
          var f = {
            fech: hoy,
            monto,
            concepto: 'COMISION INDIRECTA',
            stado: 9,
            descp: 'PRIMERA LINEA',
            asesor: j.acreedor,
            porciento: j.nivel1,
            total: val,
            lt: a.lote,
            retefuente,
            reteica,
            pagar: monto - (retefuente + reteica)
          };
          await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ uno: j.acreedor }, a.lote]);
          await pool.query(`INSERT INTO solicitudes SET ?`, f);
        }
      });
    }

    const lineaDos = await pool.query(`SELECT * FROM pines WHERE ${linea}`);
    (lDesc = ''), (linea = '');
    await lineaDos.map((p, x) => {
      lDesc += x === 0 ? `p.asesor = ${p.acreedor}` : ` OR p.asesor = ${p.acreedor}`;
      linea += x === 0 ? `usuario = ${p.acreedor}` : ` OR usuario = ${p.acreedor}`;
    });

    const reporte2 = await pool.query(`SELECT * FROM preventa p 
    INNER JOIN productosd l ON p.lote = l.id
    INNER JOIN productos o ON l.producto = o.id
    INNER JOIN users u ON p.asesor = u.id
    INNER JOIN clientes c ON p.cliente = c.idc
    WHERE (${lDesc}) AND l.estado = 10 AND l.fechar BETWEEN '${month}' and '${hoy}'`);

    if (reporte2.length > 0) {
      await reporte2.map(async (a, x) => {
        var val = a.valor - a.ahorro;
        var monto = val * j.nivel2;
        var retefuente = monto * 0.1;
        var reteica = (monto * 8) / 1000;
        venta += val;
        if (a.dos === null) {
          bono += val;
          var f = {
            fech: hoy,
            monto,
            concepto: 'COMISION INDIRECTA',
            stado: 9,
            descp: 'SEGUNDA LINEA',
            asesor: j.acreedor,
            porciento: j.nivel2,
            total: val,
            lt: a.lote,
            retefuente,
            reteica,
            pagar: monto - (retefuente + reteica)
          };
          await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ dos: j.acreedor }, a.lote]);
          await pool.query(`INSERT INTO solicitudes SET ?`, f);
        }
      });
    }

    const lineaTres = await pool.query(`SELECT * FROM pines WHERE ${linea}`);
    (lDesc = ''), (linea = '');
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
        var val = a.valor - a.ahorro;
        var monto = val * j.nivel3;
        var retefuente = monto * 0.1;
        var reteica = (monto * 8) / 1000;
        venta += val;
        if (a.tres === null) {
          bono += val;
          var f = {
            fech: hoy,
            monto,
            concepto: 'COMISION INDIRECTA',
            stado: 9,
            descp: 'TERCERA LINEA',
            asesor: j.acreedor,
            porciento: j.nivel3,
            total: val,
            lt: a.lote,
            retefuente,
            reteica,
            pagar: monto - (retefuente + reteica)
          };
          await pool.query(`UPDATE productosd SET ? WHERE id = ?`, [{ tres: j.acreedor }, a.lote]);
          await pool.query(`INSERT INTO solicitudes SET ?`, f);
        }
      });
    }
  }
  var rango = j.nrango;
  var tot = venta + personal;
  if (personal >= j.venta && tot >= j.ventas) {
    if (tot >= 500000000 && tot < 1000000000) {
      var retefuente = j.premio * 0.1;
      var reteica = (j.premio * 8) / 1000;
      var f = {
        fech: hoy,
        monto: j.premio,
        concepto: 'PREMIACION',
        stado: 9,
        descp: 'ASENSO A DIRECTOR',
        asesor: j.acreedor,
        total: tot,
        retefuente,
        reteica,
        pagar: j.premio - (retefuente + reteica)
      };
      await pool.query(`INSERT INTO solicitudes SET ?`, f);
      await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 4 }, j.acreedor]);
      rango = 4;
    } else if (tot >= 1000000000 && tot < 2000000000) {
      var retefuente = j.premio * 0.1;
      var reteica = (j.premio * 8) / 1000;
      var f = {
        fech: hoy,
        monto: j.premio,
        concepto: 'PREMIACION',
        stado: 9,
        descp: 'ASENSO A GERENTE',
        asesor: j.acreedor,
        total: tot,
        retefuente,
        reteica,
        pagar: j.premio - (retefuente + reteica)
      };
      await pool.query(`INSERT INTO solicitudes SET ?`, f);
      await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 3 }, j.acreedor]);
      rango = 3;
    } else if (tot >= 2000000000 && tot < 3000000000) {
      var retefuente = j.premio * 0.1;
      var reteica = (j.premio * 8) / 1000;
      var f = {
        fech: hoy,
        monto: j.premio,
        concepto: 'PREMIACION',
        stado: 9,
        descp: 'ASENSO A VICEPRESIDENTE',
        asesor: j.acreedor,
        total: tot,
        retefuente,
        reteica,
        pagar: j.premio - (retefuente + reteica)
      };
      await pool.query(`INSERT INTO solicitudes SET ?`, f);
      await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 2 }, j.acreedor]);
      rango = 2;
    } else if (tot >= 300000000) {
      var retefuente = j.premio * 0.1;
      var reteica = (j.premio * 8) / 1000;
      var f = {
        fech: hoy,
        monto: j.premio,
        concepto: 'PREMIACION',
        stado: 9,
        descp: 'ASENSO A PRESIDENTE',
        asesor: j.acreedor,
        total: tot,
        retefuente,
        reteica,
        pagar: j.premio - (retefuente + reteica)
      };
      await pool.query(`INSERT INTO solicitudes SET ?`, f);
      await pool.query(`UPDATE users SET ? WHERE id = ?`, [{ nrango: 1 }, j.acreedor]);
      rango = 1;
    }
  }
  var bonus = j.bono;
  if (rango !== j.nrango) {
    const ucr = await pool.query(`SELECT * FROM users WHERE id = ?`, j.acreedor);
    rango = ucr[0].nrango;
    bonus = ucr[0].bono;
  }

  if (rango === 5) {
    await pool.query(
      `DELETE FROM solicitudes WHERE concepto = 'COMISION INDIRECTA' AND asesor = ?`,
      j.acreedor
    );
  } else if (rango === 3) {
    var monto = bonop * bonus;
    var retefuente = monto * 0.1;
    var reteica = (monto * 8) / 1000;
    var f = {
      fech: hoy,
      monto,
      concepto: 'BONO',
      stado: 9,
      porciento: bonus,
      descp: 'BONO GERENCIAL',
      asesor: j.acreedor,
      total: bonop,
      retefuente,
      reteica,
      pagar: monto - (retefuente + reteica)
    };
    await pool.query(`INSERT INTO solicitudes SET ?`, f);
  } else if (rango === 2 || rango === 1) {
    var monto = (bonop + bono) * bonus;
    var retefuente = monto * 0.1;
    var reteica = (monto * 8) / 1000;
    var f = {
      fech: hoy,
      monto,
      concepto: 'BONO',
      stado: 9,
      porciento: bonus,
      descp: 'BONO PRESIDENCIAL',
      asesor: j.acreedor,
      total: bonop + bono,
      retefuente,
      reteica,
      pagar: monto - (retefuente + reteica)
    };
    await pool.query(`INSERT INTO solicitudes SET ?`, f);
  }
  return true;
}
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
  if (valor) {
    valor = valor
      .toString()
      .split('')
      .reverse()
      .join('')
      .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
    return valor;
  }
  return 0;
}
/*const SCOPES = ['https://www.googleapis.com/auth/contacts'];
const TOKEN_PATH = 'token.json';
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listConnectionNames);
});*/
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = Contactos;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);

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
    scope: SCOPES
  });
  console.log('Autorice esta aplicación visitando esta url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Ingrese el código de esa página aquí: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Almacenar el token en el disco para posteriores ejecuciones del programa
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token almacenado en', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
function listConnectionNames(auth) {
  const service = google.people({ version: 'v1', auth });
  service.people.connections.list(
    {
      resourceName: 'people/me',
      pageSize: 100,
      personFields:
        'biographies,birthdays,coverPhotos,emailAddresses,events,genders,imClients,interests,locales,memberships,metadata,names,nicknames,occupations,organizations,phoneNumbers,photos,relations,residences,sipAddresses,skills,urls,userDefined'
    },
    (err, res) => {
      if (err) return console.error('The API returned an error: ' + err);
      const connections = res.data.connections;
      if (connections) {
        console.log('Connections:');
        connections.forEach(person => {
          if (person.names && person.names.length > 0) {
            console.log(person.names);
          } else {
            console.log('No display name found for connection.');
          }
        });
      } else {
        console.log('No connections found.');
      }
    }
  );
}
//////////////* CIFRAS EN LETRAS *///////////////////
function Unidades(num) {
  switch (num) {
    case 1:
      return 'UN';
    case 2:
      return 'DOS';
    case 3:
      return 'TRES';
    case 4:
      return 'CUATRO';
    case 5:
      return 'CINCO';
    case 6:
      return 'SEIS';
    case 7:
      return 'SIETE';
    case 8:
      return 'OCHO';
    case 9:
      return 'NUEVE';
  }

  return '';
} //Unidades()
function Decenas(num) {
  decena = Math.floor(num / 10);
  unidad = num - decena * 10;

  switch (decena) {
    case 1:
      switch (unidad) {
        case 0:
          return 'DIEZ';
        case 1:
          return 'ONCE';
        case 2:
          return 'DOCE';
        case 3:
          return 'TRECE';
        case 4:
          return 'CATORCE';
        case 5:
          return 'QUINCE';
        default:
          return 'DIECI' + Unidades(unidad);
      }
    case 2:
      switch (unidad) {
        case 0:
          return 'VEINTE';
        default:
          return 'VEINTI' + Unidades(unidad);
      }
    case 3:
      return DecenasY('TREINTA', unidad);
    case 4:
      return DecenasY('CUARENTA', unidad);
    case 5:
      return DecenasY('CINCUENTA', unidad);
    case 6:
      return DecenasY('SESENTA', unidad);
    case 7:
      return DecenasY('SETENTA', unidad);
    case 8:
      return DecenasY('OCHENTA', unidad);
    case 9:
      return DecenasY('NOVENTA', unidad);
    case 0:
      return Unidades(unidad);
  }
} //Decenas()
function DecenasY(strSin, numUnidades) {
  if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades);

  return strSin;
} //DecenasY()
function Centenas(num) {
  centenas = Math.floor(num / 100);
  decenas = num - centenas * 100;

  switch (centenas) {
    case 1:
      if (decenas > 0) return 'CIENTO ' + Decenas(decenas);
      return 'CIEN';
    case 2:
      return 'DOSCIENTOS ' + Decenas(decenas);
    case 3:
      return 'TRESCIENTOS ' + Decenas(decenas);
    case 4:
      return 'CUATROCIENTOS ' + Decenas(decenas);
    case 5:
      return 'QUINIENTOS ' + Decenas(decenas);
    case 6:
      return 'SEISCIENTOS ' + Decenas(decenas);
    case 7:
      return 'SETECIENTOS ' + Decenas(decenas);
    case 8:
      return 'OCHOCIENTOS ' + Decenas(decenas);
    case 9:
      return 'NOVECIENTOS ' + Decenas(decenas);
  }

  return Decenas(decenas);
} //Centenas()
function Seccion(num, divisor, strSingular, strPlural) {
  cientos = Math.floor(num / divisor);
  resto = num - cientos * divisor;

  letras = '';

  if (cientos > 0)
    if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural;
    else letras = strSingular;

  if (resto > 0) letras += '';

  return letras;
} //Seccion()
function Miles(num) {
  divisor = 1000;
  cientos = Math.floor(num / divisor);
  resto = num - cientos * divisor;

  strMiles = Seccion(num, divisor, 'MIL', 'MIL');
  strCentenas = Centenas(resto);

  if (strMiles == '') return strCentenas;

  return strMiles + ' ' + strCentenas;

  //return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
} //Miles()
function Millones(num) {
  divisor = 1000000;
  cientos = Math.floor(num / divisor);
  resto = num - cientos * divisor;

  strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES');
  strMiles = Miles(resto);

  if (strMillones == '') return strMiles;

  return strMillones + ' ' + strMiles;

  //return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
} //Millones()
function NumeroALetras(num, centavos) {
  var data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: Math.round(num * 100) - Math.floor(num) * 100,
    letrasCentavos: ''
  };
  if (centavos == undefined || centavos == false) {
    data.letrasMonedaPlural = 'PESOS';
    data.letrasMonedaSingular = 'PESO';
  } else {
    data.letrasMonedaPlural = 'CENTAVOS';
    data.letrasMonedaSingular = 'CENTAVO';
  }

  if (data.centavos > 0) data.letrasCentavos = 'CON ' + NumeroALetras(data.centavos, true);

  if (data.enteros == 0) return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  if (data.enteros == 1) {
    res = Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
    if (res.indexOf('UN MILLON  PESO') > 0)
      return res.replace('UN MILLON  PESO', 'UN MILLON DE PESO');
    return res;
  } else {
    res = Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    if (res.indexOf('MILLONES  PESOS') > 0)
      return res.replace('MILLONES  PESOS', 'MILLONES DE PESOS');
    return res;
  }
} //NumeroALetras()
//////////////* CIFRAS EN LETRAS END *///////////////////

//////////////* EMAILS *////////////////////////////////
async function EnviarEmail(email, asunto, destinatario, html, texto, archivos) {
  let data = {
    from: "'GRUPO ELITE' <info@grupoelitefincaraiz.co>",
    to: email,
    subject: asunto
  };
  html ? (data.html = texto) : (data.text = destinatario + ' ' + texto);
  if (Array.isArray(archivos) && archivos.length) {
    data.attachments = archivos.map((e, i) => {
      return {
        // file on disk as an attachment
        filename: e.fileName,
        path: e.ruta // stream this file
      };
    });
  }
  console.log(data);
  envio = await transpoter.sendMail(data);
  //console.log(envio)
}
//////////////* EMAILS END *////////////////////////////////
async function QuienEs(document, chatId) {
  const cliente = await pool.query(`SELECT * FROM clientes WHERE documento = ?`, document);
  if (cliente.length) {
    const Id = ID(5) + '@7';
    EnviarEmail(
      cliente[0].email,
      'Comprobacion de identidad',
      cliente[0].nombre,
      false,
      `Su codigo de comprobacion es ${Id}`
    );
    let email = cliente[0].email.split('@');
    encrip = email[0].slice(0, 2) + '****' + email[0].slice(-3) + '@' + email[1];
    await pool.query(`UPDATE clientes SET code = ? WHERE  documento = ?`, [Id, document]);
    apiChatApi('message', {
      chatId: chatId,
      body: `_🙂 Muy bien *${
        cliente[0].nombre.split(' ')[0]
      }*, para terminar con la verificación, ve a tu *correo* electrónico 📧 y escríbenos *aquí* 👇🏽 el *código de comprobación* 🔐 que te enviamos al ${encrip}, recuerda que si no lo ves en tu *bandeja de entrada* puede que este en tus *"Spam"* o *"Correo no deseado"*_`
    });
    return true;
  } else {
    await pool.query(`UPDATE clientes SET code = NULL WHERE  documento = ?`, document);
    apiChatApi('message', {
      chatId: chatId,
      body: `😞 Lo sentimos no encontramos a nadie con ese numero de documento en nuestro sistema`
    });
  }
}
async function EstadoCuenta(movil, nombre, author) {
  const cel = movil.slice(-10);
  const estado =
    await pool.query(`SELECT pd.valor - p.ahorro AS total, pt.proyect, cu.pin AS cupon, cp.pin AS bono, s.stado, 
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
    const cuerpo = [];
    let totalAbonado = 0;
    estado.map((e, i) => {
      totalAbonado += e.stado === 4 ? e.monto : 0;
      if (!i) {
        cuerpo.push(
          [
            {
              text: `Area: ${e.mtr2} mt2`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {},
            {
              text: `Vr Mt2: $${Moneda(e.vrmt2)}`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {},
            {
              text: '$' + Moneda(e.valor),
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2
            },
            {}
          ],
          [
            'Cupon',
            'Dsto',
            { text: 'Ahorro', colSpan: 2 },
            {},
            { text: `Total lote`, colSpan: 2 },
            {}
          ],
          [
            { text: e.cupon, style: 'tableHeader', alignment: 'center' },
            {
              text: `${e.descuento}%`,
              style: 'tableHeader',
              alignment: 'center'
            },
            {
              text: `-$${Moneda(e.ahorro)}`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {},
            {
              text: `$${Moneda(e.total)}`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {}
          ],
          ['Fecha', 'Recibo', 'Estado', 'Forma de pago', 'Tipo', 'Monto'],
          [
            moment(e.fech).format('L'),
            `RC${e.ids}`,
            {
              text: e.stado === 4 ? 'Aprobado' : 'Pendiente',
              color: e.stado === 4 ? 'green' : 'blue'
            },
            e.formap,
            e.descp,
            {
              text: '$' + Moneda(e.monto),
              color: e.stado === 4 ? 'green' : 'blue',
              decoration: e.stado !== 4 && 'lineThrough',
              decorationStyle: e.stado !== 4 && 'double'
            }
          ]
        );
      } else {
        cuerpo.push([
          moment(e.fech).format('L'),
          `RC${e.ids}`,
          {
            text: e.stado === 4 ? 'Aprobado' : 'Pendiente',
            color: e.stado === 4 ? 'green' : 'blue'
          },
          e.formap,
          e.descp,
          {
            text: '$' + Moneda(e.monto),
            color: e.stado === 4 ? 'green' : 'blue',
            decoration: e.stado !== 4 && 'lineThrough',
            decorationStyle: e.stado !== 4 && 'double'
          }
        ]);
      }
    });
    cuerpo.push(
      [
        {
          text: 'TOTAL ABONADO',
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 4
        },
        {},
        {},
        {},
        {
          text: '$' + Moneda(totalAbonado),
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 2
        },
        {}
      ],
      [{ text: NumeroALetras(totalAbonado), style: 'small', colSpan: 6 }, {}, {}, {}, {}, {}],
      [
        {
          text: 'SALDO A LA FECHA',
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 4
        },
        {},
        {},
        {},
        {
          text: '$' + Moneda(estado[0].total - totalAbonado),
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 2
        },
        {}
      ],
      [
        {
          text: NumeroALetras(estado[0].total - totalAbonado),
          style: 'small',
          colSpan: 6
        },
        {},
        {},
        {},
        {},
        {}
      ]
    );
    ////////////////////////* CREAR PDF *//////////////////////////////
    const printer = new PdfPrinter(Roboto);
    let docDefinition = {
      background: function (currentPage, pageSize) {
        return {
          image: path.join(__dirname, '/public/img/avatars/avatar1.png'),
          width: pageSize.width,
          opacity: 0.1
        }; //, height: pageSize.height
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
      content: [
        // pageBreak: 'before',
        {
          columns: [
            [
              { text: 'ESTADO DE CUENTA', style: 'header' },
              'Conoce aqui el estado el estado de tus pagos y montos',
              { text: estado[0].nombre, style: 'subheader' },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 9,
                margin: [0, 0, 0, 5],
                columns: [
                  { text: `Doc. ${estado[0].documento}` },
                  { text: `Movil ${estado[0].movil}` },
                  { text: estado[0].email }
                ]
              },
              {
                alignment: 'justify',
                italics: true,
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
            { text: 'abonado.\n\n', bold: true, color: 'green' }
          ]
        },
        {
          columns: [
            {
              width: 100,
              qr: 'https://grupoelitefincaraiz.com',
              fit: '50',
              foreground: 'yellow',
              background: 'black'
            },
            [
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 10,
                columns: [
                  { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                  {
                    text: 'https://grupoelitefincaraiz.com',
                    link: 'https://grupoelitefincaraiz.com'
                  }
                ]
              },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 10,
                columns: [{ text: 'Nit: 901311748-3' }, { text: 'info@grupoelitefincaraiz.co' }]
              },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 10,
                columns: [
                  { text: 'Mz L lt 17 Urb. la granja, Turbaco' },
                  {
                    text: '57 300-285-1046',
                    link: 'https://wa.me/573007861987?text=Hola'
                  }
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
    };
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
    return r; //JSON.stringify(estado);
  } else {
    return { sent: false };
  }
}
async function FacturaDeCobro(ids) {
  const Proyeccion = await pool.query(`SELECT s.ids, s.fech, s.monto, s.concepto, 
    s.porciento, s.total, u.fullname nam, u.cel clu, u.username mail, pd.mz, pr.id, 
    pd.n, s.retefuente, s.pagar, s.lt, cl.nombre, p.proyect, u.document, p.imagenes,
    s.stado FROM solicitudes s INNER JOIN productosd pd ON s.lt = pd.id 
    INNER JOIN users u ON s.asesor = u.id  INNER JOIN preventa pr ON pr.lote = pd.id 
    INNER JOIN productos p ON pd.producto = p.id INNER JOIN clientes cl ON pr.cliente = cl.idc 
    WHERE s.ids IN(${ids})`);
  let cuerpo = [];
  if (Proyeccion.length) {
    Proyeccion.map((e, i) => {
      let std;
      switch (e.stado) {
        case 1:
          std = 'Auditando';
          break;
        case 4:
          std = 'Pagada';
          break;
        case 6:
          std = 'Declinada';
          break;
        case 3:
          std = 'Pendiente';
          break;
        case 15:
          std = 'Inactiva';
          break;
        case 9:
          std = 'Disponible';
          break;
        default:
          std = 'En espera';
      }
      if (!i) {
        cuerpo.push(
          [
            { text: `Id`, style: 'tableHeader', alignment: 'center' },
            { text: `Orden`, style: 'tableHeader', alignment: 'center' },
            { text: 'Fecha', style: 'tableHeader', alignment: 'center' },
            //{ text: 'Cliente', style: 'tableHeader', alignment: 'center' },
            //{ text: 'Proyecto', style: 'tableHeader', alignment: 'center' },
            { text: 'Mz', style: 'tableHeader', alignment: 'center' },
            { text: 'Lt', style: 'tableHeader', alignment: 'center' },
            { text: 'Concepto', style: 'tableHeader', alignment: 'center' },
            { text: 'Estado', style: 'tableHeader', alignment: 'center' },
            { text: 'Venta', style: 'tableHeader', alignment: 'center' },
            { text: '%', style: 'tableHeader', alignment: 'center' },
            { text: 'Monto', style: 'tableHeader', alignment: 'center' }
            /* { text: 'Iva', style: 'tableHeader', alignment: 'center' },
            { text: 'Total', style: 'tableHeader', alignment: 'center' } */
          ],
          [
            e.ids,
            e.id,
            { text: moment(e.fech).format('L'), alignment: 'center' },
            //e.proyect,
            e.mz,
            e.n,
            e.concepto, //e.nombre,
            std,
            { text: '$' + Cifra(e.total || 0), alignment: 'center' },
            e.porciento * 100 + '%',
            { text: '$' + Cifra(e.monto || 0), alignment: 'right' }
            /* '$' + Moneda(e.retefuente),
            '$' + Moneda(e.pagar) */
          ]
        );
      } else {
        cuerpo.push([
          e.ids,
          e.id,
          { text: moment(e.fech).format('L'), alignment: 'center' },
          //e.proyect,
          e.mz,
          e.n,
          e.concepto, //, e.nombre
          std,
          { text: '$' + Cifra(e.total || 0), alignment: 'center' },
          e.porciento * 100 + '%',
          { text: '$' + Cifra(e.monto || 0), alignment: 'right' }
          /* '$' + Moneda(e.retefuente),
          '$' + Moneda(e.pagar) */
        ]);
      }
    });
    console.log(Proyeccion[0].imagenes);
    ////////////////////////* CREAR PDF *//////////////////////////////
    const printer = new PdfPrinter(Roboto);
    let docDefinition = {
      background: function (currentPage, pageSize) {
        return {
          image: path.join(__dirname, '/public/img/avatars/avatar1.png'),
          width: pageSize.width,
          opacity: 0.1
        }; //, height: pageSize.height
      },
      pageSize: 'a4',
      /* footer: function (currentPage, pageCount) {
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
                alignment: 'justify',
                italics: true,
                color: 'gray',
                margin: [0, 7, 0, 0],
                fontSize: 8,
                columns: [
                  { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                  { text: 'info@grupoelitefincaraiz.co' },
                  {
                    text: 'https://grupoelitefincaraiz.com',
                    link: 'https://grupoelitefincaraiz.com'
                  }
                ]
              },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 8,
                columns: [
                  { text: 'Nit: 901311748-3' },
                  {
                    text: '57 300-285-1046',
                    link: 'https://wa.me/573007861987?text=Hola'
                  },
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
      }, */
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
        ];
      },
      info: {
        title: 'Estado de cuenta',
        author: 'RedElite',
        subject: 'Detallado del estado de los pagos de un producto',
        keywords: 'estado de cuenta',
        creator: 'Grupo Elite',
        producer: 'G.E.'
      },
      content: [
        // pageBreak: 'before',
        {
          columns: [
            [
              { text: Proyeccion[0].proyect, style: 'header' },
              { text: 'Estado de comisiones', style: 'subheader' }
              /* {
                                text: `Doc. ${Proyeccion[0].document}         Movil ${Proyeccion[0].clu}        ${Proyeccion[0].mail}`,
                                italics: true, color: 'gray', fontSize: 9
                            } */
            ],
            {
              width: 100,
              image: path.join(
                __dirname,
                Proyeccion[0].imagenes
                  ? '/public' + Proyeccion[0].imagenes
                  : '/public/img/avatars/avatar.png'
              ),
              fit: [100, 100]
            }
          ]
        },
        {
          style: 'tableBody',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto', '*'],
            headerRows: 1,
            // keepWithHeaderRows: 1,
            body: cuerpo
          }
        }
        /* { text: 'A continuacion se describiran los totales de la tabla anterior', style: 'subheader' },
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
                }, */
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
    };
    let ruta = path.join(__dirname, `/public/uploads/facturasdecobro-${Proyeccion[0].ids}.pdf`);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(ruta));
    pdfDoc.end();
    return `/uploads/facturasdecobro-${Proyeccion[0].ids}.pdf`;
  }
}
async function Facturar(numFactura) {
  const [factura] = await pool.query(`SELECT * FROM facturas WHERE id = ?`, numFactura);

  if (factura) {
    const cuerpo = [
      [
        { text: 'Producto', style: 'tableHeader', alignment: 'center' },
        { text: `Vence`, style: 'tableHeader', alignment: 'center' },
        { text: '#', style: 'tableHeader', alignment: 'center' },
        { text: 'Precio', style: 'tableHeader', alignment: 'center' },
        { text: 'Total', style: 'tableHeader', alignment: 'center' }
      ]
    ];
    // fecha hasta cuando se cobrara o congelara una mora en la que el sistema dejara de cobrar mora
    //let endDate = moment(acuerdos[acuerdoActual]?.end).format('YYYY-MM-DD'); // fecha fin de un acuerdo prestablecido en la que el sistema dejara de congelar la mora

    JSON.parse(factura.articles).map((e, i) => {
      cuerpo.push([e[1], e[2], e[3], '$' + Cifra(e[4]), '$' + Cifra(e[5])]);
    });

    cuerpo.push(
      [
        {
          text: 'TOTAL',
          alignment: 'center',
          colSpan: 4,
          fontSize: 11,
          bold: true,
          color: 'black'
        },
        {},
        {},
        {},
        {
          text: '$' + Cifra(factura.total),
          alignment: 'center',
          fontSize: 11,
          bold: true,
          color: 'black'
        }
      ],
      [{ text: NumeroALetras(factura.total), style: 'smallx', colSpan: 5 }, {}, {}, {}, {}]
    );

    ////////////////////////* CREAR PDF *//////////////////////////////
    const printer = new PdfPrinter(Roboto);
    let docDefinition = {
      background: function (currentPage, pageSize) {
        return {
          image: path.join(__dirname, '/public/img/avatars/jgelvis.png'),
          width: pageSize.width,
          opacity: 0.1
        };
      },
      pageSize: 'a4',
      header: function (currentPage, pageCount, pageSize) {
        return {
          alignment: 'right',
          margin: [10, 3, 10, 3],
          columns: [
            {
              text: moment().format('lll'),
              alignment: 'left',
              margin: [10, 15, 15, 0],
              italics: true,
              color: 'gray',
              fontSize: 7
            },
            {
              width: 20,
              alignment: 'right',
              margin: [10, 3, 10, 3],
              image: path.join(__dirname, '/public/img/avatars/jgelvis.png'),
              fit: [20, 20]
            }
          ]
        };
      },
      info: {
        title: 'Factura',
        author: 'Inmovilii',
        subject: 'Factura de venta',
        keywords: 'Factura de venta de medicamentos',
        creator: 'Inmovilii',
        producer: 'IMOVI'
      },
      content: [
        {
          columns: [
            {
              width: 100,
              image: path.join(__dirname, '/public/img/jgelvis.qr.png'),
              fit: [100, 100]
            },
            [
              { text: 'JGELVIS', fontSize: 11, bold: true, margin: [0, 5, 0, 5] },
              { text: 'NIT: 14317921-1', italics: true, color: 'gray', fontSize: 9 },
              {
                text: 'TEL: 311-345-5739',
                italics: true,
                color: 'gray',
                fontSize: 9
              },
              {
                text: 'EMAIL: jlombanagelvis@gmail.com',
                italics: true,
                color: 'gray',
                fontSize: 9
              },
              {
                text: 'DIRECCION: K21a1#29f-110 faroles',
                italics: true,
                color: 'gray',
                fontSize: 9
              },
              {
                text: 'SANTA MARTA D.T.C.H',
                italics: true,
                color: 'gray',
                fontSize: 9
              },
              {
                text: 'Magdalena, Colombia 470002',
                italics: true,
                color: 'gray',
                fontSize: 9
              }
            ],
            {
              width: 100,
              image: path.join(__dirname, '/public/img/avatars/jgelvis.png'),
              fit: [100, 100]
            }
          ]
        },
        {
          columns: [
            [
              { text: factura.adreess, style: 'subheader' },
              {
                text: `${factura.type} ${factura.doc}         Movil ${factura.phone}        ${factura.name}`,
                italics: true,
                color: 'gray',
                fontSize: 9,
                margin: [0, 0, 0, 10]
              } /* ,
              {
                fontSize: 11,
                italics: true,
                text: [
                  '\nLa siguente ',
                  { text: 'tabla ', bold: true, color: 'blue' },
                  'muestra los detalles de cada producto a facturar'
                ]
              } */
            ],
            {
              text: 'FACTURA DE VENTA #' + factura.id,
              fontSize: 13,
              bold: true,
              margin: [50, -15, 0, 0]
            }
          ]
        },
        {
          style: 'tableBody',
          color: '#444',
          table: {
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            //headerRows: 1,
            // keepWithHeaderRows: 1,
            body: cuerpo
          }
        }
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
          fontSize: 9,
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
        },
        smallx: {
          fontSize: 7,
          italics: true,
          color: 'gray',
          alignment: 'right'
        },
        tableBody2: {
          margin: [0, 5, 0, 5]
        },
        tableHeader2: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        small2: {
          fontSize: 9,
          italics: true,
          color: 'gray',
          alignment: 'right'
        }
      }
    };
    let ruta = path.join(__dirname, `/public/uploads/facturadeventa-${factura.id}.pdf`);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(ruta));
    pdfDoc.end();
    await pool.query('UPDATE facturas SET ? WHERE id = ?', [
      { pdf: `/uploads/facturadeventa-${factura.id}.pdf` },
      factura.id
    ]);

    /* var dataFile = {
            phone: '573012673944', //Proyeccion[0].movil,
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
        ); */
    console.log(ruta);
    return ruta;
  } else {
    return { sent: false };
  }
}

async function Lista() {
  const lista = await pool.query(`SELECT m.*, 
    (SELECT precioVenta FROM compras k WHERE k.droga = m.id ORDER BY k.id DESC LIMIT 1) precio,
    (SELECT SUM(c.cantidad) FROM compras c WHERE c.droga = m.id) - (SELECT SUM(v.cantidad) FROM ventas v WHERE v.producto = m.id) stock    
    FROM medicamentos m`);

  if (lista.length) {
    const cuerpo = [
      [
        { text: `Id`, style: 'tableHeader', alignment: 'center' },
        { text: 'Producto', style: 'tableHeader', alignment: 'center' },
        { text: 'Laboratorio', style: 'tableHeader', alignment: 'center' },
        { text: 'Clase', style: 'tableHeader', alignment: 'center' },
        { text: 'Stock', style: 'tableHeader', alignment: 'center' },
        { text: 'Precio', style: 'tableHeader', alignment: 'center' }
      ]
    ];

    lista.map(e =>
      cuerpo.push([e.id, e.nombre, e.laboratorio, e.clase, e.stock, '$' + Cifra(e.precio)])
    );

    ////////////////////////* CREAR PDF *//////////////////////////////
    const printer = new PdfPrinter(Roboto);
    let docDefinition = {
      background: function (currentPage, pageSize) {
        return {
          image: path.join(__dirname, '/public/img/avatars/jgelvis.png'),
          width: pageSize.width,
          opacity: 0.1
        };
      },
      pageSize: 'a4',
      header: function (currentPage, pageCount, pageSize) {
        return {
          alignment: 'right',
          margin: [10, 3, 10, 3],
          columns: [
            {
              text: moment().format('lll'),
              alignment: 'left',
              margin: [10, 15, 15, 0],
              italics: true,
              color: 'gray',
              fontSize: 7
            },
            {
              width: 20,
              alignment: 'right',
              margin: [10, 3, 10, 3],
              image: path.join(__dirname, '/public/img/avatars/jgelvis.png'),
              fit: [20, 20]
            }
          ]
        };
      },
      info: {
        title: 'Factura',
        author: 'Inmovilii',
        subject: 'Factura de venta',
        keywords: 'Factura de venta de medicamentos',
        creator: 'Inmovilii',
        producer: 'IMOVI'
      },
      content: [
        {
          columns: [
            [
              { text: 'LISTA DE PRECIOS', style: 'header' },
              {
                fontSize: 11,
                italics: true,
                text: [
                  '\nLa siguente ',
                  { text: 'tabla ', bold: true, color: 'blue' },
                  'muestra los detalles de cada producto a facturar'
                ]
              }
            ],
            {
              width: 100,
              image: path.join(__dirname, '/public/img/avatars/jgelvis.png'),
              fit: [100, 100]
            }
          ]
        },
        {
          style: 'tableBody',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            //headerRows: 1,
            // keepWithHeaderRows: 1,
            body: cuerpo
          }
        }
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
          fontSize: 9,
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
        },
        smallx: {
          fontSize: 7,
          italics: true,
          color: 'gray',
          alignment: 'right'
        },
        tableBody2: {
          margin: [0, 5, 0, 5]
        },
        tableHeader2: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        small2: {
          fontSize: 9,
          italics: true,
          color: 'gray',
          alignment: 'right'
        }
      }
    };
    let ruta = path.join(__dirname, `/public/uploads/listaprecio.pdf`);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(ruta));
    pdfDoc.end();

    /* var dataFile = {
            phone: '573012673944', //Proyeccion[0].movil,
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
        ); */
    return ruta;
  } else {
    return { sent: false };
  }
}

async function EstadoDeCuenta(Orden) {
  const Proyeccion = await pool.query(
    `SELECT c.id idcuota, c.tipo, c.ncuota, c.fechs, r.montocuota, r.dias, r.tasa, r.dcto, s.fecharcb, r.fechaLMT, 
    r.totalmora, r.montocuota + r.totalmora totalcuota, s.fech, s.monto, r.saldocuota, l.valor - p.ahorro AS total, 
    o.proyect, k.pin AS cupon, s.stado, p.ahorro, l.mz, l.n, l.valor, p.vrmt2, l.mtr2, p.fecha, s.ids, r.saldomora, 
    s.formap, s.descp, k.descuento, p.id cparacion, cl.nombre, cl.documento, cl.email, cl.movil, c.mora, c.dto, o.imagenes,
    c.cuota, c.diaspagados, c.diasmora, c.tasa tasamora, c.estado FROM cuotas c LEFT JOIN relacioncuotas r ON r.cuota = c.id 
    LEFT JOIN solicitudes s ON r.pago = s.ids INNER JOIN preventa p ON c.separacion = p.id 
    INNER JOIN productosd l ON p.lote = l.id INNER JOIN productos o ON l.producto = o.id 
    LEFT JOIN cupones k ON k.id = p.cupon INNER JOIN clientes cl ON p.cliente = cl.idc 
    WHERE p.id = ? ORDER BY TIMESTAMP(c.fechs) ASC, TIMESTAMP(s.fecharcb) ASC, TIMESTAMP(s.fech) ASC, r.id DESC;`,
    Orden
  );

  const acuerdos = await pool.query(
    `SELECT * FROM acuerdos a WHERE a.orden = ? AND a.estado IN(7, 9)`,
    Orden
  );

  if (Proyeccion.length) {
    const cuerpo = [];
    const bodi = [['Fecha', 'Recibo', 'Estado', 'Forma de pago', 'Tipo', 'Monto']];
    let totalAbonado = 0;
    let totalMora = 0;
    let moraAdeudada = 0;
    let totalDeuda = 0;
    let totalSaldo = 0;
    let p = false;
    let IDs = [];
    let IdCuotas = [];

    let acuerdoActual = 0; // variable que determina desde que acuerdo empezara la logica del algoritmo para generar los descuentos
    let totalAcuerdos = acuerdos.length - 1; // se determina el numero de acuerdo vigentes o activos que el cliente a echo con la empresa a lo largo del tiempo
    let startDate = moment(acuerdos[acuerdoActual]?.start || '2017-08-31').format('YYYY-MM-DD'); // fecha en la que entra en vigencia un acuerdo desde la que el sistema empesara a cobrar mora
    let stopDate = moment(acuerdos[acuerdoActual]?.stop).format('YYYY-MM-DD'); // fecha hasta cuando se cobrara o congelara una mora en la que el sistema dejara de cobrar mora
    let endDate = moment(acuerdos[acuerdoActual]?.end).format('YYYY-MM-DD'); // fecha fin de un acuerdo prestablecido en la que el sistema dejara de congelar la mora
    let desto = acuerdos[acuerdoActual]?.dcto || 0;

    Proyeccion.map((e, i) => {
      const IDs2 = IDs.some(s => s === e.ids);
      const idCqt = IdCuotas.some(s => s === e.idcuota);
      const actoAmora =
        acuerdos[acuerdoActual]?.end === undefined
          ? e.estado === 3 && !idCqt
          : e.estado === 3 && !idCqt && e.fechs > endDate;

      //totalAbonado += IDs2 ? 0 : e.monto ? e.monto : 0;
      moraAdeudada += actoAmora ? e.mora : 0;
      totalMora += e.totalmora + (actoAmora ? e.mora : 0) - e.saldomora;
      totalSaldo += e.estado === 3 && !idCqt ? e.cuota : 0;
      totalDeuda += actoAmora ? e.cuota + e.mora : 0;

      if (e.fechs > endDate && acuerdoActual < totalAcuerdos) {
        acuerdoActual++;
        desto = acuerdos[acuerdoActual].dcto || 0;
        startDate = moment(acuerdos[acuerdoActual]?.start || '2017-08-31').format('YYYY-MM-DD'); // fecha en la que entra en vigencia un acuerdo desde la que el sistema empesara a cobrar mora
        stopDate = moment(acuerdos[acuerdoActual]?.stop).format('YYYY-MM-DD'); // fecha hasta cuando se cobrara o congelara una mora en la que el sistema dejara de cobrar mora
        endDate = moment(acuerdos[acuerdoActual]?.end).format('YYYY-MM-DD'); // fecha fin de un acuerdo prestablecido en la que el sistema dejara de congelar la mora
      } else if (e.fechs > endDate) {
        desto = 0;
        startDate = '2017-08-31'; // fecha desde la que el sistema empesara a cobrar mora
        stopDate = null; // fecha hasta en la que el sistema dejara de cobrar mora
        endDate = moment().format('YYYY-MM-DD');
      }

      const cobro = e.fechs > startDate && (!stopDate || stopDate > e.fechs) && e.mora; // determinara si debe cobrar mora en la cuota siguiente a analizar

      const TotalDias = cobro
        ? moment().diff(e.fechs > stopDate ? stopDate : e.fechs, 'days') - e.diaspagados
        : 0;
      const TMora = cobro ? (TotalDias * e.cuota * e.tasamora) / 365 : 0; // valor de la mora
      const TotalMora = TMora - TMora * desto;
      const TotalCuota = e.cuota + TotalMora;
      const Ids = IDs2 && e.monto ? false : true;

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
            { text: 'C.Saldo', style: 'tableHeader', alignment: 'center' },
            { text: 'M.Saldo', style: 'tableHeader', alignment: 'center' }
          ],
          [
            e.tipo + '-' + e.ncuota,
            moment(e.fechs).format('L'),
            '$' + Cifra(e.montocuota ? e.montocuota : e.cuota),
            e.montocuota ? e.dias : TotalDias,
            e.montocuota ? (e.tasa * 100).toFixed(2) + '%' : (e.tasamora * 100).toFixed(2) + '%',
            e.montocuota ? e.dcto * 100 + '%' : e.dto * 100 + '%',
            '$' + Cifra(e.montocuota ? e.totalmora : e.mora),
            '$' + Cifra(e.montocuota ? e.totalcuota : e.cuota + e.mora),
            e.fecharcb
              ? Ids
                ? moment(e.fecharcb).format('L')
                : '--/--/----'
              : e.fech && (Ids ? moment(e.fech).format('L') : '--/--/----'),
            Ids ? '$' + Cifra(e.monto || 0) : '$---,---,--',
            '$' + Cifra(e.montocuota ? e.saldocuota : TotalCuota),
            '$' + Cifra(e.saldomora)
          ]
        );
      } else {
        !e.monto &&
          p &&
          cuerpo.push([
            p.tipo + '-' + p.ncuota,
            moment(p.fechs).format('L'),
            '$' + Cifra(p.cuota),
            p.s.TotalDias,
            (e.tasamora * 100).toFixed(2) + '%',
            e.dto * 100 + '%',
            '$' + Cifra(p.s.TotalMora),
            '$' + Cifra(p.s.TotalCuota),
            '',
            '$0',
            '$' + Cifra(p.s.TotalCuota),
            '$' + Cifra(p.saldomora)
          ]);

        cuerpo.push([
          e.tipo + '-' + e.ncuota,
          moment(e.fechaLMT ? e.fechaLMT : e.fechs).format('L'),
          '$' + Cifra(e.montocuota ? e.montocuota : e.cuota),
          e.montocuota ? e.dias : TotalDias,
          e.montocuota ? (e.tasa * 100).toFixed(2) + '%' : (e.tasamora * 100).toFixed(2) + '%',
          e.montocuota ? e.dcto * 100 + '%' : e.dto * 100 + '%',
          '$' + Cifra(e.montocuota ? e.totalmora : TotalMora),
          '$' + Cifra(e.montocuota ? e.totalcuota : TotalCuota),
          e.fecharcb
            ? Ids
              ? moment(e.fecharcb).format('L')
              : '--/--/----'
            : e.fech && (Ids ? moment(e.fech).format('L') : '--/--/----'),
          Ids ? '$' + Cifra(e.monto || 0) : '$---,---,--',
          '$' + Cifra(e.montocuota ? e.saldocuota : TotalCuota),
          '$' + Cifra(e.saldomora)
        ]);
      }
      e.ids && IDs.push(e.ids);
      p = e.monto && e.saldocuota ? e : false;
      e.monto && e.saldocuota && (p.s = { TotalDias, TotalMora, TotalCuota });
      IdCuotas.push(e.idcuota);
    });

    const PagosPendientes = await pool.query(
      `SELECT s.fecharcb, s.fech, s.monto, s.stado, s.ids, s.formap, s.descp 
      FROM solicitudes s INNER JOIN preventa p ON s.orden = p.id        
      WHERE s.concepto IN('PAGO', 'ABONO', 'BONO') AND p.id = ? 
      AND s.stado IN(3, 4) ORDER BY TIMESTAMP(s.fecharcb) ASC, TIMESTAMP(s.fech) ASC;`,
      Orden
    );

    if (PagosPendientes.length) {
      PagosPendientes.map((e, i) => {
        totalAbonado += e.stado != 4 ? 0 : e.monto;
        bodi.push([
          e.fecharcb ? moment(e.fecharcb).format('L') : '--/--/----',
          `RC${e.ids}`,
          {
            text: e.stado === 4 ? 'Aprobado' : 'Pendiente',
            color: e.stado === 4 ? 'green' : 'blue'
          },
          e.formap,
          'ABONO',
          {
            text: '$' + Cifra(e.monto),
            color: e.stado === 4 ? 'green' : 'blue',
            decoration: e.stado !== 4 && 'lineThrough',
            decorationStyle: e.stado !== 4 && 'double'
          }
        ]);
      });

      bodi.sort((a, b) => {
        return new Date(a[0]).getTime() - new Date(b[0]).getTime();
      });
      totalDeuda = Proyeccion[0].valor - Proyeccion[0].ahorro + totalMora - totalAbonado;

      /* const indx = bodi.findIndex(e => e[1] == 'RCnull');
      if (indx > -1) bodi.splice(indx, 1); */
    }

    //console.log(cuerpo);
    bodi.push(
      [
        {
          text: 'TOTAL ABONADO',
          alignment: 'center',
          colSpan: 4,
          fontSize: 11,
          bold: true,
          color: 'black'
        },
        {},
        {},
        {},
        {
          text: '$' + Cifra(totalAbonado),
          alignment: 'center',
          colSpan: 2,
          fontSize: 11,
          bold: true,
          color: 'black'
        },
        {}
      ],
      [{ text: NumeroALetras(totalAbonado), style: 'smallx', colSpan: 6 }, {}, {}, {}, {}, {}],
      [
        {
          text: 'SALDO A LA FECHA',
          alignment: 'center',
          colSpan: 4,
          fontSize: 11,
          bold: true,
          color: 'black'
        },
        {},
        {},
        {},
        {
          text: '$' + Cifra(totalDeuda),
          alignment: 'center',
          colSpan: 2,
          fontSize: 11,
          bold: true,
          color: 'black'
        },
        {}
      ],
      [{ text: NumeroALetras(totalDeuda), style: 'smallx', colSpan: 6 }, {}, {}, {}, {}, {}]
    );
    ////////////////////////* CREAR PDF *//////////////////////////////
    const printer = new PdfPrinter(Roboto);
    let docDefinition = {
      background: function (currentPage, pageSize) {
        return {
          image: path.join(__dirname, '/public/img/avatars/avatar1.png'),
          width: pageSize.width,
          opacity: 0.1
        }; //, height: pageSize.height
      },
      pageSize: 'a4',
      /* footer: function (currentPage, pageCount) {
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
                alignment: 'justify',
                italics: true,
                color: 'gray',
                margin: [0, 7, 0, 0],
                fontSize: 8,
                columns: [
                  { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                  { text: 'info@grupoelitefincaraiz.co' },
                  {
                    text: 'https://grupoelitefincaraiz.com',
                    link: 'https://grupoelitefincaraiz.com'
                  }
                ]
              },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 8,
                columns: [
                  { text: 'Nit: 901311748-3' },
                  {
                    text: '57 300-285-1046',
                    link: 'https://wa.me/573007861987?text=Hola'
                  },
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
      }, */
      header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return {
          alignment: 'right',
          margin: [10, 3, 10, 3],
          columns: [
            {
              text: moment().format('lll'),
              alignment: 'left',
              margin: [10, 15, 15, 0],
              italics: true,
              color: 'gray',
              fontSize: 7
            },
            {
              width: 20,
              alignment: 'right',
              margin: [10, 3, 10, 3],
              image: path.join(
                __dirname,
                Proyeccion[0].imagenes
                  ? '/public' + Proyeccion[0].imagenes
                  : '/public/img/avatars/avatar.png'
              ),
              fit: [20, 20]
            }
          ]
        };
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
      content: [
        // pageBreak: 'before',
        {
          columns: [
            [
              { text: 'ESTADO DE CUENTA', style: 'header' },
              'Conoce aqui el estado de tus pagos y montos',
              { text: Proyeccion[0].nombre, style: 'subheader' },
              {
                text: `Doc. ${Proyeccion[0].documento}         Movil ${Proyeccion[0].movil}        ${Proyeccion[0].email}`,
                italics: true,
                color: 'gray',
                fontSize: 9
              },
              {
                style: 'tableBody',
                color: '#444',
                table: {
                  widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                  body: [
                    [
                      {
                        text: Proyeccion[0].proyect,
                        bold: true,
                        fontSize: 10,
                        color: 'blue',
                        colSpan: 5
                      },
                      {},
                      {},
                      {},
                      {},
                      {
                        text: `MZ: ${Proyeccion[0].mz ? Proyeccion[0].mz : 'No aplica'}`,
                        bold: true,
                        fontSize: 10,
                        color: 'blue'
                      },
                      {
                        text: `LT: ${Proyeccion[0].n}`,
                        bold: true,
                        fontSize: 10,
                        color: 'blue'
                      }
                    ],
                    ['Area', 'Vr.mtr2', 'Valor', 'Cupon', 'Dcto.', 'Ahorro', 'Total'],
                    [
                      {
                        text: Proyeccion[0].mtr2,
                        style: 'tableHeader',
                        alignment: 'center'
                      },
                      {
                        text: `$${Cifra(Proyeccion[0].vrmt2)}`,
                        style: 'tableHeader',
                        alignment: 'center'
                      },
                      {
                        text: `$${Cifra(Proyeccion[0].valor)}`,
                        style: 'tableHeader',
                        alignment: 'center'
                      },
                      {
                        text: Proyeccion[0].cupon,
                        style: 'tableHeader',
                        alignment: 'center'
                      },
                      {
                        text: `${Proyeccion[0].descuento}%`,
                        style: 'tableHeader',
                        alignment: 'center'
                      },
                      {
                        text: `- $${Cifra(Proyeccion[0].ahorro)}`,
                        style: 'tableHeader',
                        alignment: 'center'
                      },
                      {
                        text: `$${Cifra(Proyeccion[0].total)}`,
                        style: 'tableHeader',
                        alignment: 'center'
                      }
                    ]
                  ]
                }
              }
            ],
            {
              width: 100,
              image: path.join(
                __dirname,
                Proyeccion[0].imagenes
                  ? '/public' + Proyeccion[0].imagenes
                  : '/public/img/avatars/avatar.png'
              ),
              fit: [100, 100]
            }
          ]
        },
        {
          style: 'tableBody2',
          color: '#444',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            //headerRows: 4,
            // keepWithHeaderRows: 1,
            body: bodi
          }
        },
        {
          fontSize: 11,
          italics: true,
          text: [
            '\nLa siguente ',
            { text: 'tabla ', bold: true, color: 'blue' },
            'muestra los detalles de cada cuota de la financacion con su historial de pagos  y montos.'
          ]
        },
        {
          style: 'tableBody',
          color: '#444',
          table: {
            widths: [
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto'
            ],
            headerRows: 1,
            // keepWithHeaderRows: 1,
            body: cuerpo
          }
        },
        {
          text: 'A continuacion se describiran los totales de la tabla anterior',
          style: 'subheader'
        },
        {
          ul: [
            {
              text: [
                { text: 'Total Abonado: ', fontSize: 10, bold: true },
                {
                  text: `$${Cifra(totalAbonado)}\n`,
                  italics: true,
                  bold: true,
                  fontSize: 11,
                  color: 'green'
                },
                {
                  text: NumeroALetras(totalAbonado).toLowerCase(),
                  fontSize: 8,
                  italics: true,
                  color: 'gray'
                }
              ]
            },
            {
              text: [
                { text: 'Total Mora: ', fontSize: 10, bold: true },
                {
                  text: `$${Cifra(totalMora)}\n`,
                  italics: true,
                  bold: true,
                  fontSize: 11,
                  color: 'gray'
                },
                {
                  text: NumeroALetras(totalMora).toLowerCase(),
                  fontSize: 8,
                  italics: true,
                  color: 'gray'
                }
              ]
            },
            {
              text: [
                { text: 'Mora Adeudada: ', fontSize: 10, bold: true },
                {
                  text: `$${Cifra(moraAdeudada)}\n`,
                  italics: true,
                  bold: true,
                  fontSize: 11,
                  color: 'red'
                },
                {
                  text: NumeroALetras(moraAdeudada).toLowerCase(),
                  fontSize: 8,
                  italics: true,
                  color: 'gray'
                }
              ]
            },
            {
              text: [
                { text: 'Saldo Capital: ', fontSize: 10, bold: true },
                {
                  text: `$${Cifra(totalSaldo)}\n`,
                  italics: true,
                  bold: true,
                  fontSize: 11,
                  color: 'red'
                },
                {
                  text: NumeroALetras(totalSaldo).toLowerCase(),
                  fontSize: 8,
                  italics: true,
                  color: 'gray'
                }
              ]
            },
            {
              text: [
                { text: 'Total Saldo: ', fontSize: 10, bold: true },
                {
                  text: `$${Cifra(totalDeuda)}\n`,
                  italics: true,
                  bold: true,
                  fontSize: 11,
                  color: 'blue'
                },
                {
                  text: NumeroALetras(totalDeuda).toLowerCase(),
                  fontSize: 8,
                  italics: true,
                  color: 'gray'
                }
              ]
            }
          ]
        }
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
          fontSize: 7,
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
        },
        smallx: {
          fontSize: 7,
          italics: true,
          color: 'gray',
          alignment: 'right'
        },
        tableBody2: {
          margin: [0, 5, 0, 5]
        },
        tableHeader2: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        small2: {
          fontSize: 9,
          italics: true,
          color: 'gray',
          alignment: 'right'
        }
      }
    };
    let ruta = path.join(
      __dirname,
      `/public/uploads/estadodecuenta-${Proyeccion[0].cparacion}.pdf`
    );
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(ruta));
    pdfDoc.end();

    /* var dataFile = {
            phone: '573012673944', //Proyeccion[0].movil,
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
        ); */
    console.log(ruta);
    return ruta; //JSON.stringify(estado);
  } else {
    return { sent: false };
  }
}
async function informes(data) {
  // arreglar esto
  const { datos, maxDateFilter, minDateFilter } = data;
  const ids = datos.replace(/\[|\]/g, '');
  const pagos = await pool.query(
    `SELECT s.fech, c.fechs, s.monto, u.pin, c.cuota, s.img, pd.valor, 
     cpb.monto montoa, e.lugar, e.otro, pr.ahorro, cl.email, s.facturasvenc, cp.producto, s.pdf, s.acumulado, 
     u.fullname, s.aprueba, pr.descrip, cpb.producto ordenanu, cl.documento, cl.idc, cl.movil, cl.nombre, 
     s.recibo, c.tipo, c.ncuota, p.proyect, pd.mz, u.cel, pr.tipobsevacion, s.fecharcb, pd.n, s.stado, 
     cp.pin bono, cp.monto mount, cp.motivo, cp.concept, s.formap, s.concepto, pd.id, pr.lote, e.id extr, 
     e.consignado, e.date, e.description, s.ids, s.descp, pr.id cparacion, pd.estado, s.bonoanular, s.aprobado 
     FROM solicitudes s LEFT JOIN cuotas c ON s.pago = c.id LEFT JOIN preventa pr ON s.orden = pr.id 
     INNER JOIN productosd pd ON s.lt = pd.id LEFT JOIN extrabanco e ON s.extrato = e.id INNER JOIN productos p 
     ON pd.producto = p.id LEFT JOIN users u ON pr.asesor = u.id LEFT JOIN clientes cl ON pr.cliente = cl.idc 
     LEFT JOIN cupones cp ON s.bono = cp.id LEFT JOIN cupones cpb ON s.bonoanular = cpb.id 
     WHERE s.concepto IN('PAGO','ABONO') AND ids IN(${ids}) ORDER BY s.ids`
  );
  const minDate = moment(parseFloat(minDateFilter)).format('ll');
  const maxDate = moment(parseFloat(maxDateFilter)).format('ll');
  const minD = moment(parseFloat(minDateFilter)).format('YYYY-MM-DD');
  const maxD = moment(parseFloat(maxDateFilter)).format('YYYY-MM-DD');
  //console.log(minDateFilter, maxDateFilter, minDate, maxDate, minD, maxD);
  const bank = [];
  let transaccionado = 0;
  let efectivo = 0;
  const totalesBancos = {
    totalEntrada: 0,
    totalSinSoporte: 0,
    totalExtSinSoporte: 0,
    totalExtratos: 0,
    totalConSoporte: 0,
    totalExtConSoporte: 0,
    bancos: {}
  };
  const cuerpo = [
    [
      { text: `Pago`, style: 'tableHeader', alignment: 'center' },
      { text: `Proyecto`, style: 'tableHeader', alignment: 'center' },
      { text: 'Mz', style: 'tableHeader', alignment: 'center' },
      { text: 'Lt', style: 'tableHeader', alignment: 'center' },
      { text: 'Estado', style: 'tableHeader', alignment: 'center' },
      { text: 'F.Rcb.', style: 'tableHeader', alignment: 'center' },
      { text: 'Monto', style: 'tableHeader', alignment: 'center' },
      { text: 'Extrato', style: 'tableHeader', alignment: 'center' },
      { text: 'F.Extrato', style: 'tableHeader', alignment: 'center' },
      { text: 'Cuenta', style: 'tableHeader', alignment: 'center' },
      { text: 'Consignado', style: 'tableHeader', alignment: 'center' }
    ]
  ];

  const extratos = await pool.query(
    `SELECT e.*, COUNT(s.ids) recibos, SUM(s.monto) monto, e.consignado - SUM(s.monto) diff 
     FROM extrabanco e LEFT JOIN solicitudes s ON s.extrato = e.id WHERE e.consignado > 0 AND e.date 
     BETWEEN CAST(? AS DATE) AND CAST(? AS DATE) GROUP BY e.id ORDER BY e.date, e.otro`,
    [minD, maxD]
  );
  await extratos.map(e => {
    totalesBancos.totalEntrada += e.consignado;
    totalesBancos.totalSinSoporte += !e.recibos ? e.consignado : 0;
    totalesBancos.totalExtSinSoporte += !e.recibos ? 1 : 0;
    totalesBancos.totalExtratos++;
    if (!bank.length || !bank.some(r => r === e.otro)) {
      totalesBancos.bancos[e.otro] = {
        totalEntrada: e.consignado,
        totalSinSoporte: !e.recibos ? e.consignado : 0,
        totalExtSinSoporte: !e.recibos ? 1 : 0,
        totalConSoporte: 0,
        totalExtConSoporte: 0,
        totalExtratos: 1
      };
      bank.push(e.otro);
    } else {
      totalesBancos.bancos[e.otro].totalEntrada += e.consignado;
      totalesBancos.bancos[e.otro].totalSinSoporte += !e.recibos ? e.consignado : 0;
      totalesBancos.bancos[e.otro].totalExtSinSoporte += !e.recibos ? 1 : 0;
      totalesBancos.bancos[e.otro].totalExtratos++;

      //console.log(totalesBancos.bancos[e.otro].totalEntrada, e.consignado, e.otro);
    }
  });
  const bancos = await Object.keys(totalesBancos.bancos).map((a, i) => {
    return {
      alignment: 'justify',
      margin: [0, 0, 0, 5],
      columns: [
        {
          text: [
            {
              text: 'Cuenta\n',
              fontSize: 8,
              italics: true,
              color: 'gray'
            },
            {
              text: a,
              fontSize: 10,
              bold: true,
              color: 'green'
            }
          ]
        },
        {
          text: [
            {
              text: 'Total Ingreso Banco\n',
              fontSize: 8,
              italics: true,
              color: 'gray'
            },
            {
              text: `$${Moneda(totalesBancos.bancos[a].totalEntrada)}\n`,
              fontSize: 10,
              bold: true,
              color: 'blue'
            }
          ]
        },
        {
          text: [
            {
              text: 'Total no soportado\n',
              fontSize: 8,
              italics: true,
              color: 'gray'
            },
            {
              text: `$${Moneda(totalesBancos.bancos[a].totalSinSoporte)}\n`,
              fontSize: 10,
              bold: true,
              color: 'blue'
            }
          ]
        },
        {
          text: [
            {
              text: 'Total extratos: ',
              fontSize: 8,
              italics: true,
              color: 'gray'
            },
            {
              text: `${totalesBancos.bancos[a].totalExtratos}\n`,
              fontSize: 9,
              bold: true,
              color: 'red'
            },
            {
              text: 'Sin soporte: ',
              fontSize: 8,
              italics: true,
              color: 'gray'
            },
            {
              text: `${totalesBancos.bancos[a].totalExtSinSoporte}\n`,
              fontSize: 9,
              bold: true,
              color: 'red'
            }
          ]
        }
      ]
    };
  });
  await bancos.push({
    alignment: 'justify',
    margin: [0, 0, 0, 5],
    columns: [
      {
        text: [
          {
            text: '.\n',
            fontSize: 8,
            italics: true,
            color: 'gray'
          },
          {
            text: 'TOTALES',
            fontSize: 10,
            bold: true,
            color: 'green'
          }
        ]
      },
      {
        text: [
          {
            text: 'Total Ingreso Banco\n',
            fontSize: 8,
            italics: true,
            color: 'gray'
          },
          {
            text: `$${Moneda(totalesBancos.totalEntrada)}\n`,
            fontSize: 10,
            bold: true,
            color: 'blue'
          }
        ]
      },
      {
        text: [
          {
            text: 'Total no soportado\n',
            fontSize: 8,
            italics: true,
            color: 'gray'
          },
          {
            text: `$${Moneda(totalesBancos.totalSinSoporte)}\n`,
            fontSize: 10,
            bold: true,
            color: 'blue'
          }
        ]
      },
      {
        text: [
          {
            text: 'Total extratos: ',
            fontSize: 8,
            italics: true,
            color: 'gray'
          },
          { text: `${totalesBancos.totalExtratos}\n`, fontSize: 9, bold: true, color: 'red' },
          {
            text: 'Sin soporte: ',
            fontSize: 8,
            italics: true,
            color: 'gray'
          },
          { text: `${totalesBancos.totalExtSinSoporte}\n`, fontSize: 9, bold: true, color: 'red' }
        ]
      }
    ]
  });
  await pagos.map((a, i) => {
    let estado;
    switch (a.stado) {
      case 4:
        estado = {
          text: 'Aprobado',
          color: 'green'
        };
        break;
      case 3:
        estado = {
          text: 'Pendiente',
          color: 'blue'
        };
        break;
      case 6:
        estado = {
          text: 'Declinado',
          color: 'red'
        };
        break;
    }
    transaccionado += a.extr ? a.monto : 0;
    efectivo += !a.extr ? a.monto : 0;
    if (a.otro) {
      totalesBancos.bancos[a.otro].totalConSoporte += a.monto;
      totalesBancos.bancos[a.otro].totalExtConSoporte++;
      totalesBancos.totalConSoporte += a.monto;
      totalesBancos.totalExtConSoporte++;
    }
    const extrato =
      !a.extr && a.stado == 3
        ? { text: 'PENDIENTE POR APROBAR', colSpan: 4, alignment: 'center', color: 'blue' }
        : !a.extr && a.stado == 4
        ? { text: 'EFECTIVO. SIN EXTRATO', colSpan: 4, alignment: 'center', color: 'green' }
        : !a.extr && a.stado == 6
        ? { text: 'SIN NINGUNA INFORMACION', colSpan: 4, alignment: 'center', color: 'green' }
        : a.extr && a.stado == 6
        ? { text: a.extr + ' DESASOCIAR EXTRATO', colSpan: 4, alignment: 'center', color: 'green' }
        : a.extr;

    cuerpo.push([
      { text: a.ids, link: 'https://grupoelitefincaraiz.com' + a.img, color: 'blue' },
      a.proyect,
      a.mz,
      a.n,
      estado,
      a.fecharcb ? moment(a.fecharcb).format('L') : 'sin definir',
      '$' + Moneda(a.monto),
      extrato,
      a.date ? moment(a.date).format('L') : '',
      a.otro,
      '$' + Moneda(a.consignado)
    ]);
  });

  //console.log(minDate, maxDate, totalesBancos, cuerpo);

  const printer = new PdfPrinter(Roboto);
  let docDefinition = {
    background: function (currentPage, pageSize) {
      return {
        image: path.join(__dirname, '/public/img/avatars/avatar1.png'),
        width: pageSize.width,
        opacity: 0.1
      }; //, height: pageSize.height
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
              alignment: 'justify',
              italics: true,
              color: 'gray',
              margin: [0, 7, 0, 0],
              fontSize: 8,
              columns: [
                { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                { text: 'info@grupoelitefincaraiz.co' },
                {
                  text: 'https://grupoelitefincaraiz.com',
                  link: 'https://grupoelitefincaraiz.com'
                }
              ]
            },
            {
              alignment: 'justify',
              italics: true,
              color: 'gray',
              fontSize: 8,
              columns: [
                { text: 'Nit: 901311748-3' },
                {
                  text: '57 300-285-1046',
                  link: 'https://wa.me/573007861987?text=Hola'
                },
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
      return {
        alignment: 'right',
        margin: [10, 3, 10, 3],
        columns: [
          {
            text: moment().format('lll'),
            alignment: 'left',
            margin: [10, 15, 15, 0],
            italics: true,
            color: 'gray',
            fontSize: 7
          },
          {
            width: 20,
            alignment: 'right',
            margin: [10, 3, 10, 3],
            image: path.join(__dirname, '/public/img/avatars/avatar.png'),
            fit: [30, 30]
          }
        ]
      };
    },
    //watermark: { text: 'Grupo Elite', color: 'blue', opacity: 0.1, bold: true, italics: false, fontSize: 200 }, //, angle: 180
    //watermark: { image: path.join(__dirname, '/public/img/avatars/avatar.png'), width: 100, opacity: 0.3, fit: [100, 100] }, //, angle: 180
    info: {
      title: 'Reporte de ingresos',
      author: 'RedElite',
      subject: 'Detallado del estado de los pagos vs los extratos',
      keywords: 'Pagos y Abonos',
      creator: 'Red Elite',
      producer: 'R.E.'
    },
    content: [
      {
        margin: [0, 0, 0, 15],
        columns: [
          {
            width: 'auto',
            text: [
              { text: 'INFORME DE INGRESOS VS EXTRATOS\n', style: 'header' },
              'Relacion de pagos y extractos bancarios\n\n'
            ]
          },
          [
            { text: 'PERIODOS\n', fontSize: 8, bold: true, alignment: 'center' },
            {
              width: '*',
              margin: [50, 0, 0, 0],
              alignment: 'justify',
              columns: [
                {
                  text: [
                    {
                      text: 'Desde\n',
                      fontSize: 6,
                      italics: true,
                      color: 'gray'
                    },
                    { text: minDate, fontSize: 8, bold: true }
                  ]
                },
                {
                  text: [
                    {
                      text: 'Hasta\n',
                      fontSize: 6,
                      italics: true,
                      color: 'gray'
                    },
                    { text: maxDate, fontSize: 8, bold: true }
                  ]
                }
              ]
            }
          ]
        ]
      },
      bancos,
      {
        style: 'tableBody',
        color: '#444',
        table: {
          widths: [
            'auto',
            '*',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto'
          ],
          headerRows: 1,
          // keepWithHeaderRows: 1,
          body: cuerpo
        }
      },
      {
        margin: [0, 0, 0, 15],
        text: 'Todos los que no esten asociados a un extrato, se consideran dinero en efectivo',
        color: 'gray',
        fontSize: 9
      },
      {
        text: 'A continuacion se describiran los totales de la tabla anterior',
        style: 'subheader'
      },
      {
        ul: [
          {
            text: [
              {
                text: totalesBancos.totalExtConSoporte + ' EXTRATOS TOTAL TRANSACCIONADO: ',
                fontSize: 10,
                bold: true
              },
              {
                text: `$${Moneda(transaccionado)}\n`,
                italics: true,
                bold: true,
                fontSize: 10,
                color: 'blue'
              },
              {
                text: NumeroALetras(transaccionado).toLowerCase(),
                fontSize: 8,
                italics: true,
                color: 'gray'
              }
            ]
          },
          {
            text: [
              { text: 'TOTAL EFECTIVO: ', fontSize: 10, bold: true },
              {
                text: `$${Moneda(efectivo)}\n`,
                italics: true,
                bold: true,
                fontSize: 10,
                color: 'blue'
              },
              {
                text: NumeroALetras(efectivo).toLowerCase(),
                fontSize: 8,
                italics: true,
                color: 'gray'
              }
            ]
          },
          {
            text: [
              {
                text: 'TOTAL INGRESADO: ',
                fontSize: 10,
                bold: true
              },
              {
                text: `$${Moneda(transaccionado + efectivo)}\n`,
                italics: true,
                bold: true,
                fontSize: 10,
                color: 'blue'
              },
              {
                text: NumeroALetras(transaccionado + efectivo).toLowerCase(),
                fontSize: 8,
                italics: true,
                color: 'gray'
              }
            ]
          }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 13,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 11,
        bold: true,
        margin: [0, 5, 0, 2]
      },
      tableBody: {
        fontSize: 7,
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
      },
      tableBody2: {
        margin: [0, 5, 0, 5]
      },
      tableHeader2: {
        bold: true,
        fontSize: 13,
        color: 'black'
      },
      small2: {
        fontSize: 9,
        italics: true,
        color: 'gray',
        alignment: 'right'
      }
    }
  };
  let ruta = path.join(__dirname, `/public/uploads/informes.pdf`);
  let pdfDoc = await printer.createPdfKitDocument(docDefinition);
  await pdfDoc.pipe(fs.createWriteStream(ruta));
  await pdfDoc.end();

  return ruta;
}
async function ReciboDeCaja(movil, nombre, author) {
  const estado =
    await pool.query(`SELECT pd.valor - p.ahorro AS total, pt.proyect, cu.pin AS cupon, cp.pin AS bono, s.stado, 
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
    const cuerpo = [];
    let totalAbonado = 0;
    estado.map((e, i) => {
      totalAbonado += e.stado === 4 ? e.monto : 0;
      if (!i) {
        cuerpo.push(
          [
            {
              text: `Area: ${e.mtr2} mt2`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {},
            {
              text: `Vr Mt2: $${Moneda(e.vrmt2)}`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {},
            {
              text: '$' + Moneda(e.valor),
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2
            },
            {}
          ],
          [
            'Cupon',
            'Dsto',
            { text: 'Ahorro', colSpan: 2 },
            {},
            { text: `Total lote`, colSpan: 2 },
            {}
          ],
          [
            { text: e.cupon, style: 'tableHeader', alignment: 'center' },
            {
              text: `${e.descuento}%`,
              style: 'tableHeader',
              alignment: 'center'
            },
            {
              text: `-$${Moneda(e.ahorro)}`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {},
            {
              text: `$${Moneda(e.total)}`,
              style: 'tableHeader',
              colSpan: 2,
              alignment: 'center'
            },
            {}
          ],
          ['Fecha', 'Recibo', 'Estado', 'Forma de pago', 'Tipo', 'Monto'],
          [
            moment(e.fech).format('L'),
            `RC${e.ids}`,
            {
              text: e.stado === 4 ? 'Aprobado' : 'Pendiente',
              color: e.stado === 4 ? 'green' : 'blue'
            },
            e.formap,
            e.descp,
            {
              text: '$' + Moneda(e.monto),
              color: e.stado === 4 ? 'green' : 'blue',
              decoration: e.stado !== 4 && 'lineThrough',
              decorationStyle: e.stado !== 4 && 'double'
            }
          ]
        );
      } else {
        cuerpo.push([
          moment(e.fech).format('L'),
          `RC${e.ids}`,
          {
            text: e.stado === 4 ? 'Aprobado' : 'Pendiente',
            color: e.stado === 4 ? 'green' : 'blue'
          },
          e.formap,
          e.descp,
          {
            text: '$' + Moneda(e.monto),
            color: e.stado === 4 ? 'green' : 'blue',
            decoration: e.stado !== 4 && 'lineThrough',
            decorationStyle: e.stado !== 4 && 'double'
          }
        ]);
      }
    });
    cuerpo.push(
      [
        {
          text: 'TOTAL ABONADO',
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 4
        },
        {},
        {},
        {},
        {
          text: '$' + Moneda(totalAbonado),
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 2
        },
        {}
      ],
      [{ text: NumeroALetras(totalAbonado), style: 'small', colSpan: 6 }, {}, {}, {}, {}, {}],
      [
        {
          text: 'SALDO A LA FECHA',
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 4
        },
        {},
        {},
        {},
        {
          text: '$' + Moneda(estado[0].total - totalAbonado),
          style: 'tableHeader',
          alignment: 'center',
          colSpan: 2
        },
        {}
      ],
      [
        {
          text: NumeroALetras(estado[0].total - totalAbonado),
          style: 'small',
          colSpan: 6
        },
        {},
        {},
        {},
        {},
        {}
      ]
    );
    ////////////////////////* CREAR PDF *//////////////////////////////
    const printer = new PdfPrinter(Roboto);
    let docDefinition = {
      background: function (currentPage, pageSize) {
        return {
          image: path.join(__dirname, '/public/img/avatars/avatar1.png'),
          width: pageSize.width,
          opacity: 0.1
        }; //, height: pageSize.height
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
      content: [
        // pageBreak: 'before',
        {
          columns: [
            [
              { text: 'ESTADO DE CUENTA', style: 'header' },
              'Conoce aqui el estado el estado de tus pagos y montos',
              { text: estado[0].nombre, style: 'subheader' },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 9,
                margin: [0, 0, 0, 5],
                columns: [
                  { text: `Doc. ${estado[0].documento}` },
                  { text: `Movil ${estado[0].movil}` },
                  { text: estado[0].email }
                ]
              },
              {
                alignment: 'justify',
                italics: true,
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
            { text: 'abonado.\n\n', bold: true, color: 'green' }
          ]
        },
        {
          columns: [
            {
              width: 100,
              qr: 'https://grupoelitefincaraiz.com',
              fit: '50',
              foreground: 'yellow',
              background: 'black'
            },
            [
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 10,
                columns: [
                  { text: 'GRUPO ELITE FINCA RAÍZ S.A.S.' },
                  {
                    text: 'https://grupoelitefincaraiz.com',
                    link: 'https://grupoelitefincaraiz.com'
                  }
                ]
              },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 10,
                columns: [{ text: 'Nit: 901311748-3' }, { text: 'info@grupoelitefincaraiz.co' }]
              },
              {
                alignment: 'justify',
                italics: true,
                color: 'gray',
                fontSize: 10,
                columns: [
                  { text: 'Mz L lt 17 Urb. la granja, Turbaco' },
                  {
                    text: '57 300-285-1046',
                    link: 'https://wa.me/573007861987?text=Hola'
                  }
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
    };
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
    return r; //JSON.stringify(estado);
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
  sql +=
    reci !== '##'
      ? 'AND s.ids = ' + reci
      : `AND (c.movil LIKE '%${cel}%' OR c.code LIKE '%${cel}%' OR c.nombre = '${nombre}'
           OR c2.movil LIKE '%${cel}%' OR c2.code LIKE '%${cel}%' OR c2.nombre = '${nombre}'
           OR c3.movil LIKE '%${cel}%' OR c3.code LIKE '%${cel}%' OR c3.nombre = '${nombre}'
           OR c4.movil LIKE '%${cel}%' OR c4.code LIKE '%${cel}%' OR c4.nombre = '${nombre}')`;

  sql += ' ORDER BY s.ids';
  const recibos = await pool.query(sql);
  let archivos = [];
  console.log(recibos);

  if (recibos.length) {
    const printer = new PdfPrinter(Roboto);
    for (i = 0; i < recibos.length; i++) {
      let e = recibos[i];
      //if (i === 3) { continue; } \n
      const saldo = await Saldos(e.lote, e.fech, e.ids);
      ////////////////////////* CREAR PDF *//////////////////////////////
      let docDefinition = {
        background: function (currentPage, pageSize) {
          return {
            image: path.join(__dirname, '/public/img/avatars/avatar1.png'),
            width: pageSize.width,
            opacity: 0.1
          };
        },
        header: function (currentPage, pageCount, pageSize) {
          return [
            {
              width: 100,
              margin: [20, 10, 0, 0],
              image: path.join(__dirname, '/public/img/avatars/logo.png'),
              fit: [100, 100]
            }
          ];
        },
        footer: function (currentPage, pageCount) {
          return [
            {
              columns: [
                {
                  margin: [0, 0, 0, 7],
                  width: 50,
                  alignment: 'center',
                  image: path.join(__dirname, '/public/img/avatars/avatar.png'),
                  fit: [30, 30]
                },
                [
                  {
                    alignment: 'justify',
                    italics: true,
                    color: 'gray',
                    fontSize: 8,
                    margin: [0, 3, 0, 0],
                    columns: [
                      {
                        text: 'GRUPO ELITE FINCA RAÍZ S.A.S.',
                        alignment: 'center'
                      },
                      {
                        text: 'info@grupoelitefincaraiz.co',
                        alignment: 'center'
                      },
                      {
                        text: 'https://grupoelitefincaraiz.com',
                        link: 'https://grupoelitefincaraiz.com',
                        alignment: 'center'
                      }
                    ]
                  },
                  {
                    alignment: 'justify',
                    italics: true,
                    color: 'gray',
                    fontSize: 8,
                    margin: [0, 0, 0, 7],
                    columns: [
                      { text: 'Nit: 901311748-3', alignment: 'center' },
                      {
                        text: '57 300-285-1046',
                        link: 'https://wa.me/573007861987?text=Hola',
                        alignment: 'center'
                      },
                      {
                        text: 'Mz L lt 17 Urb. la granja, Turbaco',
                        alignment: 'center'
                      }
                    ]
                  }
                ],
                {
                  margin: [0, 0, 0, 7],
                  alignment: 'center',
                  width: 50,
                  qr: 'https://grupoelitefincaraiz.com',
                  fit: '40',
                  foreground: 'yellow',
                  background: 'black'
                }
              ]
            }
          ];
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
          {
            text: 'RECIBO DE CAJA ' + e.ids,
            style: 'header',
            alignment: 'right'
          },
          { text: moment(e.fech).format('lll'), style: 'small' },
          {
            columns: [
              [
                { text: e.nombre, style: 'subheader' },
                {
                  alignment: 'justify',
                  italics: true,
                  color: 'gray',
                  fontSize: 9,
                  margin: [0, 0, 0, 5],
                  columns: [
                    { text: `Doc. ${e.documento}` },
                    { text: `Movil ${e.movil}` },
                    { text: e.email }
                  ]
                },
                {
                  alignment: 'justify',
                  italics: true,
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
                  {
                    text: `FORMA PAGO`,
                    style: 'tableHeader',
                    alignment: 'center'
                  },
                  {
                    text: `CONCEPTO`,
                    style: 'tableHeader',
                    alignment: 'center'
                  },
                  { text: `CUOTA`, style: 'tableHeader', alignment: 'center' }
                ],
                [
                  e.concepto,
                  e.formap,
                  e.descp,
                  { text: e.ncuota ? e.ncuota : 'AL DIA', alignment: 'center' }
                ],
                [
                  { text: `SLD. FECHA`, style: 'tableHeader' },
                  {
                    text: NumeroALetras(e.total - saldo),
                    colSpan: 2,
                    italics: true,
                    bold: true
                  },
                  {},
                  {
                    text: `$${Moneda(e.total - saldo)}`,
                    italics: true,
                    bold: true
                  }
                ],
                [
                  { text: `MONTO`, style: 'tableHeader' },
                  {
                    text: NumeroALetras(e.monto),
                    colSpan: 2,
                    italics: true,
                    bold: true
                  },
                  {},
                  { text: `$${Moneda(e.monto)}`, italics: true, bold: true }
                ],
                [
                  { text: `TOTAL SLD.`, style: 'tableHeader' },
                  {
                    text: NumeroALetras(e.total - saldo - e.monto),
                    colSpan: 2,
                    italics: true,
                    bold: true
                  },
                  {},
                  {
                    text: `$${Moneda(e.total - saldo - e.monto)}`,
                    italics: true,
                    bold: true
                  }
                ]
              ]
            }
          }
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
      };

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
}
async function apiChatApi(method, params) {
  const apiUrl = 'https://eu89.chat-api.com/instance107218';
  const token = '5jn3c5dxvcj27fm0';
  const options = {
    method: 'POST',
    url: `${apiUrl}/${method}?token=${token}`,
    data: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  };

  const apiResponse = await axios(options);
  //console.log(apiResponse.data)
  return apiResponse.data;
}

async function consultCompany(nit, method = 1) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFkZSI6IlNhbXlyIiwid2ViaG9vayI6Imh0dHBzOi8vYzE4YS0yODAwLTQ4NC1hYzgyLTFhMGMtMjk5Ni1iZGUyLTI4NWUtMzgyYS5uZ3Jvay5pby93dHNwL3dlYmhvb2siLCJpYXQiOjE2NDg4MjYxNTR9.o-aWCOLCowGoJdqnUQnKpNrtJFWYrNqZ8LpPycQH7U0';

  var data = JSON.stringify({ nit, method });

  var config = {
    method: 'post',
    url: 'https://querys.inmovili.com/api/query/company',
    headers: {
      'x-access-token':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFkZSI6IlNhbXlyIiwid2ViaG9vayI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC93ZWJob29rIiwiaWF0IjoxNjQ4NjE3ODY5fQ.m_0kgatFJ3im8Z0SJhj5KrVWeyoTOiEoEPQ4W8n5lks',
      'Content-Type': 'application/json'
    },
    data: data
  };
  try {
    const apiResponse = await axios(config);
    return apiResponse.data;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function consultDocument(docNumber, docType = 'CC') {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFkZSI6IlNhbXlyIiwid2ViaG9vayI6Imh0dHBzOi8vYzE4YS0yODAwLTQ4NC1hYzgyLTFhMGMtMjk5Ni1iZGUyLTI4NWUtMzgyYS5uZ3Jvay5pby93dHNwL3dlYmhvb2siLCJpYXQiOjE2NDg4MjYxNTR9.o-aWCOLCowGoJdqnUQnKpNrtJFWYrNqZ8LpPycQH7U0';

  var data = JSON.stringify({ docNumber, docType });

  var config = {
    method: 'post',
    url: 'https://querys.inmovili.com/api/query/person',
    headers: {
      'x-access-token':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFkZSI6IlNhbXlyIiwid2ViaG9vayI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC93ZWJob29rIiwiaWF0IjoxNjQ4NjE3ODY5fQ.m_0kgatFJ3im8Z0SJhj5KrVWeyoTOiEoEPQ4W8n5lks',
      'Content-Type': 'application/json'
    },
    data: data
  };
  try {
    const apiResponse = await axios(config);
    return apiResponse.data;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = {
  NumeroALetras,
  EstadoCuenta,
  apiChatApi,
  QuienEs,
  EnviarEmail,
  RecibosCaja,
  EstadoDeCuenta,
  FacturaDeCobro,
  informes,
  Facturar,
  consultCompany,
  consultDocument,
  Lista
};
