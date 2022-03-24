const venom = require('venom-bot');
const nanoid = require('nanoid');
const { getDataIa } = require('./dialogflow');
const { browserArgs } = require('./browserArgs');

const sessionIds = new Map();

const setSessionAndUser = async senderId => {
  try {
    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, nanoid.nanoid());
    }
  } catch (err) {
    throw err;
  }
};

const getIA = (message, session) =>
  new Promise((resolve, reject) => {
    let resData = { replyMessage: '', media: null, trigger: null };
    getDataIa(message, session, dt => {
      resData = { ...resData, ...dt };
      resolve(resData);
    });
  });

const bothResponse = async (message, session) => {
  const data = await getIA(message, session);
  console.log(data, 'samir');
  /* if (data && data.media) {
    const file = await saveExternalFile(data.media);
    return { ...data, ...{ media: file } };
  } */
  return data;
};

venom
  .create(
    //session
    'RedElite', //Pase el nombre del cliente que desea iniciar el bot

    //catchQR
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log('Número de intentos de leer el código qr: ', attempts);
      console.log('Código qr del terminal: ', asciiQR);
      //console.log('Cadena de imagen base64 qrcode: ', base64Qrimg);
      console.log('Cadena de imagen base64 qrcode: ', base64Qr);
      console.log('urlCode (data-ref): ', urlCode);

      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile('out.png', imageBuffer['data'], 'binary', function (err) {
        if (err != null) {
          console.log(err);
        }
      });
    },
    /* undefined,
    { logQR: false }, */

    // statusFind
    (statusSession, session) => {
      console.log('Estado de la sesión: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser
      //Create session wss return "serverClose" case server for close
      console.log('Nombre de la sesión: ', session);
    },
    // options
    {
      multidevice: true, // para la versión que no es multidispositivo, use falso. (predeterminado: verdadero)
      folderNameToken: 'tokens', //nombre de la carpeta al guardar tokens
      mkdirFolderToken: '', //tokens de directorio de carpetas, justo dentro de la carpeta de venom, ejemplo: { mkdir Folder Token: '/node_modules', } //guardará la carpeta de tokens en el directorio node_modules
      headless: true, // chrome sin cabeza
      devtools: false, // Abrir devtools por defecto
      useChrome: true, // Si es falso, usará la instancia de Chromium
      debug: false, // Abre una sesión de depuración.
      logQR: true, // Registra QR automáticamente en la terminal
      browserWS: '', // Si desea utilizar browserWSEndpoint
      browserArgs, //Parámetros originales ---Parámetros que se agregarán a la instancia del navegador Chrome
      puppeteerOptions: {}, // Se pasará a puppeteer.launch (titiritero.lanzamiento )
      disableSpins: true, // Deshabilitará la animación de Spinnies, útil para contenedores (docker) para un mejor registro
      disableWelcome: true, // Deshabilitará el mensaje de bienvenida que aparece al principio.
      updatesLog: true, // Registra actualizaciones de información automáticamente en la terminal
      autoClose: 60000, // Cierra automáticamente el venom-bot solo cuando se escanea el código QR (predeterminado 60 segundos, si desea apagarlo, asigne 0 o falso)
      createPathFileToken: false, // crea una carpeta al insertar un objeto en el navegador del cliente, para que funcione es necesario pasarle los parámetros en la función crear token de sesión del navegador
      chromiumVersion: '818858', // Versión del navegador que se utilizará. Las cadenas de revisión se pueden obtener en omahaproxy.appspot.com.
      addProxy: [''], // Agregar ejemplo de servidor proxy: [e1.p.webshare.io:01, e1.p.webshare.io:01]
      userProxy: '', // Nombre de usuario de inicio de sesión de proxy
      userPass: '' // Proxy password
    },
    // BrowserSessionToken
    // Para recibir el token del cliente, use la función await client.getSessionTokenBrowser()
    {
      WABrowserId: '"UnXjH....."',
      WASecretBundle: '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
      WAToken1: '"0i8...."',
      WAToken2: '"1@lPpzwC...."'
    },
    // BrowserInstance
    (browser, waPage) => {
      console.log('Navegador PID:', browser.process().pid);
      waPage.screenshot({ path: 'screenshot.png' });
    }
  )
  .then(client => start(client))
  .catch(erro => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async msg => {
    const { from, body, hasMedia, isGroupMsg } = msg;
    // Este bug lo reporto Lucas Aldeco Brescia para evitar que se publiquen estados
    if (from === 'status@broadcast') {
      return;
    }
    message = body.toLowerCase();
    console.log('BODY', message);

    setSessionAndUser(from);
    let session = sessionIds.get(from);
    const response = await bothResponse(message, session);

    //await sendMessage(client, from, response.replyMessage);
    /* if (response.media) {
      sendMedia(client, from, response.media);
    }
    return; */

    if (isGroupMsg === false) {
      client
        .sendText(from, response.replyMessage)
        .then(result => {
          console.log('Result: ', result); //return object success
        })
        .catch(erro => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}
