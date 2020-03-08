// Copyright (c) 2018, Altiria TIC SL
// All rights reserved.
// El uso de este código de ejemplo es solamente para mostrar el uso de la pasarela de envío de SMS de Altiria
// Para un uso personalizado del código, es necesario consultar la API de especificaciones técnicas, donde también podrás encontrar
// más ejemplos de programación en otros lenguajes de programación y otros protocolos (http, REST, web services)
// https://www.altiria.com/api-envio-sms/

var querystring = require('querystring');
var http = require('http');

/*function sendSMS(domainId, login, passwd, tel, sender, text) {
  // Se contruye la cadena del post desde un objeto
  var post_data = querystring.stringify({
      'cmd' : 'sendsms',
      'domainId' : domainId,
      'login': login,
      'passwd': passwd,
      'dest' : tel,
      //No es posible utilizar el remitente en América pero sí en España y Europa
      'senderId' : sender,
      'msg' : text
  });*/

  function sendSMS(tel, text) {
    // Se contruye la cadena del post desde un objeto
    var post_data = querystring.stringify({
        'cmd' : 'sendsms',
        'domainId' : 'samirsaldarriaga',
        'login': 'samirsaldarriaga@hotmail.com',
        'passwd': 'fZ7h8e9LUs2',
        'dest' : tel,
        //No es posible utilizar el remitente en América pero sí en España y Europa
        'senderId' : '',
        'msg' : text
    });

  // Un objeto de opciones sobre donde se envia el post
  var post_options = {
      host: 'www.altiria.net',
      port: '80',
      path: '/api/http',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Se efectua la petición
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          //Es necesario procesar la respuesta y los posibles errores
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}
module.exports = sendSMS;
// XX, YY y ZZ se corresponden con los valores de identificacion del
// usuario en el sistema.
//sendSMS('samirsaldarriaga','samirsaldarriaga@hotmail.com','fZ7h8e9LUs2 ','573007753983','','Mensaje de prueba');
//No es posible utilizar el remitente en América pero sí en España y Europa
//Utilizar esta llamada solo si se cuenta con un remitente autorizado por Altiria
//sendSMS('XX','YY','ZZ','346xxxxxxxx,346yyyyyyyy','remitente','Mensaje de prueba');
