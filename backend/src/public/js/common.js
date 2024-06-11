function initMap() {
  // Crea un nuevo mapa de Google
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 }, // Centra el mapa en una ubicación específica
    zoom: 8 // Establece el nivel de zoom del mapa
  });
}
/////////////////////CAJA REGISTRADORA////////////////////////
async function connectToUSBDevice() {
  try {
    const device = await navigator.usb.requestDevice({ filters: [] }); // Especifica los filtros según el dispositivo USB de la caja registradora
    await device.open();
    await device.selectConfiguration(1); // Selecciona la configuración adecuada
    await device.claimInterface(2); // Reclama la interfaz requerida
    // Envía y recibe datos según el protocolo de comunicación de la caja registradora
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

async function connectToSerialPort() {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 }); // Establece la velocidad de transmisión según la configuración de tu caja registradora

    // Escucha los datos recibidos
    const reader = port.readable.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      console.log(value);
      // Procesa los datos recibidos
    }
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}
////////////////////* FUNCIONES GLOBALES *///////////////////////
$.jMaskGlobals = {
  maskElements: 'input,td,span,div',
  dataMaskAttr: '*[data-mask]',
  dataMask: true,
  watchInterval: 300,
  watchInputs: true,
  watchDataMask: false,
  byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
  translation: {
    $: { pattern: /\d/ },
    '*': { pattern: /\d/, optional: true },
    '#': { pattern: /\d/, recursive: true },
    A: { pattern: /[a-zA-Z0-9]/ },
    S: { pattern: /[a-zA-Z]/ }
  }
};

///////////////////* CARRITO DE COMPRAS *////////////////////////
let caritems = JSON.parse(localStorage.getItem('caritems') ?? '[]');

const ref = ref => {
  return `<div class='card shadow-lg mb-2 rounded position-relative overflow-auto referencia'>
    <div
      class='d-flex align-items-center align-content-center flex-wrap'      
      style='background-color: #FCF3CF !important;'
    >
      <div class='p-1 flex-grow-1 w-50'>
        <h4 class='m-0 text-truncate' title='name' style="max-width: 95%;"></h4>
        <span class='badge badge-info' title='ref'></span>
        <span title='precio'></span>        
      </div>
      <div 
        class='p-1'
        type='button'
        data-toggle='collapse'
        data-target='#referencia_${ref}'
        aria-expanded='false'
        aria-controls='referencia_${ref}'
      >
        x <span class='badge badge-info ctd' title='cantidad'></span>
        <a><i class='fas fa-fw fa-angle-down'></i></a>
        <br class='d-block d-md-none'/> 
        <span class='d-block d-md-none total' title='total'></span>
      </div>
      <div class='p-1 d-none d-md-block'>
        <span class='total' title='total'></span>
      </div>
      <div class='py-1 px-2'>
        <a class="deleteProduct">
          <i class='far fa-times-circle fa-2x'></i>          
        </a>
      </div>      
    </div>

    <div
      id='referencia_${ref}'
      class='collapse show px-2'
      aria-labelledby='headingOne'
      data-parent='#referencias'
    >
      <div class='d-flex align-items-center align-content-center flex-wrap'> 
        <div class='p-1 flex-grow-1 w-50 text-truncate'>Agrega mas al carrito</div>
        <div class='p-2'>
          <div class='input-group input-group-sm'>
            <div class='input-group-prepend' title='Disminuir cantidad'>
              <button type="button" class='btn btn-outline-primary minctd'>
                <i class='fas fa-fw fa-minus'></i>
              </button>
            </div>
            <input class='form-control text-center cantidad' type='text' name='cantidad' placeholder='Ctd.' style="width: 50px;" />
            <div class='input-group-append' title='Aumentar cantidad'>
              <button type="button" class='btn btn-outline-primary maxctd'>
                <i class='fas fa-fw fa-plus'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

const setRowss = (productos, data) => {
  productos.each(function () {
    if ($(this).is('input')) this.value = data[this.name] ?? null;
    else
      this.innerText = /precio|total/.test(this.title)
        ? Moneda(data[this.title], true)
        : data[this.title] ?? '';
  });
};

const addItemsCar = () => {
  if (caritems.length) {
    console.log('entro por aqui', caritems);
    $('#itemsCar').text(caritems.length).show();
    $('#msgCar').text(`${caritems.length} En Carrito`);
    $('#listCar').html(
      caritems
        .map(
          e => `
      <a href='#' class='list-group-item'>
        <div class='row no-gutters align-items-center'>
          <div class='col-2'>
            <img
              src='/img/avatars/avatar-5.jpg'
              class='avatar img-fluid rounded-circle'
              alt='Ashley Briggs'
            />
          </div>
          <div class='col-10 pl-2'>
            <div class='text-dark'>Ashley Briggs</div>
            <div class='text-muted small mt-1'>Nam pretium turpis et arcu. Duis arcu tortor.
            </div>
            <div class='text-muted small mt-1'>15m ago</div>
          </div>
        </div>
      </a>`
        )
        .join('')
    );

    localStorage.setItem('caritems', JSON.stringify(caritems));
  }
};

$(document).ready(function () {
  caritems.forEach(row => {
    const elements = setRef(row?.idref).find('input, span, h4, h5');
    return setRowss(elements, row);
  });
  addItemsCar();
});

function setRef(id) {
  const code = id ?? ID(5);

  $('#referencias').append(ref(code));

  const newElemnt = $('#referencias').find('.card:last');

  $('.collapse').not(`#referencia_${code}`).collapse('hide');

  $(`#referencia_${code}`).collapse('show');

  newElemnt
    .find('.deleteProduct')
    .hover(
      function () {
        $(this).css('color', '#000000');
      },
      function () {
        $(this).css('color', '#bfbfbf');
      }
    )
    .click(function () {
      newElemnt.hide('slow', function () {
        caritems = caritems.filter(e => e.idref === code);
        addItemsCar();
        $(this).remove();
      });
    })
    .css('color', '#bfbfbf');

  newElemnt.on('click', '.minctd', function () {
    const input = $(this).parent().siblings('input.cantidad');
    input.val(parseInt(input.val() || 0) - 1).trigger('change');
  });

  newElemnt.on('click', '.maxctd', function () {
    const input = $(this).parent().siblings('input.cantidad');
    input.val(parseInt(input.val() || 0) + 1).trigger('change');
  });

  newElemnt.on('change', '.cantidad', function () {
    if (this.value < 1) {
      newElemnt.hide('slow', function () {
        caritems = caritems.filter(e => e.idref === code);
        $(this).remove();
      });
    } else {
      caritems = caritems.map(e => {
        if (e.idref === code) {
          data = { cantidad: parseInt(this.value), total: e.precio * this.value };
          newElemnt.find('span.ctd, span.total').each(function () {
            this.innerText = this.title === 'total' ? Moneda(data[this.title]) : data[this.title];
          });
          return { ...e, ...data };
        }
        return e;
      });
    }

    addItemsCar();
  });

  return newElemnt;
}

const measuring = [
  { tag: 'Metros', val: 'm' },
  { tag: 'Metros cuadrados', val: 'm²' },
  { tag: 'Metros cubicos', val: 'm³' },
  { tag: 'Centimetros cubicos', val: 'cm³' },
  { tag: 'Centimetros', val: 'cm' },
  { tag: 'Milimetros', val: 'mm' },
  { tag: 'Kilometros', val: 'km' },
  { tag: 'Litros', val: 'l' },
  { tag: 'Mililitros', val: 'ml' },
  { tag: 'Gramos', val: 'g' },
  { tag: 'Kilogramos', val: 'kg' },
  { tag: 'Miligramos', val: 'mg' },
  { tag: 'Libras', val: 'lb' },
  { tag: 'Onzas', val: 'oz' },
  { tag: 'Unidades', val: 'u' },
  { tag: 'Pares', val: 'par' },
  { tag: 'Cajas', val: 'c' },
  { tag: 'Bolsas', val: 'b' },
  { tag: 'Paquetes', val: 'p' },
  { tag: 'Rollos', val: 'r' },
  { tag: 'Galones', val: 'gl' },
  { tag: 'Barriles', val: 'b' },
  { tag: 'Toneladas', val: 't' },
  { tag: 'Miles', val: 'mi' },
  { tag: 'Yardas', val: 'yd' },
  { tag: 'Pies', val: 'ft' },
  { tag: 'Pulgadas', val: 'in' }
];

/* function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert('La geolocalización no es soportada por este navegador.');
    }
  }
  
  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    alert('Latitud: ' + latitude + '\nLongitud: ' + longitude);
    // geocodeLatLng(latitude, longitude)
  }
  
  function geocodeLatLng(lat, lng) {
    var geocoder = new google.maps.Geocoder();
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
  
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          // console.log(results[0].formatted_address);
          console.log(results);
          // Aquí puedes hacer lo que quieras con la dirección obtenida, como mostrarla en tu página HTML
        } else {
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  } */

const noCifra = valor => {
  if (!valor) return 0;
  const num = /[^0-9.-]/g.test(valor)
    ? parseFloat(valor.replace(/[^0-9.]/g, ''))
    : parseFloat(valor);
  if (typeof num != 'number') throw TypeError('El argumento no puede ser de tipo string');
  return num;
};
const Cifra = valor => {
  if (!valor) return valor;
  const punto = /\.$/.test(valor);
  const num = /[^0-9.-]/g.test(valor)
    ? parseFloat(valor.replace(/[^0-9.]/g, ''))
    : parseFloat(valor);
  if (typeof num != 'number') throw TypeError('El argumento no puede ser de tipo string');
  return punto
    ? num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '.'
    : num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const currency = (value, coin = false) => {
  if (!value) return value;
  if (!/[0-9]/g.test(value)) return value.replace(/[^0-9.]/g, '');
  let symbol = '';
  const punto = /\.$/.test(value);
  const num = /[^0-9.-]/g.test(value)
    ? parseFloat(value.replace(/[^0-9.]/g, ''))
    : parseFloat(value);
  if (typeof num != 'number') throw TypeError('El argumento no puede ser de tipo string');

  if (coin) symbol = num > 0 && num < 1 ? '%' : num > 0 ? '$ ' : '';

  const number = num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  const amount = punto ? number + '.' : number;
  return symbol === '%' ? amount + symbol : symbol + amount;
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
function Moneda(valor, sng = false) {
  valor = valor
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
  valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
  return sng ? '$ ' + valor : valor;
}
//Leva a mayúsculas la primera letra de cada palabra
function titleCase(texto) {
  const re = /(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(?:([a-záéíóúüñ])|([A-ZÁÉÍÓÚÜÑ]))|([A-ZÁÉÍÓÚÜÑ]+)/gu;
  return texto.replace(re, (m, caracterPrevio, minuscInicial, mayuscInicial, mayuscIntermedias) => {
    const locale = ['es', 'gl', 'ca', 'pt', 'en'];
    //Son letras mayúsculas en el medio de la palabra
    // => llevar a minúsculas.
    if (mayuscIntermedias) return mayuscIntermedias.toLocaleLowerCase(locale);
    //Es la letra inicial de la palabra
    // => dejar el caracter previo como está.
    // => si la primera letra es minúscula, capitalizar
    //    sino, dejar como está.
    return (
      caracterPrevio + (minuscInicial ? minuscInicial.toLocaleUpperCase(locale) : mayuscInicial)
    );
  });
}
function init_events(ele) {
  ele.each(function () {
    // crear un objeto de evento (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
    // no necesita tener un comienzo o un final
    var eventObject = {
      title: $.trim($(this).text()) // Usa el texto del elemento como título del evento.
    };
    // almacenar el objeto de evento en el elemento DOM para que podamos acceder a él más tarde
    $(this).data('eventObject', eventObject);
    // haz que el evento se pueda arrastrar usando jQuery UI
    $(this).draggable({
      zIndex: 1070,
      revert: true, // hará que el evento vuelva a su
      revertDuration: 0 //  Posición original después del arrastre
    });
  });
}
/*CONSULTAR PERSONAS || EMPRESAS*/
function Consultar(tipo, code) {
  var settings,
    datos = {},
    url,
    dat;
  if (tipo === 'Nit') {
    datos.url = 'https://api.misdatos.com.co/api/co/rues/consultarEmpresaPorNit';
    datos.dat = {
      nit: code
    };
  } else {
    datos.url = 'https://api.misdatos.com.co/api/co/consultarNombres';
    datos.dat = {
      documentType: tipo,
      documentNumber: code
    };
  }
  return datos;
}
/*CONSULTAS EN DATATABLES*/

var VER = (tabla, filas) => {
  $(tabla).DataTable().page.len(filas).draw();
};
var STAD = (tabla, col, std) => {
  $(tabla).DataTable().columns().search('');
  $(tabla).DataTable().columns(col).search(std).draw();
};
var STAD3 = (tabla, col, std) => {
  //$(tabla).DataTable().columns().search('');
  $(tabla).DataTable().columns(col).search(std).draw();
};
////////////////////* ESTADO DE EL MODAL DE EVENTOS /////////////////////
$('#ModalEventos').on('hide.bs.modal', function (e) {
  console.log('lo mandaron a cerrar');
});
$('#ModalEventos').on('hidden.bs.modal', function (e) {
  console.log('ya se cerro');
});
////////////////////*ROLES*//////////////////////////////////////
let ro;
$.ajax({
  url: '/links/roles',
  async: false,
  beforeSend: function (xhr) {},
  success: function (data) {
    ro = data; //console.log(data)
  }
});
const rol = ro;
/* var admin = $('#usuarioadmin').val()
  var USERADMIN = $('#usuariofullname').val(); */
////////////////////////////////////////////////////////////////////
//lenguaje
const languag = {
  lengthMenu: 'Ver 10 filas',
  sProcessing: 'Procesando...',
  sLengthMenu: 'Mostrar _MENU_ registros',
  sZeroRecords: 'No se encontraron resultados',
  sEmptyTable: 'Ningún dato disponible',
  sInfo: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
  sInfoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
  sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
  sInfoPostFix: '',
  sSearch: 'Buscar : ',
  sUrl: '',
  sInfoThousands: ',',
  sLoadingRecords: 'Cargando...',
  oPaginate: {
    sFirst: 'Pri',
    sLast: 'Últ',
    sNext: 'Sig',
    sPrevious: 'Ant'
  },
  oAria: {
    sSortAscending: ': Activar para ordenar la columna de manera ascendente',
    sSortDescending: ': Activar para ordenar la columna de manera descendente'
  },
  buttons: {
    copy: 'Copiar',
    csv: 'Exportar a CSV'
  }
};
const languag2 = {
  lengthMenu: 'Ver 10 filas',
  sProcessing: 'Procesando...',
  sLengthMenu: 'Ver _MENU_ filas',
  sZeroRecords: 'No se encontraron resultados',
  sEmptyTable: 'Ningún dato disponible',
  sInfo: 'Mostrando del _START_ al _END_ | Total _TOTAL_ registros',
  sInfoEmpty: 'Reg. del 0 al 0 | Total 0 registros',
  sInfoFiltered: '(filtro de _MAX_ registros)',
  sInfoPostFix: '',
  sSearch: 'Buscar : ',
  sUrl: '',
  sInfoThousands: ',',
  sLoadingRecords: 'Cargando...',
  oPaginate: {
    sFirst: 'Pri',
    sLast: 'Últ',
    sNext: 'Sig',
    sPrevious: 'Ant'
  },
  oAria: {
    sSortAscending: ': Activar para ordenar la columna de manera ascendente',
    sSortDescending: ': Activar para ordenar la columna de manera descendente'
  }
};
$('.fechas').daterangepicker({
  locale: {
    format: 'YYYY-MM-DD',
    daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    monthNames: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ],
    firstDay: 1
  },
  singleDatePicker: true,
  showDropdowns: true,
  opens: 'right'
});

//mensajes
function SMSj(tipo, mensaje) {
  var message = mensaje;
  var title = 'RedElite';
  var type = tipo;
  toastr[type](message, title, {
    positionClass: 'toast-top-right',
    closeButton: true,
    progressBar: true,
    newestOnTop: true,
    rtl: $('body').attr('dir') === 'rtl' || $('html').attr('dir') === 'rtl',
    timeOut: 7500
  });
}
////////////////////////////////* CHATS */////////////////////////////////////
$(document).ready(function () {
  moment.locale('es-mx');
  var Chats = () => {
    $.ajax({
      url: '/links/chats',
      type: 'GET',
      beforeSend: function (xhr) {},
      success: function (data) {
        if (data.dialogs) {
          var id = data.dialogs[0].id;
          var id2 = data.dialogs[0].id.replace(/[^a-zA-Z 0-9]+/g, '');
          var i = data.dialogs[0].image || null;
          var name = data.dialogs[0].name;
          var tiempo = data.dialogs[0].last_time * 1000;
          Chatid(id, id2, i, name, tiempo);

          data.dialogs.map((x, i) => {
            var fecha = moment(x.last_time * 1000).fromNow();
            $('#contactos').append(
              `<div class="contact" id="${x.id.replace(/[^a-zA-Z 0-9]+/g, '')}">
                              <div class="pic rogers" style="background-image: url('${
                                x.image
                                  ? x.image
                                  : 'https://c0.klipartz.com/pngpicture/719/903/gratis-png-iconos-de-computadora-avatar-icono-de-avatar.png'
                              }');"></div>
                              <div class="badge"></div>
                              <div class="name">${x.name}</div>
                              <div class="message">${
                                x.metadata.isGroup ? 'Group' : 'Person'
                              } 🍑 ${fecha}</div>
                              <input type="hidden" class="tiempo" value="${x.last_time * 1000}">
                              <input type="hidden" class="idOrg" value="${x.id}">
                          </div>`
            );
          });
          $('.contact').on('click', function () {
            var id = $(this).find('.idOrg').val();
            var id2 = $(this).attr('id');
            var i = $(this).find('.pic').css('background-image');
            var name = $(this).find('.name').html();
            var tiempo = $(this).find('.tiempo').val();
            Chatid(id, id2, i, name, tiempo);
          });
        }
      }
    });
  };
  //Chats();
});
var Chatid = (id, id2, img, name, tiempo) => {
  $.ajax({
    url: '/links/chats/' + id,
    type: 'GET',
    beforeSend: function (xhr) {},
    success: function (data) {
      if (data.messages) {
        var fech = null;
        $('#chat').html('');
        $('#ChatActivo').val(id2);
        $('#ChatActivOrg').val(id);
        $('#' + id2)
          .find('.badge')
          .html(null);
        img ? $('.bar .pic').css('background-image', img) : '';
        $('.bar .name').html(name);
        $('.bar .seen').html(moment(parseFloat(tiempo)).fromNow());
        data.messages.map((x, i) => {
          var segundos = x.time * 1000;
          var fecha = moment(segundos).calendar();
          var indic = fecha.indexOf(' a la');
          var dia = indic != -1 ? fecha.substr(0, indic) : fecha; //.format('MM-DD HH:mm');
          var f = moment(segundos).format('LT');
          var body = x.body.replace(/[^a-zA-Z 0-9]+/g, '');
          var icons = x.id.substr(0, 4) === 'false' ? 'far' : 'fas';
          $('#chat').prepend(
            `${dia !== fech ? `<div class="time">${dia}</div>` : ``}
                          ${
                            x.fromMe
                              ? `<div class="message parker" id="${x.id.replace(
                                  /[^a-zA-Z 0-9]+/g,
                                  ''
                                )}">${body} &nbsp&nbsp&nbsp<small class="float-right"> ${f} &nbsp<i class="${icons} fa-copyright"></i></small></div>`
                              : `<div class="message stark" id="${x.id.replace(
                                  /[^a-zA-Z 0-9]+/g,
                                  ''
                                )}">${
                                  x.body
                                } &nbsp&nbsp&nbsp<small class="float-right"> ${f}</small></div>`
                          }`
          );

          fech = dia;
          $('#diah').val(`${dia}`);
        });
        $('#chat').scrollTop($('#chat').prop('scrollHeight'));
        /*`<div class="message stark">
                  <div class="typing typing-1"></div>
                  <div class="typing typing-2"></div>
                  <div class="typing typing-3"></div>
              </div>
              //Le agrego otro ''Mensaje''
      $('#chat').append('<div class="chatMessage"></div>');
      //Fijo el scroll al fondo usando añadiendo una animación (animate)
      $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight")}, 1000);`*/
      }
    }
  });
};
/* const socket = io();
  socket.on('messages', function (data) {
      var chatId = "#" + data.chatId.replace(/[^a-zA-Z 0-9]+/g, '');
      var t = data.chatId.replace(/[^a-zA-Z 0-9]+/g, '');
      var p = data.id.replace(/[^a-zA-Z 0-9]+/g, '');
      if (t === $('#ChatActivo').val()) {
  
          var day = $('#diah').val();
          var segundos = data.time * 1000;
          var fecha = moment(segundos).calendar()
          var indic = fecha.indexOf(' a la');
          var dia = indic != -1 ? fecha.substr(0, indic) : fecha; //.format('MM-DD HH:mm');
          var f = moment(segundos).format('LT');
          var body = data.body.replace(/[^a-zA-Z 0-9]+/g, '');
          var icons = data.id.substr(0, 4) === 'false' ? 'far' : 'fas';
          $('#typing').length > 0 ? $('#typing').remove() : '';
          $('#chat').append(
              `${dia !== day ? `<div class="time">${dia}</div>` : ``}
              ${data.fromMe ? `<div class="message parker" id="${p}">${body} &nbsp&nbsp&nbsp<small class="float-right"> ${f} &nbsp<i class="${icons} fa-copyright"></i></small></div>`
                  : `<div class="message stark" id="${p}">${data.body} &nbsp&nbsp&nbsp<small class="float-right"> ${f}</small></div>`}`);
          $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight") }, 1000);
          $('#diah').val(`${dia}`);
  
      } else if ($(chatId).length > 0) {
  
          var num = parseFloat($(chatId).find('.badge').html() || 0) + 1;
          var pic = $(chatId).find('.pic').css('background-image'),
              name = $(chatId).find('.name').html(),
              item = $(chatId).find('.message').html(),
              tiempo = $(chatId).find('.tiempo').val();
  
          $(chatId).remove();
          $('#contactos').find(".contact").first().before(
              `<div class="contact" id="${t}">
                  <div class="pic rogers"></div>
                  <div class="badge">${num}</div>
                  <div class="name">${name}</div>
                  <div class="message">${item}</div>
                  <input type="hidden" class="tiempo" value="${tiempo}">
                  <input type="hidden" class="idOrg" value="${data.chatId}">
              </div>`);
          $(chatId).find('.pic').css('background-image', pic)
          $('.contact').on('click', function () {
              var id = $(this).find('.idOrg').val();
              var id2 = $(this).attr('id');
              var i = $(this).find('.pic').css('background-image');
              var name = $(this).find('.name').html();
              var tiempo = $(this).find('.tiempo').val();
              Chatid(id, id2, i, name, tiempo)
          })
  
      } else {
  
          var fecha = moment(data.time * 1000).fromNow()
          $('#contactos').find(".contact").first().before(
              `<div class="contact" id="${t}">
                  <div class="pic rogers" style="background-image: url('https://c0.klipartz.com/pngpicture/719/903/gratis-png-iconos-de-computadora-avatar-icono-de-avatar.png');"></div>
                  <div class="badge">1</div>
                  <div class="name">${data.chatName}</div>
                  <div class="message">Person 🍑 ${fecha}</div>
                  <input type="hidden" class="tiempo" value="${data.time * 1000}">
                  <input type="hidden" class="idOrg" value="${data.chatId}">
              </div>`);
          $('.contact').on('click', function () {
              var id = $(this).find('.idOrg').val();
              var id2 = $(this).attr('id');
              var i = $(this).find('.pic').css('background-image');
              var name = $(this).find('.name').html();
              var tiempo = $(this).find('.tiempo').val();
              Chatid(id, id2, i, name, tiempo)
          })
      }
  });
  
  socket.on('typing', function (data) {
      if (data.chatId.replace(/[^a-zA-Z 0-9]+/g, '') === $('#ChatActivo').val()) {
          $("#" + data.id.replace(/[^a-zA-Z 0-9]+/g, '')).find('.fa-copyright').removeClass("fas").addClass('far');
      }
  }); */

$('#send').keypress(function (e) {
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    socket.emit('message', {
      id: $('#ChatActivOrg').val(),
      body: $(this).val()
    });
    $('#chat').append(
      `<div class="message stark" id="typing">
                  <div class="typing typing-1"></div>
                  <div class="typing typing-2"></div>
                  <div class="typing typing-3"></div>
              </div>`
    );
    $('#chat').animate({ scrollTop: $('#chat').prop('scrollHeight') }, 1000);
    $(this).val('');
  }
});

$('#btn-mas').on('change', function () {
  if ($(this).is(':checked')) {
    $('.center').css({
      opacity: '1',
      visibility: 'visible',
      'margin-bottom': '1px'
    });
    $('.contacts').css({
      opacity: '1',
      visibility: 'visible'
    });
  } else {
    $('.center').css({
      opacity: '0',
      visibility: 'hidden',
      'margin-bottom': '-50px'
    });
    $('.contacts').css({
      opacity: '0',
      visibility: 'hidden'
    });
  }
});

var chat;
//rol.externo ? '' : !rol.asistente ? '' : chat = document.getElementById('chat');
//rol.externo ? '' : rol.asistente ? chat.scrollTop = chat.scrollHeight - chat.clientHeight : '';

/////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  moment.locale('es-mx');
  var cli = $('#cli').val();
  if (!cli) {
    $('#AddClientes').modal({
      backdrop: 'static',
      keyboard: true,
      toggle: true
    });
  }
  if ($('#nivel').html() === 'Independiente') {
    $('#nivel').addClass('badge-danger');
  } else if ($('#nivel').html() === 'Inversionista') {
    $('#afiliacion').removeClass('d-none');
    $('#nivel').addClass('badge-warning');
  } else if ($('#nivel').html() === 'Director') {
    $('#afiliacion').removeClass('d-none');
    $('#nivel').addClass('badge-dark');
  } else if ($('#nivel').html() === 'Gerente') {
    $('#afiliacion').removeClass('d-none');
    $('#nivel').addClass('badge-info');
  } else if ($('#nivel').html() === 'Gerente Elite') {
    $('#afiliacion').removeClass('d-none');
    $('#nivel').addClass('badge-primary');
  } else if ($('#nivel').html() === 'Vicepresidente') {
    $('#afiliacion').removeClass('d-none');
    $('#nivel').addClass('badge-tertiary');
  } else {
    $('#afiliacion').removeClass('d-none');
    $('#nivel').addClass('badge-success');
  }
  if (rol.admin) {
    $('#nivel').html('Administrador');
    $('#afiliacion').removeClass('d-none');
  } else if (rol.subadmin) {
    $('#nivel').html('Sub Administrador');
    $('#afiliacion').removeClass('d-none');
  } else if (rol.contador) {
    $('#nivel').html('Contador');
  } else if (rol.financiero) {
    $('#nivel').html('financista');
  } else if (rol.auxicontbl) {
    $('#nivel').html('Aux. Contable');
  } else if (rol.asistente) {
    $('#nivel').html('Asistente');
  } else if (rol.externo) {
    $('#nivel').html('Externo');
  }
  $('a.r').css('color', '#bfbfbf');
  $('a.r').hover(
    function () {
      $(this).next('div.reditarh').show();
      $(this).css('color', '#000000');
    },
    function () {
      $('.reditarh').hide('slow');
      $(this).css('color', '#bfbfbf');
    }
  );
  $('.edi').on({
    focus: function () {
      $(this).css('background-color', '#FFFFCC');
      $(this).next('div.reditarh').show('slow');
      $(this).attr('input') ? this.select() : '';
    },
    blur: function () {
      $(this).css({
        'background-color': 'transparent'
      });
      $('.reditarh').hide('slow');
      $('.item').hide('slow');
    },
    change: function () {
      //$(this).val($(this).val().toLowerCase().trim().split(' ').map(v => v[0].toUpperCase() + v.substr(1)).join(' '))
    }
  });
  $('#pays').change(function () {
    $('.movl').val('');
    $('.movl')
      .mask(`${$(this).val()} ***-***-****`)
      .focus();
  });
  $('.movl').mask('57 ***-***-****');
  $('.docum').mask('AAAAAAAAAAA');
  var coun = 0;
  $('#pedircupon').click(function () {
    if (!cli) {
      SMSj(
        'error',
        'No puedes solicitar un CUPON sin haber completado tu registro primero. Actualiza tus datos'
      );
      $('#AddClientes').modal({
        backdrop: 'static',
        keyboard: true,
        toggle: true
      });
    } else {
      $('#pedircupon').prop('disabled', true);
      $.ajax({
        url: '/links/cupon',
        data: { dto: $('#porcntgd').val(), ctn: coun++ },
        type: 'POST',
        async: false,
        success: function (data) {
          if (data) {
            SMSj(data.tipo, data.msj);
            $('#pedircupon').prop('disabled', false);
          }
        }
      });
    }
  });
  $('#crearclientes').submit(function (e) {
    e.preventDefault();
    $('.ya').val(moment().format('YYYY-MM-DD HH:mm'));
    //var fd = $('#creacliente').serialize();
    var formData = new FormData(document.getElementById('crearclientes'));
    $.ajax({
      url: '/links/clientes/agregar',
      data: formData,
      type: 'PUT',
      processData: false,
      contentType: false,
      beforeSend: function (xhr) {
        $('#AddClientes').modal('hide');
        $('#ModalEventos').modal({
          toggle: true,
          backdrop: 'static',
          keyboard: true
        });
      },
      success: function (data) {
        if (data) {
          SMSj('success', 'Datos atualizados correctamente');
          $('#ModalEventos').modal('hide');
        }
      }
    });
  });
});

function getScreenSize() {
  const width = window.innerWidth;

  if (width < 576) return { width, tag: 'xs' };
  else if (width < 768) return { width, tag: 'sm' };
  else if (width < 992) return { width, tag: 'md' };
  else if (width < 1200) return { width, tag: 'lg' };
  else return { width, tag: 'xl' };
}

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
}
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
} //Unidades()
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
  if (data.enteros == 1)
    return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
  else return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
} //NumeroALetras()
//return a promise that resolves with a File instance
function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}
function ID(lon) {
  let chars = 'wB9XyUfZ2nR3K1Am5MoH7h8EqsbcLeFjDPa0uGrzTVlQgtW6NpSJivCYkdIx4OM',
    code = '';
  for (x = 0; x < lon; x++) {
    let rand = Math.floor(Math.random() * chars.length);
    code += chars.substr(rand, 1);
  }
  return code;
}
var LISTA = '';
function LISTAS(n, fi, ff, p, IMG) {
  var fch = new Date();
  var FI = moment(fi).format('YYYY-MM-DD'),
    FF = moment(ff).format('YYYY-MM-DD');
  var fechs = new Date(ff);
  var months = fechs.getMonth() - fch.getMonth() + 12 * (fechs.getFullYear() - fch.getFullYear());
  let maxcuotas = 0;

  if (months > 102) maxcuotas = 114;
  else if (months > 90) maxcuotas = 102;
  else if (months > 72) maxcuotas = 90;
  else if (months > 60) maxcuotas = 72;
  else if (months > 48) maxcuotas = 60;
  else if (months > 42) maxcuotas = 48;
  else if (months > 36) maxcuotas = 42;
  else if (months > 30) maxcuotas = 36;
  else if (months > 24) maxcuotas = 30;
  else if (months > 18) maxcuotas = 24;
  else if (months > 12) maxcuotas = 18;
  else if (months > 6) maxcuotas = 12;
  else maxcuotas = 6;

  var PDF = () => {
    var doc = new jsPDF('p', 'mm', 'a4');
    var img = new Image();
    var totalPagesExp = '{total_pages_count_string}';
    img.src = IMG == 'NULL' ? '/img/avatars/avatar.png' : IMG;

    doc.autoTable({
      html: '#listas',
      useCss: true,
      didDrawPage: function (data) {
        // Header
        doc.setTextColor(0);
        doc.setFontStyle('normal');
        if (img) {
          doc.addImage(img, 'png', data.settings.margin.left, 10, 20, 20);
        }
        doc.setFontSize(9);
        doc.text(moment().format('lll'), data.settings.margin.left + 157, 10);
        /* doc.setFontSize(20);
          doc.text('INMOVILI', 105, 15, null, null, 'center'); */
        doc.setFontSize(20);
        doc.text(p, 105, 20, null, null, 'center');
        doc.setFontSize(9);
        doc.text('LISTADO DE PRODUCTOS', 105, 25, null, null, 'center');
        doc.setFontSize(8);
        doc.text(
          `Proyecto iniciado en ${FI} y proyectado a finalizar en ${FF}`,
          data.settings.margin.left,
          33
        );

        // Footer
        var str = 'Page ' + doc.internal.getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + ' of ' + totalPagesExp;
        }
        doc.setFontSize(8);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        //doc.text(/*str*/ `Atententamente:`, data.settings.margin.left, pageHeight - 45)
        doc.text(
          /*str*/ `Debe tener en cuenta que esta informacion no es cien por ciento veras, ya que en cualquier instante puede cambiar el estado de un producto.\nRED ELITE recomienda hacer uso del sistema el cual si posee el estado veras del producto, con el fin de no mal informar al cliente inetresado.\nLos productos demarcados con azul estan pedientes por pagos pasados 24 horas habil volveran a estar disponibles en caso que no se confirme`,
          data.settings.margin.left,
          pageHeight - 15
        );
        doc.text(str, data.settings.margin.right, pageHeight - 5);
      },
      margin: { top: 35 }
    });
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    doc.output('save', `LISTADO ${p}.pdf`);
    SMSj('success', `Lista de ${p} descargada exitosamente`);
    $('#ModalEventos').modal('hide');
  };
  $.ajax({
    type: 'POST',
    url: '/links/products/' + n,
    beforeSend: function (xhr) {
      $('#ModalEventos').modal({
        backdrop: 'static',
        keyboard: true,
        toggle: true
      });
    },
    success: function (dat) {
      if (dat && !LISTA) {
        LISTA = $('#listas').DataTable({
          lengthMenu: [-1],
          ajax: {
            method: 'POST',
            url: '/links/products/' + n,
            dataSrc: 'data'
          },
          columns: [
            { data: 'mz' },
            { data: 'n' },
            { data: 'mtr2' },
            {
              data: 'estado',
              className: 'c',
              render: function (data, method, row) {
                switch (data) {
                  case 1:
                    return `<span class="badge badge-pill badge-info">Pendiente</span>`;
                    break;
                  case 8:
                    return `<span class="badge badge-pill badge-dark">Tramitando</span>`;
                    break;
                  case 9:
                    return `<span class="badge badge-pill badge-success">Disponible</span>`;
                    break;
                  case 10:
                    return `<span class="badge badge-pill badge-primary">Separado</span>`;
                    break;
                  case 12:
                    return `<span class="badge badge-pill badge-secondary">Apartado</span>`;
                    break;
                  case 13:
                    return `<span class="badge badge-pill badge-tertiary">Vendido</span>`;
                    break;
                  case 14:
                    return `<span class="badge badge-pill badge-danger">Tramitando</span>`;
                    break;
                  case 15:
                    return `<span class="badge badge-pill badge-warning">Inactivo</span>`; //secondary
                    break;
                }
              }
            },
            {
              data: 'valor',
              render: $.fn.dataTable.render.number('.', '.', 2, '$')
            },
            {
              data: 'inicial',
              render: $.fn.dataTable.render.number('.', '.', 2, '$')
            },
            {
              data: 'mtr2',
              render: function (data, method, row) {
                return '$' + Cifra(row.valor / data);
              }
            },
            {
              data: null,
              //defaultContent: maxcuotas
              render: (data, method, row) => {
                const maxQota = row.maxfnc ? parseFloat(row.maxfnc) : maxcuotas;
                return maxQota - row.maxini;
              }
            },
            {
              data: 'valor',
              render: function (data, method, row) {
                const maxQota = row.maxfnc ? parseFloat(row.maxfnc) : maxcuotas;
                return '$' + Cifra((data - row.inicial) / (maxQota - row.maxini));
              }
            }
          ],
          //autoWidth: true,
          //responsive: true,
          initComplete: function (settings, json) {
            PDF();
          },
          search: false,
          info: false,
          paging: false,
          order: [
            [0, 'asc'],
            [1, 'asc']
          ],
          drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api
              .column(0, { page: 'current' })
              .data()
              .each(function (group, i) {
                if (last !== group) {
                  $(rows)
                    .eq(i)
                    .before(
                      `<tr class="group" style="background: #7f8c8d; color: #FFFFCC;">
                                          <td colspan="10">
                                              <div class="text-center">
                                                  ${group != '0' ? 'MANZANA "' + group + '"' : ''}
                                              </div>
                                          </td>
                                      </tr>`
                    );
                  last = group;
                }
              });
          },
          rowCallback: function (row, data, index) {
            if (data['estado'] == 15) {
              $(row).css('background-color', '#FFFFCC');
            } else if (data['estado'] == 1) {
              $(row).css('background-color', '#00FFFF');
            } else if (data['estado'] == 9) {
              $(row).css('background-color', '#40E0D0');
            }
          }
        });
      } else {
        LISTA.ajax.url('/links/products/' + n).load(function () {
          PDF();
        });
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}
//Usage example:
/*urltoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt','text/plain')
  .then(function(file){ console.log(file);});*/
/*
      const url = 'data:image/png;base6....';
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], "File name",{ type: "image/png" })
    })*/
function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}
/*
  var file = document.querySelector('#files > input[type="file"]').files[0];
  getBase64(file);*/
