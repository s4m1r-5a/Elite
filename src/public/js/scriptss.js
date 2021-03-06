/////////////////////* FUNCIONES GLOBALES *///////////////////////
$.jMaskGlobals = {
    maskElements: 'input,td,span,div',
    dataMaskAttr: '*[data-mask]',
    dataMask: true,
    watchInterval: 300,
    watchInputs: true,
    watchDataMask: false,
    byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
    translation: {
        '$': { pattern: /\d/ },
        '*': { pattern: /\d/, optional: true },
        '#': { pattern: /\d/, recursive: true },
        'A': { pattern: /[a-zA-Z0-9]/ },
        'S': { pattern: /[a-zA-Z]/ }
    }
};
function Moneda(valor) {
    valor = valor.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
    return valor;
}
//Leva a mayúsculas la primera letra de cada palabra
function titleCase(texto) {
    const re = /(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])(?:([a-záéíóúüñ])|([A-ZÁÉÍÓÚÜÑ]))|([A-ZÁÉÍÓÚÜÑ]+)/gu;
    return texto.replace(re,
        (m, caracterPrevio, minuscInicial, mayuscInicial, mayuscIntermedias) => {
            const locale = ['es', 'gl', 'ca', 'pt', 'en'];
            //Son letras mayúsculas en el medio de la palabra
            // => llevar a minúsculas.
            if (mayuscIntermedias)
                return mayuscIntermedias.toLocaleLowerCase(locale);
            //Es la letra inicial de la palabra
            // => dejar el caracter previo como está.
            // => si la primera letra es minúscula, capitalizar
            //    sino, dejar como está.
            return caracterPrevio +
                (minuscInicial ? minuscInicial.toLocaleUpperCase(locale) : mayuscInicial);
        }
    );
}
function init_events(ele) {
    ele.each(function () {
        // crear un objeto de evento (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // no necesita tener un comienzo o un final
        var eventObject = {
            title: $.trim($(this).text()) // Usa el texto del elemento como título del evento.
        }
        // almacenar el objeto de evento en el elemento DOM para que podamos acceder a él más tarde
        $(this).data('eventObject', eventObject)
        // haz que el evento se pueda arrastrar usando jQuery UI
        $(this).draggable({
            zIndex: 1070,
            revert: true, // hará que el evento vuelva a su
            revertDuration: 0 //  Posición original después del arrastre
        })
    })
};
/*CONSULTAR PERSONAS || EMPRESAS*/
function Consultar(tipo, code) {
    var settings, datos = {}, url, dat;
    if (tipo === 'Nit') {
        datos.url = 'https://api.misdatos.com.co/api/co/rues/consultarEmpresaPorNit';
        datos.dat = {
            "nit": code
        }
    } else {
        datos.url = 'https://api.misdatos.com.co/api/co/consultarNombres';
        datos.dat = {
            "documentType": tipo,
            "documentNumber": code
        }
    }
    return datos;
}
/*CONSULTAS EN DATATABLES*/
var VER = (tabla, filas) => {
    $(tabla).DataTable().page.len(filas).draw();
}
var STAD = (tabla, col, std) => {
    $(tabla).DataTable().columns().search('');
    $(tabla).DataTable().columns(col).search(std).draw();
}
////////////////////* ESTADO DE EL MODAL DE EVENTOS /////////////////////
$('#ModalEventos').on('hide.bs.modal', function (e) {
    console.log('lo mandaron a cerrar')
});
$('#ModalEventos').on('hidden.bs.modal', function (e) {
    console.log('ya se cerro')
});
////////////////////*ROLES*//////////////////////////////////////
let ro;
$.ajax({
    url: '/links/roles',
    async: false,
    beforeSend: function (xhr) {
    },
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
    "lengthMenu": "Ver 10 filas",
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar : ",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Pri",
        "sLast": "Últ",
        "sNext": "Sig",
        "sPrevious": "Ant"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },
    "buttons": {
        "copy": 'Copiar',
        "csv": 'Exportar a CSV'
    }
};
const languag2 = {
    "lengthMenu": "Ver 10 filas",
    "sProcessing": "Procesando...",
    "sLengthMenu": "Ver _MENU_ filas",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible",
    "sInfo": "Mostrando del _START_ al _END_ | Total _TOTAL_ registros",
    "sInfoEmpty": "Reg. del 0 al 0 | Total 0 registros",
    "sInfoFiltered": "(filtro de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar : ",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Pri",
        "sLast": "Últ",
        "sNext": "Sig",
        "sPrevious": "Ant"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};
$(".fechas").daterangepicker({
    locale: {
        'format': 'YYYY-MM-DD',
        'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'firstDay': 1
    },
    singleDatePicker: true,
    showDropdowns: true,
    opens: "right",
});

var $validationForm = $("#smartwizard-arrows-primary");
$validationForm.smartWizard({
    theme: "arrows",
    showStepURLhash: false,
    lang: {// Variables del lenguaje
        next: 'Siguiente',
        previous: 'Atras'
    },
    toolbarSettings: {
        toolbarPosition: 'bottom', // none, top, bottom, both
        toolbarButtonPosition: 'right', // left, right
        showNextButton: true, // show/hide a Next button
        showPreviousButton: false // show/hide a Previous button
        //toolbarExtraButtons: [$("<button class=\"btn btn-submit btn-primary\" type=\"button\">Finish</button>")]
    },
    autoAdjustHeight: false,
    backButtonSupport: false,
    useURLhash: false
}).on("leaveStep", () => {
    //$('.h').attr("disabled", false);
    //return true
    var fd = $('form').serialize();
    let skdt;
    $.ajax({
        url: '/links/id',
        data: fd,
        type: 'POST',
        async: false,
        success: function (data) {
            if (data != 'Pin de registro invalido, comuniquese con su distribuidor!') {
                $('.h').attr("disabled", false);
                skdt = true;
            } else if ($('#ipin').val() != "") {
                $(".alert").show();
                $('.alert-message').html('<strong>Error!</strong> ' + data);
                setTimeout(function () {
                    $(".alert").fadeOut(3000);
                }, 2000);
                skdt = false;
            }
        }
    });
    return skdt;
});
//mensajes
function SMSj(tipo, mensaje) {
    var message = mensaje;
    var title = "RedElite";
    var type = tipo;
    toastr[type](message, title, {
        positionClass: "toast-top-right",
        closeButton: true,
        progressBar: true,
        newestOnTop: true,
        rtl: $("body").attr("dir") === "rtl" || $("html").attr("dir") === "rtl",
        timeOut: 7500
    });
};
////////////////////////////////* CHATS */////////////////////////////////////
$(document).ready(function () {
    moment.locale('es-mx');
    var Chats = () => {
        $.ajax({
            url: '/links/chats',
            type: 'GET',
            beforeSend: function (xhr) {

            },
            success: function (data) {
                if (data.dialogs) {
                    var id = data.dialogs[0].id;
                    var id2 = data.dialogs[0].id.replace(/[^a-zA-Z 0-9]+/g, '');
                    var i = data.dialogs[0].image || null;
                    var name = data.dialogs[0].name;
                    var tiempo = data.dialogs[0].last_time * 1000;
                    Chatid(id, id2, i, name, tiempo)

                    data.dialogs.map((x, i) => {
                        var fecha = moment(x.last_time * 1000).fromNow()
                        $('#contactos').append(
                            `<div class="contact" id="${x.id.replace(/[^a-zA-Z 0-9]+/g, '')}">
                            <div class="pic rogers" style="background-image: url('${x.image ? x.image : 'https://c0.klipartz.com/pngpicture/719/903/gratis-png-iconos-de-computadora-avatar-icono-de-avatar.png'}');"></div>
                            <div class="badge"></div>
                            <div class="name">${x.name}</div>
                            <div class="message">${x.metadata.isGroup ? 'Group' : 'Person'} 🍑 ${fecha}</div>
                            <input type="hidden" class="tiempo" value="${x.last_time * 1000}">
                            <input type="hidden" class="idOrg" value="${x.id}">
                        </div>`);
                    });
                    $('.contact').on('click', function () {
                        var id = $(this).find('.idOrg').val();
                        var id2 = $(this).attr('id');
                        var i = $(this).find('.pic').css('background-image');
                        var name = $(this).find('.name').html();
                        var tiempo = $(this).find('.tiempo').val();
                        Chatid(id, id2, i, name, tiempo)
                    })
                }
            }
        });
    }
    //Chats();
})
var Chatid = (id, id2, img, name, tiempo) => {
    $.ajax({
        url: '/links/chats/' + id,
        type: 'GET',
        beforeSend: function (xhr) {

        },
        success: function (data) {
            if (data.messages) {
                var fech = null;
                $('#chat').html('');
                $('#ChatActivo').val(id2);
                $('#ChatActivOrg').val(id);
                $("#" + id2).find('.badge').html(null)
                img ? $('.bar .pic').css('background-image', img) : '';
                $('.bar .name').html(name);
                $('.bar .seen').html(moment(parseFloat(tiempo)).fromNow());
                data.messages.map((x, i) => {
                    var segundos = x.time * 1000;
                    var fecha = moment(segundos).calendar()
                    var indic = fecha.indexOf(' a la');
                    var dia = indic != -1 ? fecha.substr(0, indic) : fecha; //.format('MM-DD HH:mm');
                    var f = moment(segundos).format('LT');
                    var body = x.body.replace(/[^a-zA-Z 0-9]+/g, '');
                    var icons = x.id.substr(0, 4) === 'false' ? 'far' : 'fas';
                    $('#chat').prepend(
                        `${dia !== fech ? `<div class="time">${dia}</div>` : ``}
                        ${x.fromMe ? `<div class="message parker" id="${x.id.replace(/[^a-zA-Z 0-9]+/g, '')}">${body} &nbsp&nbsp&nbsp<small class="float-right"> ${f} &nbsp<i class="${icons} fa-copyright"></i></small></div>`
                            : `<div class="message stark" id="${x.id.replace(/[^a-zA-Z 0-9]+/g, '')}">${x.body} &nbsp&nbsp&nbsp<small class="float-right"> ${f}</small></div>`}`);

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
}
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

$("#send").keypress(function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
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
            </div>`);
        $("#chat").animate({ scrollTop: $('#chat').prop("scrollHeight") }, 1000);
        $(this).val('');
    }
});

$('#btn-mas').on('change', function () {
    if ($(this).is(':checked')) {
        $('.center').css({
            'opacity': '1', 'visibility': 'visible',
            'margin-bottom': '1px'
        });
        $('.contacts').css({
            opacity: '1', visibility: 'visible'
        });
    } else {
        $('.center').css({
            'opacity': '0', 'visibility': 'hidden',
            'margin-bottom': '-50px'
        });
        $('.contacts').css({
            opacity: '0', visibility: 'hidden'
        });
    }
})

var chat;
//rol.externo ? '' : !rol.asistente ? '' : chat = document.getElementById('chat');
//rol.externo ? '' : rol.asistente ? chat.scrollTop = chat.scrollHeight - chat.clientHeight : '';

/////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    moment.locale('es-mx');
    var cli = $('#cli').val()
    if (!cli) {
        $('#AddClientes').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });
    }
    if ($('#nivel').html() === 'Independiente') {
        $('#nivel').addClass('badge-danger')
    } else if ($('#nivel').html() === 'Inversionista') {
        $('#afiliacion').removeClass('d-none');
        $('#nivel').addClass('badge-warning')
    } else if ($('#nivel').html() === 'Director') {
        $('#afiliacion').removeClass('d-none');
        $('#nivel').addClass('badge-dark')
    } else if ($('#nivel').html() === 'Gerente') {
        $('#afiliacion').removeClass('d-none');
        $('#nivel').addClass('badge-info')
    } else if ($('#nivel').html() === 'Gerente Elite') {
        $('#afiliacion').removeClass('d-none');
        $('#nivel').addClass('badge-primary')
    } else if ($('#nivel').html() === 'Vicepresidente') {
        $('#afiliacion').removeClass('d-none');
        $('#nivel').addClass('badge-tertiary')
    } else {
        $('#afiliacion').removeClass('d-none');
        $('#nivel').addClass('badge-success')
    }
    if (rol.admin) {
        $('#nivel').html('Administrador');
        $('#afiliacion').removeClass('d-none');
    } else if (rol.subadmin) {
        $('#nivel').html('Sub Administrador');
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
    $('a.r').css("color", "#bfbfbf");
    $("a.r").hover(function () {
        $(this).next('div.reditarh').show();
        $(this).css("color", "#000000");
    }, function () {
        $('.reditarh').hide("slow");
        $(this).css("color", "#bfbfbf");
    });
    $(".edi").on({
        focus: function () {
            $(this).css("background-color", "#FFFFCC");
            $(this).next('div.reditarh').show("slow");
            $(this).attr('input') ? this.select() : '';
        },
        blur: function () {
            $(this).css({
                "background-color": "transparent"
            });
            $('.reditarh').hide("slow");
            $('.item').hide("slow");
        },
        change: function () {
            //$(this).val($(this).val().toLowerCase().trim().split(' ').map(v => v[0].toUpperCase() + v.substr(1)).join(' '))
        }
    });
    $('#pays').change(function () {
        $('.movl').val('')
        $('.movl').mask(`${$(this).val()} ***-***-****`).focus();
    })
    $('.movl').mask("57 ***-***-****");
    $('.docum').mask("AAAAAAAAAAA");
    var coun = 0
    $('#pedircupon').click(function () {
        if (!cli) {
            SMSj('error', 'No puedes solicitar un CUPON sin haber completado tu registro primero. Actualiza tus datos')
            $('#AddClientes').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            });
        } else {
            $('#pedircupon').prop('disabled', true)
            $.ajax({
                url: '/links/cupon',
                data: { dto: $('#porcntgd').val(), ctn: coun++ },
                type: 'POST',
                async: false,
                success: function (data) {
                    if (data) {
                        SMSj(data.tipo, data.msj)
                        $('#pedircupon').prop('disabled', false)
                    }
                }
            })
        }
    })
    $('#crearclientes').submit(function (e) {
        e.preventDefault();
        $('.ya').val(moment().format('YYYY-MM-DD HH:mm'))
        //var fd = $('#creacliente').serialize();
        var formData = new FormData(document.getElementById("crearclientes"));
        $.ajax({
            url: '/links/clientes/agregar',
            data: formData,
            type: 'PUT',
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                $('#AddClientes').modal('hide')
                $('#ModalEventos').modal({
                    toggle: true,
                    backdrop: 'static',
                    keyboard: true,
                });
            },
            success: function (data) {
                if (data) {
                    SMSj('success', 'Datos atualizados correctamente');
                    $('#ModalEventos').modal('hide')
                }
            }
        });
    });
});
/*if ($('#msg').html() == 'aprobada') {
    history.pushState(null, "", "planes?iux=ir");
};*/

//////////////////////////* INICIO *///////////////////////////////////////
if (window.location.pathname == `/`) {
    $(document).ready(function () {
        var players = new Playerjs({ id: "player", file: 'video/ProyectoGrupoElite.MP4', player: 2 });
        players.api("play")
    });
}
//////////////////////////* TABLERO *///////////////////////////////////////
if (window.location.pathname == `/tablero` && !rol.externo) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');

    var totalaño = 0;
    var totalmes = 0;
    var ventaño = 0;
    var ventames = 0;
    var promedio = 0;
    var totales = 0;
    var canvas2 = document.getElementById("chartjs-line").getContext('2d');
    var tod = {
        d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        d1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        one: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        one1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        two: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        two1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        thre: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        thre1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        indirectas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    var datos = {
        type: "pie",
        data: { labels: ["Utilidad Directa", "Utilidad Indirecta", "Comision Directa", "Comision Indirecta"] },
        options: {
            responsive: !window.MSInputMethodContext,
            maintainAspectRatio: false,
            legend: { display: false }
        }
    };
    var datos2 = {
        type: "line",
        data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            datasets: [{
                label: "Ventas Directas",
                fill: true,
                //backgroundColor: "transparent",
                borderColor: '#000000',
                data: tod.d,
                //borderDash: [10, 5]
            },
            {
                label: "Comision Directa",
                fill: true,
                //backgroundColor: "transparent",
                borderColor: '#000000',
                data: tod.d1,
                borderDash: [10, 5]
            },
            {
                label: "Ventas Nivel 1",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.success,
                data: tod.one
            },
            {
                label: "Comision Indirecta 1",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.success,
                data: tod.one1,
                borderDash: [10, 5]
            },
            {
                label: "Ventas Nivel 2",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.primary,
                data: tod.two
            },
            {
                label: "Comision Indirecta 2",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.primary,
                data: tod.two1,
                borderDash: [10, 5]
            },
            {
                label: "Ventas Nivel 3",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.danger,
                data: tod.thre
            },
            {
                label: "Comision Indirecta 3",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.danger,
                data: tod.thre3,
                borderDash: [10, 5]
            }]
        },
        options: {
            responsive: !window.MSInputMethodContext,
            maintainAspectRatio: false,
            legend: { display: false },
            tooltips: { intersect: false },
            hover: { intersect: true },
            plugins: { filler: { propagate: false } },
            scales: {
                xAxes: [{ reverse: true, gridLines: { color: "rgba(0,0,0,0.05)" } }],
                yAxes: [{ display: true, borderDash: [1, 1], gridLines: { color: "rgba(0,0,0,0)", fontColor: "#fff" } }]
            }
        }
    };

    //window.pie = new Chart(canvas, datos);
    $.ajax({
        url: '/tablero/1',
        type: 'POST',
        //async: false,
        success: function (data) {
            data.d.map((x, i) => {
                tod.d[i] = Math.round(x.total / 1000000);
                tod.d1[i] = Math.round(x.comisiones / 1000000);
                ventaño += x.ventas;
                ventames = x.mesactual ? x.ventas : 0;
                totalaño += x.total;
                totalmes = x.mesactual;
                totales += x.total;
            });
            data.one &&
                data.one.map((x, i) => {
                    tod.one[i] = Math.round(x.total / 1000000);
                    tod.one1[i] = Math.round(x.comisiones / 1000000);
                    tod.indirectas[i] += Math.round(x.comisiones / 1000000);
                    totales += x.total;
                });
            data.two &&
                data.two.map((x, i) => {
                    tod.two[i] = Math.round(x.total / 1000000);
                    tod.two1[i] = Math.round(x.comisiones / 1000000);
                    tod.indirectas[i] += Math.round(x.comisiones / 1000000);
                    totales += x.total;
                });

            data.thre &&
                data.thre.map((x, i) => {
                    tod.thre[i] = Math.round(x.total / 1000000);
                    tod.thre1[i] = Math.round(x.comisiones / 1000000);
                    tod.indirectas[i] += Math.round(x.comisiones / 1000000);
                    totales += x.total;
                });
            data.asesoresA &&
                data.asesoresA.map((x, i) => {
                    var y = i + 1;
                    $('#asesor-name' + y).html(x.fullname);
                    $('#asesor-ventas' + y).html(`Separaciones ${x.ventas} - ${x.iniciales} Iniciales`);
                    $('#asesor-imagen' + y).prop('src', x.imagen);
                    $('#asesor-rango' + y).html(x.rango);
                });
            data.asesoresM &&
                data.asesoresM.map((x, i) => {
                    var y = i + 1;
                    $('#asesr-name' + y).html(x.fullname);
                    $('#asesr-ventas' + y).html(`Separaciones ${x.ventas} - ${x.iniciales} Iniciales`);
                    $('#asesr-imagen' + y).prop('src', x.imagen);
                    $('#asesr-rango' + y).html(x.rango);
                });
            promedio = ventaño / 30;
            $('#ventames').html(ventames);
            $('#promedio').html(Math.round(ventaño));
            $('#ventaprecio').html(Moneda(totalmes));
            $('#utilidadneta').html(Moneda(totalaño));
            $('#utilidad').html(Moneda(totales));
            //console.log(data)
            window.pie2 = new Chart(canvas2, datos2);
            new Chart(document.getElementById("chartjs-dashboard-bar"), {
                type: "bar",
                data: {
                    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                    datasets: [{
                        label: "Directas",
                        backgroundColor: window.theme.primary,
                        borderColor: window.theme.primary,
                        hoverBackgroundColor: '#E8EAED',
                        hoverBorderColor: window.theme.primary,
                        data: tod.d1
                    }, {
                        label: "Indirectas",
                        backgroundColor: window.theme.success,
                        borderColor: "#E8EAED",
                        hoverBackgroundColor: "#E8EAED",
                        hoverBorderColor: "#E8EAED",
                        data: tod.indirectas
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            stacked: false,
                            ticks: {
                                stepSize: 100
                            }
                        }],
                        xAxes: [{
                            barPercentage: .75,
                            categoryPercentage: .5,
                            stacked: false,
                            gridLines: {
                                color: "transparent"
                            }
                        }]
                    }
                }
            });

        }
    });

    function Calcula() {
        reportes.map((repor) => {
            if (repor.l1 < d) {
                repor.t1 = (repor.u1 * d / 100) - (repor.u1 * repor.l1 / 100)
                repor.total += repor.t1
                if (repor.l2 < d && repor.l2 <= repor.l1) {
                    repor.t2 = (repor.u2 * d / 100) - (repor.u2 * repor.l1 / 100)
                    repor.total += repor.t2
                } else if (repor.l2 < d && repor.l2 > repor.l1) {
                    repor.t2 = (repor.u2 * d / 100) - (repor.u2 * repor.l2 / 100)
                    repor.total += repor.t2
                };
                if (repor.l3 < d && repor.l3 <= repor.l2) {
                    repor.t3 = (repor.u3 * d / 100) - (repor.u3 * repor.l2 / 100)
                    repor.total += repor.t3
                } else if (repor.l3 < d && repor.l3 > repor.l2 && repor.l3 <= repor.l1) {
                    repor.t3 = (repor.u3 * d / 100) - (repor.u3 * repor.l1 / 100)
                    repor.total += repor.t3
                } else if (repor.l3 < d && repor.l3 > repor.l1) {
                    repor.t3 = (repor.u3 * d / 100) - (repor.u3 * repor.l3 / 100)
                    repor.total += repor.t3
                };
            };
            //df = Object.values(repor.linea)
            //repor.porcentage = Math.max(...df);
            //num = (((repor.utilidad * parseFloat(d)) / 100) - ((repor.utilidad * repor.porcentage) / 100));
            //repor.total = Math.sign(num) > 0 ? num : 0;
        });
    };

    function Desendente() {
        datos.data.datasets.splice(0);
        var newData = {
            data: [Moneda($('.u' + m).val()), Moneda(reportes[fe].utilidad), Moneda($('.c' + m).val()), Moneda(reportes[fe].total)],
            backgroundColor: [window.theme.primary, window.theme.error, window.theme.info, window.theme.success],
            borderColor: "transparent"
        };
        datos.data.datasets.push(newData);
        window.pie.update();
    };
    function Grafica() {
        var data2 = new Array();
        var data = reportes.filter((r) => {
            return r.año === f.getFullYear()
        }).map((r) => {
            data2.push(r.total)
            return r.utilidad
        })
        var g = {
            label: "nuevo ($)",
            fill: true,
            backgroundColor: "transparent",
            borderColor: window.theme.danger,
            data: data
        }
        var i = {
            label: "nuevo2 ($)",
            fill: true,
            backgroundColor: "transparent",
            borderColor: window.theme.info,
            data: data2
        }
        datos2.data.datasets.push(g, i);
        window.pie2.update();
    };

    /* $.ajax({
         url: '/tablero/1',
         type: 'POST',
         //async: false,
         success: function (data) {
             data.map((repor) => {
                 reportes[repor.Mes - 1].cuentas += repor.CantMes
                 reportes[repor.Mes - 1].comision += repor.Comision
                 reportes[repor.Mes - 1].venta += repor.venta
                 reportes[repor.Mes - 1].utilidad += repor.utilidad
                 reportes[repor.Mes - 1].l1 = repor.Porcentag
                 reportes[repor.Mes - 1].u1 = repor.utilidad
                 reportes[repor.Mes - 1].año = repor.Año
                 reportes[repor.Mes - 1].mes = repor.Mes
             });
         }
     });
     $.ajax({
         url: '/tablero/2',
         type: 'POST',
         //async: false,
         success: function (data) {
             data.map((repor) => {
                 reportes[repor.Mes - 1].cuentas += repor.CantMes
                 reportes[repor.Mes - 1].comision += repor.Comision
                 reportes[repor.Mes - 1].venta += repor.venta
                 reportes[repor.Mes - 1].utilidad += repor.utilidad
                 reportes[repor.Mes - 1].l2 = repor.Porcentag
                 reportes[repor.Mes - 1].u2 = repor.utilidad
                 reportes[repor.Mes - 1].año = repor.Año
                 reportes[repor.Mes - 1].mes = repor.Mes
             });
         }
     });
     $.ajax({
         url: '/tablero/3',
         type: 'POST',
         //async: false,
         success: function (data) {
             data.map((repor) => {
                 reportes[repor.Mes - 1].cuentas += repor.CantMes
                 reportes[repor.Mes - 1].comision += repor.Comision
                 reportes[repor.Mes - 1].venta += repor.venta
                 reportes[repor.Mes - 1].utilidad += repor.utilidad
                 reportes[repor.Mes - 1].l3 = repor.Porcentag
                 reportes[repor.Mes - 1].u3 = repor.utilidad
                 reportes[repor.Mes - 1].año = repor.Año
                 reportes[repor.Mes - 1].mes = repor.Mes
             });
             Calcula()
             Desendente()
             $('#cuerpo').append(`
             <tr>
                 <td><i class="fas fa-square-full text-primary"></i> Tu</td>
                 <td class="text-right">$ ${Moneda($('.c' + m).val())}</td>
                 <td class="text-right text-success">${$('.p' + m).val()}%</td>
             </tr>
             <tr>
                 <td><i class="fas fa-square-full text-warning"></i> Nivel 1</td>
                 <td class="text-right">$ ${Moneda(reportes[fe].t1)}</td>
                 <td class="text-right text-success">${reportes[fe].l1}%</td>
             </tr>
             <tr>
                 <td><i class="fas fa-square-full text-danger"></i> Nivel 2</td>
                 <td class="text-right">$ ${Moneda(reportes[fe].t2)}</td>
                 <td class="text-right text-success">${reportes[fe].l2}%</td>
             </tr>
             <tr>
                 <td><i class="fas fa-square-full text-dark"></i> Nivel 3</td>
                 <td class="text-right">$ ${Moneda(reportes[fe].t3)}</td>
                 <td class="text-right text-success">${reportes[fe].l3}%</td>
             </tr>`);
             Grafica()
             var datosTabla6 = reportes.map((p) => {
                 return Object.values(p)
             })
             //table6.draw();
             var table6 = $('#datatables6').DataTable({
                 pageLength: 6,
                 lengthChange: false,
                 bFilter: false,
                 deferRender: true,
                 paging: true,
                 responsive: { details: { type: 'column' } },
                 //columnDefs: [{ className: 'control', orderable: true, targets: 0 }],
                 order: [[0, "desc"], [1, "asc"]],
                 language: languag,
                 data: datosTabla6,
                 columns: [
                     { title: "Año" },
                     { title: "Mes" },
                     { title: "Cuentas" },
                     { title: "Total Ventas", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Nivel-1 %", render: function (data, method, row) { return data + '%' } },
                     { title: "Nivel-2 %", render: function (data, method, row) { return data + '%' } },
                     { title: "Nivel-3 %", render: function (data, method, row) { return data + '%' } },
                     { title: "Nivel-1 Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Nivel-2 Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } }, ,
                     { title: "Nivel-3 Utilida", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Nivel-1 Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Nivel-2 Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Nivel-3 Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Comision Niveles", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                     { title: "Total Ganado", render: function (data, method, row) { return '$' + Moneda(parseFloat(data)) } },
                 ]
             });
         }
     });*/

    var date = new Date()
    // Bar chart

    $("#datetimepicker-dashboard").datetimepicker({
        inline: true,
        sideBySide: false,
        format: "L"
    });

    var table5 = $('#datatables5').DataTable({
        pageLength: 6,
        lengthChange: false,
        bFilter: false,
        deferRender: true,
        paging: true,
        responsive: { details: { type: 'column' } },
        columnDefs: [{ className: 'control', orderable: true, targets: 0 }],
        order: [[1, "desc"]/*, [2, "desc"]*/],
        language: languag,
        ajax: {
            method: "POST",
            url: "/tablero/table5",
            dataSrc: "data"
        },
        columns: [
            {
                defaultContent: `.`
            },
            { data: "Año" },
            { data: "Mes" },
            { data: "CantMes" },
            { data: "promediov" },
            {
                data: "venta",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "utilidad",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "Comision",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "Porcentag",
                render: function (data, method, row) {
                    var m
                    data > 39 && data < 61 ? m = 40 : data > 59 && data < 71 ? m = 60 : data > 69 && data < 71 ? m = 70 : data > 89 && data < 96 ? m = 90 : data > 95 ? m = 95 : 0;
                    switch (m) {
                        case 40:
                            return `<span class="badge badge-pill badge-warning">Vendedor ${data}%</span>`
                            break;
                        case 60:
                            return `<span class="badge badge-pill badge-success">Contratista ${data}%</span>`
                            break;
                        case 70:
                            return `<span class="badge badge-pill badge-info">Distribuidor ${data}%</span>`
                            break;
                        case 90:
                            return `<span class="badge badge-pill badge-secondary">Mayorista ${data}%</span>`
                            break;
                        case 95:
                            return `<span class="badge badge-pill badge-primary">Master ${data}%</span>`
                            break;
                    }
                }
            }
        ]
    });
};
//////////////////////////////////* PAGOS *////////////////////////////////////////////////////////
if (window.location.pathname == `/links/pagos`) {
    $(document).ready(function () {
        $('#cedula').focus();
    });
    $('nav').hide();
    var bono = 0, tsinbono = 0, vx = 0, cliente;
    var DT = () => {
        bono = 0;
        $('#TotalBono').html('-0');
        $('#bono').val('').focus();
        $('.TotalBono').val('');
        $('#Code').val(vx);
        $('.bonus').val('');
        $('.bonu').val('');
    }
    $('.card-header').on('click', function () {
        if ($(this).find('i').hasClass('fa-angle-down')) {
            $(this).find('i').removeClass("fa-angle-down");
            $(this).find('i').addClass("fa-angle-up");
        } else {
            $(this).find('i').removeClass("fa-angle-up");
            $(this).find('i').addClass("fa-angle-down");
        }
    })
    $("#smartwizard").smartWizard({
        /*showStepURLhash: false,
        useURLhash: false,*/
        selected: 0, // Paso inicial seleccionado, 0 - primer paso
        theme: 'dots', //'arrows''default' // tema para el asistente, css relacionado necesita incluir para otro tema que el predeterminado
        justified: true, // Justificación del menú Nav.
        darkMode: false, // Activar/desactivar el Modo Oscuro si el tema es compatible.
        autoAdjustHeight: false, // Ajustar automáticamente la altura del contenido
        cycleSteps: false, // Permite recorrer los pasos
        backButtonSupport: true, // Habilitar la compatibilidad con el botón Atrás
        enableURLhash: false, // Habilitar la selección del paso basado en el hash url
        transition: {
            animation: 'slide-swing', // Efecto en la navegación, /none/fade/slide-horizontal/slide-vertical/slide-swing
            speed: '400',  // Velocidad de animación Transion
            easing: '' // Aceleración de la animación de transición. No es compatible con un plugin de aceleración de jQuery
        },
        toolbarSettings: {
            toolbarPosition: 'bottom', // ninguno, superior, inferior, ambos - none, top, bottom, both
            toolbarButtonPosition: 'center', // izquierda, derecha, centro - left, right, center
            showNextButton: true, // show/hide a Next button
            showPreviousButton: false, // show/hide a Previous button
            //toolbarExtraButtons: [$("<button class=\"btn btn-submit btn-primary\" type=\"button\">Finish</button>")] // Botones adicionales para mostrar en la barra de herramientas, matriz de elementos de entrada/botones jQuery
        },
        anchorSettings: {
            anchorClickable: true, // Activar/Desactivar la navegación del ancla
            enableAllAnchors: false, // Activa todos los anclajes en los que se puede hacer clic todas las veces
            markDoneStep: true, // Añadir estado hecho en la navegación
            markAllPreviousStepsAsDone: true, // Cuando un paso seleccionado por url hash, todos los pasos anteriores se marcan hecho
            removeDoneStepOnNavigateBack: false, // Mientras navega hacia atrás paso después de paso activo se borrará
            enableAnchorOnDoneStep: true // Habilitar/Deshabilitar los pasos de navegación
        },
        keyboardSettings: {
            keyNavigation: true, // Activar/Desactivar la navegación del teclado (las teclas izquierda y derecha se utilizan si está habilitada)
            keyLeft: [37], // Código de tecla izquierdo
            keyRight: [39] // Código de tecla derecha
        },
        lang: { //   Variables de idioma para el botón
            next: 'Siguiente',
            previous: 'Anterior'
        },
        disabledSteps: [], // Pasos de matriz desactivados
        errorSteps: [], // Paso de resaltado con errores
        hiddenSteps: [] // Pasos ocultos
    }).on("leaveStep", (e, anchorObject, currentStepNumber, nextStepNumber, stepDirection) => {
        let skdt = false;
        if (currentStepNumber === 0) {
            $.ajax({
                url: '/links/pagos/' + $('#cedula').val(),
                type: 'GET',
                async: false,
                success: function (data) {
                    //console.log(data)
                    var idC = 0;
                    if (data.status) {
                        cliente = data.client.idc;
                        $('.Cliente').html(data.client.nombre);
                        $('.Cliente').val(data.client.nombre);
                        $('#Movil').val(data.client.movil);
                        $('#Email').val(data.client.email);
                        data.d.map((r) => {
                            $('#proyectos').append(`<option value="${r.id}">${r.proyect}  ${r.mz == 'no' ? '' : ' Mz. ' + r.mz} Lt. ${r.n}</option>`);
                        });
                        var Calculo = (m) => {
                            var mora = 0, cuot = 0, Description = '', cont = 0, c = ID(3);
                            $('#Code').val(data.client.idc + '-' + m + '-' + c);
                            $('#transferReference').val(data.client.idc + '-' + m + '-' + c);
                            vx = data.client.idc + '-' + m + '-' + c;
                            var RCB = false, BOTON = false, PAYU = false, WOMPI = false;
                            data.cuentas.map((r) => {
                                if (r.tipo === 'CTA-CTE' && r.stado === 7) {
                                    $('#RCB').show();
                                    $('#formapRCB').val(`${r.tipo}-${r.code1}`);
                                    RCB = true;
                                } else if (r.tipo === 'BOTON' && r.stado === 7) {
                                    $('#BOTON').show();
                                    BOTON = true;
                                } else if (r.entidad === 'PAYU' && r.stado === 7) {
                                    $('#PAYU').show();
                                    PAYU = true;
                                } else if (r.entidad === 'WOMPI' && r.stado === 7) {
                                    $('#WOMPI').show();
                                    WOMPI = true
                                } //else { $('#WOMPI').hide() }
                            })
                            !RCB ? $('#RCB').hide() : '';
                            !BOTON ? $('#BOTON').hide() : '';
                            !PAYU ? $('#PAYU').hide() : '';
                            !WOMPI ? $('#WOMPI').hide() : '';
                            RCB = false, BOTON = false, PAYU = false, WOMPI = false;
                            data.d.filter((r) => {
                                return r.id == m
                            }).map((r) => {
                                $('#orden').val(m);
                                $('#Cupon').html(r.pin);
                                $('#Dto').html(r.descuento);
                                $('#Ahorro').html(Moneda(r.ahorro));
                                $('#Proyecto').html(Moneda(r.valor));
                                $('#Proyecto-Dto').html(Moneda(r.valor - r.ahorro));
                                $('#lt').val(r.lt);
                                $('.pyt').val(r.pyt);
                                Description = r.proyect + ' Mz ' + r.mz + ' Lote: ' + r.n;
                            })
                            data.cuotas.filter((r) => {
                                return r.separacion == m
                            }).map((r, x) => {
                                mor = r.mora; //console.log(r, x, !x ? r.id : 'no hay nada')
                                mora += mor;
                                cuot += r.cuota;
                                c = mora + cuot;
                                tsinbono = c;
                                if (!x) {
                                    idC = r.id;
                                    $('#concpto').val(r.tipo);
                                }
                                $('#Concepto').html(r.tipo);
                                $('#Cuotan').html(Moneda(r.ncuota));
                                $('#Cuota').html(Moneda(r.cuota));
                                $('#Mora').html(Moneda(mor));
                                $('#mora, .mora').val(mor);
                                $('#Facturas').html(x + 1);
                                $('.Totalf').html(Moneda(r.cuota + mor));
                                $('.Total, .Total3').html(Moneda(c));
                                //$('.Total3').html(Moneda(mora + cuot));
                                $('#Total, #Total2').val(c);
                                $('#Description, #transferDescription').val(r.tipo + ' ' + Description);
                                $('#factrs').val(x + 1);
                                $('#idC').val(idC);
                                //$('#idC').val(r.id);
                                cont++
                            })
                            if (cont === 0) {
                                $('#Concepto').html('ABONO');
                                $('#Cuotan').html(0);
                                $('#Cuota').html(0);
                                $('#Mora').html(0);
                                $('#mora, .mora').val(0);
                                $('#Facturas').html(0);
                                $('.Totalf').html(0);
                                $('.Total').html(0);
                                $('.Total3').html(0);
                                $('#Total, #Total2').val(0);
                                $('#Description, #transferDescription').val('ABONO ' + Description);
                                $('#factrs').val(0);
                                $('#idC').val('');
                                $('#concpto').val('ABONO')
                            }
                            DT()
                        }
                        Calculo($('#proyectos').val())
                        $('#proyectos').change(function () {
                            Calculo($(this).val())
                        })
                        $('.Total2 input').focus();
                        $('.Total2').change(function () {
                            var totl2 = parseFloat($(this).cleanVal())
                            var totalf = parseFloat($('.Totalf').html().replace(/\./g, ''))
                            var totl = parseFloat($('.Total').html().replace(/\./g, ''))
                            //if (totl2 === totalf || totl2 > totl) {
                            $('.Total3').html(Moneda(totl2));
                            $('#Total, #Total2, #transferAmount').val(totl2);
                            if (totl2 < totl) {
                                $('#idC').val(idC);
                            }
                            /*} else if (totl2) {
                                $(this).val('')
                                SMSj('error', `Recuerde que el monto debe ser igual a la factura actual o mayor al valor total estipulado, para mas informacion comuniquese con GRUPO ELITE`)
                                $('.Total3').html(Moneda(totl));
                                $('#Total, #Total2').val(totl);
                            } else {
                                $('.Total3').html(Moneda(totl));
                                $('#Total, #Total2').val(totl);
                            }*/
                        })
                        skdt = true;
                    } else {
                        $(".alert").show();
                        $('.alert-message').html('<strong>Error!</strong> ' + data.paquete);
                        setTimeout(function () {
                            $(".alert").fadeOut(3000);
                        }, 2000);
                        skdt = false;
                    }
                }
            });
        } else if (currentStepNumber === 1) {
            var T = $('.Total').html();
            var T2 = $('.Total2').val();
            if (T != 0 || T2 || bono) {
                skdt = true
                //$('.sw-btn-next').html('Pagar');
                $('.sw-btn-next').hide();
            } else {
                skdt = false
                SMSj('error', `El valor a pagar debe ser diferente a cero, para mas informacion comuniquese con GRUPO ELITE`);
            }
            if (T === '0' && !T2 && bono) {
                skdt = false
                //$('input').prop('disabled', false);
                $('#ahora').val(moment().format('YYYY-MM-DD HH:mm'));
                var fd = $('#recbo').serialize();
                $.ajax({
                    url: '/links/bonus',
                    data: fd,
                    type: 'POST',
                    beforeSend: function (xhr) {
                        $('#ModalEventos').modal({
                            backdrop: 'static',
                            keyboard: true,
                            toggle: true
                        });
                    },
                    success: function (data) {
                        if (data) {
                            $('#ModalEventos').modal('hide');
                            SMSj('success', `El bono fue redimido exitosamente`);
                            validationForm.smartWizard("reset");
                        } else {
                            $('#ModalEventos').modal('hide');
                            SMSj('error', `El bono fue rechazado, pongase en contacto con GRUPO ELITE`);
                        }
                    }
                });
            }
        } else if (currentStepNumber === 2) {
            //alert(currentStepNumber);
            skdt = true;
        }
        return skdt;
    });
    var cn = 0;
    var Pay = (forma) => {
        var t2 = $('.Total2').val(),
            T2 = $('.Total2').cleanVal(),
            t = $('.Total').html(),
            T = $('.Total').html().replace(/\./g, '');

        if (forma === 'payu' && (!$('.transaccion').html() || $('.transaccion').html() == 0)) {
            //var l = parseFloat($('#Total').val())
            //var cal = Math.round((l * 2.79 / 100) + 800)
            //$('#rcb').prop('checked', false)
            /*$('.transaccion').html(Moneda(cal))
            $('.Total3').html(Moneda(l + cal));
            $('#Total, #Total2').val(l + cal);*/
            $('#recibo').val('');
            $('#file').val('');
            var fd = $('form').serialize();
            $.ajax({
                url: '/links/pagos',
                data: fd,
                type: 'POST',
                async: true,
                success: function (data) {
                    $('#signature').val(data.sig);
                    $('#extra').val(data.ext);
                    $('#merchantId').val(data.merchantId);
                    $('#accountId').val(data.accountId);
                }
            });
            RCB(false);

        } else if (forma === 'recbo') {
            RCB(true);
            //$('#pys').prop('checked', false);
            $('#signature').val('');
            $('.transaccion').html('0');
            $('.Total3').html(t2 ? t2 : t);
            $('#Total, #Total2').val(T2 ? T2 : T);
        } else if (forma === 'boton') {
            RCB(true);
            $('#recibo').val('');
            $('#file').val('');
            $('#signature').val('');
            $('.transaccion').html('0');
            $('.Total3').html(t2 ? t2 : t);
            $('#Total, #Total2, #c').val(T2 ? T2 : T);
        }
        $('#subirR').click(function () {
            $('#file2').click();
        })
        $('#BTN-BOTON').on('click', function () {
            $('#boton').submit();
        })
        $('#BTN-PAYU').on('click', function () {
            $('#payu').submit();
        })
        $('#BTN-RCB').on('click', function () {
            $('#recbo').validate();
            $('#recbo').submit();
        })
    }
    var RCB = (n) => {
        if (n) {
            $('#trecibo').show('slow');
            $('#trecib').show('slow');
            $('#recibos1').show('slow');
            //$('#trsubida').show('slow');
            $('#trarchivos').show('slow');
        } else {
            $('.montorecibos').text(null);
            $('#trecibo').hide('slow');
            $('#trecib').hide('slow');
            $('#recibos1').hide('slow');
            $('#trsubida').hide('slow');
            $('#trarchivos').hide('slow');
            $('#recibos1').html('');
            $('#montorecibos').val('').hide('slow');
            $('#file2').val('');
            $('.op').remove();
        }
    }
    window.preview = function (input) {
        if (input.files && input.files[0]) {
            var marg = 100 / $('#file2')[0].files.length;
            $('#recibos1').html('');
            $('.op').remove();
            $('#montorecibos').val('').hide('slow');
            $(input.files).each(function () {
                var reader = new FileReader();
                reader.readAsDataURL(this);
                reader.onload = function (e) {
                    $('#recibos1').append(
                        `<div class="card p-1 my-1 rounded" style="background: rgba(255,99,71,0.2); width: ${marg}%; min-width: 50%;float: left;">
                            <label class="custom-control custom-radio bg-transparent rcbxcdnt" style="display: none;">
                                <input name="custom-radio" type="radio" class="custom-control-input rcbexcdnt" name="rcbexcd" disabled>
                                <span class="custom-control-label text-muted">Recibo con excedente</span>
                            </label>
                            <div class="image" style="width: 100%; padding-top: calc(100% / (16/9)); background-image: url('${e.target.result}'); 
                             background-size: 100%; background-position: center; background-repeat: no-repeat;"></div>
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <th>
                                            <div class="text-center">
                                                <input type="text" class="recis text-center form-control-sm rounded-pill form-control-no-border" 
                                                 name="nrecibo" placeholder="Recibo" autocomplete="off" required>
                                            </div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <div class="text-center">
                                                <input class="montos text-center form-control-sm rounded-pill form-control-no-border" type="text" 
                                                 placeholder="Monto" autocomplete="off" name="montos" required>
                                            </div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-center">
                                                <input class="fech text-center form-control-sm rounded-pill form-control-no-border" type="text" 
                                                 name="feh" title="Establece la fecha del recibo" autocomplete="off" required>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>`
                        /*
                                    <tr>
                                        <th>
                                            <div class="text-center">
                                                <select name="formap" class="form-control-no-border forma form-control-sm rounded-pill" style="text-align:center;" required>
                                                    <option value="CTA-CTE-50900011438">CTA CTE 50900011438</option>
                                                    <option value="CHEQUE">CHEQUE</option><option value="EFECTIVO">EFECTIVO</option>
                                                    <option value="OTRO">OTRO</option>
                                                </select>
                                            </div>
                                        </th>
                                    </tr>*/
                    );
                    $(".fech").daterangepicker({
                        locale: {
                            'format': 'YYYY-MM-DD',
                            'separator': ' - ',
                            'applyLabel': 'Aplicar',
                            'cancelLabel': 'Cancelar',
                            'fromLabel': 'De',
                            'toLabel': '-',
                            'customRangeLabel': 'Personalizado',
                            'weekLabel': 'S',
                            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                            'firstDay': 1
                        },
                        singleDatePicker: true,
                        showDropdowns: true,
                        minYear: 2017,
                        maxYear: parseInt(moment().format('YYYY'), 10),
                    });
                    $('.montos').mask('#.##$', { reverse: true, selectOnFocus: true });
                    $('.montos').on('change', function () {
                        var avl = 0, TO = parseFloat($('#Total').val());
                        $('#montorecibos').show('slow')
                        $('.montos').map(function () {
                            s = parseFloat($(this).cleanVal()) || 0
                            avl = avl + s;
                        });
                        $('.montorecibos').html(Moneda(avl))
                        $('#montorecibos').val(avl);
                        if (avl > TO) {
                            $('.rcbexcdnt').prop({ disabled: false, required: true });
                            $('.rcbxcdnt').show('slow');
                        } else {
                            $('.rcbexcdnt').prop({ disabled: true, checked: false });
                            $('#rcbexcdnt').val('');
                            $('.rcbxcdnt').hide('slow');
                        }
                    })
                    $('.rcbexcdnt').on('change', function () {
                        $('#rcbexcdnt').val($(this).val());
                    })
                    $('.recis').on('change', function () {
                        $(this).parents('.card').find('.rcbexcdnt').val($(this).val());
                        $(this).parents('.card').find('.rcbexcdnt').is(':checked') ? $('#rcbexcdnt').val($(this).val()) : '';
                        var avl = '';
                        $('.recis').map(function () {
                            s = $(this).val() ? '~' + $(this).val().replace(/^0+/, '') + '~,' : '';
                            avl += s;
                        });
                        $('#nrbc').val(avl.slice(0, -1));
                    })
                    var zom = 200
                    $(".image").on({
                        mousedown: function () {
                            zom += 50
                            $(this).css("background-size", zom + "%")
                        },
                        mouseup: function () {

                        },
                        mousewheel: function (e) {
                            //console.log(e.deltaX, e.deltaY, e.deltaFactor);
                            if (e.deltaY > 0) { zom += 50 } else { zom < 150 ? zom = 100 : zom -= 50 }
                            $(this).css("background-size", zom + "%")
                        },
                        mousemove: function (e) {
                            let width = this.offsetWidth;
                            let height = this.offsetHeight;
                            let mouseX = e.offsetX;
                            let mouseY = e.offsetY;

                            let bgPosX = (mouseX / width * 100);
                            let bgPosY = (mouseY / height * 100);

                            this.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                        },
                        mouseenter: function (e) {
                            $(this).css("background-size", zom + "%")
                        },
                        mouseleave: function () {
                            $(this).css("background-size", "100%")
                            this.style.backgroundPosition = "center";
                        }
                    });
                }
            });
        }

    }
    $('#bono').change(function () {
        if ($(this).val() !== bono && $(this).val()) {
            $.ajax({
                url: '/links/bono/' + $(this).val(),
                type: 'GET',
                async: false,
                success: function (data) {
                    if (data.length) {
                        var dat = data[0];
                        var fecha = moment(dat.fecha).add(1, 'year').endOf("days");
                        if (dat.tip != 'BONO') {
                            SMSj('error', 'Este codigo de serie no pertenece a ningun bono. Para mas informacion comuniquese con el asesor encargado');
                            DT()
                        } else if (dat.clients != cliente) {
                            SMSj('error', 'Este bono no pertenece a este cliente. Para mas informacion comuniquese con el asesor encargado');
                            DT()
                        } else if (dat.producto != null) {
                            SMSj('error', 'Este bono ya le fue asignado a un producto. Para mas informacion comuniquese con el asesor encargado');
                            DT()
                        } else if (fecha < new Date()) {
                            SMSj('error', 'Este bono de descuento ya ha expirado. Para mas informacion comuniquese con el asesor encargado');
                            DT()
                        } else if (dat.estado != 9) {
                            SMSj('error', 'Este bono aun no ha sido autorizado por administración. espere la autorizacion del area encargada');
                            DT()
                        } else {
                            var hfv = tsinbono - dat.monto;
                            var vr = hfv < 0 ? 0 : hfv;
                            $('.Total, .Total3').html(Moneda(vr));
                            $('#Total, #Total2').val(vr);
                            $('#TotalBono').html('-' + Moneda(dat.monto));
                            $('.TotalBono').val(dat.monto);
                            $('.bonus').val(dat.pin);
                            $('.bonu').val(dat.id);
                            bono = dat.pin;
                            $('#Code').val(vx + '-' + bono);
                        }
                    } else {
                        DT();
                        SMSj('error', 'Debe digitar un N° de bono. Comuniquese con uno de nuestros asesores encargado');
                    }
                }
            });
        } else {
            DT();
            SMSj('error', 'Cupon de decuento invalido. Comuniquese con uno de nuestros asesores encargado')
        }
    })
    $('#payu').submit(function (e) {
        //e.preventDefault()
        $('input').prop('disabled', false);
        $('#ahora').val(moment().format('YYYY-MM-DD HH:mm'));
        if (!$('#signature').val()) {
            e.preventDefault()
        } else {
            $('#ModalEventos').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            })
        };
    });
    $('#recbo').submit(function (e) {
        e.preventDefault();
        $('input:not(.rcbexcdnt)').prop('disabled', false);
        $('#ahora').val(moment().format('YYYY-MM-DD HH:mm'));
        if (!$('#montorecibos').val()
            || !$('#file2').val()
            || !$('#nrbc').val()
            || (!$(".rcbexcdnt").is(':disabled')
                && !$(".rcbexcdnt").is(':checked')
            )
        ) {
            SMSj('error', 'Debe rellenar todos los campos solicitados');
        } else if (parseFloat($('#montorecibos').val()) < parseFloat($('#Total2').val())) {
            SMSj('error', 'el monto de los recibos ingresados no corresponde al monto total a pagar');
        } else {
            var formData = new FormData($('#recbo')[0]);
            var df = $('#recibos1 input').serializeArray();
            df.map((x, i) => {
                formData.append(x.name, x.value);
            })
            $.ajax({
                type: 'POST',
                url: '/links/recibo',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: true,
                        toggle: true
                    });
                },
                async: false,
                success: function (data) {
                    if (data.std) {
                        SMSj('success', data.msj);
                        setTimeout(function () {
                            window.location.href = '/links/pagos';
                        }, 2000);
                    } else {
                        SMSj('error', data.msj);
                        $('#ModalEventos').hide();
                    }
                }
            });
        }
    });
    $('#boton').submit(function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/links/boton',
            data: $(this).serialize(),
            beforeSend: function (xhr) {
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            //async: false,
            success: function (data) {
                if (data.std) {
                    SMSj('success', data.msj);
                    setTimeout(function () {
                        window.location.href = data.href;
                    }, 2000);
                } else {
                    SMSj('error', 'Existe un error. No es posible continuar, intenta con un metodo de pago diferente');
                    $('#ModalEventos').hide();
                    setTimeout(function () {
                        $('#ModalEventos').modal('hide');
                    }, 2000);
                }
            }
        });
    });

}
//////////////////////////////////* COMISIONES */////////////////////////////////////////////////////////////
if (window.location.pathname === `/links/comisiones` && !rol.externo) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');

    var comisiones = $('#comisiones').DataTable({
        //dom: 'Bfrtip',        
        lengthChange: false,
        lengthMenu: [
            [10, 25, 50, 100, -1],
            ['10 filas', '25 filas', '50 filas', '100 filas', 'Ver todo']
        ],
        /*buttons: [
            {
                extend: 'pageLength',
                text: 'Ver',
                orientation: 'landscape'
            },
            {
                text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                        stroke-linecap="round" stroke-linejoin="round" class="feather feather-slack">
                            <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path>
                            <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
                            <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path>
                            <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path>
                            <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path>
                            <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path>
                            <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path>
                            <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path></svg>`,
                attr: {
                    title: 'Generar cuenta de cobro',
                    id: ''
                },
                className: 'btn btn-secondary',
                action: function () {
                    CuentaCobro();
                }
            },
            {
                extend: 'collection',
                text: 'Stds',
                orientation: 'landscape',
                buttons: [
                    {
                        text: 'COPIAR',
                        extend: 'copy'
                    },
                    {
                        text: `PENDIENTES`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD2(17, 'Pendiente');
                        }
                    },
                    {
                        text: `PAGADAS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD2(17, 'Pagada');
                        }
                    },
                    {
                        text: `DISPONIBLES`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD2(17, 'Disponible');
                        }
                    },
                    {
                        text: `ANULADOS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD2(17, 'Declinada');
                        }
                    },
                    {
                        text: `TODOS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD2('', '');
                        }
                    }
                ]
            }
        ],*/
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [
            { className: 'control', orderable: true, targets: 0 },
            { responsivePriority: 1, targets: [8, 11, 15, 16, 17] },
            { responsivePriority: 2, targets: [13, -1] }
        ],
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/comision",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
            //$('#collapse4').collapse('toggle');
            //$('#ModalEventos').modal('hide');
            $('#comisiones_filter').hide();
        },
        columns: [
            {
                data: null,
                defaultContent: ''
            },
            { data: "ids" },
            { data: "nam" },
            {
                data: "fech",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            { data: "fullname" },
            { data: "nombre" },
            {
                data: "total",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "porciento",
                render: function (data, method, row) {
                    return `${(data * 100).toFixed(2)}%` //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "retefuente",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "reteica",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "pagar",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "concepto" },
            { data: "descp" },
            { data: "proyect" },
            { data: "mz" },
            { data: "n" },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-warning" title="Esta comision esta siendo auditadda">Auditando</span>`
                            break;
                        case 4:
                            return `<span class="badge badge-pill badge-dark">Pagada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Declinada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-warning">Inactiva</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success">Disponible</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-primary">Sin info</span>`
                    }
                }
            },
            {
                className: 't',
                data: "ids",
                render: function (data, method, row) {
                    return rol.admin ? `
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Accion</a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" onclick="EstadoCC(${data}, 9, ${row.stado})">Habilitar</a>
                        <a class="dropdown-item" onclick="EstadoCC(${data}, 15, ${row.stado})">Inhabilitar</a>
                        <a class="dropdown-item" onclick="EstadoCC(${data}, 4, ${row.stado})">Cancelada</a>
                    </div>` : ''
                }
            }
        ],
        rowCallback: function (row, data, index) {
            if (data["stado"] == 3) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["stado"] == 4) {
                $(row).css({ "background-color": "#008080", "color": "#FFFFCC" });
            } else if (data["stado"] == 9) {
                $(row).css("background-color", "#40E0D0");
            } else if (data["stado"] == 15) {
                $(row).css("background-color", "#FFFFCC");
            } else if (data["stado"] == 1) {
                $(row).css({ "background-color": "#FEC782", "color": "#FFFFFF" });
            }
        }
    });
    var aasesor = null, iid = null;
    comisiones.on('click', 'td:not(.control, .t)', function () {
        var fila = $(this).parents('tr');
        var data = comisiones.row(fila).data(); //console.log(data)
        if (!aasesor && data.stado === 9) {
            aasesor = data.nam; console.log(data.bank)
            iid = data.ids;
            fila.toggleClass('selected');
        } else if (iid === data.ids) {
            $(fila).removeClass('selected');
            aasesor = null;
            iid = null;
        } else if (aasesor !== data.nam && aasesor) {
            SMSj('error', 'No puede seleccionar este pago ya que no pertenece al asesor')
        } else {
            data.stado === 9 ? fila.toggleClass('selected') : SMSj('error', 'No puede seleccionar este item ya que no se encuentra disponible');
        }
    });
    var EstadoCC = (id, std, actualstd) => {
        if ((actualstd === 4 && rol.admin) || actualstd !== 4) {
            $.ajax({
                type: 'POST',
                url: '/links/reportes/std',
                data: { ids: id, std },
                beforeSend: function (xhr) {
                    $('#Modalimg').modal('hide');
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: true,
                        toggle: true
                    });
                },
                success: function (data) {
                    if (data) {
                        $('#ModalEventos').modal('hide');
                        SMSj('success', `Solicitud procesada correctamente`);
                        comisiones.ajax.reload(null, false)
                    } else {
                        $('#ModalEventos').modal('hide');
                        SMSj('error', `Solicitud no pudo ser procesada correctamente`)
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            })
        } else {
            SMSj('error', `Solicitud no pude ser procesada, no cuentas con los permisos`)
        }
    }
    var CuentaCobro = () => {
        var NOMBRE = '', EMAIL = '', MOVIL = '', RG = '', CC = '',
            ID = '', BANCO = '', TCTA = '', NCTA = '', TOTAL = 0,
            MONTO = 0, PAGAR = 0, RETEFUENTE = 0, RETEICA = 0,
            cuerpo = [], Ids = [];

        var enviarCuentaCobro = () => {
            var fd = new FormData();
            var doc = new jsPDF('p', 'mm', 'a4');
            var img2 = new Image();
            var img = new Image();
            var totalPagesExp = '{total_pages_count_string}'
            //doc.addPage("a3"); 
            img.src = '/img/avatars/avatar.png'
            img2.src = `https://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=BEGIN%3AVCARD%0AVERSION%3A2.1%0AFN%3ARED+ELITE%0AN%3AELITE%3BRED%0ATITLE%3ABIENES+RAICES%0ATEL%3BCELL%3A3007753983%0ATEL%3BHOME%3BVOICE%3A3012673944%0AEMAIL%3BHOME%3BINTERNET%3Aadmin%40redelite.co%0AEMAIL%3BWORK%3BINTERNET%3Ainfo%40redelite.co%0AURL%3Ahttps%3A%2F%2Fredelite.co%0AADR%3A%3B%3BLA+GRANJA%3BTURBACO%3B%3B131001%3BCOLOMBIA%0AORG%3AGRUPO+ELITE+FINCA+RAIZ+S.A.S.%0AEND%3AVCARD%0A&qzone=1&margin=0&size=400x400&ecc=L`
            cuerpo.push({
                concepto: {
                    content: 'TOTALES:', colSpan: 1, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                    }
                },
                total: {
                    content: '$' + Moneda(Math.round(TOTAL)), colSpan: 1, styles: {
                        halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                    }
                },
                monto: {
                    content: '$' + Moneda(Math.round(MONTO)), colSpan: 1, styles: {
                        halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                    }
                }
            })
            cuerpo.push({
                id: {
                    content: '', colSpan: 11, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                    }
                }
            })
            cuerpo.push({
                id: {
                    content: 'TOTAL COMISION:', colSpan: 3, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                    }
                },
                descp: {
                    content: '$' + Moneda(Math.round(MONTO)), colSpan: 1, styles: {
                        halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                    }
                },
                benefactor: {
                    content: `${NumeroALetras(MONTO)} MCT********`, colSpan: 6, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                    }
                }
            })
            cuerpo.push({
                id: {
                    content: 'RETEFUENTE:', colSpan: 3, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                    }
                },
                descp: {
                    content: '-$' + Moneda(Math.round(RETEFUENTE)), colSpan: 1, styles: {
                        halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                    }
                },
                benefactor: {
                    content: `${NumeroALetras(RETEFUENTE)} MCT********`, colSpan: 6, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                    }
                }
            })
            cuerpo.push({
                id: {
                    content: 'RETEICA:', colSpan: 3, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                    }
                },
                descp: {
                    content: '-$' + Moneda(Math.round(RETEICA)), colSpan: 1, styles: {
                        halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                    }
                },
                benefactor: {
                    content: `${NumeroALetras(RETEICA)} MCT********`, colSpan: 6, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                    }
                }
            })
            cuerpo.push({
                id: {
                    content: 'PAGAR:', colSpan: 3, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                    }
                },
                descp: {
                    content: '$' + Moneda(Math.round(PAGAR)), colSpan: 1, styles: {
                        halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC" `${NumeroALetras(totl)} MCT********`
                    }
                },
                benefactor: {
                    content: `${NumeroALetras(PAGAR)} MCT********`, colSpan: 6, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                    }
                }
            })
            cuerpo.push({
                id: {
                    content: '', colSpan: 11, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                    }
                }
            })
            cuerpo.push({
                id: {
                    content: `Depositar el DINERO a la siguieinte CUENTA ${BANCO.toUpperCase()} ${TCTA} ${NCTA}`, colSpan: 11, styles: {
                        halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                        fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                    }
                }
            })
            /////////////////////////////////////////* PDF *//////////////////////////////////////////////
            fd.append('total', PAGAR)
            fd.append('descuentos', RETEFUENTE + RETEICA)
            fd.append('solicitudes', Ids)
            fd.append('usuario', RG)
            fd.append('fechas', moment().format('YYYY-MM-DD HH:mm'))
            /*fd.append('acumulado', acumulad);
            doc.output('dataurlnewwindow')*/
            $.ajax({
                type: 'POST',
                url: '/links/solicitudes/cuentacobro',
                data: fd,
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#Modalimg').modal('hide');
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true
                    });
                },
                success: function (dat) {
                    if (dat) {
                        doc.autoTable({
                            head: [
                                {
                                    id: 'ID', fecha: 'Fecha', concepto: 'Concepto', descp: 'Descp', porciento: '%',
                                    benefactor: 'Benefactor', proyecto: 'Proyecto', mz: 'Mz', lt: 'Lt', total: 'Total', monto: 'Monto'
                                },
                            ],
                            body: cuerpo,
                            didDrawPage: function (data) {
                                // Header
                                doc.setTextColor(0)
                                doc.setFontStyle('normal')
                                if (img) {
                                    doc.addImage(img, 'png', data.settings.margin.left, 10, 15, 20)
                                    doc.addImage(img2, 'png', data.settings.margin.left + 130, 40, 45, 45)
                                }
                                doc.setFontSize(15)
                                doc.text('CUENTA DE COBRO ' + dat.id, 105, 25, null, null, "center");
                                doc.setFontSize(9)
                                doc.text(moment().format('YYYY-MM-DD HH:mm'), data.settings.margin.left + 155, 38)
                                doc.setFontSize(12)
                                doc.text('GRUPO ELITE FINCA RAÍZ SAS', data.settings.margin.left, 45)
                                doc.setFontSize(10)
                                doc.text('Nit: 901311748-3', data.settings.margin.left, 50)
                                doc.setFontSize(8)
                                doc.text(`Domicilio: Mz 'L' Lt 17 Urb. La granja Turbaco, Bolivar`, data.settings.margin.left, 53)

                                doc.setFontSize(10)
                                doc.text('DEBE A:', data.settings.margin.left, 63)
                                doc.setFontSize(12)
                                doc.text(NOMBRE, data.settings.margin.left, 70)
                                doc.setFontSize(10)
                                doc.text('CC: ' + CC, data.settings.margin.left, 75)
                                doc.setFontSize(10)
                                doc.text(MOVIL, data.settings.margin.left, 78)
                                doc.setFontSize(8)
                                doc.text(EMAIL, data.settings.margin.left, 81)

                                doc.setFontSize(9)
                                doc.text('A continuacion se detalla el concepto del total adeudado', data.settings.margin.left, 90)


                                // Footer
                                var str = 'Page ' + doc.internal.getNumberOfPages()
                                // Total page number plugin only available in jspdf v1.0+
                                if (typeof doc.putTotalPages === 'function') {
                                    str = str + ' of ' + totalPagesExp
                                }
                                doc.setFontSize(8)

                                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                                var pageSize = doc.internal.pageSize
                                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                                doc.text(/*str*/ `Atententamente:`, data.settings.margin.left, pageHeight - 45)
                                doc.text(/*str*/ NOMBRE, data.settings.margin.left, pageHeight - 40)
                                doc.text(/*str*/ `Por medio de la presente certifico que mis ingresos son por honorarios, los cuales se encuentran descritos como Rentas de Trabajo (Articulo 103\nE.T.), ademas para realizar mis labores profecionales no tengo subcontratados a mas de 2 personas (Paragrafo 2 del articlo 383 E.T.). Por tanto\nsolicito se me aplique la misma tasa de retencion de los asalariados estiplada en la tabla de retencion en la fuente contenida en el articulo 383 del E.T.`, data.settings.margin.left, pageHeight - 27)
                            },
                            margin: { top: 95 },
                        })
                        // Total page number plugin only available in jspdf v1.0+
                        if (typeof doc.putTotalPages === 'function') {
                            doc.putTotalPages(totalPagesExp)
                        }
                        doc.output('save', 'CUENTA DE COBRO ' + dat.id + '.pdf')
                        var blob = doc.output('blob')
                        fd.append('pdf', blob)
                        fd.append('ID', dat.id)
                        $.ajax({
                            type: 'POST',
                            url: '/links/solicitudes/cuentacobro',
                            data: fd,
                            processData: false,
                            contentType: false,
                            success: function (data) {
                                $('#ModalEventos').modal('hide');
                                SMSj('success', `Solicitud procesada correctamente`);
                                comisiones.ajax.reload(null, false)
                            },
                            error: function (data) {
                                console.log(data);
                            }
                        });

                    } else {
                        $('#ModalEventos').modal('hide');
                        SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`)
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            })
        };
        comisiones
            .rows('.selected')
            .data()
            .filter(function (value, index) {
                if (index < 1) {
                    ID = value.i;
                    RG = value.idu;
                    CC = value.docu;
                    NOMBRE = value.nam;
                    EMAIL = value.mail;
                    MOVIL = value.clu;
                    BANCO = value.bank;
                    TCTA = value.tipocta;
                    NCTA = value.numerocuenta;
                }
                TOTAL += value.total;
                MONTO += parseFloat(value.monto);
                PAGAR += value.pagar;
                RETEFUENTE += value.retefuente;
                RETEICA += value.reteica;
                Ids.push(value.ids);
                cuerpo.push({
                    id: {
                        content: value.ids, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    fecha: {
                        content: value.fech, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    concepto: {
                        content: value.concepto, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    descp: {
                        content: value.descp, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    porciento: {
                        content: `%${(value.porciento * 100).toFixed(2)}`, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    benefactor: {
                        content: value.fullname, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    proyecto: {
                        content: value.proyect, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    mz: {
                        content: value.mz, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    lt: {
                        content: value.n, colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    total: {
                        content: '$' + Moneda(Math.round(value.total)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    monto: {
                        content: '$' + Moneda(Math.round(value.monto)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    }
                })
            });
        if (BANCO) {
            enviarCuentaCobro();
        } else if (!TOTAL) {
            SMSj('error', 'Debe seleccionar al menos una comicion, para generar una cuenta de cobro');
            return false;
        } else {
            $('#idbank').val(ID)
            $('#BANK').modal({
                backdrop: 'static',
                keyboard: false,
                toggle: true
            });
        }
        $('#bank').submit((e) => {
            e.preventDefault();
            var datos = $('#bank').serialize();
            $.ajax({
                type: 'POST',
                url: '/links/reportes/bank',
                data: datos,
                beforeSend: (x) => {
                    $('#BANK').modal('hide');
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true
                    });
                },
                success: (data) => {
                    if (data) {
                        BANCO = data.banco;
                        TCTA = data.cta;
                        NCTA = data.numero;
                        SMSj('success', 'Cuenta Bancaria registrada correctamente');
                        enviarCuentaCobro();
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            })
        })
    }

    var comisionesOLD = $('#comisionesOLD').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pageLength',
                text: 'Ver',
                orientation: 'landscape'
            },
            {
                text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                        stroke-linecap="round" stroke-linejoin="round" class="feather feather-slack">
                            <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path>
                            <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
                            <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path>
                            <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path>
                            <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path>
                            <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path>
                            <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path>
                            <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path></svg>`,
                attr: {
                    title: 'Generar cuenta de cobro',
                    id: ''
                },
                className: 'btn btn-secondary',
                action: function () {
                    //CuentaCobro();
                }
            },
            {
                text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                    stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>`,
                attr: {
                    title: 'Inspeccion de linea desendente',
                    id: ''
                },
                className: 'btn btn-secondary',
                action: function () {
                    /*$.ajax({
                        type: 'POST',
                        url: '/links/desendentes',
                        beforeSend: function (xhr) {
                            $('#ModalEventos').modal({
                                backdrop: 'static',
                                keyboard: true,
                                toggle: true
                            });
                        },
                        success: function (data) {
                            if (data) {
                                SMSj('success', `Solicitud procesada correctamente`);
                                comisiones.ajax.reload(null, false);
                                $('#ModalEventos').modal('hide');
                            } else {
                                SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`);
                                $('#ModalEventos').modal('hide');
                            }
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    })*/
                }
            }
        ],
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: true,
            targets: 0
        },
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 1, targets: -2 }],
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/comisionOLD",
            dataSrc: "data"
        },
        columns: [
            {
                data: null,
                defaultContent: ''
            },
            { data: "ids" },
            { data: "nam" },
            {
                data: "fech",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            { data: "fullname" },
            { data: "nombre" },
            {
                data: "total",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "porciento",
                render: function (data, method, row) {
                    return `%${(data * 100).toFixed(2)}` //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "retefuente",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "reteica",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "pagar",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "concepto" },
            { data: "descp" },
            { data: "proyect" },
            { data: "mz" },
            { data: "n" },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-dark">Pagada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Declinada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-warning">Inactiva</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success">Disponible</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-primary">Sin info</span>`
                    }
                }
            },
            {
                className: 't',
                data: "ids",
                //defaultContent: 
                render: function (data, method, row) {
                    return rol.admin ? `<div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" onclick="EstadoCC(${data}, 9, ${row.stado})">Habilitar</a>
                                            <a class="dropdown-item" onclick="EstadoCC(${data}, 15, ${row.stado})">Inhabilitar</a>
                                            <a class="dropdown-item" onclick="EstadoCC(${data}, 4, ${row.stado})">Cancelada</a>
                                        </div>
                                    </div>` : ''
                }
            }
        ],
        rowCallback: function (row, data, index) {
            if (data["stado"] == 3) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["stado"] == 4) {
                $(row).css({ "background-color": "#008080", "color": "#FFFFCC" });
            } else if (data["stado"] == 9) {
                $(row).css("background-color", "#40E0D0");
            } else if (data["stado"] == 15) {
                $(row).css("background-color", "#FFFFCC");
            }
        }
    });
}
//////////////////////////////////* REPORTES */////////////////////////////////////////////////////////////
if (window.location.pathname === `/links/reportes`) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');
    
    $('.card-header').on('click', function () {
        var papa = $(this).parents('.accordion');
        if ($(this).find('i').hasClass('fa-angle-down')) {
            $(papa).find('.card-header i').removeClass("fa-angle-up");
            $(papa).find('.card-header i').addClass("fa-angle-down");

            $(this).find('i').removeClass("fa-angle-down");
            $(this).find('i').addClass("fa-angle-up");

        } else {
            $(this).find('i').removeClass("fa-angle-up");
            $(this).find('i').addClass("fa-angle-down");
        }
    });
    //////////////////////* TABLA DE REPORTES */////////////////////// 
    /*if (admin == 1) {
        $('#resumen').show();
    }
    $('#reports').click(function () {
        $('#stadoreportes').show('slow');
        $('#stadocuentasd').hide('slow');
        $('#stadocuentasr').hide('slow');
        $('#reports').hide('slow');
        tableOrden.columns.adjust().draw();
    })*/
    var column = 4;
    var tableOrden = $('#datatable2').DataTable({
        //dom: 'Bfrtip',
        //searching: false,
        lengthChange: false,
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        /*buttons: [
            {
                extend: 'pageLength',
                text: 'Ver',
                orientation: 'landscape'
            },
            {
                text: `<input id="min" type="text" class="edi text-center" style="width: 30px; padding: 1px;"
                        placeholder="MZ">`,
                attr: {
                    title: 'Busqueda por MZ',
                    id: ''
                },
                className: 'btn btn-secondary'
            },
            {
                text: `<input id="max" type="text" class="edi text-center" style="width: 30px; padding: 1px;"
                        placeholder="LT">`,
                attr: {
                    title: 'Busqueda por LT',
                    id: ''
                },
                className: 'btn btn-secondary'
            },
            {
                extend: 'collection',
                text: 'Stds',
                orientation: 'landscape',
                buttons: [
                    {
                        text: 'COPIAR',
                        extend: 'copy'
                    },
                    {
                        text: `CARTERA`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD(13, 'CARTERA');
                            //tableOrden.columns(13).search('CARTERA').draw();
                        }
                    },
                    {
                        text: `PENDIENTES`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD(6, 'Pendiente');
                        }
                    },
                    {
                        text: `APARTADOS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD(6, 'Apartado');
                        }
                    },
                    {
                        text: `SEPARADOS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD(6, 'Separado');
                        }
                    },
                    {
                        text: `VENDIDOS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD(6, 'Vendido');
                        }
                    },
                    {
                        text: `ANULADAS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD(-1, 'ANULADA');
                        }
                    },
                    {
                        text: `TODOS`,
                        className: 'btn btn-secondary',
                        action: function () {
                            STAD('', '');
                        }
                    }
                ]
            }
        ],*/
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [
            { className: 'control', orderable: true, targets: 0 },
            { responsivePriority: 1, targets: [3, 4, 6] },
            { responsivePriority: 2, targets: 5 },
            { responsivePriority: 3, targets: 1 },
            { responsivePriority: 4, targets: 11 },
            { responsivePriority: 5, targets: [7, 8, 12] },
            { targets: [6, 14, 13], searchable: true },
            { targets: [13, 14], visible: false, searchable: true }
        ],
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/table2",
            dataSrc: "data"
        },
        columns: [
            {
                data: null,
                defaultContent: ''
            },
            {
                data: "id",
                className: 'ids'
            },
            {
                data: "proyecto",
                className: 'te'
            },
            {
                data: "mz",
                className: 'te'
            },
            {
                data: "n",
                className: 'deuda'
            },
            {
                data: "promesa",
                className: 'gr',
                render: function (data, method, row) {
                    if (data || row.autoriza) {
                        return row.status == 1 ? `<a ondblclick="Promesa(${row.id}, 2)" title="Promesa realizada \na la espera que el \ncliente autentique \n\n${row.autoriza}"><i class="far fa-check-circle" style="color:green;"></i></a>`
                            : row.status == 2 ? `<a ondblclick="Promesa(${row.id}, 3)" title="Promesa autenticada \npor el cliente \n\n${row.autoriza}"><i class="fas fa-check-circle" style="color:green;"></i></a>`
                                : row.status == 3 ? `<a ondblclick="Promesa(${row.id}, 0)" title="Promesa autenticada \npor ambas partes \n\n${row.autoriza}"><i class="fas fa-certificate" style="color:green;"></i></a>`
                                    : `<a ondblclick="Promesa(${row.id}, 1)" title="Promesa anulada por \n${row.autoriza}"><i class="fas fa-exclamation-circle"></i></a>`;
                    } else {
                        return `<a ondblclick="Promesa(${row.id}, 1)" title="No posee promesa todavia \ndoble click para confirmar \npromesa"><i class="fas fa-exclamation-circle"></i></a>`;
                    }
                }
            },
            {
                data: "estado",
                className: 'Std',
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<a><span class="badge badge-pill badge-warning" title="Estado en el que aun no se a ingresado ningun pago desde el momento de la separacion\nLote ${row.lote}">Pendiente</span></a>`
                            break;
                        case 8:
                            return `<a><span class="badge badge-pill badge-info" title="Pago que se encuentra pendiente de aprobar por el area de contabilidad\nLote ${row.lote}">Tramitando</span></a>`
                            break;
                        case 9:
                            return `<a><span class="badge badge-pill badge-danger" title="Lote ${row.lote}">Anulada</span></a>`
                            break;
                        case 10:
                            return `<a><span class="badge badge-pill badge-success" title="Pago total del valor de la cuota inicial del lote\nLote ${row.lote}">Separado</span></a>`
                            break;
                        case 12:
                            return `<a><span class="badge badge-pill badge-dark" title="Primer pago que se le realiza al lote por concepto de separacion\nLote ${row.lote}">Apartado</span></a>`
                            break;
                        case 13:
                            return `<a><span class="badge badge-pill badge-primary" title="Pago total del valor del lote\nLote ${row.lote}">Vendido</span></a>`
                            break;
                        case 15:
                            return `<a><span class="badge badge-pill badge-tertiary" title="Lote ${row.lote}">Inactivo</span></a>` //secondary
                            break;
                    }
                }
            },
            {
                data: "nombre",
                className: 'te'
            },
            {
                data: "documento",
                className: 'te'
            },
            {
                data: "fecha",
                className: 'te fi',
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            {
                data: "fullname",
                className: 'warp'
            },
            {
                className: 't',
                data: "id",
                render: function (data, method, row) {
                    if (row.tipobsevacion === 'ANULADA' && rol.admin && row.estado != 9 && row.estado != 15) {
                        return `<a class="flex-sm-fill text-sm-center" href="/links/ordendeseparacion/${data}" target="_blank"><i class="fas fa-print"></i></a>`;
                    } else if (rol.subadmin) {
                        return `<a class="flex-sm-fill text-sm-center" data-toggle="collapse" href="#Ord${data}" role="button"
                        aria-expanded="false" aria-controls="datatable2"><i class="fas fa-angle-double-down"></i> Accion</a>`;
                    } else {
                        return `<a class="flex-sm-fill text-sm-center" href="/links/ordendeseparacion/${data}" target="_blank"><i class="fas fa-print"></i></a>`;
                    }
                }
            },
            {
                className: "centr",
                data: "imags",
                render: function (data, method, row) {
                    if (data) {
                        var fr = '', p = data.split(",");
                        p.map((e) => {
                            fr += e ? `<a href="${e}" target="_blank" title="Click para ver documento" class="mr-1"><i class="fas fa-address-card"></i></a>` : ``
                        })
                        return fr;
                    } else {
                        return `<a title="No posee ningun documento"><i class="fas fa-exclamation-circle"></i></a>`;
                    }
                }
            },
            { data: "obsevacion" },
            { data: "tipobsevacion" },
            {
                data: "ultimoabono",
                className: 'te',
                render: function (data, method, row) {
                    return data ? moment(data).format('YYYY-MM-DD') : 'No registra'
                }
            },
            {
                data: "meses",
                className: 'te'
            },
            {
                data: "valor",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "separar",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "ahorro",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "Total",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "abonos",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "deuda",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            }
        ],
        drawCallback: function (settings) {
            var AdminSuper = false, resOrden = false;
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var filas = api.column(0, { page: 'current' }).data();
            filas.each(function (g, i) {

                AdminSuper = rol.subadmin;
                resOrden = rol.admin && g.tipobsevacion === 'ANULADA' && (g.estado == 9 || g.estado == 15);
                //<a class="flex-sm-fill text-sm-center nav-link" href="#" data-toggle="modal" data-target="#Anulacion"><i class="fas fa-ban"></i> Anular</a> 

                $(rows).eq(i).after(
                    `<tr class="total">
                        <th colspan=${column} class="menu">
                        <nav class="nav flex-sm-row collapse" id="Ord${g.id}" aria-labelledby="headingOne" data-parent="#datatable2">

                        ${AdminSuper && !resOrden ? `
                        <a class="flex-sm-fill text-sm-center nav-link" href="/links/editordn/${g.id}"><i class="fas fa-edit"></i> Editar</a>
                        <a class="flex-sm-fill text-sm-center nav-link anular" href="#"><i class="fas fa-ban"></i> Anular</a>                                
                        <a class="flex-sm-fill text-sm-center nav-link" href="#" onclick="Proyeccion(${g.id})"><i class="fas fa-glasses"></i> Proyeccion</a>
                        <a class="flex-sm-fill text-sm-center nav-link" href="#" onclick="GestComi(${g.id},'${g.asesor}')"><i class="fas fa-sitemap"></i> Comisiones</a>`
                        : ''}                              
                        ${!resOrden ? `
                        <a class="flex-sm-fill text-sm-center nav-link" href="#" onclick="Eliminar(${g.id})"><i class="fas fa-trash-alt"></i> Eliminar</a>
                        <a class="flex-sm-fill text-sm-center nav-link" href="/links/ordendeseparacion/${g.id}" target="_blank"><i class="fas fa-print"></i> Imprimir</a>
                        <a class="flex-sm-fill text-sm-center nav-link" href="#" onclick="Verificar(${g.id})"><i class="fas fa-glasses"></i> Estado</a>`
                        : ''}
                        ${g.kupn && AdminSuper && !resOrden ? `<a class="flex-sm-fill text-sm-center nav-link" href="#" onclick="RestKupon(${g.id})"><i class="fas fa-undo"></i> Restablecer Cupon</a>` : ''}
                        ${resOrden ? `<a class="flex-sm-fill text-sm-center nav-link" href="#" onclick="RestOrden(${g.id})"><i class="fas fa-undo"></i> Restablecer Orden</a>` : ''}
                        </nav></td></tr>`
                );
            });
        },
        rowCallback: function (row, data, index) {
            if (data["tipobsevacion"] === 'ANULADA') {
                $(row).css({ "background-color": "#C61633", "color": "#FFFFFF" });
            } else if (data["estado"] == 12) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["estado"] == 8) {
                $(row).css("background-color", "#FFFFCC");
            } else if (data["estado"] == 10) {
                $(row).css("background-color", "#40E0D0");
            } else if (data["estado"] == 1) {
                $(row).css({ "background-color": "#FEC782", "color": "#FFFFFF" });
            } else if (data["estado"] == 13) {
                $(row).css({ "background-color": "#008080", "color": "white" });
            }
            if (data["obsevacion"] === 'CARTERA') {
                $(row).find(`.ids`).css({ "background-color": "#EB0C1A", "color": "white", "border-radius": "10%", "text-align": "center" });
            }
            var caso = data["meses"];
            var msg = caso ? `Se encuentra retrasado ${caso} mes(es) en sus pagos` : "Se encuentra al dia con sus pagos";
            switch (true) {
                case (caso >= 10):
                    return $(row).find(`.deuda`).prop('title', msg).css({ "background-color": "red", "color": "white", "border-radius": "10%", "text-align": "center", "cursor": "pointer" });
                    break;
                case (caso >= 5):
                    return $(row).find(`.deuda`).prop('title', msg).css({ "background-color": "navy", "color": "white", "border-radius": "10%", "text-align": "center", "cursor": "pointer" });
                    break;
                case (caso >= 3):
                    return $(row).find(`.deuda`).prop('title', msg).css({ "background-color": "purple", "color": "white", "border-radius": "10%", "text-align": "center", "cursor": "pointer" });
                    break;
                case (caso >= 1):
                    return $(row).find(`.deuda`).prop('title', msg).css({ "background-color": "blue", "color": "white", "border-radius": "10%", "text-align": "center", "cursor": "pointer" });
                    break;
                default:
                    return $(row).find(`.deuda`).prop('title', msg).css({ "background-color": "green", "color": "white", "border-radius": "10%", "text-align": "center", "cursor": "pointer" });
            }

        },
        initComplete: function (settings, json) {
            //$('#collapse').collapse('toggle');
            $('#datatable2_filter').hide();
            var n = $('#datatable2 tbody tr:first').find('td:hidden').length;
            column = 21 - n;
            $('.menu').prop('colspan', column);
            /*if (!$('main').hasClass('p-1') && column < 7) {
                $('main').addClass('p-1')
                $('card-body').addClass('p-1')
            } else if ($('main').hasClass('p-1') && column > 6) {
                $('main').removeClass('p-1')
                $('card-body').removeClass('p-1')
            };*/
            if (rol.subadmin) {
                $(".fi").daterangepicker({
                    locale: {
                        'format': 'YYYY-MM-DD',
                        'separator': ' - ',
                        'applyLabel': 'Aplicar',
                        'cancelLabel': 'Cancelar',
                        'fromLabel': 'De',
                        'toLabel': '-',
                        'customRangeLabel': 'Personalizado',
                        'weekLabel': 'S',
                        'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                        'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                        'firstDay': 1
                    },
                    singleDatePicker: true,
                    showDropdowns: true,
                    minYear: 2017,
                    maxYear: parseInt(moment().format('YYYY'), 10),
                }, function (start, end, label) {
                    var fila = this.element.parent();
                    var data = tableOrden.row(fila).data();
                    $.ajax({
                        type: 'POST',
                        url: '/links/reportes/fechas',
                        data: { id: data.id, fecha: moment(start).format('YYYY-MM-DD') },
                        success: function (data) {
                            if (data) {
                                tableOrden.ajax.reload(null, false);
                                SMSj('success', 'Fecha actualizada correctamente')
                            }
                        }
                    })
                });
            }
            this.api().columns(2).every(function () {
                var column = this;
                var productos = $('.productos');
                productos.select2({
                    placeholder: 'Seleccione proyecto',
                    allowClear: true
                });
                column.data().unique().sort().each(function (d, j) {
                    productos.append(new Option(d, d, false, false));

                    $('#menu2').append(
                        `<a class="flex-sm-fill text-sm-center nav-link 2" href="javascript:void 0"
                        onclick="STAD('#datatable2', 2, ${d})"><i class="fas fa-home"></i> ${d.toLowerCase()}</a>`
                    );
                });
                $('#menu2').append(`<a class="flex-sm-fill text-sm-center nav-link" href="javascript:void 0">
                    <i class="fas fa-undo"></i> Todos</a>`)

                productos.val(null).trigger('change');
            });
            $('#menu2 a').on('click', function () {
                var texto = $(this).text().trim();
                if (texto === 'Todos') {
                    $('#menu2 a').removeClass("text-success");
                    tableOrden
                        .columns('')
                        .search('')
                        .draw();

                } else if ($(this).hasClass('13')) {
                    $(this).toggleClass("text-success");
                    !$(this).hasClass('text-success') ? texto = '' : '';
                    tableOrden
                        .columns(13)
                        .search(texto)
                        .draw();

                } else if ($(this).hasClass('-1')) {
                    $(this).toggleClass("text-success");
                    !$(this).hasClass('text-success') ? texto = '' : '';
                    tableOrden
                        .columns(-1)
                        .search(texto)
                        .draw();

                } else if ($(this).hasClass('2')) {
                    $(this).siblings(".2").removeClass("text-success");
                    $(this).toggleClass("text-success");
                    !$(this).hasClass('text-success') ? texto = '' : '';
                    tableOrden
                        .columns(2)
                        .search(texto)
                        .draw();

                } else if ($(this).hasClass('6')) {
                    $(this).siblings(".6").removeClass("text-success");
                    $(this).toggleClass("text-success");
                    !$(this).hasClass('text-success') ? texto = '' : '';
                    tableOrden
                        .columns(6)
                        .search(texto)
                        .draw();

                }; //console.log(texto)
            });
        }
    });
    tableOrden.on('click', '.Std', function () {
        var fila = $(this).parents('tr');
        var data = tableOrden.row(fila).data(); //console.log(data)
        $('#datosProducto').html(`${data.proyecto}`);
        $('#datos2Producto').html(`Manzana: ${data.mz}  -  Lote: ${data.n}`);
        $('#nombreCliente').html(data.nombre);
        $('#emailCliente').html(data.email);
        $('#Area').html('Area: ' + data.mtr2);
        $('#ValorArea').html('Valor: $' + Moneda(data.mtr));
        $('#Separacion').html('Separado: ' + moment(data.fecha).format('YYYY-MM-DD'));
        $('#Valor').html('Precio: $' + Moneda(data.valor));
        $('#PinKupon').html(data.pin ? `Cupon: ${data.pin}` : "Cupon: No aplica");
        $('#Porcentage').html(data.descuento ? `Descuento: ${data.descuento}%` : 'Descuento: 0%');
        $('#Descuento').html(data.ahorro ? `Ahorro: $${Moneda(data.ahorro)}` : 'Ahorro: No aplica');
        $('#TotalPrecio').html('Total: $' + Moneda(data.Total));
        $('#Mora').html(data.meses ? `Mes(es) mora: ${data.meses}` : 'Mes(es) mora: Al dia');
        $('#Deuda').html(data.deuda ? `Deuda: $${Moneda(data.deuda)}` : 'Deuda: $0.000');
        $('#Abono').html(data.abonos ? `Abonado: $${Moneda(data.abonos)}` : 'Abonado: $0.000');
        $('#Saldo').html('Saldo: $' + Moneda(data.Total - (data.abonos || 0)));        
        //Comi.column(9).search(data.lote).draw();
        //Recibos.column(9).search(data.id).draw();
        $('#ModalEstadoDetalles').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });
        $('#ModalEstadoDetalles').on('shown.bs.modal', function (e) {
            Comi.ajax.url("/links/comisiones/" + data.id).load(function () {
                Comi.columns.adjust().responsive.recalc();
            });
            Recibos.ajax.url("/links/rcb/" + data.id).load(function () {
                Recibos.columns.adjust().responsive.recalc();
            });
            
        });

    })
    /*$(window).resize(function () {
        tableOrden
            .columns.adjust()
            .responsive.recalc();
    });
    tableOrden.on('column-sizing.dt', function (e, settings) {
        console.log('Column width recalculated in table');
    });
    tableOrden.on('column-visibility.dt', function (e, settings, column, state) {
        console.log('Column ' + column + ' has changed to ' + (state ? 'visible' : 'hidden'));
    });*/
    tableOrden.on('responsive-display', function (e, datatable, row, showHide, update) {
        console.log(row.id(), 'Details for row ' + row.index() + ' ' + (showHide ? 'shown' : 'hidden'));
    });
    tableOrden.on('responsive-resize', function (e, datatable, columns) {
        tableOrden
            .columns.adjust()
            .responsive.recalc();
        var count = columns.reduce(function (a, b) {
            return b === false ? a + 1 : a;
        }, 0);
        column = 23 - count;
        /*if (!$('main').hasClass('p-1') && column < 7) {
            $('main').addClass('p-1')
            $('card-body').addClass('p-1')
        } else if ($('main').hasClass('p-1') && column > 6) {
            $('main').removeClass('p-1')
            $('card-body').removeClass('p-1')
        };*/
        $('.menu').prop('colspan', column);
        //console.log(column, count + ' column(s) are hidden');
    });
    $('#busq').on('keyup', function () {
        tableOrden.search(this.value).draw();
    });
    $('#busq2').on('keyup', function () {
        comisiones.search(this.value).draw();
    });
    //////////////////////* Table3 *///////////////////////
    var area, productos, descuentos, total, abonos, salds,
        Fehsi = 'Origenes', Fehsf = 'Actualidad', proyct = 'TODOS LOS PROYECTOS';
    var f = [{
        text: `TODOS`,
        action: function () {
            proyct = 'TODOS LOS PROYECTOS'
            estadoscuentas
                .columns(-1)
                .search('')
                .draw();
        }
    }]
    $.ajax({
        url: '/links/reportes/proyectos',
        type: 'POST',
        async: false,
        success: function (data) {
            if (data) {
                data.map((a) => {
                    f.push({
                        text: a.proyect,
                        action: function () {
                            proyct = a.proyect
                            estadoscuentas
                                .columns(-1)
                                .search(a.proyect)
                                .draw();
                        }
                    })
                })
            }
        }
    });
    //////////////////////* TABLA DE RECIBOS DE MODAL *///////////////////////////
    var Recibos = $('#Rcbs').DataTable({
        //dom: 'Bfrtip',
        lengthChange: false,
        deferRender: true,
        paging: true,
        autoWidth: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.childRowImmediate,
                type: 'none',
                target: ''
            }
        },
        order: [[0, "desc"]],
        language: languag2,
        columnDefs: [
            { targets: -1, visible: false, searchable: true }
        ],
        ajax: {
            method: "POST",
            url: "/links/rcb/nada",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
            $('#Rcbs_filter').hide();
            //$('[data-toggle="popover"]').popover()
        },
        columns: [
            {
                className: 't',
                data: "ids"
            },
            {
                data: "fech"
            },
            {
                data: "fecharcb",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            { data: "descp" },
            {
                data: "monto",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "recibo",
                className: "Reci",
                render: function (data, method, row) {
                    return `<a tabindex="0" class="recivos" data-toggle="popover" title="${data.replace(/~/g, '')}" data-content="<img src='https://grupoelitefincaraiz.com${row.img}' alt='...' class='img-thumbnail'>">${data.replace(/~/g, '')}</a>` //`<a class="recivos" id="${row.img}">${data.replace(/~/g, '')}</a>`//
                }
            },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-success">Aprobada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Anulada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">sin formato</span>`
                    }
                }
            },
            {
                className: 't',
                data: "pdf",
                render: function (data, method, row) {
                    return data ? `<a href="${data}" target="_blank" title="Click para ver recibo"><i class="fas fa-file-alt"></i></a>`
                        : `<a title="No posee ningun recibo"><i class="fas fa-exclamation-circle"></i></a>`;
                }
            },
            { data: "aprueba" },
            { data: "orden" }
        ],
        rowCallback: function (row, data, index) {
            if (data["stado"] == 6) {
                $(row).css({ "background-color": "#C61633", "color": "#FFFFFF" });
            } else if (data["stado"] == 3) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["stado"] == 4) {
                $(row).css("background-color", "#40E0D0");
            }
        },
        infoCallback: function (settings, start, end, max, total, pre) {
            $('#totalRcb').html('Total de recibos ingresados ' + total);
            return pre;
        }
    });
    Recibos.on("mouseenter", ".Reci", function () {
        $('.recivos').popover({
            trigger: "hover",
            delay: { "show": 500, "hide": 100 },
            placement: "auto",
            html: true,
            //title: 'Recibo',
            //content: `<img src='https://grupoelitefincaraiz.com/${$(this).prop('id')}' alt='...' class='img-thumbnail'>`,
        });
    });
    //////////////////////* ESTADOS DE CUENTA RESUMIDOS */////////////////////// 
/*     var estadoscuentas = $('#estadoscuentas').DataTable({
        processing: true,
        autowidth: true,
        //columnDefs: [{ targets: [-1], visible: false, searchable: true }],
        order: [[0, 'asc'], [1, 'asc']],
        ajax: {
            method: "POST",
            url: "/links/reportes/estadosc",
            dataSrc: "data"
        },
        columns: [
            {
                data: "mz",
                render: function (data, method, row) {
                    return data === 'no' ? 0 : data
                }
            },
            { data: "n" },
            { data: "mtr2" },
            {
                data: "vrmt2",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "nombre",
                className: 'te'
            },
            {
                data: "fecha",
                className: 'te',
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            {
                data: "valor",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "descuento",
                className: 'te',
                render: function (data, method, row) {
                    return data + '%'
                }
            },
            {
                data: "ahorro",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "total",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "montos",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                className: 't',
                data: "montos",
                render: function (data, method, row) {
                    return '$' + Moneda(row.total - data);
                }
            },
            {
                data: "proyect",
                className: 'te'
            },
        ],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            var total = 0;
            var filas = api.column(0, { page: 'current' }).data();
            var intVal = function (i) {
                var t = i.replace(/[\$,]/g, '')
                return typeof i === 'string' ?
                    t.replace(/\./g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            filas.each(function (group, i) {
                if (last !== group) {
                    if (last != null) {
                        $(rows).eq(i - 1).after(
                            `<tr class="total">
                                    <td colspan=2>Total:</td>
                                    <td colspan="10">${Moneda(total)}</td>
                                 </tr>`
                        );
                        total = 0;
                    }
                    $(rows).eq(i).before(
                        `<tr class="group" style="background: #7f8c8d; color: #FFFFCC;">
                                <td colspan="13" class="text-center">MANZANA ${group}</td>
                            </tr>`
                    );
                    last = group;
                }
                total += intVal($(rows).eq(i).children()[10].textContent);
                if (i == filas.length - 1) {
                    $(rows).eq(i).after(
                        `<tr class="total">
                                <td colspan=2>Total:</td>
                                <td colspan="10">${Moneda(total)}</td>
                            </tr>`
                    );
                }
            });
        },
        dom: 'Bfrtip',
        buttons: [{
            extend: 'collection',
            text: '<i class="align-middle feather-md" data-feather="menu"></i>',
            orientation: 'landscape',
            buttons: [{
                text: '<i class="align-middle feather-md" data-feather="copy"></i> Copiar',
                extend: 'copy'
            },
            {
                text: '<i class="align-middle feather-md" data-feather="printer"></i> Imprimir',
                extend: 'print',
                title: ``,
                orientation: 'landscape',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    //modifier: true
                },
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '10pt')
                        .prepend(
                            `                
                    <div class="card">
                        <!--<div class="text-right mb-2">
                            <span class="badge badge-dark text-md-center">PRADOS DE PONTEVEDRA</span>
                        </div>-->
                        <div class="row">
                            <div class="col-sm-5">
                                <div class="card border-primary text-left">
                                    <div class="row no-gutters">
                                        <div class="col-md-2">
                                            <img src="https://grupoelitered.com.co/img/avatars/avatar.svg" class="card-img" alt="...">
                                        </div>
                                        <div class="col-md-9">
                                            <div class="card-body text-primary h4">
                                                <div class="mb-0">
                                                    <span class="align-middle text-dark">GRUPO ELITE FINCA RAIZ S.A.S</span>
                                                </div>   
                                                <div class="mb-0">
                                                    <span class="align-middle card-text">${Fehsi + '/' + Fehsf}</span>
                                                </div>
                                                <div class="mb-0">
                                                    <span class="align-middle text-dark">PRODUCTOS</span>
                                                    <span class="align-middle card-text">${productos} LOTES</span>
                                                </div>
                                                <div class="mb-0">
                                                    <span class="align-middle text-dark">AREA</span>
                                                    <span class="align-middle card-text">${Math.round(area, 2)} MTR2</span>
                                                </div>                                            
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div class="col-sm-7">
                            <div class="card border-primary text-left">
                            <div class="row no-gutters">
                                <div class="col-md-6">
                                    <div class="card-body text-primary h4">
                                        <div class="mb-0">                                          
                                            <span class="align-middle text-dark">DESCUENTOS</span>
                                            <span class="align-middle text-danger">$${Moneda(descuentos)}</span>
                                        </div>
                                        <div class="mb-0">
                                            <span class="align-middle text-dark">TOTALES</span>
                                            <span class="align-middle card-text">$${Moneda(total)}</span>
                                        </div>
                                        <div class="mb-0">
                                            <span class="align-middle text-dark">ABONOS</span>
                                            <span class="align-middle text-success">$${Moneda(abonos)}</span>
                                        </div>
                                        <div class="mb-0">
                                            <span class="align-middle text-dark">SALDOS</span>
                                            <span class="align-middle text-warning">$${Moneda(total - abonos)}</span>
                                        </div>                                            
                                    </div>
                                </div>
                                <div class="col-md-6">
                                <div class="card-body text-primary h4">
                                <div class="mb-0">
                                    <span class="align-middle text-warning">${proyct}</span>
                                </div>
                                <div class="mb-0">
                                    <span class="align-middle card-text">ESTADOS DE CUENTAS</span>
                                </div>
                                <div class="mb-0">
                                    <span class="align-middle card-text">CONCEPTO RESUMEN</span>
                                </div>
                                <div class="mb-0">
                                    <span class="align-middle card-text">SISTEMA DE REPORTES</span>
                                </div>                                            
                            </div>
                                </div>
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>`
                        );

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                },
                autoPrint: true
            }
            ]
        },
        {
            extend: 'pageLength',
            text: '<i class="align-middle feather-md" data-feather="eye-off"></i>',
            orientation: 'landscape'
        },
        {
            extend: 'collection',
            text: `<i class="align-middle feather-md" data-feather="home"></i>`,
            //orientation: 'landscape',
            buttons: f
        },
        {
            text: `<i class="align-middle feather-md" data-feather="calendar"></i>`,
            attr: {
                title: 'Fecha',
                id: 'Date'
            },
            className: 'btn btn-secondary fech'
        },
        {
            text: `<input type="text" class="edi text-center min" style="width: 30px; padding: 1px;"
                placeholder="MZ">`,
            attr: {
                title: 'Busqueda por MZ',
                id: ''
            },
            className: 'btn btn-secondary'
        },
        {
            text: `<input type="text" class="edi text-center max" style="width: 30px; padding: 1px;"
                placeholder="LT">`,
            attr: {
                title: 'Busqueda por LT',
                id: ''
            },
            className: 'btn btn-secondary'
        }
        ],
        fixedHeader: {
            headerOffset: -9
        },
        //ordering: true,
        language: languag,
        //deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        initComplete: function (settings, json) {
            //console.log(Math.round(area, 2), productos, descuentos, total, abonos, total - abonos)
        },
        footerCallback: function (row, data, start, end, display) {
            var api = this.api(), data;
            // Elimine el formato para obtener datos enteros para la suma
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };
            // Total en todas las páginas visibles (encontradas)
            area = api
                .column(3, { order: 'applied', search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            productos = api
                .column(3, { order: 'applied', search: 'applied' })
                .data()
                .reduce(function (a, b, x) {
                    return x;
                }, 0);
            descuentos = api
                .column(8, { order: 'applied', search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            total = api
                .column(9, { order: 'applied', search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            abonos = api
                .column(10, { order: 'applied', search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);
            //console.log(Math.round(area, 2), productos, descuentos, total, abonos, total - abonos)
        },
        rowCallback: function (row, data, index) {
        }
    });
    
    $('.min, .max').on('keyup', function () {
        var col = $(this).hasClass('min') ? 1 : 2;
        var buscar = this.value ? "^" + this.value + "$" : '';
        estadoscuentas
            .columns(col)
            .search(buscar, true, false, true)
            .draw();
    });
 */
    /*$('#resumen').click(function () {
        $('#stadoreportes').hide('slow');
        $('#stadocuentasd').hide('slow');
        $('#stadocuentasr').show('slow');
        $('#reports').show('slow');
        estadoscuentas.columns.adjust().draw();
    })*/
    //////////////////////* ESTADOS DE CUENTA DETALLADOS */////////////////////// 
    var body = [];
    var estadoscuentas2 = $('#estadoscuentas2').DataTable({
        processing: true,
        autowidth: true,
        columnDefs: [
            {
                targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                visible: false,
                //searchable: true
            }
        ],
        order: [[1, 'asc'], [2, 'asc']],
        ajax: {
            method: "POST",
            url: "/links/reportes/estadosc2",
            dataSrc: "data"
        },
        columns: [
            {
                className: 'control',
                data: null,
                defaultContent: ''
            },
            {
                data: "mz",
                render: function (data, method, row) {
                    return data === 'no' ? 0 : data
                }
            },
            { data: "n" },
            { data: "proyect" },
            {
                data: "valor",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 2, '$')
            },
            {
                data: "descuento",
                className: 'te',
                render: function (data, method, row) {
                    return data + '%'
                }
            },
            {
                data: "cupon",
                className: 'te'
            },
            {
                data: "ahorro",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 2, '$')
            },
            {
                data: "total",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 2, '$')
            },
            {
                data: "fecha",
                className: 'te',
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            {
                data: "nombre",
                className: 'te'
            },
            {
                data: "fech",
                className: 'te',
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            {
                data: "ids",
                className: 'te',
                render: function (data, method, row) {
                    return 'RC-' + data
                }
            },
            {
                data: "formap",
                className: 'te',
                render: function (data, method, row) {
                    return data ? data : 'INDEFINIDO'
                }
            },
            {
                data: "descp",
                className: 'te'
            },
            {
                data: "monto",
                className: 'te',
                render: function (data, method, row) {
                    return row.formap === 'BONO' ? '$0' : '$' + Moneda(data)
                }
            },
            {
                data: "bono",
                className: 'te',
                render: function (data, method, row) {
                    return data ? data : 'NO APLICA'
                }
            },
            {
                data: "mtb",
                className: 'te',
                render: function (data, method, row) {
                    return data ? '$' + Moneda(data) : '$0'
                }
            },
            {
                data: "mtb",
                className: 'te',
                render: function (data, method, row) {
                    return row.formap === 'BONO' ? '$' + Moneda(data)
                        : data ? '$' + Moneda(parseFloat(row.monto) + parseFloat(data))
                            : '$' + Moneda(row.monto)
                }
            },
            {
                data: "date",
                className: 'f',
                render: function (data, method, row) {
                    return data ? moment(data).format('YYYY-MM-DD') : 'INDEFINIDA'
                }
            },
            {
                data: "rcb",
                className: 'te'
            },
            {
                data: "formapg",
                className: 'te',
                render: function (data, method, row) {
                    return data === 'CTA-CTE-50900011438' ? 'CTA-CTE-1438' : data
                }
            },
            {
                data: "id",
                className: 'te'
            },
            {
                data: "mounto",
                className: 'te',
                render: function (data, method, row) {
                    return data ? '$' + Moneda(data) : '$0'
                }
            },
            {
                data: "observacion",
                className: 'te'
            },
            {
                data: "bonus",
                className: 'te'
            },
            {
                orderable: false,
                data: null,
                defaultContent: `<a class="no float-right"><i class="align-middle mr-2 fas fa-fw fa-trash"></i></i></a>`
            }
        ],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null, lote = null, pago = null;
            var total = 0, vlr = 0, totaloteanterior = 0;
            var datos = api.column({ page: 'current' }).data()
            var filas = api.column(10, { page: 'current' }).data();
            body = [];

            filas.each(function (group, i) {
                var gt = moment(datos[i].fecha).format('YYYY/M/D');
                var gt2 = moment(datos[i].fech).format('YYYY/M/D');
                var valr = datos[i].formap === 'BONO' ? parseFloat(datos[i].mtb)
                    : datos[i].mtb ? parseFloat(datos[i].monto) + parseFloat(datos[i].mtb)
                        : parseFloat(datos[i].monto)

                if (last !== group || lote !== datos[i].n) {
                    if (last != null) {
                        $(rows).eq(i - 1).after(
                            `<tr class="total" style="background: #F08080; color: #FFFFCC;">                           
                                <td colspan="15">
                                    <nav class="nav nav-justified">
                                        <a class="nav-item nav-link py-0">TOTAL ABONADO</a>
                                        <a class="nav-item nav-link py-0">$${Moneda(vlr)}</a>
                                    </nav>
                                </td>
                            </tr>
                            <tr class="total" style="background: #F08080; color: #FFFFCC;">                          
                                <td colspan="15">
                                    <nav class="nav nav-justified">
                                        <a class="nav-item nav-link py-0">SALDO A LA FECHA</a>
                                        <a class="nav-item nav-link py-0">$${Moneda(totaloteanterior - vlr)}</a>
                                    </nav>
                                </td>
                            </tr>
                            <tr></tr>`
                        );
                        body.push(
                            {
                                id: {
                                    content: 'TOTAL ABONADO',
                                    colSpan: 4, styles: {
                                        halign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                        fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                    }
                                },
                                id5: {
                                    content: '$' + Moneda(vlr),
                                    colSpan: 4, styles: {
                                        halign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                        fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                    }
                                }
                            },
                            {
                                id: {
                                    content: 'SALDO A LA FECHA',
                                    colSpan: 4, styles: {
                                        halign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                        fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                    }
                                },
                                id5: {
                                    content: '$' + Moneda(totaloteanterior - vlr),
                                    colSpan: 4, styles: {
                                        halign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                        fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                    }
                                }
                            }
                        )
                        vlr = 0;
                    }
                    $(rows).eq(i).before(
                        `<tr class="group" style="background: #7f8c8d; color: #FFFFCC;">
                            <td colspan="15">
                                <nav class="nav flex-column flex-sm-row">
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">${group}</a>
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">${datos[i].proyect}</a>
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">MZ: ${datos[i].mz} - LT: ${datos[i].n}</a>
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">PRECIO: $${Moneda(datos[i].valor)}</a>
                                </nav>
                            </td>
                        </tr>
                        <tr class="group" style="background: #FFFFCC; color: #7f8c8d;">
                            <td colspan="15">
                                <nav class="nav flex-column flex-sm-row">
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">SEPARADO: ${gt}</a>
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">DSTO: ${datos[i].descuento}%</a>
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">CUPON: ${datos[i].cupon}</a>
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">AHORRO: $${Moneda(datos[i].ahorro)}</a>
                                    <a class="flex-sm-fill text-sm-center nav-link py-0">TOTAL: $${Moneda(datos[i].total)}</a>
                                </nav>
                            </td>
                        </tr>
                        <tr class="pago" style="background: #40E0D0;" onclick="Pago(${datos[i].ids}, '${datos[i].img}', '${datos[i].id}')">
                            <td colspan="15">
                                <nav class="nav nav-justified">
                                    <a class="nav-item nav-link py-0">${gt2}</a>
                                    <a class="nav-item nav-link py-0">RC-${datos[i].ids}</a>
                                    <a class="nav-item nav-link py-0">${datos[i].descp}</a>
                                    <a class="nav-item nav-link py-0">$${datos[i].formap === 'BONO' ? Moneda(datos[i].mtb)
                            : datos[i].mtb ? Moneda(parseFloat(datos[i].monto) + parseFloat(datos[i].mtb))
                                : Moneda(datos[i].monto)}</a>
                                </nav>
                            </td>
                        </tr>`
                    );

                    vlr += valr
                    last = group;
                    lote = datos[i].n
                    pago = datos[i].ids;
                    body.push(
                        {
                            id: {
                                content: group, colSpan: 3, styles: {
                                    halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 10, fillColor: "#FFFFCC"
                                }
                            },
                            id4: {
                                content: datos[i].proyect, colSpan: 2, styles: {
                                    halign: 'center', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 9, fillColor: "#FFFFCC"
                                }
                            },
                            id6: {
                                content: 'MZ: ' + datos[i].mz + ' - LT: ' + datos[i].n, styles: {
                                    halign: 'center', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 8, fillColor: "#FFFFCC"
                                }
                            },
                            id7: {
                                content: '$' + Moneda(datos[i].valor), colSpan: 2, styles: {
                                    halign: 'right', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 8, fillColor: "#FFFFCC"
                                }
                            }
                        },
                        {
                            id: {
                                content: 'Sp. ' + gt, styles: {
                                    halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 8, fillColor: "#FFFFCC"
                                }
                            },
                            id2: {
                                content: 'Dto. ' + datos[i].descuento + '%', styles: {
                                    halign: 'center', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 8, fillColor: "#FFFFCC"
                                }
                            },
                            id3: {
                                content: 'Cupon: ' + datos[i].cupon, styles: {
                                    halign: 'center', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 8, fillColor: "#FFFFCC"
                                }
                            },
                            id4: {
                                content: 'Ahorro: $' + Moneda(datos[i].ahorro), colSpan: 2, styles: {
                                    halign: 'right', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 8, fillColor: "#FFFFCC"
                                }
                            },
                            id6: {
                                content: 'Total: $' + Moneda(datos[i].total), colSpan: 3, styles: {
                                    halign: 'right', cellWidth: 'auto', textColor: '#7f8c8d',
                                    fontStyle: 'bolditalic', fontSize: 8, fillColor: "#FFFFCC"
                                }
                            }
                        },
                        {
                            id: {
                                content: gt2, styles: {
                                    halign: 'left', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                }
                            },
                            id2: {
                                content: 'RC-' + datos[i].ids, styles: {
                                    halign: 'center', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                }
                            },
                            id3: {
                                content: datos[i].descp, styles: {
                                    halign: 'center', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                }
                            },
                            id4: {
                                content: datos[i].formap === 'BONO' ? Moneda(datos[i].mtb)
                                    : datos[i].mtb ? Moneda(parseFloat(datos[i].monto) + parseFloat(datos[i].mtb))
                                        : Moneda(datos[i].monto), colSpan: 5, styles: {
                                            halign: 'right', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                        }
                            }
                        }
                    )
                } else if (pago !== datos[i].ids) {
                    //("background-color", "#40E0D0");
                    $(rows).eq(i - 1).after(
                        `<tr class="pago" style="background: #40E0D0;" onclick="Pago(${datos[i].ids}, '${datos[i].img}', '${datos[i].id}')">
                            <td colspan="15">
                                <nav class="nav nav-justified">
                                    <a class="nav-item nav-link py-0">${gt2}</a>
                                    <a class="nav-item nav-link py-0">RC-${datos[i].ids}</a>
                                    <a class="nav-item nav-link py-0">${datos[i].descp}</a>
                                    <a class="nav-item nav-link py-0">$${datos[i].formap === 'BONO' ? Moneda(datos[i].mtb)
                            : datos[i].mtb ? Moneda(parseFloat(datos[i].monto) + parseFloat(datos[i].mtb))
                                : Moneda(datos[i].monto)}</a>
                                </nav>
                            </td>
                        </tr>`
                    );
                    body.push(
                        {
                            id: {
                                content: gt2, styles: {
                                    halign: 'left', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                }
                            },
                            id2: {
                                content: 'RC-' + datos[i].ids, styles: {
                                    halign: 'center', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                }
                            },
                            id3: {
                                content: datos[i].descp, styles: {
                                    halign: 'center', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                }
                            },
                            id4: {
                                content: datos[i].formap === 'BONO' ? Moneda(datos[i].mtb)
                                    : datos[i].mtb ? Moneda(parseFloat(datos[i].monto) + parseFloat(datos[i].mtb))
                                        : Moneda(datos[i].monto), colSpan: 5, styles: {
                                            halign: 'right', cellWidth: 'auto', fontStyle: 'bolditalic', fontSize: 8, fillColor: "#40E0D0"
                                        }
                            }
                        }
                    )
                    pago = datos[i].ids;
                    vlr += valr
                }
                body.push(
                    {
                        id: { content: datos[i].date ? datos[i].date : 'Indefinido', styles: { fontSize: 7, fontStyle: 'bold' } },
                        id2: { content: datos[i].rcb ? datos[i].rcb : 'Indefinido', styles: { fontSize: 7, fontStyle: 'bold' } },
                        id3: { content: datos[i].formapg ? datos[i].formapg : 'Indefinido', styles: { fontSize: 7, fontStyle: 'bold' } },
                        id4: { content: datos[i].id ? datos[i].id : 'Indefinido', styles: { fontSize: 7, fontStyle: 'bold' } },
                        id5: { content: datos[i].mounto ? '$' + Moneda(datos[i].mounto) : '$0', styles: { fontSize: 7, fontStyle: 'bold' } }
                    }
                )
                //console.log(pago, datos[i].ids)

                if (i == filas.length - 1) {
                    $(rows).eq(i).after(
                        `<tr class="total" style="background: #F08080; color: #FFFFCC;">                          
                            <td colspan="15">
                                <nav class="nav nav-justified">
                                    <a class="nav-item nav-link py-0">TOTAL ABONADO</a>
                                    <a class="nav-item nav-link py-0">$${Moneda(vlr)}</a>
                                </nav>
                            </td>
                        </tr>
                        <tr class="total" style="background: #F08080; color: #FFFFCC;">                           
                            <td colspan="15">
                                <nav class="nav nav-justified">
                                    <a class="nav-item nav-link py-0">SALDO A LA FECHA</a>
                                    <a class="nav-item nav-link py-0">$${Moneda(parseFloat(datos[i].total) - vlr)}</a>
                                </nav>
                            </td>
                        </tr>
                        <tr></tr>`
                    );
                    body.push(
                        {
                            id: {
                                content: 'TOTAL ABONADO',
                                colSpan: 4, styles: {
                                    halign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                    fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                }
                            },
                            id5: {
                                content: '$' + Moneda(vlr),
                                colSpan: 4, styles: {
                                    halign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                    fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                }
                            }
                        },
                        {
                            id: {
                                content: 'SALDO A LA FECHA',
                                colSpan: 4, styles: {
                                    hhalign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                    fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                }
                            },
                            id5: {
                                content: '$' + Moneda(parseFloat(datos[i].total) - vlr),
                                colSpan: 4, styles: {
                                    halign: 'right', cellWidth: 'wrap', textColor: '#FFFFCC',
                                    fontStyle: 'bolditalic', fontSize: 7, fillColor: "#7f8c8d"
                                }
                            }
                        }
                    )
                }
                totaloteanterior = parseFloat(datos[i].total);
            });
        },
        dom: 'Bfrtip',
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        buttons: [{
            text: `<i class="align-middle" data-feather="file-text"></i>`,
            attr: {
                title: 'Fecha',
                id: 'facturar'
            },
            className: 'btn btn-secondary',
            action: function () {
                var doc = new jsPDF('p', 'mm', [612, 792]);
                var img = new Image();
                img.src = '/img/avatars/avatar.png'
                var totalPagesExp = '{total_pages_count_string}'
                doc.autoTable({
                    head: [
                        { id: 'fechas', id2: 'recibos', id3: 'forma', id4: 'dscp', id5: 'monto', id6: 'bono', id7: 'monto', id8: 'total' },
                    ],
                    body,
                    //html: '#estadoscuentas2',
                    //showHead: false,
                    includeHiddenHtml: false,
                    theme: 'plain',
                    /*columnStyles: {
                        //id: { fillColor: 120, textColor: 255, fontStyle: 'bold' },
                        //FECHAS: { textColor: 0, fontStyle: 'bold' },                        
                        0: { cellWidth: '10', textColor: 0, fontStyle: 'italic', fontSize: 7 },
                        1: { cellWidth: '50', textColor: 0, fontStyle: 'normal', fontSize: 7 },
                        2: { cellWidth: 'wrap', textColor: 0, fontStyle: 'normal', fontSize: 7 },
                        3: { cellWidth: 'wrap', textColor: 0, fontStyle: 'normal', fontSize: 7 },
                        4: { cellWidth: 'auto', textColor: 0, fontStyle: 'normal', fontSize: 7 },
                        7: { cellWidth: 'auto', textColor: 0, fontStyle: 'bold', fontSize: 9 },
                    },*/
                    didDrawPage: function (data) {
                        // Header
                        doc.setTextColor(0)
                        doc.setFontStyle('normal')
                        if (img) {
                            doc.addImage(img, 'png', data.settings.margin.left, 2, 7, 10)
                        }
                        doc.setFontSize(10)
                        doc.text('ESTADOS DE CUENTA DETALLADO', data.settings.margin.left + 9, 9)
                        // Footer
                        var str = 'Page ' + doc.internal.getNumberOfPages()
                        // Total page number plugin only available in jspdf v1.0+
                        if (typeof doc.putTotalPages === 'function') {
                            str = str + ' of ' + totalPagesExp
                        }
                        //doc.setFontSize(8)
                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        //var pageSize = doc.internal.pageSize
                        //var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                        //doc.text(/*str*/ `https://grupoelitered.com.co/links/pagos`, data.settings.margin.left, pageHeight - 10)
                    },
                    margin: { top: 13 },
                })
                // Total page number plugin only available in jspdf v1.0+
                //if (typeof doc.putTotalPages === 'function') {
                //doc.putTotalPages(totalPagesExp)
                //}
                doc.output('dataurlnewwindow')
                //var blob = doc.output('blob')
            }
        },
        {
            extend: 'pageLength',
            text: '<i class="align-middle feather-md" data-feather="eye-off"></i>',
            orientation: 'landscape'
        },
        {
            text: `<input type="text" class="edi text-center mins" style="width: 30px; padding: 1px;"
            placeholder="MZ">`,
            attr: {
                title: 'Busqueda por MZ',
                id: ''
            },
            className: 'btn btn-secondary'
        },
        {
            text: `<input type="text" class="edi text-center maxs" style="width: 30px; padding: 1px;"
            placeholder="LT">`,
            attr: {
                title: 'Busqueda por LT',
                id: ''
            },
            className: 'btn btn-secondary'
        }
        ],
        ordering: true,
        language: languag,
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        initComplete: function (settings, json) {
            /*$(".f").daterangepicker({
                locale: {
                    'format': 'YYYY-MM-DD',
                    'separator': ' - ',
                    'applyLabel': 'Aplicar',
                    'cancelLabel': 'Cancelar',
                    'fromLabel': 'De',
                    'toLabel': '-',
                    'customRangeLabel': 'Personalizado',
                    'weekLabel': 'S',
                    'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                    'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    'firstDay': 1
                },
                singleDatePicker: true,
                showDropdowns: true,
                minYear: 2017,
                maxYear: parseInt(moment().format('YYYY'), 10),
            });*/
        },
    });
    $('.mins, .maxs').on('keyup', function () {
        var col = $(this).hasClass('mins') ? 1 : 2;
        var buscar = this.value ? "^" + this.value + "$" : '';
        estadoscuentas2
            .columns(col)
            .search(buscar, true, false, true)
            .draw();
    });
    estadoscuentas2.on('click', 'tr:not(.pago)', function () {
        var data = estadoscuentas2.row(this).data();
        $("#Modalimg .foto").remove();
        $("#descargaimg .imag").remove();
        if (data.rcb && rol.subadmin) {
            imge = 1;
            $("#descargaimg").html(`<a class="imag" href="${data.baucher}" target="_blank"><span class="badge badge-dark">Img</span></a>`);
            $("#Modalimg .fotos").html(
                `<div class="foto" style="
                        width: 100%;
                        padding-top: calc(100% / (16/9));
                        background-image: url('${data.baucher}');
                        background-size: 100%;
                        background-position: center;
                        background-repeat: no-repeat;float: left;">
                        <div class="card">
                        <table class="table table-sm tablarcb"><tbody>
                    <tr class="op">
                        <th> 
                        <input type="hidden" name="img" class="imag" value="${data.baucher}">
                        <input type="hidden" name="id" value="${data.ids}">
                        <input type="hidden" name="j" value="${data.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        <input class="recis text-center" type="text" name="nrecibo" placeholder="Recibo"
                         autocomplete="off" style="padding: 1px; width: 60%;" value="${data.rcb}" required>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>                     
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign">
                            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <input class="montos text-center" type="text" name="montos" value="${Moneda(data.mounto)}"
                             placeholder="Monto" autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                        </td>
                    </tr>
                    <tr class="op">
                        <th>                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <input class="fec text-center" type="text" name="feh" value="${data.date ? data.date : ''}" autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <select class="form-control-no-border forma" id="forma" style="padding: 1px;text-align:center; width: 60%;" name="formap" required>
                                <option value="CTA-CTE-50900011438">CTA CTE 50900011438</option>
                                <option value="BONO CTA CRUSADA">BONO CTA CRUSADA</option>
                                <option value="BONO EFECTIVO">BONO EFECTIVO</option>
                                <option value="BONO PREMUTA">BONO PREMUTA</option>
                                <option value="EFECTIVO">EFECTIVO</option>
                                <option value="CHEQUE">CHEQUE</option>
                                <option value="BONO">BONO</option>
                                <option value="OTRO">OTRO</option>
                            </select>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>
                ${data.observacion ? `<textarea id="d" name="observacion" rows="2" placeholder="Observación" style="padding: 1px;text-align:center; width: 100%;">${data.observacion}</textarea>`
                    : `<textarea id="d" name="observacion" rows="2" placeholder="Observación" style="padding: 1px;text-align:center; width: 100%;"></textarea>`}
                        
                        </th>
                    </tr></tbody></table></div></div>`);

            $(`#forma option[value='${data.formapg}']`).prop("selected", true);
            $('.montos').mask('#.##$', { reverse: true, selectOnFocus: true });
            $('.forma').on('change', function () {
                if ($(this).val().indexOf('BONO') === 0) {
                    var bono = ID(5);
                    var anc = $(this).parents('tbody');
                    anc.find('.recis').val(bono);
                    $("#Modalimg .imag").val('/img/bonos.png');
                    $("#Modalimg .imag").prop('href', '/img/bonos.png');
                    $("#Modalimg .foto").css('background-image', "url('/img/bonos.png')");
                } else {
                    $("#Modalimg .foto").css('background-image', `url('${data.baucher}')`);
                }
            })
            $(".fec").daterangepicker({
                locale: {
                    'format': 'YYYY-MM-DD',
                    'separator': ' - ',
                    'applyLabel': 'Aplicar',
                    'cancelLabel': 'Cancelar',
                    'fromLabel': 'De',
                    'toLabel': '-',
                    'customRangeLabel': 'Personalizado',
                    'weekLabel': 'S',
                    'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                    'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    'firstDay': 1
                },
                singleDatePicker: true,
                showDropdowns: true,
                minYear: 2017,
                maxYear: parseInt(moment().format('YYYY'), 10),
            });
            $('.imag').on('click', function () {
                const link = document.createElement('a');
                link.href = $(this).attr('href'); //'/bank/Movimientos.xlsm';
                link.download = "recibo" + data.id + ".jpg";
                link.dispatchEvent(new MouseEvent('click'));
            });

            var zoom = 200
            $(".foto").on({
                mousedown: function () {
                    zoom += 50
                    $(this).css("background-size", zoom + "%")
                },
                mouseup: function () {

                },
                mousewheel: function (e) {
                    //console.log(e.deltaX, e.deltaY, e.deltaFactor);
                    if (e.deltaY > 0) { zoom += 50 } else { zoom < 150 ? zoom = 100 : zoom -= 50 }
                    $(this).css("background-size", zoom + "%")
                },
                mousemove: function (e) {
                    let width = this.offsetWidth;
                    let height = this.offsetHeight;
                    let mouseX = e.offsetX;
                    let mouseY = e.offsetY;

                    let bgPosX = (mouseX / width * 100);
                    let bgPosY = (mouseY / height * 100);

                    this.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                },
                mouseenter: function (e) {
                    $(this).css("background-size", zoom + "%")
                },
                mouseleave: function () {
                    $(this).css("background-size", "100%")
                    this.style.backgroundPosition = "center";
                }
            });
            $('#Modalimg').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            });
        }
    })
    estadoscuentas2.on('click', '.no', function () {
        var fila = $(this).parents('tr');
        var data = estadoscuentas2.row(fila).data();
        if (data.id && rol.admin) {
            var mensaje = confirm("¿Seguro deseas eliminar este RECIBO DEL PAGO?");
            if (mensaje) {
                $('#ModalEventos').modal({
                    toggle: true,
                    backdrop: 'static',
                    keyboard: true,
                });
                var datos = { id: data.id };
                $.ajax({
                    type: 'POST',
                    url: '/links/reportes/emili',
                    data: datos,
                    beforeSend: function (xhr) {
                        $('#ModalEventos').modal({
                            backdrop: 'static',
                            keyboard: true,
                            toggle: true
                        });
                    },
                    success: function (data) {
                        if (data) {
                            estadoscuentas2.ajax.reload(null, false);
                            $('#ModalEventos').modal('hide')
                            SMSj('error', 'RECIBO ELIMINADO CORRECTAMENTE')
                        }
                    }
                })
            }
        } else if (data.id) {
            SMSj('error', 'No tienes permiso para ejecutar esta accion')
        } else {
            SMSj('error', 'No existe RECIBO alguno para eliminar')
        }
    });
    /*$('#detalles').click(function () {
        $('#stadocuentasr').hide('slow');
        $('#stadoreportes').hide('slow');
        $('#stadocuentasd').show('slow');
        $('#reports').show('slow');
        estadoscuentas2.columns.adjust().draw();
    })*/
    ///////////////////// Daterangepicker /////////////////// 
    var start = moment().subtract(29, "days").startOf("hour");
    var end = moment().startOf("hour").add(32, "hour");
    $(".fech").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        startDate: start,
        endDate: end,
        ranges: {
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Hoy': [moment().startOf('days'), moment().endOf("days")]
        }
    }, function (start, end, label) {
        maxDateFilter = end;
        minDateFilter = start;
        Fehsi = moment(start).format('ll');
        Fehsf = moment(end).format('ll');
        estadoscuentas.draw();
    });
    /* 
    tableOrden.on('click', 'tr:not(.total)', function () {
        datos = tableOrden.row(this).data(); console.log(datos, datos.status > 1)
    }) */
    var datos
    tableOrden.on('click', '.anular', function () {
        var fila = $(this).parents('tr').prev();
        datos = tableOrden.row(fila).data();
        console.log(datos, fila, 'vamos muy bien samir')

        if (datos.status > 1 && (datos.estado === 10 || datos.estado === 13)) {
            if (confirm("Esta orden posee un pago de comisiones si la anula se le generará un cobro a ese asesor por el monto de la comision ha anular, Seguro deseas continuar con la anulación?")) {
                $('#Anulacion').modal('show');
            } else {
                return false;
            }
        } else {
            $('#Anulacion').modal('show');
            return true;
        }
    })
    $('#enanul').submit(function (e) {
        e.preventDefault();
        datos.causa = $('#causa').val();
        datos.motivo = $('#motivo').val();
        datos.qhacer = $('#qhacer').val();
        $.ajax({
            url: '/links/anular',
            data: datos,
            type: 'POST',
            //async: false,
            beforeSend: function (xhr) {
                $('#Anulacion').modal('hide')
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            success: function (data) {
                if (data.std) {
                    tableOrden.ajax.reload(null, false)
                    SMSj('success', data.msg)
                    data = null
                    $('#ModalEventos').modal('hide')
                } else {
                    tableOrden.ajax.reload(null, false)
                    SMSj('error', data.msg)
                    data = null
                    $('#ModalEventos').modal('hide')
                }
                datos = null;
            }
        });
    });
    $('#Anulacion').on('hidden.bs.modal', function (e) {
        $(this).find('input, textarea, select').val(null);
    })
    var Pago = (id, img, rcb) => {
        if (rcb === 'null' && rol.subadmin) {
            var imagenes = img === null ? '' : img.indexOf(",") > 0 ? img.split(",") : img
            if (Array.isArray(imagenes)) {
                var marg = 100 / (imagenes.length - 1);
                imge = imagenes.length - 1
                //$("#Modalimg img:not(.foto)").remove();
                $("#Modalimg .foto").remove();
                $("#descargaimg .imag").remove();
                imagenes.map((e) => {
                    if (e) {
                        $("#descargaimg").append(`<a class="imag mr-2" href="${e}" target="_blank"><span class="badge badge-dark">Img</span></a>`)
                        $("#Modalimg .fotos").append(
                            `<div class="foto" style="
                        width: ${marg}%;
                        padding-top: calc(100% / (16/9));
                        background-image: url('${e}');
                        background-size: 100%;
                        background-position: center;
                        background-repeat: no-repeat;float: left;">
                        <div class="card">
                        <table class="table table-sm tablarcb"><tbody>
                    <tr class="op">
                        <th> 
                        <input type="hidden" name="img" value="${e}">
                        <input type="hidden" name="id" value="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        <input class="recis text-center" type="text" name="nrecibo" placeholder="Recibo"
                             autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>                     
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign">
                            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <input class="montos text-center" type="text" name="montos"
                             placeholder="Monto" autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                        </td>
                    </tr>
                    <tr class="op">
                        <th>                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <input class="fec text-center" type="text" name="feh" placeholder="Fecha" autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <select class="form-control-no-border forma" style="padding: 1px;text-align:center; width: 60%;" name="formap" required>
                                <option value="CTA-CTE-50900011438">CTA CTE 50900011438</option>
                                <option value="BONO CTA CRUSADA">BONO CTA CRUSADA</option>
                                <option value="BONO EFECTIVO">BONO EFECTIVO</option>
                                <option value="BONO PREMUTA">BONO PREMUTA</option>
                                <option value="EFECTIVO">EFECTIVO</option>
                                <option value="CHEQUE">CHEQUE</option>
                                <option value="OTRO">OTRO</option>
                            </select>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>
                        <textarea id="d" name="observacion" rows="2" placeholder="Observación" style="padding: 1px;text-align:center; width: 100%;"></textarea>
                        </th>
                    </tr></tbody></table></div>
                    </div>`);
                        /*<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
                            </svg>*/
                    }
                })
            } else if (imagenes) {
                imge = 1
                $("#descargaimg").html(`<a class="imag" href="${img}" target="_blank"><span class="badge badge-dark">Img</span></a>`)
                $("#Modalimg .fotos").append(
                    `<div class="foto" style="
                        width: 100%;
                        padding-top: calc(100% / (16/9));
                        background-image: url('${img}');
                        background-size: 100%;
                        background-position: center;
                        background-repeat: no-repeat;float: left;">
                        <div class="card">
                        <table class="table table-sm tablarcb"><tbody>
                    <tr class="op">
                        <th> 
                        <input type="hidden" name="img" value="${img}">
                        <input type="hidden" name="id" value="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                        <input class="recis text-center" type="text" name="nrecibo" placeholder="Recibo"
                             autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>                     
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign">
                            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            <input class="montos text-center" type="text" name="montos"
                             placeholder="Monto" autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                        </td>
                    </tr>
                    <tr class="op">
                        <th>                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <input class="fec text-center" type="text" name="feh" placeholder="Fecha" autocomplete="off" style="padding: 1px; width: 60%;" required>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <select class="form-control-no-border forma" style="padding: 1px;text-align:center; width: 60%;" name="formap" required>
                                <option value="CTA-CTE-50900011438">CTA CTE 50900011438</option>
                                <option value="BONO CTA CRUSADA">BONO CTA CRUSADA</option>
                                <option value="BONO EFECTIVO">BONO EFECTIVO</option>
                                <option value="BONO PREMUTA">BONO PREMUTA</option>
                                <option value="EFECTIVO">EFECTIVO</option>
                                <option value="CHEQUE">CHEQUE</option>
                                <option value="OTRO">OTRO</option>
                            </select>
                        </th>
                    </tr>
                    <tr class="op">
                        <th>
                        <textarea id="d" name="observacion" rows="2" placeholder="Observación" style="padding: 1px;text-align:center; width: 100%;"></textarea>
                        </th>
                    </tr></tbody></table></div>
                    </div>`);
            }
            $('.montos').mask('#.##$', { reverse: true, selectOnFocus: true });
            $('.forma').on('change', function () {
                if ($(this).val().indexOf('BONO') === 0) {
                    var bono = ID(5);
                    var anc = $(this).parents('tbody');
                    anc.find('.recis').val(bono);
                }
            })
            $(".fec").daterangepicker({
                locale: {
                    'format': 'YYYY-MM-DD',
                    'separator': ' - ',
                    'applyLabel': 'Aplicar',
                    'cancelLabel': 'Cancelar',
                    'fromLabel': 'De',
                    'toLabel': '-',
                    'customRangeLabel': 'Personalizado',
                    'weekLabel': 'S',
                    'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                    'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    'firstDay': 1
                },
                singleDatePicker: true,
                showDropdowns: true,
                minYear: 2017,
                maxYear: parseInt(moment().format('YYYY'), 10),
            });
            $('.imag').on('click', function () {
                const link = document.createElement('a');
                link.href = $(this).attr('href'); //'/bank/Movimientos.xlsm';
                link.download = "recibo" + id + ".jpg";
                link.dispatchEvent(new MouseEvent('click'));
            });

            var zoom = 200
            $(".foto").on({
                mousedown: function () {
                    zoom += 50
                    $(this).css("background-size", zoom + "%")
                },
                mouseup: function () {

                },
                mousewheel: function (e) {
                    //console.log(e.deltaX, e.deltaY, e.deltaFactor);
                    if (e.deltaY > 0) { zoom += 50 } else { zoom < 150 ? zoom = 100 : zoom -= 50 }
                    $(this).css("background-size", zoom + "%")
                },
                mousemove: function (e) {
                    let width = this.offsetWidth;
                    let height = this.offsetHeight;
                    let mouseX = e.offsetX;
                    let mouseY = e.offsetY;

                    let bgPosX = (mouseX / width * 100);
                    let bgPosY = (mouseY / height * 100);

                    this.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                },
                mouseenter: function (e) {
                    $(this).css("background-size", zoom + "%")
                },
                mouseleave: function () {
                    $(this).css("background-size", "100%")
                    this.style.backgroundPosition = "center";
                }
            });
            $('#Modalimg').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            });
        }
    }
    $('#grecibos').on('click', function () {
        var datoss = $('#datos input, select, textarea').serialize();
        $.ajax({
            url: '/links/reportes/registrarcb',
            data: datoss,
            type: 'POST',
            beforeSend: function (xhr) {
                $('#Modalimg').modal('hide');
            },
            success: function (data) {
                if (data) {
                    estadoscuentas2.ajax.reload(null, false);
                    SMSj('success', 'Recibos generados exitosamente');
                }
            }
        });
    })
    var Eliminar = (eli) => {
        if (!rol.externo) {
            if (confirm("Seguro deseas eliminar esta separacion?")) {
                //txt = "You pressed OK!";
                var D = { k: eli, h: moment().format('YYYY-MM') };
                $.ajax({
                    url: '/links/reportes/eliminar',
                    data: D,
                    type: 'POST',
                    beforeSend: function (xhr) {
                        $('#ModalEventos').modal({
                            backdrop: 'static',
                            keyboard: true,
                            toggle: true
                        });
                    },
                    success: function (data) {
                        if (data.r) {
                            tableOrden.ajax.reload(null, false)
                            $('#ModalEventos').modal('hide')
                            SMSj('success', data.m);
                        } else if (data.m === 'Codigo enviado') {
                            var Code = prompt("Digite el codigo de autorizacion para realizar la eliminacion de la orden");
                            if (Code) {
                                D.code = Code;
                                $.ajax({
                                    url: '/links/reportes/eliminar',
                                    data: D,
                                    type: 'POST',
                                    success: function (data) {
                                        if (data.r) {
                                            tableOrden.ajax.reload(null, false)
                                            $('#ModalEventos').modal('hide')
                                            SMSj('success', data.m);
                                        } else {
                                            $('#ModalEventos').modal('hide')
                                            SMSj('error', data.m);
                                        }
                                    }
                                });
                            } else {
                                $('#ModalEventos').modal('hide')
                                SMSj('error', 'ERROR DE AUTORIZACION');
                            }
                        } else {
                            $('#ModalEventos').modal('hide')
                            SMSj('error', data.m);
                        }
                    }
                });
            }
        } else {
            SMSj('error', 'No cuentas con los permisos para realizar esta accion');
        }
    }
    var Promesa = (id, aut) => {
        if (rol.subadmin || rol.externo) {
            var D = { k: id, h: aut, f: moment().format('YYYY-MM-DD') };
            $.ajax({
                url: '/links/reportes/estadopromesas',
                data: D,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: true,
                        toggle: true
                    });
                },
                success: function (data) {
                    if (data) {
                        $('#ModalEventos').modal('hide')
                        tableOrden.ajax.reload(null, false);
                        comisiones.ajax.reload(null, false);
                    } else {
                        $('#ModalEventos').modal('hide')
                        tableOrden.ajax.reload(null, false);
                        SMSj('error', 'no es posible cambiar su estado ya que esta comicion fue desembolsada al asesor');
                    }
                }
            });
        }
    }
    var Verificar = (id) => {
        var D = { k: id, h: moment().format('YYYY-MM') };
        $.ajax({
            url: '/links/reportes/verificar',
            data: D,
            type: 'POST',
            beforeSend: function (xhr) {
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            success: function (data) {
                if (data) {
                    tableOrden.ajax.reload(null, false)
                    !rol.externo ? comisiones.ajax.reload(null, false) : '';
                    $('#ModalEventos').modal('hide')
                }
            }
        });
    }
    var RestKupon = (id) => {
        if (rol.subadmin) {
            $.ajax({
                url: '/links/reportes/restkupon',
                data: { k: id },
                type: 'POST',
                beforeSend: function (xhr) {
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: true,
                        toggle: true
                    });
                },
                success: function (data) {
                    if (data) {
                        tableOrden.ajax.reload(null, false)
                        comisiones.ajax.reload(null, false)
                        $('#ModalEventos').modal('hide')
                        SMSj('success', 'Cupon de descuento restablecido correctamente')
                    }
                }
            });
        } else {
            SMSj('error', 'No posees permisos para ejecuutar esta accion')
        }
    }
    var RestOrden = (id) => {
        if (rol.admin) {
            $.ajax({
                url: '/links/reportes/restorden',
                data: { k: id },
                type: 'POST',
                beforeSend: function (xhr) {
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: true,
                        toggle: true
                    });
                },
                success: function (data) {
                    if (data) {
                        tableOrden.ajax.reload(null, false)
                        comisiones.ajax.reload(null, false)
                        $('#ModalEventos').modal('hide')
                        SMSj('success', 'Orden ' + id + ' restablecida correctamente')
                    }
                }
            });
        } else {
            SMSj('error', 'No posees permisos para ejecuutar esta accion')
        }
    }
    var Proyeccion = (id) => {
        if (rol.admin) {
            var D = { k: id, h: moment().format('YYYY-MM') };
            $.ajax({
                url: '/links/reportes/proyeccion',
                data: D,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: true,
                        toggle: true
                    });
                },
                success: function (data) {
                    if (data) {
                        tableOrden.ajax.reload(null, false)
                        comisiones.ajax.reload(null, false)
                        $('#ModalEventos').modal('hide')
                    }
                }
            });
        } else {
            SMSj('error', 'No posees permisos para ejecuutar esta accion')
        }
    }
    var GestComi = (id, asesor) => {
        !rol.externo ?
            $.ajax({
                url: '/links/desendentes',
                data: { id, asesor },
                type: 'POST',
                async: false,
                success: function (data) {
                    if (data) {
                        $('#ModalEventos').modal('hide');
                        tableOrden.ajax.reload(null, false);
                        comisiones.ajax.reload(null, false);
                        SMSj('success', 'Gestion de comisiones generada');
                        data = null
                    }
                }
            }) : '';
    }
    $('#recbo').submit(function (e) {
        e.preventDefault();
        $('#g').val(1);
        $('#ahora').val(moment().format('YYYY-MM-DD HH:mm'));
        var dat = new FormData(this); //$('#recbo').serialize();
        $.ajax({
            type: 'POST',
            url: '/links/recibo',
            data: dat,
            //async: true,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                $('#PagO').modal('hide');
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            success: function (data) {
                if (data.std) {
                    $('#ModalEventos').modal('hide');
                    SMSj('success', data.msj);
                    //table.ajax.reload(null, false)
                } else {
                    $('#ModalEventos').modal('hide');
                    SMSj('error', data.msj)
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    });
    window.preview = function (input) {
        if (input.files && input.files[0]) {
            var marg = 100 / $('#file2')[0].files.length;
            $('#recibos1').html('');
            $('.op').remove();
            $('#montorecibos').val('').hide('slow');
            $(input.files).each(function () {
                var reader = new FileReader();
                reader.readAsDataURL(this);
                reader.onload = function (e) {
                    $('#recibos1').append(
                        //`<img id="img_02" src="${e.target.result}" width="${marg}%" height="100%" alt="As">`
                        `<div class="image" style="
                            width: ${marg}%;
                            padding-top: calc(100% / (16/9));
                            background-image: url('${e.target.result}');
                            background-size: 100%;
                            background-position: center;
                            background-repeat: no-repeat;float: left;"></div>`
                    );
                    $('#trarchivos').after(`
                    <tr class="op">
                        <th>                     
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                        stroke-linejoin="round" class="feather feather-file-text">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <input class="recis" type="text" name="nrecibo" placeholder="Recibo"
                             autocomplete="off" style="padding: 1px; width: 50%;" required>
                        </th>
                        <td>
                            <input class="montos text-center" type="text" name=""
                             placeholder="Monto" autocomplete="off" style="padding: 1px; width: 100%;" required>
                        </td>
                    </tr>`
                    );
                    $('.montos').mask('#.##$', { reverse: true, selectOnFocus: true });
                    $('.montos').on('change', function () {
                        var avl = 0;
                        $('#montorecibos').show('slow')
                        $('.montos').map(function () {
                            s = parseFloat($(this).cleanVal()) || 0
                            avl = avl + s;
                        });
                        $('.montorecibos').html(Moneda(avl))
                        $('#montorecibos').val(avl);
                    })
                    $('.recis').on('change', function () {
                        var avl = '';
                        $('.recis').map(function () {
                            s = $(this).val() ? '~' + $(this).val().replace(/^0+/, '') + '~,' : '';
                            avl += s;
                        });
                        $('#nrbc').val(avl.slice(0, -1));
                    })
                    var zom = 200
                    $(".image").on({
                        mousedown: function () {
                            zom += 50
                            $(this).css("background-size", zom + "%")
                        },
                        mouseup: function () {

                        },
                        mousewheel: function (e) {
                            //console.log(e.deltaX, e.deltaY, e.deltaFactor);
                            if (e.deltaY > 0) { zom += 50 } else { zom < 150 ? zom = 100 : zom -= 50 }
                            $(this).css("background-size", zom + "%")
                        },
                        mousemove: function (e) {
                            let width = this.offsetWidth;
                            let height = this.offsetHeight;
                            let mouseX = e.offsetX;
                            let mouseY = e.offsetY;

                            let bgPosX = (mouseX / width * 100);
                            let bgPosY = (mouseY / height * 100);

                            this.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                        },
                        mouseenter: function (e) {
                            $(this).css("background-size", zom + "%")
                        },
                        mouseleave: function () {
                            $(this).css("background-size", "100%")
                            this.style.backgroundPosition = "center";
                        }
                    });
                }
            });
        }

    }
    if (!rol.externo) {
        var Comi = $('#comi').DataTable({
            lengthChange: false,
            deferRender: true,
            info: true,
            paging: false,
            search: {
                regex: true,
                caseInsensitive: true,
            },
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.childRowImmediate,
                    type: 'none',
                    target: ''
                }
            },
            columnDefs: [
                { targets: -1, visible: false, searchable: true }
                //{ className: 'control', orderable: true, targets: 0 },
                //{ responsivePriority: 1, targets: [8, 11, 15, 16, 17] },
                //{ responsivePriority: 2, targets: [13, -1] }
            ],
            order: [[0, "desc"]],
            language: languag,
            ajax: {
                method: "POST",
                url: "/links/comisiones/nada",
                dataSrc: "data"
            },
            initComplete: function (settings, json, row) {
                $('#comi_filter').hide();
                //$("#comi").find(".row").last().hide();
            },
            columns: [
                { data: "ids" },
                { data: "nam" },
                {
                    data: "fech",
                    className: "nowrap",
                    render: function (data, method, row) {
                        return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                    }
                },
                {
                    data: "monto",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                },
                {
                    data: "porciento",
                    render: function (data, method, row) {
                        return `${(data * 100).toFixed(2)}%` //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                },
                {
                    data: "pagar",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                },
                { data: "concepto" },
                { data: "descp" },
                {
                    data: "stado",
                    render: function (data, method, row) {
                        switch (data) {
                            case 1:
                                return `<span class="badge badge-pill badge-warning" title="Esta comision esta siendo auditadda">Auditando</span>`
                                break;
                            case 4:
                                return `<span class="badge badge-pill badge-dark">Pagada</span>`
                                break;
                            case 6:
                                return `<span class="badge badge-pill badge-danger">Declinada</span>`
                                break;
                            case 3:
                                return `<span class="badge badge-pill badge-info">Pendiente</span>`
                                break;
                            case 15:
                                return `<span class="badge badge-pill badge-warning">Inactiva</span>`
                                break;
                            case 9:
                                return `<span class="badge badge-pill badge-success">Disponible</span>`
                                break;
                            default:
                                return `<span class="badge badge-pill badge-primary">Sin info</span>`
                        }
                    }
                },
                { data: "lt" }
            ],
            rowCallback: function (row, data, index) {
                if (data["stado"] == 3) {
                    $(row).css("background-color", "#00FFFF");
                } else if (data["stado"] == 4) {
                    $(row).css({ "background-color": "#008080", "color": "#FFFFCC" });
                } else if (data["stado"] == 9) {
                    $(row).css("background-color", "#40E0D0");
                } else if (data["stado"] == 15) {
                    $(row).css("background-color", "#FFFFCC");
                } else if (data["stado"] == 1) {
                    $(row).css({ "background-color": "#FEC782", "color": "#FFFFFF" });
                }
            },
            infoCallback: function (settings, start, end, max, total, pre) {
                $('#totalComi').html('Total comisiones generadas ' + total);
                //return false;
            }
        });
        var comisiones = $('#comisiones').DataTable({
            //dom: 'Bfrtip',        
            lengthChange: false,
            lengthMenu: [
                [10, 25, 50, 100, -1],
                ['10 filas', '25 filas', '50 filas', '100 filas', 'Ver todo']
            ],
            /*buttons: [
                {
                    extend: 'pageLength',
                    text: 'Ver',
                    orientation: 'landscape'
                },
                {
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-slack">
                                <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path>
                                <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path>
                                <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path>
                                <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path>
                                <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path>
                                <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path>
                                <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path>
                                <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path></svg>`,
                    attr: {
                        title: 'Generar cuenta de cobro',
                        id: ''
                    },
                    className: 'btn btn-secondary',
                    action: function () {
                        CuentaCobro();
                    }
                },
                {
                    extend: 'collection',
                    text: 'Stds',
                    orientation: 'landscape',
                    buttons: [
                        {
                            text: 'COPIAR',
                            extend: 'copy'
                        },
                        {
                            text: `PENDIENTES`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD2(17, 'Pendiente');
                            }
                        },
                        {
                            text: `PAGADAS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD2(17, 'Pagada');
                            }
                        },
                        {
                            text: `DISPONIBLES`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD2(17, 'Disponible');
                            }
                        },
                        {
                            text: `ANULADOS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD2(17, 'Declinada');
                            }
                        },
                        {
                            text: `TODOS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD2('', '');
                            }
                        }
                    ]
                }
            ],*/
            deferRender: true,
            paging: true,
            search: {
                regex: true,
                caseInsensitive: true,
            },
            responsive: {
                details: {
                    type: 'column'
                }
            },
            columnDefs: [
                { className: 'control', orderable: true, targets: 0 },
                { responsivePriority: 1, targets: [8, 11, 15, 16, 17] },
                { responsivePriority: 2, targets: [13, -1] }
            ],
            order: [[1, "desc"]],
            language: languag,
            ajax: {
                method: "POST",
                url: "/links/reportes/comision",
                dataSrc: "data"
            },
            initComplete: function (settings, json, row) {
                //$('#collapse4').collapse('toggle');
                //$('#ModalEventos').modal('hide');
                $('#comisiones_filter').hide();
            },
            columns: [
                {
                    data: null,
                    defaultContent: ''
                },
                { data: "ids" },
                { data: "nam" },
                {
                    data: "fech",
                    render: function (data, method, row) {
                        return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                    }
                },
                { data: "fullname" },
                { data: "nombre" },
                {
                    data: "total",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                },
                {
                    data: "monto",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                },
                {
                    data: "porciento",
                    render: function (data, method, row) {
                        return `${(data * 100).toFixed(2)}%` //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                }, {
                    data: "retefuente",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                }, {
                    data: "reteica",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                }, {
                    data: "pagar",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                    }
                },
                { data: "concepto" },
                { data: "descp" },
                { data: "proyect" },
                { data: "mz" },
                { data: "n" },
                {
                    data: "stado",
                    render: function (data, method, row) {
                        switch (data) {
                            case 1:
                                return `<span class="badge badge-pill badge-warning" title="Esta comision esta siendo auditadda">Auditando</span>`
                                break;
                            case 4:
                                return `<span class="badge badge-pill badge-dark">Pagada</span>`
                                break;
                            case 6:
                                return `<span class="badge badge-pill badge-danger">Declinada</span>`
                                break;
                            case 3:
                                return `<span class="badge badge-pill badge-info">Pendiente</span>`
                                break;
                            case 15:
                                return `<span class="badge badge-pill badge-warning">Inactiva</span>`
                                break;
                            case 9:
                                return `<span class="badge badge-pill badge-success">Disponible</span>`
                                break;
                            default:
                                return `<span class="badge badge-pill badge-primary">Sin info</span>`
                        }
                    }
                },
                {
                    className: 't',
                    data: "ids",
                    render: function (data, method, row) {
                        return rol.admin ? `
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Accion</a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" onclick="EstadoCC(${data}, 9, ${row.stado})">Habilitar</a>
                            <a class="dropdown-item" onclick="EstadoCC(${data}, 15, ${row.stado})">Inhabilitar</a>
                            <a class="dropdown-item" onclick="EstadoCC(${data}, 4, ${row.stado})">Cancelada</a>
                        </div>` : ''
                    }
                }
            ],
            rowCallback: function (row, data, index) {
                if (data["stado"] == 3) {
                    $(row).css("background-color", "#00FFFF");
                } else if (data["stado"] == 4) {
                    $(row).css({ "background-color": "#008080", "color": "#FFFFCC" });
                } else if (data["stado"] == 9) {
                    $(row).css("background-color", "#40E0D0");
                } else if (data["stado"] == 15) {
                    $(row).css("background-color", "#FFFFCC");
                } else if (data["stado"] == 1) {
                    $(row).css({ "background-color": "#FEC782", "color": "#FFFFFF" });
                }
            }
        });
        var aasesor = null, iid = null;
        comisiones.on('click', 'td:not(.control, .t)', function () {
            var fila = $(this).parents('tr');
            var data = comisiones.row(fila).data(); //console.log(data)
            if (!aasesor && data.stado === 9) {
                aasesor = data.nam; console.log(data.bank)
                iid = data.ids;
                fila.toggleClass('selected');
            } else if (iid === data.ids) {
                $(fila).removeClass('selected');
                aasesor = null;
                iid = null;
            } else if (aasesor !== data.nam && aasesor) {
                SMSj('error', 'No puede seleccionar este pago ya que no pertenece al asesor')
            } else {
                data.stado === 9 ? fila.toggleClass('selected') : SMSj('error', 'No puede seleccionar este item ya que no se encuentra disponible');
            }
        });
        var EstadoCC = (id, std, actualstd) => {
            if ((actualstd === 4 && rol.admin) || actualstd !== 4) {
                $.ajax({
                    type: 'POST',
                    url: '/links/reportes/std',
                    data: { ids: id, std },
                    beforeSend: function (xhr) {
                        $('#Modalimg').modal('hide');
                        $('#ModalEventos').modal({
                            backdrop: 'static',
                            keyboard: true,
                            toggle: true
                        });
                    },
                    success: function (data) {
                        if (data) {
                            $('#ModalEventos').modal('hide');
                            SMSj('success', `Solicitud procesada correctamente`);
                            comisiones.ajax.reload(null, false)
                        } else {
                            $('#ModalEventos').modal('hide');
                            SMSj('error', `Solicitud no pudo ser procesada correctamente`)
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            } else {
                SMSj('error', `Solicitud no pude ser procesada, no cuentas con los permisos`)
            }
        }
        var CuentaCobro = () => {
            var NOMBRE = '', EMAIL = '', MOVIL = '', RG = '', CC = '',
                ID = '', BANCO = '', TCTA = '', NCTA = '', TOTAL = 0,
                MONTO = 0, PAGAR = 0, RETEFUENTE = 0, RETEICA = 0,
                cuerpo = [], Ids = [];
    
            var enviarCuentaCobro = () => {
                var fd = new FormData();
                var doc = new jsPDF('p', 'mm', 'a4');
                var img2 = new Image();
                var img = new Image();
                var totalPagesExp = '{total_pages_count_string}'
                //doc.addPage("a3"); 
                img.src = '/img/avatars/avatar.png'
                img2.src = `https://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=BEGIN%3AVCARD%0AVERSION%3A2.1%0AFN%3ARED+ELITE%0AN%3AELITE%3BRED%0ATITLE%3ABIENES+RAICES%0ATEL%3BCELL%3A3007753983%0ATEL%3BHOME%3BVOICE%3A3012673944%0AEMAIL%3BHOME%3BINTERNET%3Aadmin%40redelite.co%0AEMAIL%3BWORK%3BINTERNET%3Ainfo%40redelite.co%0AURL%3Ahttps%3A%2F%2Fredelite.co%0AADR%3A%3B%3BLA+GRANJA%3BTURBACO%3B%3B131001%3BCOLOMBIA%0AORG%3AGRUPO+ELITE+FINCA+RAIZ+S.A.S.%0AEND%3AVCARD%0A&qzone=1&margin=0&size=400x400&ecc=L`
                cuerpo.push({
                    concepto: {
                        content: 'TOTALES:', colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    total: {
                        content: '$' + Moneda(Math.round(TOTAL)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    },
                    monto: {
                        content: '$' + Moneda(Math.round(MONTO)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    }
                })
                cuerpo.push({
                    id: {
                        content: '', colSpan: 11, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    }
                })
                cuerpo.push({
                    id: {
                        content: 'TOTAL COMISION:', colSpan: 3, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                        }
                    },
                    descp: {
                        content: '$' + Moneda(Math.round(MONTO)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                        }
                    },
                    benefactor: {
                        content: `${NumeroALetras(MONTO)} MCT********`, colSpan: 6, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                        }
                    }
                })
                cuerpo.push({
                    id: {
                        content: 'RETEFUENTE:', colSpan: 3, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                        }
                    },
                    descp: {
                        content: '-$' + Moneda(Math.round(RETEFUENTE)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                        }
                    },
                    benefactor: {
                        content: `${NumeroALetras(RETEFUENTE)} MCT********`, colSpan: 6, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                        }
                    }
                })
                cuerpo.push({
                    id: {
                        content: 'RETEICA:', colSpan: 3, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                        }
                    },
                    descp: {
                        content: '-$' + Moneda(Math.round(RETEICA)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                        }
                    },
                    benefactor: {
                        content: `${NumeroALetras(RETEICA)} MCT********`, colSpan: 6, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                        }
                    }
                })
                cuerpo.push({
                    id: {
                        content: 'PAGAR:', colSpan: 3, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC"
                        }
                    },
                    descp: {
                        content: '$' + Moneda(Math.round(PAGAR)), colSpan: 1, styles: {
                            halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 8, //fillColor: "#FFFFCC" `${NumeroALetras(totl)} MCT********`
                        }
                    },
                    benefactor: {
                        content: `${NumeroALetras(PAGAR)} MCT********`, colSpan: 6, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                        }
                    }
                })
                cuerpo.push({
                    id: {
                        content: '', colSpan: 11, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                        }
                    }
                })
                cuerpo.push({
                    id: {
                        content: `Depositar el DINERO a la siguieinte CUENTA ${BANCO.toUpperCase()} ${TCTA} ${NCTA}`, colSpan: 11, styles: {
                            halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                            fontStyle: 'bolditalic', fontSize: 7, //fillColor: "#FFFFCC"
                        }
                    }
                })
                /////////////////////////////////////////* PDF *//////////////////////////////////////////////
                fd.append('total', PAGAR)
                fd.append('descuentos', RETEFUENTE + RETEICA)
                fd.append('solicitudes', Ids)
                fd.append('usuario', RG)
                fd.append('fechas', moment().format('YYYY-MM-DD HH:mm'))
                /*fd.append('acumulado', acumulad);
                doc.output('dataurlnewwindow')*/
                $.ajax({
                    type: 'POST',
                    url: '/links/solicitudes/cuentacobro',
                    data: fd,
                    processData: false,
                    contentType: false,
                    beforeSend: function (xhr) {
                        $('#Modalimg').modal('hide');
                        $('#ModalEventos').modal({
                            backdrop: 'static',
                            keyboard: false,
                            show: true
                        });
                    },
                    success: function (dat) {
                        if (dat) {
                            doc.autoTable({
                                head: [
                                    {
                                        id: 'ID', fecha: 'Fecha', concepto: 'Concepto', descp: 'Descp', porciento: '%',
                                        benefactor: 'Benefactor', proyecto: 'Proyecto', mz: 'Mz', lt: 'Lt', total: 'Total', monto: 'Monto'
                                    },
                                ],
                                body: cuerpo,
                                didDrawPage: function (data) {
                                    // Header
                                    doc.setTextColor(0)
                                    doc.setFontStyle('normal')
                                    if (img) {
                                        doc.addImage(img, 'png', data.settings.margin.left, 10, 15, 20)
                                        doc.addImage(img2, 'png', data.settings.margin.left + 130, 40, 45, 45)
                                    }
                                    doc.setFontSize(15)
                                    doc.text('CUENTA DE COBRO ' + dat.id, 105, 25, null, null, "center");
                                    doc.setFontSize(9)
                                    doc.text(moment().format('YYYY-MM-DD HH:mm'), data.settings.margin.left + 155, 38)
                                    doc.setFontSize(12)
                                    doc.text('GRUPO ELITE FINCA RAÍZ SAS', data.settings.margin.left, 45)
                                    doc.setFontSize(10)
                                    doc.text('Nit: 901311748-3', data.settings.margin.left, 50)
                                    doc.setFontSize(8)
                                    doc.text(`Domicilio: Mz 'L' Lt 17 Urb. La granja Turbaco, Bolivar`, data.settings.margin.left, 53)
    
                                    doc.setFontSize(10)
                                    doc.text('DEBE A:', data.settings.margin.left, 63)
                                    doc.setFontSize(12)
                                    doc.text(NOMBRE, data.settings.margin.left, 70)
                                    doc.setFontSize(10)
                                    doc.text('CC: ' + CC, data.settings.margin.left, 75)
                                    doc.setFontSize(10)
                                    doc.text(MOVIL, data.settings.margin.left, 78)
                                    doc.setFontSize(8)
                                    doc.text(EMAIL, data.settings.margin.left, 81)
    
                                    doc.setFontSize(9)
                                    doc.text('A continuacion se detalla el concepto del total adeudado', data.settings.margin.left, 90)
    
    
                                    // Footer
                                    var str = 'Page ' + doc.internal.getNumberOfPages()
                                    // Total page number plugin only available in jspdf v1.0+
                                    if (typeof doc.putTotalPages === 'function') {
                                        str = str + ' of ' + totalPagesExp
                                    }
                                    doc.setFontSize(8)
    
                                    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                                    var pageSize = doc.internal.pageSize
                                    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                                    doc.text(/*str*/ `Atententamente:`, data.settings.margin.left, pageHeight - 45)
                                    doc.text(/*str*/ NOMBRE, data.settings.margin.left, pageHeight - 40)
                                    doc.text(/*str*/ `Por medio de la presente certifico que mis ingresos son por honorarios, los cuales se encuentran descritos como Rentas de Trabajo (Articulo 103\nE.T.), ademas para realizar mis labores profecionales no tengo subcontratados a mas de 2 personas (Paragrafo 2 del articlo 383 E.T.). Por tanto\nsolicito se me aplique la misma tasa de retencion de los asalariados estiplada en la tabla de retencion en la fuente contenida en el articulo 383 del E.T.`, data.settings.margin.left, pageHeight - 27)
                                },
                                margin: { top: 95 },
                            })
                            // Total page number plugin only available in jspdf v1.0+
                            if (typeof doc.putTotalPages === 'function') {
                                doc.putTotalPages(totalPagesExp)
                            }
                            doc.output('save', 'CUENTA DE COBRO ' + dat.id + '.pdf')
                            var blob = doc.output('blob')
                            fd.append('pdf', blob)
                            fd.append('ID', dat.id)
                            $.ajax({
                                type: 'POST',
                                url: '/links/solicitudes/cuentacobro',
                                data: fd,
                                processData: false,
                                contentType: false,
                                success: function (data) {
                                    $('#ModalEventos').modal('hide');
                                    SMSj('success', `Solicitud procesada correctamente`);
                                    comisiones.ajax.reload(null, false)
                                },
                                error: function (data) {
                                    console.log(data);
                                }
                            });
    
                        } else {
                            $('#ModalEventos').modal('hide');
                            SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`)
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            };
            comisiones
                .rows('.selected')
                .data()
                .filter(function (value, index) {
                    if (index < 1) {
                        ID = value.i;
                        RG = value.idu;
                        CC = value.docu;
                        NOMBRE = value.nam;
                        EMAIL = value.mail;
                        MOVIL = value.clu;
                        BANCO = value.bank;
                        TCTA = value.tipocta;
                        NCTA = value.numerocuenta;
                    }
                    TOTAL += value.total;
                    MONTO += parseFloat(value.monto);
                    PAGAR += value.pagar;
                    RETEFUENTE += value.retefuente;
                    RETEICA += value.reteica;
                    Ids.push(value.ids);
                    cuerpo.push({
                        id: {
                            content: value.ids, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        fecha: {
                            content: value.fech, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        concepto: {
                            content: value.concepto, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        descp: {
                            content: value.descp, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        porciento: {
                            content: `%${(value.porciento * 100).toFixed(2)}`, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        benefactor: {
                            content: value.fullname, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        proyecto: {
                            content: value.proyect, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        mz: {
                            content: value.mz, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        lt: {
                            content: value.n, colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'auto', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        total: {
                            content: '$' + Moneda(Math.round(value.total)), colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        },
                        monto: {
                            content: '$' + Moneda(Math.round(value.monto)), colSpan: 1, styles: {
                                halign: 'left', cellWidth: 'wrap', textColor: '#7f8c8d',
                                fontStyle: 'bolditalic', fontSize: 6, //fillColor: "#FFFFCC"
                            }
                        }
                    })
                });
            if (BANCO) {
                enviarCuentaCobro();
            } else if (!TOTAL) {
                SMSj('error', 'Debe seleccionar al menos una comicion, para generar una cuenta de cobro');
                return false;
            } else {
                $('#idbank').val(ID)
                $('#BANK').modal({
                    backdrop: 'static',
                    keyboard: false,
                    toggle: true
                });
            }
            $('#bank').submit((e) => {
                e.preventDefault();
                var datos = $('#bank').serialize();
                $.ajax({
                    type: 'POST',
                    url: '/links/reportes/bank',
                    data: datos,
                    beforeSend: (x) => {
                        $('#BANK').modal('hide');
                        $('#ModalEventos').modal({
                            backdrop: 'static',
                            keyboard: false,
                            show: true
                        });
                    },
                    success: (data) => {
                        if (data) {
                            BANCO = data.banco;
                            TCTA = data.cta;
                            NCTA = data.numero;
                            SMSj('success', 'Cuenta Bancaria registrada correctamente');
                            enviarCuentaCobro();
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            })
        }
    }
    $('#min, #max').on('keyup', function () {
        var col = $(this).attr('id') === 'min' ? 3 : 4;
        var col2 = $(this).attr('id') === 'min' ? 15 : 16;
        var buscar = this.value ? "^" + this.value + "$" : '';
        tableOrden
            .columns(col)
            .search(buscar, true, false, true)
            .draw();
        comisiones
            .columns(col2)
            .search(buscar, true, false, true)
            .draw();
    });
    $('#collapse').on('shown.bs.collapse', function () {
        tableOrden.columns.adjust().responsive.recalc();
    });
    $('#collapse2').on('shown.bs.collapse', function () {
        estadoscuentas2.columns.adjust().responsive.recalc();
    });
    $('#collapse3').on('shown.bs.collapse', function () {
        estadoscuentas.columns.adjust().responsive.recalc();
    });
    $('#collapse4').on('shown.bs.collapse', function () {
        comisiones.columns.adjust().responsive.recalc();
    });
}
/////////////////////////////////* EDITAR REPORTES */////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/editordn/${window.location.pathname.split('/')[3]}` && !rol.externo) {
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[6]).getTime();
            }
            if (minDateFilter && !isNaN(minDateFilter)) {
                if (aData._date < minDateFilter) {
                    return false;
                }
            }
            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (aData._date > maxDateFilter) {
                    return false;
                }
            }
            return true;
        }
    );
    var Montos = parseFloat($('#Montos').val());
    var Pagos = parseFloat($('#Pagos').val());
    var vrmt2 = parseFloat($('#vrmt2').val());
    var mtro2 = parseFloat($('#mtro2').val());
    var iniciar = parseFloat($('#iniciar').val());
    var separar = parseFloat($('#separar').val());
    var descuento = parseFloat($('#descuento').val());
    var extran = parseFloat($('#extran').val());
    var ncal = parseFloat($('#ncal').val());
    var financia = parseFloat($('#financia').val());
    var valor = vrmt2 * mtro2
    var status = $('#status').val();
    var kupon = $('#kupon').val();
    var cuota = $('#cuota').val();
    var pin = $('#pin').val();
    pin = pin === 'NO' || !pin ? 0 : pin;
    var OrdnSepr = $('#ID-Sep').val();
    var prodct = $('#prodct').val() || 0;
    var ecesr = $('#ecesr').val() || 0;
    var c1 = $('#clent1').val() || 0;
    var c2 = $('#clent2').val() || 0;
    var c3 = $('#clent3').val() || 0;
    var c4 = $('#clent4').val() || 0;
    var ya = moment(new Date()).format('YYYY-MM-DD');
    var R = true, T = true, eliminar = '';
    $('#ModalEventos').modal({
        toggle: true,
        backdrop: 'static',
        keyboard: true,
    });
    $(document).ready(function () {
        var bono = 0;
        $(".select2").each(function () {
            var texto = $(this).attr('id') === 'clientes' ? "Seleccion de Clientes" : "Selecciona un Producto";
            $(this)
                .wrap("<div class=\"position-relative\"></div>")
                .select2({
                    placeholder: texto,
                    dropdownParent: $(this).parent(),
                    maximumSelectionLength: 4,
                    allowClear: true
                });
        });
        $('#proyectos').change(function () {
            var pr = prodct == $(this).val() ? true : false;
            if (pr) {
                $('#otro').val(null);
                var ini = iniciar * valor / 100;
                $('#mtr2').val(mtro2);
                $('#vmtr2').val(Moneda(Math.round(vrmt2)));
                $('#inicial').val(Moneda(Math.round(ini)));
                $('#total').val(Moneda(Math.round(valor)));
                $(`#xcntag option[value='${iniciar}']`).attr("selected", true);
                $(`#promesa option[value='${status}']`).prop("selected", true);
                $('#ini').val(Moneda(Math.round(ini)));
                $('#fnc').val(Moneda(Math.round(valor - ini)));
                if (pin) {
                    $('.quitar').show('slow');
                    var precio = valor;
                    var ahorr = Math.round(valor * descuento / 100)
                    $('#idbono').val(kupon);
                    $('#cupon').val(pin);
                    $('#ahorro').val(Moneda(ahorr));
                    precio = precio - ahorr;
                    inicial = precio * iniciar / 100;
                    $('#cuponx100to').val(descuento + '%');
                    $('#desinicial').val(Moneda(Math.round(inicial)))
                    $('#destotal').val(Moneda(Math.round(precio)));
                    $('#ini').val(Moneda(Math.round(inicial)))
                    $('#fnc').val(Moneda(Math.round(precio - inicial)));
                }
                $('#ModalEventos').modal('hide')
                if (T) {
                    CONT(separar);
                    T = false;
                } else {
                    FINANCIAR(1, '', $('#Separar').val().replace(/\./g, ''));
                }
            } else {
                var link = '/links/cartera/' + $(this).val();
                $.ajax({
                    type: 'POST',
                    url: link,
                    beforeSend: function (xhr) {
                        //tabledit.state.save();
                    },
                    success: function (data) {
                        if (data) {
                            if (data.valor >= valor) {
                                $('#otro').val('1');
                                var porg = data.inicial * 100 / data.valor;
                                $('#mtr2').val(data.mtr2);
                                $('#vmtr2').val(Moneda(Math.round(data.mtr)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                                $('#inicial').val(Moneda(Math.round(data.inicial)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                                $('#total').val(Moneda(Math.round(data.valor)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                                $(`#xcntag option[value='${porg}']`).attr("selected", true);
                                $('#ini').val(Moneda(Math.round(data.inicial)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                                $('#fnc').val(Moneda(Math.round(data.valor - data.inicial)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                                if (pin) {
                                    var precio = data.valor;
                                    var ahorr = Math.round(data.valor * descuento / 100)
                                    $('#idbono').val(kupon);
                                    $('#cupon').val(pin);
                                    $('#ahorro').val(Moneda(ahorr));
                                    precio = precio - ahorr;
                                    inicial = precio * iniciar / 100;
                                    $('#cuponx100to').val(descuento + '%');
                                    $('#desinicial').val(Moneda(Math.round(inicial)))
                                    $('#destotal').val(Moneda(Math.round(precio)));
                                    $('#ini').val(Moneda(Math.round(inicial)))
                                    $('#fnc').val(Moneda(Math.round(precio - inicial)));
                                } else {
                                    $('#idbono').val('');
                                    $('#cupon').val('');
                                    $('#ahorro').val('');
                                    $('#cuponx100to').val('');
                                    $('#desinicial').val('')
                                    $('#destotal').val('');
                                }
                                FINANCIAR(1, '', $('#Separar').val().replace(/\./g, ''));
                            } else {
                                SMSj('error', 'No es posible cambiar el producto por uno de menor valor');
                                proyectos.val(prodct).trigger('change');
                            }
                        }
                    }
                })
            }
        })
        $('#financiacion-btn').click(function () {
            if (eliminar) {
                SMSj('info', 'No es posible agregar cuotas despues de haber eliminado una, actualiza el modulo y agrega las cuotas luego si podras eliminar las cuotas que desees');
            } else {
                var c = 1;
                crearcartera
                    .rows()
                    .data()
                    .filter((x, c) => {
                        return $(x[4]).val() === 'FINANCIACION';
                    }).map((x, j) => {
                        c = j + 2;
                    })
                $('#financiacion').val(c);
                if ($('#Separar').val()) {
                    FINANCIAR('FINANCIACION', c, parseFloat($('#Separar').val().replace(/\./g, '')))
                } else {
                    FINANCIAR('FINANCIACION', c, 0)
                }
            }
        })
        $('#inicialcuotas-btn').click(function () {
            if (eliminar) {
                SMSj('info', 'No es posible agregar cuotas despues de haber eliminado una, actualiza el modulo y agrega las cuotas que desees primero luego si podras eliminar las cuotas que desees');
            } else {
                var c = 1;
                crearcartera
                    .rows()
                    .data()
                    .filter((x, c) => {
                        return $(x[4]).val() === 'INICIAL';
                    }).map((x, j) => {
                        c = j + 2;
                    })
                $('#inicialcuotas').val(c)
                if ($('#Separar').val()) {
                    FINANCIAR('INICIAL', c, parseFloat($('#Separar').val().replace(/\./g, '')))
                } else {
                    FINANCIAR('INICIAL', c, 0);
                }
            }
        })
        $('#cupon').change(function () {
            if ($(this).val() !== bono && $(this).val()) {
                $.ajax({
                    url: '/links/bono/' + $(this).val(),
                    type: 'GET',
                    async: false,
                    success: function (data) {
                        if (data.length) {
                            var fecha = moment(data[0].fecha).add(59, 'days').endOf("days");
                            if (data[0].producto != null) {
                                SMSj('error', 'Este cupon ya le fue asignado a un producto. Para mas informacion comuniquese con el asesor encargado');
                                $(this).val('')
                            } else if (fecha < new Date()) {
                                SMSj('error', 'Este cupon de descuento ya ha expirado. Para mas informacion comuniquese con el asesor encargado');
                                $(this).val('')
                            } else if (data[0].estado != 9) {
                                SMSj('error', 'Este cupon aun no ha sido autorizado por administración. espere la autorizacion del area encargada');
                                $(this).val('') //L0X66
                            } else {
                                var precio = parseFloat($('#total').cleanVal());
                                var porcentage = parseFloat($('#xcntag').val());
                                var ahorr = Math.round(precio * data[0].descuento / 100)
                                $('#idbono').val(data[0].id);
                                $('#ahorro').val(Moneda(ahorr));
                                precio = precio - ahorr;
                                inicial = precio * porcentage / 100;
                                $('#cuponx100to').val(data[0].descuento + '%');
                                $('#desinicial').val(Moneda(Math.round(inicial)))
                                $('#destotal').val(Moneda(Math.round(precio)));
                                $('#ini').val(Moneda(Math.round(inicial)))
                                $('#fnc').val(Moneda(Math.round(precio - inicial)));
                                if ($('#Separar').val()) {
                                    CONT(parseFloat($('#Separar').val().replace(/\./g, '')), 1);
                                } else {
                                    CONT(0, 1);
                                }
                            }
                            bono = data[0].pin;
                        } else {
                            SMSj('error', 'Debe digitar un N° de bono valido. Comuniquese con uno de nuestros asesores encargado')
                        }
                    }
                });
            } else {
                SMSj('error', 'Cupon de decuento invalido. Comuniquese con uno de nuestros asesores encargado')
                bono !== 0 ? $(this).val(bono) : '';
            }
        })
        $('#xcntag').change(function () {
            var porcntg = $(this).val();
            var total = $('#total').val().replace(/\./g, '');
            var inicl = total * porcntg / 100;
            $('#inicial').val(Moneda(Math.round(inicl)));
            var totaldesc = $('#destotal').val().replace(/\./g, '');
            if (totaldesc) {
                inicl = totaldesc * porcntg / 100;
                total = totaldesc;
                $('#desinicial').val(Moneda(Math.round(inicl)));
            }

            $('#ini').val(Moneda(Math.round(inicl)));
            $('#fnc').val(Moneda(Math.round(total - inicl)));
            if ($('#Separar').val()) {
                CONT(parseFloat($('#Separar').val().replace(/\./g, '')), 1)
            } else {
                CONT(0, 1)
            }
        })
        $('#vmtr2').change(function () {
            var vmtr = $(this).val().replace(/\./g, '');
            var mtr = $('#mtr2').val();
            var porcntg = $('#xcntag').val();
            var total = vmtr * mtr;
            var inicl = total * porcntg / 100;

            $('#total').val(Moneda(Math.round(total)));
            $('#inicial').val(Moneda(Math.round(inicl)));
            if (pin) {
                var ahorr = Math.round(total * descuento / 100);
                $('#ahorro').val(Moneda(ahorr));
                total = total - ahorr;
                inicl = total * porcntg / 100;
                $('#destotal').val(Moneda(Math.round(total)));
                $('#desinicial').val(Moneda(Math.round(inicl)));
                //.mask('#.##$', { reverse: true, selectOnFocus: true });
            }
            $('#ini').val(Moneda(Math.round(inicl)))
            $('#fnc').val(Moneda(Math.round(total - inicl)))
            if ($('#Separar').val()) {
                CONT(parseFloat($('#Separar').val().replace(/\./g, '')), 1)
            } else {
                CONT(0, 1)
            }
        })
        $('#cuadro2').submit(function (e) {
            var asesors = $('#asesores').val();
            var clients = $('#clientes').val();
            if (asesors == 0 || clients == 0) {
                e.preventDefault();
                SMSj('error', 'Debe seleccionar un CLIENTE o ASESOR');
                return false;
            }
            if (!R) { e.preventDefault(); return false; }
            $('#ModalEventos').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            });
            $('#ahora').val(moment().format('YYYY-MM-DD HH:mm'));
            $('#cuadro2').find('input, select').prop('disabled', false);
        })
    })
    var proyectos = $('#proyectos');
    var asesores = $('#asesores');
    var clientes = $('#clientes');
    var realcuotai = 0;
    var realcuotaf = 0;
    var cont = 0, cuota = 0;
    $.ajax({
        type: 'POST',
        url: '/links/prodlotes/' + OrdnSepr
    }).then(function (data) {
        var proyecto = null;
        var parent = null;
        var option = null;

        var f = data.orden.map((x, v) => {
            return [
                '',
                `<input class="text-center id" type="text" name="id" style="width: 100%;" value="${x.id}" disabled>`,
                `<input class="text-center fecha" type="text" name="fecha" style="width: 100%;" value="${x.fechs}" required>`,
                `<input class="text-center n" type="text" name="n" style="width: 100%;" value="${x.ncuota}" required>`,
                `<input class="text-center tipo" type="hidden" name="tipo" style="width: 100%;" value="${x.tipo}">`,
                `<input class="text-center cuota" type="text" name="cuota" style="width: 100%;"  ${!v ? 'id="Separar"' : ''} 
                data-mask="000.000.000" data-mask-reverse="true" data-mask-selectonfocus="true" value="${Moneda(x.cuota)}" required>`,
                `<input class="text-center rcuota" type="text" name="rcuota" style="width: 100%;" value="${x.proyeccion ? Moneda(x.proyeccion) : Moneda(x.cuota)}" disabled>`,
                `<select size="1" class="text-center std" name="std" disabled>
                <option value="3" selected="selected">Pendiente</option>
                <option value="13">Pagada</option>
                </select>`,
                `${x.tipo !== 'SEPARACION' ? '<a>' : ''}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>${x.tipo !== 'SEPARACION' ? '</a >' : ''}`
            ]
        });
        $('#inicialcuotas').val(ncal);
        $('#financiacion').val(financia);
        crearcartera.rows.add(f).draw(false);
        $('#Separar').val(Moneda(separar));


        data.productos.map((x, v) => {
            if (x.proyect !== proyecto) {
                parent = document.createElement("optgroup");
                parent.setAttribute("label", x.proyect);
                proyectos.append(parent)
                proyecto = x.proyect;
            }
            var pd = prodct == x.id ? true : false;
            option = new Option(`${x.proyect}  MZ ${x.mz} LT ${x.n}`, x.id, pd, pd);
            parent.append(option)
        });
        proyectos.val(prodct).trigger('change');
        data.asesores.map((x, v) => {
            var pd = ecesr == x.id ? true : false;
            asesores.append(new Option(`${x.fullname}  CC ${x.document}`, x.id, pd, pd))
        });
        asesores.val(ecesr).trigger('change');
        data.clientes.map((x, v) => {
            var pd = c1 == x.idc ? true : false;
            clientes.append(new Option(`${x.nombre}  CC ${x.documento}`, x.idc, pd, pd))
        });
        clientes.val([c1, c2, c3, c4]).trigger('change');

        CONT(separar)
    });

    var crearcartera = $('#crearcartera').DataTable({
        searching: false,
        language: languag2,
        lengthMenu: [-1],
        deferRender: true,
        info: false,
        autoWidth: false,
        paging: false,
        order: [[1, 'asc'], [2, 'asc']],
        responsive: true,
        columnDefs: [
            { className: 'control', orderable: true, targets: 0 },
            //{ "visible": false, "targets": 3 }
            /*{ responsivePriority: 1, targets: [1, 2, 3, 4, 7] },
            { responsivePriority: 2, targets: 5 },
            { responsivePriority: 10003, targets: 6 },
            { responsivePriority: 10002, targets: 8 }*/
        ],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(4, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="8">' + $(group).val() || group + '</td></tr>'
                    );

                    last = group;
                }
            });
        },
        initComplete: function (settings, json) {
            $('#agrmz').find('input').val('no');
        },
        createdRow: function (row, data, dataIndex) {
            /*console.log(data, row)
            if (!data[2]) {
                $(row).find('td').attr('colspan', '8');
            }*/
        }
    });
    crearcartera.on('click', 'tr a', function () {
        var fila = $(this).parents('tr');
        var tipo = fila.find(`.tipo`).val();
        var id = fila.find(`.id`).val();
        crearcartera.row(fila).remove().draw(false);
        var cuotai = $('#inicialcuotas').val() - 1;
        var cuotaf = $('#financiacion').val() - 1;
        eliminar += `& acion=eliminar & idcuota=${id}`;
        tipo === 'INICIAL' ? $('#inicialcuotas').val(cuotai) : $('#financiacion').val(cuotaf);
        if ($('#Separar').val()) {
            CONT(parseFloat($('#Separar').val().replace(/\./g, '')), 1)
        } else {
            CONT(0, 1)
        }
    });
    crearcartera.on('click', '.tabl .cuota', function () {
        $(this).mask('#.##$', { reverse: true, selectOnFocus: true });
    });
    crearcartera.on('click', '.quitar', function () {
        if ($(this).html() === 'Quitar Bono') {
            var inc = parseFloat($('#inicial').val().replace(/\./g, ''));
            var to = parseFloat($('#total').val().replace(/\./g, ''));
            $('#idbono').val('');
            $('#cupon').val('');
            $('#ahorro').val('');
            $('#cuponx100to').val('');
            $('#desinicial').val('')
            $('#destotal').val('');
            $('#ini').val($('#inicial').val())
            $('#fnc').val(Moneda(Math.round(to - inc)));
            $(this).html('Restablecer Bono');
            if ($('#Separar').val()) {
                CONT(parseFloat($('#Separar').val().replace(/\./g, '')), 1);
            } else {
                CONT(0, 1);
            }
        } else {
            $(this).html('Quitar Bono');
            var precio = parseFloat($('#total').cleanVal());
            var porcentage = parseFloat($('#xcntag').val());
            var ahorr = Math.round(precio * descuento / 100)
            $('#idbono').val(kupon);
            $('#cupon').val(pin);
            $('#ahorro').val(Moneda(ahorr));
            precio = precio - ahorr;
            inicial = precio * porcentage / 100;
            $('#cuponx100to').val(descuento + '%');
            $('#desinicial').val(Moneda(Math.round(inicial)))
            $('#destotal').val(Moneda(Math.round(precio)));
            $('#ini').val(Moneda(Math.round(inicial)))
            $('#fnc').val(Moneda(Math.round(precio - inicial)));
            if ($('#Separar').val()) {
                CONT(parseFloat($('#Separar').val().replace(/\./g, '')), 1);
            } else {
                CONT(0, 1);
            }
        }
    })
    crearcartera.on('click', '.guardar', function () {
        $('#crearcartera').find('.id, .rcuota, .std, #ahorro, #inicialcuotas, #financiacion, #ini, #fnc, #total, #inicial').prop('disabled', false);
        var datos = $('#crearcartera thead').find(`input, select`).serialize();
        datos += '&' + crearcartera.$('input, select').serialize();
        datos += eliminar;
        crearcartera.$('.id, .rcuota, .std, #ini, #fnc, #total, #inicial').prop('disabled', true);
        //console.log(datos) 
        $.ajax({
            type: 'POST',
            url: '/links/ordne',
            data: datos,
            async: true,
            beforeSend: function (xhr) {
                $('#ModalEventos').modal({
                    toggle: true,
                    backdrop: 'static',
                    keyboard: true,
                });
            },
            success: function (data) {
                if (data) {
                    SMSj('success', 'Datos actualizados correctamente')
                    $('#ModalEventos').modal('hide')
                    eliminar = '';
                    window.location.href = '/links/reportes';
                }
            }
        })
    });
    crearcartera.on('change', '.tabl .cuota', function () {
        var fila = $(this).parents('tr');
        var tipo = fila.find(`.tipo`).val();
        var total = 0, valor = 0, num = 0;
        var montorecibos = Montos || 0; //console.log(realcuotai, realcuotaf)

        if (tipo === 'INICIAL') {
            $('#crearcartera .tabl tr').filter((c, i) => {
                var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                return $(i).find(`.tipo`).val() === 'INICIAL' && parseFloat(e) !== realcuotai;
            }).map((c, i) => {
                num = c + 1;
                var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                valor += parseFloat(e);
            })

            var n = $('#inicialcuotas').val() - num;
            var ini = $('#ini').val().replace(/\./g, '');
            total = ini - valor;
            cuota = Math.round(total / n);
            if (n > 0) {
                $('#crearcartera .tabl tr').each((e, i) => {
                    var tpo = $(i).find(`.tipo`).val()
                    if (tpo === 'INICIAL') {
                        var c = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                        if (parseFloat(c) === realcuotai) {
                            $(i).find(`.cuota`).val(Moneda(cuota))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                        }
                    }
                })
            }
            realcuotai = cuota;
        } else if (tipo === 'FINANCIACION') {
            $('#crearcartera .tabl tr').filter((c, i) => {
                var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                return $(i).find(`.tipo`).val() === 'FINANCIACION' && parseFloat(e) !== realcuotaf;
            }).map((c, i) => {
                num = c + 1;
                var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                valor += parseFloat(e);
            })

            var n = $('#financiacion').val() - num;
            var fnc = $('#fnc').val().replace(/\./g, '');
            total = fnc - valor;
            cuota = Math.round(total / n);
            if (n > 0) {
                $('#crearcartera .tabl tr').each((e, i) => {
                    var tpo = $(i).find(`.tipo`).val()
                    if (tpo === 'FINANCIACION') {
                        var c = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                        if (parseFloat(c) === realcuotaf) {
                            $(i).find(`.cuota`).val(Moneda(cuota));
                        }
                    }
                })
            }
            realcuotaf = cuota;
        }
        $('#crearcartera .tabl tr').each((e, i) => {
            var tpo = $(i).find(`.tipo`).val();
            var cuota = tpo !== undefined ? parseFloat($(i).find(`.cuota`).val().replace(/\./g, '')) : 0;
            if (montorecibos > 0 && tpo !== undefined) {
                if (montorecibos >= cuota) {
                    $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                    $(i).find(`.std option[value = '13']`).attr("selected", true);
                    montorecibos = montorecibos - cuota;

                } else if (montorecibos < cuota) {
                    $(i).find(`.rcuota`).val(Moneda(Math.round(cuota - montorecibos)));
                    $(i).find(`.std option[value = '3']`).attr("selected", true);
                    montorecibos = 0;
                }
            } else {
                $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                $(i).find(`.std option[value = '3']`).attr("selected", true);
            }
        })
        //$(this).val(Moneda(estacuota))//.mask('#.##$', { reverse: true, selectOnFocus: true });
    });
    crearcartera.on('change', '#Separar', function () {
        if ($(this).val().length > 3) {
            CONT(parseFloat($(this).val().replace(/\./g, '')), 1)
        } else {
            $(this).val(0)
            CONT(0, 1)
        }
    })
    crearcartera.on('change', '.tabl .fecha', function () {
        var t = moment().format('YYYY-MM-DD')
        var fech = $(this).val() ? $(this).val() : t;
        var f = null, n = 0;
        $('#crearcartera .tabl tr').map((c, i) => {
            var e = $(i).find(`.fecha`).val() ? $(i).find(`.fecha`).val() : 12;
            if ($(i).find(`.fecha`).val() !== undefined && e === fech) {
                f = true;
            } else if ($(i).find(`.fecha`).val() !== undefined && f) {
                n++;
                s = moment(fech).add(n, 'month').format('YYYY-MM-DD')
                $(i).find(`.fecha`).val(s);
            }
        })
    })

    var CONT = (sepa, typo) => {
        var p = sepa > 0 ? parseFloat(sepa) : 0
        var ini = parseFloat($('#ini').val().replace(/\./g, '')) - p;
        var fnc = parseFloat($('#fnc').val().replace(/\./g, ''));
        var ic = parseFloat($('#inicialcuotas').val());
        var fc = parseFloat($('#financiacion').val());
        var cuotai = parseFloat(ini) / ic;
        var cuotaf = parseFloat(fnc) / fc;
        var montorecibos = Montos || 0;
        var fecha = $('#crearcartera .tabl tr').find(`.fecha`)[0].value;
        var n = 0, s;
        $('#cuot').val(cuotaf);
        if (ic === 0 && fc === 0) {
            $('#Separar').val(Moneda(Math.round(ini + p + fnc)));
            $('#cuot').val(0);
            cuotai = 0;
            cuotaf = 0;
        } else if (ic === 0 && fc !== 0) {
            $('#Separar').val(Moneda(Math.round(ini + p)));
            cuotai = 0;
        } else if (ic !== 0 && fc === 0) {
            $('#Separar').val(Moneda(Math.round(p + fnc)));
            $('#cuot').val(0);
            cuotaf = 0;
        }
        $('#crearcartera .tabl tr').each((e, i) => {
            var fe = $(i).find(`.fecha`).val();
            var tpo = $(i).find(`.tipo`).val();
            if (tpo === 'INICIAL' && typo) { // && typo === tpo 
                $(i).find(`.n`).val(e - 2);
                $(i).find(`.cuota`).val(Moneda(Math.round(cuotai)))
            }
            if (tpo === 'FINANCIACION' && typo) {// && typo === tpo
                var co = parseFloat($('#inicialcuotas').val()) + 3;
                $(i).find(`.n`).val(e - co)
                $(i).find(`.cuota`).val(Moneda(Math.round(cuotaf)))
            }
            var cuota = tpo !== undefined ? parseFloat($(i).find(`.cuota`).val().replace(/\./g, '')) : 0;
            if (montorecibos > 0 && tpo !== undefined) {
                if (montorecibos >= cuota) {
                    $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                    $(i).find(`.std option[value = '13']`).attr("selected", true);
                    montorecibos = montorecibos - cuota;

                } else if (montorecibos < cuota) {
                    $(i).find(`.rcuota`).val(Moneda(Math.round(cuota - montorecibos)));
                    $(i).find(`.std option[value = '3']`).attr("selected", true);
                    montorecibos = 0;
                }
            } else {
                $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                $(i).find(`.std option[value = '3']`).attr("selected", true);
            } //console.log(fe !== undefined && typo && fe !== fecha, fe , typo, fecha, n)
            if (fe !== undefined && typo && fe !== fecha) {
                n++;
                s = moment(fecha).add(n, 'month').format('YYYY-MM-DD')
                $(i).find(`.fecha`).val(s);
            }
        })
        realcuotai = Math.round(cuotai);
        realcuotaf = Math.round(cuotaf);
        $(".fecha").daterangepicker({
            locale: {
                'format': 'YYYY-MM-DD',
                'separator': ' - ',
                'applyLabel': 'Aplicar',
                'cancelLabel': 'Cancelar',
                'fromLabel': 'De',
                'toLabel': '-',
                'customRangeLabel': 'Personalizado',
                'weekLabel': 'S',
                'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                'firstDay': 1
            },
            singleDatePicker: true,
            showDropdowns: true,
            minYear: 2017,
            maxYear: parseInt(moment().format('YYYY'), 10) + 5,
        });
    }
    var FINANCIAR = (tipo, cnt, separ) => {
        var table = new $.fn.dataTable.Api('#crearcartera');
        var datos = table.rows({ page: 'current' }).data();
        if (!datos.length) {
            datos.push([
                '',
                `< input class= "text-center id" type = "text" name = "id" style = "width: 100%;" value = "0" disabled > `,
                `< input class= "text-center fecha" type = "text" name = "fecha" style = "width: 100%;" required > `,
                `< input class= "text-center n" type = "text" name = "n" style = "width: 100%;" value = "${cnt ? cnt : 1}" required > `,
                `< input class= "text-center tipo" type = "hidden" name = "tipo" style = "width: 100%;" value = "SEPARACION" > `,
                `< input class= "text-center cuota" type = "text" name = "cuota" id = "Separar" style = "width: 100%;" data - mask="000.000.000" data - mask - reverse="true" data - mask - selectonfocus="true" required > `,
                `< input class= "text-center rcuota" type = "text" name = "rcuota" style = "width: 100%;" disabled > `,
                `< select size = "1" class= "text-center std" name = "std" disabled >
                <option value="3" selected="selected">Pendiente</option>
                <option value="13">Pagada</option>
                </select > `,
                `< svg xmlns = "http://www.w3.org/2000/svg" width = "24" height = "24" viewBox = "0 0 24 24" fill = "none"
        stroke = "currentColor" stroke - width="2" stroke - linecap="round" stroke - linejoin="round" class="feather feather-trash-2" >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg > `
            ])
        }
        tipo != 1 ? datos.push([
            '',
            `<input class="text-center id" type="text" name="id" style="width: 100%;" value="0" disabled>`,
            `<input class="text-center fecha" type="text" name="fecha" style="width: 100%;" required>`,
            `<input class="text-center n" type="text" name="n" style="width: 100%;" value="${cnt ? cnt : 1}" required>`,
            `<input class="text-center tipo" type="hidden" name="tipo" style="width: 100%;" value="${tipo}">`,
            `<input class="text-center cuota" type="text" name="cuota" style="width: 100%;" data-mask="000.000.000" data-mask-reverse="true" data-mask-selectonfocus="true" required>`,
            `<input class="text-center rcuota" type="text" name="rcuota" style="width: 100%;" disabled>`,
            `<select size="1" class="text-center std" name="std" disabled>
            <option value="3" selected="selected">Pendiente</option>
            <option value="13">Pagada</option>
            </select>`,
            `<a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg></a>`
        ]) : '';
        crearcartera.clear().draw(false);
        var dat = [];
        datos.filter((x, c) => {
            return $(x[4]).val() === 'SEPARACION';
        }).map((x, c) => {
            dat.push(x);
        })
        datos.filter((x, c) => {
            return $(x[4]).val() === 'INICIAL';
        }).map((x, c) => {
            dat.push(x);
        })
        datos.filter((x, c) => {
            return $(x[4]).val() === 'FINANCIACION';
        }).map((x, c) => {
            dat.push(x);
        })
        crearcartera.rows.add(dat).draw(false);
        separ ? $('#Separar').val(Moneda(separ)) : '';
        CONT(separ, tipo);
    }

}
//////////////////////////////////* IMPRIMIR */////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/ordendeseparacion/${window.location.pathname.split('/')[3]}`) {
    $('footer').hide()
    $('nav').hide()
    var table = $('#datatable').DataTable({
        paging: false,
        info: false,
        searching: false,
        autoWidth: true,
        responsive: false,
        ajax: {
            method: "POST",
            url: "/links/ordendeseparacion/" + $('#orden').val(),
            data: {
                p: $('#numerocuotaspryecto').val(),
                i: $('#inicialdiferida').val()
            },
            dataSrc: "data"
        },
        columns: [
            { data: "tipo" },
            { data: "ncuota" },
            {
                data: "fechs",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            {
                data: "cuota",
                render: $.fn.dataTable.render.number('.', '.', 2, '$')
            },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 13:
                            return `<span class="badge badge-pill badge-success"> Pagada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary"> Pendiente</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger"> Anulada</span> `
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-secondary"> Abono</span>`
                            break;
                        case 1:
                            return `<span class="badge badge-pill badge-warning"> Procesando</span>`
                            break;
                    }
                }
            },
            { data: "ncuota2" },
            {
                data: "fecha2",
                render: function (data, method, row) {
                    return data ? moment(data).format('YYYY-MM-DD') : '';
                }
            },
            {
                data: "cuota2",
                render: $.fn.dataTable.render.number('.', '.', 2, '$')
            },
            {
                data: "estado2",
                render: function (data, method, row) {
                    switch (data) {
                        case 13:
                            return `<span class="badge badge-pill badge-success"> Pagada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary"> Pendiente</span> `
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-danger"> Vencida</span> `
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-secondary"> Abono</span> `
                            break;
                        default:
                            return ``
                    }
                }
            }
        ],
        initComplete: function (settings, json) {
            //tableOrden.column(2).visible(true);
            window.addEventListener("load", window.print());

        },
        columnDefs: [
            { "visible": false, "targets": 0 }
        ],
        order: [[0, "desc"], [1, 'asc']],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        `<tr class="group">
            <td colspan="8">
                <div class="text-right text-muted">
                    ${group}
                </div>
            </td>
                        </tr>`
                    );
                    last = group;
                }
            });
        }
    });

    $(document).ready(function () {
        var g = $('#fechaFactura').text()
        var j = $('#fechaFactura').html()
        $('#fechaFactura').html(moment(g).format('YYYY-MM-DD'))
        $('#fechaOrden').html('..............................' + moment(j).format('YYYY-MM-DD'))
        $('.totales').text('$' + Moneda(parseFloat($('#vLetras').val())))
        var totalp = Moneda($('.totalp').html())
        var m2 = Moneda($('.m2').html())
        var totali = Moneda($('.totali').html())
        var ahorro = Moneda($('.ahorro').html())
        var extrao = Moneda($('.extrao').html())
        var separar = Moneda($('.separar').html())
        var cuota = Moneda($('#cuota').html())
        var total = parseFloat($('.totalp').html()) - parseFloat($('.ahorro').html());
        var saldot = total - parseFloat($('#saldofecha').val());
        $('.totalote').html('$' + Moneda(total));
        $('.saldofecha').html('$' + Moneda(saldot));
        $('.totalp').html('Valor $' + totalp)
        $('.m2').text('$' + m2)
        $('.totali').html('Total inicial $' + totali)
        $('.ahorro').html('$' + ahorro)
        $('.extrao').html('$' + extrao)
        $('.separar').html('$' + separar)
        $('#cuota').html('$' + cuota)

        //window.print();   
        //<a href="invoice-print.html" target="_blank" class="btn btn-default"><i class="fas fa-print"></i> Print</a>
        //window.addEventListener("load", window.print());
    })

} //else {
//$('footer').show()
//$('nav').show()
//}
//////////////////////////////////* CARTERA */////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/cartera`) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[6]).getTime();
            }
            if (minDateFilter && !isNaN(minDateFilter)) {
                if (aData._date < minDateFilter) {
                    return false;
                }
            }
            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (aData._date > maxDateFilter) {
                    return false;
                }
            }
            return true;
        }
    );
    var ya = moment(new Date()).format('YYYY-MM-DD');
    var R = true;
    $(document).ready(function () {
        var bono = 0;
        $(".select2").each(function () {
            var texto = $(this).attr('id') === 'clientes' ? "Seleccion de Clientes" : "Selecciona un Producto";
            $(this)
                .wrap("<div class=\"position-relative\"></div>")
                .select2({
                    placeholder: texto,
                    dropdownParent: $(this).parent(),
                    maximumSelectionLength: 4,
                    allowClear: true
                });
        });
        $('#proyectos').change(function () {
            $.ajax({
                type: 'POST',
                url: '/links/cartera/' + $(this).val(),
                //async: true,
                beforeSend: function (xhr) {
                    //tabledit.state.save();
                },
                success: function (data) {
                    if (data) {
                        var porg = data.inicial * 100 / data.valor;
                        $('#mtr2').val(data.mtr2);
                        $('#vmtr2').val(Moneda(Math.round(data.mtr)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                        $('#inicial').val(Moneda(Math.round(data.inicial)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                        $('#total').val(Moneda(Math.round(data.valor)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                        $(`#xcntag option[value = '${porg}']`).attr("selected", true);
                        $('#ini').val(Moneda(Math.round(data.inicial)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                        $('#fnc').val(Moneda(Math.round(data.valor - data.inicial)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                        if ($('#Separar').val()) {
                            CONT(parseFloat($('#Separar').val().replace(/\./g, '')))
                        } else {
                            CONT()
                        }
                    }
                }
            })
        })
        $('#financiacion-btn').click(function () {
            var c = 1;
            crearcartera
                .rows()
                .data()
                .filter((x, c) => {
                    return $(x[3]).val() === 'FINANCIACION';
                }).map((x, j) => {
                    c = j + 2;
                })
            $('#financiacion').val(c)
            if ($('#Separar').val()) {
                FINANCIAR('FINANCIACION', c, parseFloat($('#Separar').val().replace(/\./g, '')))
            } else {
                FINANCIAR('FINANCIACION', c, 0)
            }
        })
        $('#inicialcuotas-btn').click(function () {
            var c = 1;
            crearcartera
                .rows()
                .data()
                .filter((x, c) => {
                    return $(x[3]).val() === 'INICIAL';
                }).map((x, j) => {
                    c = j + 2;
                })
            $('#inicialcuotas').val(c)
            if ($('#Separar').val()) {
                FINANCIAR('INICIAL', c, parseFloat($('#Separar').val().replace(/\./g, '')))
            } else {
                FINANCIAR('INICIAL', c, 0)
            }
        })
        $('#cupon').change(function () {
            if ($(this).val() !== bono && $(this).val()) {
                $.ajax({
                    url: '/links/bono/' + $(this).val(),
                    type: 'GET',
                    async: false,
                    success: function (data) {
                        if (data.length) {
                            var fecha = moment(data[0].fecha).add(59, 'days').endOf("days");
                            if (data[0].producto != null) {
                                SMSj('error', 'Este cupon ya le fue asignado a un producto. Para mas informacion comuniquese con el asesor encargado');
                                $(this).val('')
                            } else if (fecha < new Date()) {
                                SMSj('error', 'Este cupon de descuento ya ha expirado. Para mas informacion comuniquese con el asesor encargado');
                                $(this).val('')
                            } else if (data[0].estado != 9) {
                                SMSj('error', 'Este cupon aun no ha sido autorizado por administración. espere la autorizacion del area encargada');
                                $(this).val('') //L0X66
                            } else {
                                var precio = parseFloat($('#total').cleanVal());
                                var porcentage = parseFloat($('#xcntag').val());
                                var ahorr = Math.round(precio * data[0].descuento / 100)
                                $('#idbono').val(data[0].id);
                                $('#ahorro').val(Moneda(ahorr));
                                precio = precio - ahorr;
                                inicial = precio * porcentage / 100;
                                $('#cuponx100to').val(data[0].descuento + '%');
                                $('#desinicial').val(Moneda(Math.round(inicial)))
                                $('#destotal').val(Moneda(Math.round(precio)));
                                $('#ini').val(Moneda(Math.round(inicial)))
                                $('#fnc').val(Moneda(Math.round(precio - inicial)));
                                if ($('#Separar').val()) {
                                    CONT(parseFloat($('#Separar').val().replace(/\./g, '')))
                                } else {
                                    CONT()
                                }
                            }
                            bono = data[0].pin;
                        } else {
                            SMSj('error', 'Debe digitar un N° de bono valido. Comuniquese con uno de nuestros asesores encargado')
                        }
                    }
                });
            } else {
                SMSj('error', 'Cupon de decuento invalido. Comuniquese con uno de nuestros asesores encargado')
                bono !== 0 ? $(this).val(bono) : '';
            }
        })
        $('#xcntag').change(function () {
            var porcntg = $(this).val();
            var total = $('#total').val().replace(/\./g, '');
            var totaldesc = $('#destotal').val().replace(/\./g, '');
            var inicl = total * porcntg / 100;
            //console.log(inicl, total, porcntg, totaldesc)
            $('#inicial').val(Moneda(Math.round(inicl)));
            if (totaldesc) {
                inicl = totaldesc * porcntg / 100;
                total = totaldesc;
                $('#desinicial').val(Moneda(Math.round(inicl)));
            }
            $('#ini').val(Moneda(Math.round(inicl)));
            $('#fnc').val(Moneda(Math.round(total - inicl)));
            if ($('#Separar').val()) {
                CONT(parseFloat($('#Separar').val().replace(/\./g, '')))
            } else {
                CONT()
            }
        })
        $('#vmtr2').change(function () {
            var vmtr = $(this).val().replace(/\./g, '');
            var mtr = $('#mtr2').val();
            var porcntg = $('#xcntag').val();
            var total = vmtr * mtr;
            var inicl = total * porcntg / 100;
            var totaldesc = $('#destotal').val().replace(/\./g, '');
            $('#total').val(Moneda(Math.round(total)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
            $('#inicial').val(Moneda(Math.round(inicl)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
            if (totaldesc) {
                var ahorro = $('#ahorro').val().replace(/\./g, '');
                total = total - ahorro;
                inicl = total * porcntg / 100;
                $('#destotal').val(Moneda(Math.round(total)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                $('#desinicial').val(Moneda(Math.round(inicl)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
            }
            $('#ini').val(Moneda(Math.round(inicl)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
            $('#fnc').val(Moneda(Math.round(total - inicl)))//.mask('#.##$', { reverse: true, selectOnFocus: true });
            if ($('#Separar').val()) {
                CONT(parseFloat($('#Separar').val().replace(/\./g, '')))
            } else {
                CONT()
            }
        })
        $('#cuadro2').submit(function (e) {
            var asesors = $('#asesores').val();
            var clients = $('#clientes').val();
            if (asesors == 0 || clients == 0) {
                e.preventDefault();
                SMSj('error', 'Debe seleccionar un CLIENTE o ASESOR');
                return false;
            }
            if (!R) { e.preventDefault(); return false; }
            $('#ModalEventos').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            });
            $('#ahora').val(moment().format('YYYY-MM-DD HH:mm'));
            $('#cuadro2').find('input, select').prop('disabled', false);

        })
    })
    var cartera = $('#cartera').DataTable({
        dom: 'Bfrtip',
        buttons: rol.auxicontbl && !rol.externo ?
            [
                { extend: 'pageLength', text: 'Ver', orientation: 'landscape' },
                {
                    text: `<div class="mb-0" >
                            <i class="align-middle mr-2" data-feather="file-text"></i> <span class="align-middle">+ Producto</span>
                        </div>`,
                    attr: {
                        title: 'Crear cartera',
                        id: 'facturar'
                    },
                    className: 'btn btn-secondary',
                    action: function () {
                        $("#cuadro1").hide("slow");
                        $("#cuadro2").show("slow");
                    }
                }
            ] : [{ extend: 'pageLength', text: 'Ver', orientation: 'landscape' }],
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [
            { className: 'control', orderable: true, targets: 0 },
            { responsivePriority: 1, targets: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13] },
            //{ responsivePriority: 2, targets: 4 }
        ],
        order: [[6, "desc"], [1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            data: { h: ya },
            url: "/links/cartera",
            dataSrc: "data"
        },
        columns: [
            {
                data: null,
                defaultContent: ''
            },
            {
                data: "id"
            },
            {
                data: "mz",
                className: 'te'
            },
            {
                data: "n",
                className: 'te'
            },
            {
                data: "fecha",
                className: 'te',
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            {
                data: "ultimoabono",
                className: 'te',
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            {
                data: "meses",
                className: 'te'
            },
            {
                data: "estado",
                className: 'te',
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-warning"> Pendiente</span>`
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-info"> Tramitando</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-danger"> Anulada</span>`
                            break;
                        case 10:
                            return `<span class="badge badge-pill badge-success"> Separado</span>`
                            break;
                        case 12:
                            return `<span class="badge badge-pill badge-dark"> Apartado</span>`
                            break;
                        case 13:
                            return `<span class="badge badge-pill badge-primary"> Vendido</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-tertiary"> Inactivo</span>` //secondary
                            break;
                    }
                }
            },
            {
                data: "valor",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "separar",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "ahorro",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "Total",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "abonos",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "deuda",
                className: 'te',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "proyect",
                className: 'te'
            },
            {
                data: "nombre",
                className: 'te'
            },
            {
                data: "documento",
                className: 'te'
            },
            {
                data: "fullname",
                className: 'te'
            },
            {
                data: "movil",
                className: 'te'
            }/* ,
            {
                className: 't',
                data: "id",
                render: function (data, method, row) {
                    return rol.subadmin ? `<div class="btn-group btn-group-sm">
                                            <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                             aria-haspopup="true" aria-expanded="false">Acción</button>
                                                <div class="dropdown-menu">
                                                    <a class="dropdown-item" href="/links/ordn/${data}"><i class="fas fa-edit"></i> Ediar</a>
                                                    <a class="dropdown-item" href="/links/ordendeseparacion/${data}" target="_blank"><i class="fas fa-print"></i> Imprimir</a>
                                                </div>
                                        </div>`
                        : `<a href="/links/ordendeseparacion/${data}" target="_blank"><i class="fas fa-print"></i></a>`
                }
            } */
        ],
        rowCallback: function (row, data, index) {
            if (data["estado"] == 9) {
                $(row).css({ "background-color": "#C61633", "color": "#FFFFFF" });
            } else if (data["estado"] == 12) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["estado"] == 8) {
                $(row).css("background-color", "#FFFFCC");
            } else if (data["estado"] == 10) {
                $(row).css("background-color", "#40E0D0");
            } else if (data["estado"] == 1) {
                $(row).css({ "background-color": "#162723", "color": "#FFFFFF" });
            } else if (data["estado"] == 13) {
                $(row).css({ "background-color": "#008080", "color": "#FFFFFF" });
            }
        }
    });
    if (rol.auxicontbl || !rol.externo) {
        var proyectos = $('#proyectos');
        var asesores = $('#asesores');
        var clientes = $('#clientes');
        var realcuotai = 0;
        var realcuotaf = 0;
        var cont = 0, cuota = 0;
        $.ajax({
            type: 'POST',
            url: '/links/prodlotes'
        }).then(function (data) {
            var proyecto = null;
            var parent = null;
            var option = null;
            data.productos.map((x, v) => {
                if (x.proyect !== proyecto) {
                    parent = document.createElement("optgroup");
                    parent.setAttribute("label", x.proyect);
                    proyectos.append(parent)
                    proyecto = x.proyect;
                }
                option = new Option(`${x.proyect} MZ ${x.mz} LT ${x.n} `, x.id, false, false);
                parent.append(option)
            });
            asesores.append(new Option(`Selecciona un Asesor`, 0, true, true))
            data.asesores.map((x, v) => {
                asesores.append(new Option(`${x.fullname} CC ${x.document} `, x.id, false, false))
            });
            //clientes.append(new Option(`Selecciona un Cliente`, 0, true, true))
            data.clientes.map((x, v) => {
                clientes.append(new Option(`${x.nombre} CC ${x.documento} `, x.idc, false, false))
            });
        });
        $('#min, #max').on('keyup', function () {
            var col = $(this).attr('id') === 'min' ? 3 : 4;
            cartera
                .columns(col)
                .search(this.value)
                .draw();
        });
        var crearcartera = $('#crearcartera').DataTable({
            searching: false,
            language: languag2,
            lengthMenu: [-1],
            deferRender: true,
            info: false,
            autoWidth: false,
            paging: false,
            order: [[1, 'asc'], [2, 'asc']],
            responsive: true,
            columnDefs: [
                { className: 'control', orderable: true, targets: 0 },
                //{ "visible": false, "targets": 3 }
                /*{ responsivePriority: 1, targets: [1, 2, 3, 4, 7] },
                { responsivePriority: 2, targets: 5 },
                { responsivePriority: 10003, targets: 6 },
                { responsivePriority: 10002, targets: 8 }*/
            ],
            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(3, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class="group"><td colspan="8">' + $(group).val() + '</td></tr>'
                        );

                        last = group;
                    }
                });
            },
            initComplete: function (settings, json) {
                $('#agrmz').find('input').val('no');
            },
            createdRow: function (row, data, dataIndex) {
                /*console.log(data, row)
                if (!data[2]) {
                    $(row).find('td').attr('colspan', '8');
                }*/
            }
        });
        crearcartera.on('click', 'tr a', function () {
            var fila = $(this).parents('tr');
            var tipo = fila.find(`.tipo`).val();
            crearcartera.row(fila).remove().draw(false);
            var cuotai = $('#inicialcuotas').val() - 1;
            var cuotaf = $('#financiacion').val() - 1;
            tipo === 'INICIAL' ? $('#inicialcuotas').val(cuotai) : $('#financiacion').val(cuotaf);
            if ($('#Separar').val()) {
                CONT(parseFloat($('#Separar').val().replace(/\./g, '')))
            } else {
                CONT()
            }
        });
        crearcartera.on('click', '.tabl .cuota', function () {
            $(this).mask('#.##$', { reverse: true, selectOnFocus: true });
        })
        crearcartera.on('change', '.tabl .cuota', function () {
            var fila = $(this).parents('tr');
            var tipo = fila.find(`.tipo`).val();
            var total = 0, valor = 0, num = 0;
            var montorecibos = parseFloat($('#montorecibos').val()) || 0;

            if (tipo === 'INICIAL') {
                $('#crearcartera .tabl tr').filter((c, i) => {
                    var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                    return $(i).find(`.tipo`).val() === 'INICIAL' && parseFloat(e) !== realcuotai;
                }).map((c, i) => {
                    num = c + 1;
                    var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                    valor += parseFloat(e);
                })

                var n = $('#inicialcuotas').val() - num;
                var ini = $('#ini').val().replace(/\./g, '');
                total = ini - valor;
                cuota = Math.round(total / n);
                if (n > 0) {
                    $('#crearcartera .tabl tr').each((e, i) => {
                        var tpo = $(i).find(`.tipo`).val()
                        if (tpo === 'INICIAL') {
                            var c = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                            if (parseFloat(c) === realcuotai) {
                                $(i).find(`.cuota`).val(Moneda(cuota))//.mask('#.##$', { reverse: true, selectOnFocus: true });
                            }
                        }
                    })
                }
                realcuotai = cuota;
            } else if (tipo === 'FINANCIACION') {
                $('#crearcartera .tabl tr').filter((c, i) => {
                    var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                    return $(i).find(`.tipo`).val() === 'FINANCIACION' && parseFloat(e) !== realcuotaf;
                }).map((c, i) => {
                    num = c + 1;
                    var e = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                    valor += parseFloat(e);
                })

                var n = $('#financiacion').val() - num;
                var fnc = $('#fnc').val().replace(/\./g, '');
                total = fnc - valor;
                cuota = Math.round(total / n);
                if (n > 0) {
                    $('#crearcartera .tabl tr').each((e, i) => {
                        var tpo = $(i).find(`.tipo`).val()
                        if (tpo === 'FINANCIACION') {
                            var c = $(i).find(`.cuota`).val() === undefined ? '' : $(i).find(`.cuota`).val().length > 3 ? $(i).find(`.cuota`).val().replace(/\./g, '') : $(i).find(`.cuota`).val();
                            if (parseFloat(c) === realcuotaf) {
                                $(i).find(`.cuota`).val(Moneda(cuota));
                            }
                        }
                    })
                }
                realcuotaf = cuota;
            }
            $('#crearcartera .tabl tr').each((e, i) => {
                var tpo = $(i).find(`.tipo`).val();
                var cuota = tpo !== undefined ? parseFloat($(i).find(`.cuota`).val().replace(/\./g, '')) : 0;
                if (montorecibos > 0 && tpo !== undefined) {
                    if (montorecibos >= cuota) {
                        $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                        $(i).find(`.std option[value = '13']`).attr("selected", true);
                        montorecibos = montorecibos - cuota;

                    } else if (montorecibos < cuota) {
                        $(i).find(`.rcuota`).val(Moneda(Math.round(cuota - montorecibos)));
                        $(i).find(`.std option[value = '3']`).attr("selected", true);
                        montorecibos = 0;
                    }
                } else {
                    $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                    $(i).find(`.std option[value = '3']`).attr("selected", true);
                }
            })
            //$(this).val(Moneda(estacuota))//.mask('#.##$', { reverse: true, selectOnFocus: true });
        });
        crearcartera.on('change', '#Separar', function () {
            if ($(this).val().length > 3) {
                CONT(parseFloat($(this).val().replace(/\./g, '')))
            } else {
                $(this).val(0)
                CONT()
            }
        })
        crearcartera.on('change', '.tabl .fecha', function () {
            var t = moment().format('YYYY-MM-DD')
            var fech = $(this).val() ? $(this).val() : t;
            var f = null, n = 0;
            $('#crearcartera .tabl tr').map((c, i) => {
                var e = $(i).find(`.fecha`).val() ? $(i).find(`.fecha`).val() : 12;
                if ($(i).find(`.fecha`).val() !== undefined && e === fech) {
                    f = true;
                } else if ($(i).find(`.fecha`).val() !== undefined && f) {
                    n++;
                    s = moment(fech).add(n, 'month').format('YYYY-MM-DD')
                    $(i).find(`.fecha`).val(s);
                }
            })
        })

        var CONT = (separa, g) => {
            var p = separa > 0 ? parseFloat(separa) : 0
            var ini = parseFloat($('#ini').val().replace(/\./g, '')) - p;
            var fnc = $('#fnc').val().replace(/\./g, '');
            var cuotai = parseFloat(ini) / $('#inicialcuotas').val();
            var cuotaf = parseFloat(fnc) / $('#financiacion').val();
            var montorecibos = parseFloat($('#montorecibos').val()) || 0;
            $('#cuot').val(cuotaf);
            $('#crearcartera .tabl tr').each((e, i) => {
                var tpo = $(i).find(`.tipo`).val();
                if (tpo === 'INICIAL' && !g) {
                    $(i).find(`.n`).val(e - 2);
                    $(i).find(`.cuota`).val(Moneda(Math.round(cuotai)))
                }
                if (tpo === 'FINANCIACION' && !g) {
                    var co = parseFloat($('#inicialcuotas').val()) + 3;
                    $(i).find(`.n`).val(e - co)
                    $(i).find(`.cuota`).val(Moneda(Math.round(cuotaf)))
                }
                var cuota = tpo !== undefined ? parseFloat($(i).find(`.cuota`).val().replace(/\./g, '')) : 0;
                if (montorecibos > 0 && tpo !== undefined) {
                    if (montorecibos >= cuota) {
                        $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                        $(i).find(`.std option[value = '13']`).attr("selected", true);
                        montorecibos = montorecibos - cuota;

                    } else if (montorecibos < cuota) {
                        $(i).find(`.rcuota`).val(Moneda(Math.round(cuota - montorecibos)));
                        $(i).find(`.std option[value = '3']`).attr("selected", true);
                        montorecibos = 0;
                    }
                } else {
                    $(i).find(`.rcuota`).val($(i).find(`.cuota`).val());
                    $(i).find(`.std option[value = '3']`).attr("selected", true);
                }
            })
            realcuotai = Math.round(cuotai);
            realcuotaf = Math.round(cuotaf);
            $(".fecha").daterangepicker({
                locale: {
                    'format': 'YYYY-MM-DD',
                    'separator': ' - ',
                    'applyLabel': 'Aplicar',
                    'cancelLabel': 'Cancelar',
                    'fromLabel': 'De',
                    'toLabel': '-',
                    'customRangeLabel': 'Personalizado',
                    'weekLabel': 'S',
                    'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                    'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    'firstDay': 1
                },
                singleDatePicker: true,
                showDropdowns: true,
                minYear: 2017,
                maxYear: parseInt(moment().format('YYYY'), 10) + 5,
            });
        }
        var FINANCIAR = (tipo, cnt, separ) => {
            var table = new $.fn.dataTable.Api('#crearcartera');
            var datos = table.rows({ page: 'current' }).data()
            if (!datos.length) {
                datos.push([
                    '',
                    `<input class="text-center fecha" type="text" name="fecha" style="width: 100%;" required>`,
                    `<input class="text-center n" type="text" name="n" style="width: 100%;" value="${cnt ? cnt : 1}" required>`,
                    `<input class="text-center tipo" type="hidden" name="tipo" style="width: 100%;" value="SEPARACION">`,
                    `<input class="text-center cuota" type="text" name="cuota" id="Separar" style="width: 100%;" data-mask="000.000.000" data-mask-reverse="true" data-mask-selectonfocus="true" required>`,
                    `<input class="text-center rcuota" type="text" name="rcuota" style="width: 100%;" disabled>`,
                    `<select size="1" class="text-center std" name="std" disabled>
                     <option value="3" selected="selected">Pendiente</option>
                    <option value="13">Pagada</option>
                 </select>`,
                    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>`
                ])
            }
            datos.push([
                '',
                `<input class="text-center fecha" type="text" name="fecha" style="width: 100%;" required>`,
                `<input class="text-center n" type="text" name="n" style="width: 100%;" value="${cnt ? cnt : 1}" required>`,
                `<input class="text-center tipo" type="hidden" name="tipo" style="width: 100%;" value="${tipo}">`,
                `<input class="text-center cuota" type="text" name="cuota" style="width: 100%;" data-mask="000.000.000" data-mask-reverse="true" data-mask-selectonfocus="true" required>`,
                `<input class="text-center rcuota" type="text" name="rcuota" style="width: 100%;" disabled>`,
                `<select size="1" class="text-center std" name="std" disabled>
            <option value="3" selected="selected">Pendiente</option>
            <option value="13">Pagada</option>
            </select>`,
                `<a> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg></a>`
            ])
            crearcartera.clear().draw(false);
            var dat = []
            datos.filter((x, c) => {
                return $(x[3]).val() === 'SEPARACION';
            }).map((x, c) => {
                dat.push(x)
            })
            datos.filter((x, c) => {
                return $(x[3]).val() === 'INICIAL';
            }).map((x, c) => {
                dat.push(x)
            })
            datos.filter((x, c) => {
                return $(x[3]).val() === 'FINANCIACION';
            }).map((x, c) => {
                dat.push(x)
            })
            crearcartera.rows.add(dat).draw(false);
            separ ? $('#Separar').val(Moneda(separ)) : '';
            CONT(separ)
        }
        window.preview = function (input) {
            if (input.files && input.files[0]) {
                var marg = 100 / $('#file2')[0].files.length;
                $('#recibos1').html('');
                $('.op').remove();
                $('#montorecibos').val('').hide('slow');
                $(input.files).each(function () {
                    var reader = new FileReader();
                    reader.readAsDataURL(this);
                    reader.onload = function (e) {
                        $('#recibos1').append(
                            `<div class="image container" style="width: ${marg}%; min-width: 25%; padding-top: 
                         calc(100% / (16/9)); background-image: url('${e.target.result}'); background-size: 100%;
                         background-position: center; background-repeat: no-repeat; float: left;"></div>`
                        );
                        /*<div class="card">
                            <table class="table table-sm"><tbody><tr><th><div class="text-center"><input type="text" 
                            class="recis text-center" name="nrecibo" placeholder="Recibo" autocomplete="off" required>
                            </div></th></tr><tr><th><div class="text-center"><input class="montos text-center" type="text" 
                            placeholder="Monto" autocomplete="off" required></div></th></tr><tr><th><div class="text-center">
                            <select name="formap" class="form-control-no-border forma" style="text-align:center;" required>
                            <option value="CTA-CTE-50900011438">CTA CTE 50900011438</option><option value="CHEQUE">CHEQUE
                            </option><option value="EFECTIVO">EFECTIVO</option><option value="OTRO">OTRO</option></select>
                            </div></th></tr></tbody></table></div>*/
                        $('#trarchivos').after(`
                    <tr class="op">
                        <th>                     
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                        stroke-linejoin="round" class="feather feather-file-text">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <input class="recis" type="text" name="nrecibo" placeholder="Recibo"
                             autocomplete="off" style="padding: 1px; width: 50%;" required>
                        </th>
                        <td>
                            <input class="montos text-center" type="text" name="montos"
                             placeholder="Monto" autocomplete="off" style="padding: 1px; width: 100%;" required>
                        </td>
                    </tr>
                    <tr class="op">
                        <th>                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>FECHA</span>
                        </th>
                        <td>
                            <input class="fech text-center" type="text" name="feh" autocomplete="off" style="padding: 1px; width: 100%;" required>
                        </td>
                    </tr>
                    <tr class="op">
                        <th>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>FORMA DE PAGO</span>
                        </th>
                        <td>
                            <select class="form-control-no-border forma" style="padding: 1px;text-align:center;" name="formap" required>
                                <option value="CTA-CTE-50900011438">CTA CTE 50900011438</option>
                                <option value="CHEQUE">CHEQUE</option>
                                <option value="EFECTIVO">EFECTIVO</option>
                                <option value="OTRO">OTRO</option>
                            </select>
                        </td>
                    </tr>`
                        );
                        $(".fech").daterangepicker({
                            locale: {
                                'format': 'YYYY-MM-DD',
                                'separator': ' - ',
                                'applyLabel': 'Aplicar',
                                'cancelLabel': 'Cancelar',
                                'fromLabel': 'De',
                                'toLabel': '-',
                                'customRangeLabel': 'Personalizado',
                                'weekLabel': 'S',
                                'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                                'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                                'firstDay': 1
                            },
                            singleDatePicker: true,
                            showDropdowns: true,
                            minYear: 2017,
                            maxYear: parseInt(moment().format('YYYY'), 10),
                        });
                        $('.montos').mask('###.###.###', { reverse: true });
                        $('.montos').on('change', function () {
                            var avl = 0;
                            $('#montorecibos').show('slow')
                            $('.montos').map(function () {
                                s = parseFloat($(this).cleanVal()) || 0
                                avl = avl + s;
                            });
                            $('.montorecibos').html(Moneda(avl))
                            $('#montorecibos').val(avl);
                            if ($('#Separar').val()) {
                                CONT(parseFloat($('#Separar').val().replace(/\./g, '')), true)
                            } else {
                                CONT(0, true)
                            }
                        })
                        $('.recis').on('change', function () {
                            var input = $(this);
                            $.ajax({
                                url: '/links/rcb',
                                data: { rcb: '~' + $(this).val().replace(/^0+/, '') + '~' },
                                type: 'POST',
                                beforeSend: function (xhr) {
                                    R = false;
                                },
                                success: function (data) {
                                    if (data) {
                                        var avl = '';
                                        $('.recis').map(function () {
                                            s = $(this).val() ? '~' + $(this).val().replace(/^0+/, '') + '~,' : '';
                                            avl += s;
                                        });
                                        $('#nrbc').val(avl.slice(0, -1));
                                        R = true;
                                    } else {
                                        input.val('');
                                        SMSj('error', 'Recibo rechazado se encuentra duplicado');
                                    }
                                }
                            });

                        })
                        var zom = 200
                        $(".image").on({
                            mousedown: function () {
                                zom += 50
                                $(this).css("background-size", zom + "%")
                            },
                            mouseup: function () {

                            },
                            mousewheel: function (e) {
                                //console.log(e.deltaX, e.deltaY, e.deltaFactor);
                                if (e.deltaY > 0) { zom += 50 } else { zom < 150 ? zom = 100 : zom -= 50 }
                                $(this).css("background-size", zom + "%")
                            },
                            mousemove: function (e) {
                                let width = this.offsetWidth;
                                let height = this.offsetHeight;
                                let mouseX = e.offsetX;
                                let mouseY = e.offsetY;

                                let bgPosX = (mouseX / width * 100);
                                let bgPosY = (mouseY / height * 100);

                                this.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                            },
                            mouseenter: function (e) {
                                $(this).css("background-size", zom + "%")
                            },
                            mouseleave: function () {
                                $(this).css("background-size", "100%")
                                this.style.backgroundPosition = "center";
                            }
                        });
                    }
                });
            }

        }
    }
}
//////////////////////////////////* PRODUCTOS */////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/productos` && !rol.externo) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');
    let recargada = true,
        dataid = 0,
        total = 0,
        cliente = "";
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[2]).getTime();
            }
            if (minDateFilter && !isNaN(minDateFilter)) {
                if (aData._date < minDateFilter) {
                    return false;
                }
            }
            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (aData._date > maxDateFilter) {
                    return false;
                }
            }
            return true;
        }
    );
    var start = moment(), end = moment().add(2, 'year');
    $(document).ready(function () {
        $('a.atras').on('click', function () {
            table2.ajax.reload(null, false)
            table2.columns.adjust().draw();
            $("#cuadro2").hide("slow");
            $("#cuadro3").hide("slow");
            $("#cuadro4").hide("slow");
            $("#cuadro1").show("slow");
        });
        $('.v').change(function () {
            if ($(this).attr('id') === 'vmt2') {
                $('#crearlotes .vmt2').val($(this).val());
                //console.log('si cruso')
            }
            $('#crearlotes .mt2').each(function (index, element) {
                var fila = $(this).parents('tr');
                if ($(this).val()) {
                    valor = $(this).val() * fila.find('.vmt2').cleanVal();
                    inicial = valor * $('#porcentage').val() / 100;
                    fila.find('.vrlt').val(Moneda(valor))
                    fila.find('.vri').val(Moneda(inicial))
                }
            });
        });
        $("form input:not(.edi)").on({
            focus: function () {
                this.select();
            }
        });
        $('#pro').submit(function (e) {
            $('#ModalEventos').modal({
                toggle: true,
                backdrop: 'static',
                keyboard: true,
            });
        })
        var counter = 1, loteo = 1;
        //var da = lotes.$('input, select').serialize();
        var lotes = $('#crearlotes').DataTable({
            dom: 'Bfrtip',
            buttons: [
                {
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg> Agr. MZ <input class="text-center" type="text" id="agmz" value="no" style="width: 40px;">`,
                    attr: { title: 'Agregar MZ', id: "agrmz" },
                    className: 'btn btn-secondary min',
                    action: function () {
                        if (parseFloat($('#agrmz').find('input').val()) > 0) {
                            counter++
                            loteo = 1;
                            $('#agrmz').find('input').val(counter)
                        } else {
                            counter = 1;
                        }
                    }
                },
                {
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg> Agr. LT`,
                    attr: { title: 'Agregar Lotes' },
                    className: 'btn btn-secondary min',
                    action: function () {
                        LOTEO()
                    }
                }
            ],
            searching: false,
            language: languag2,
            lengthMenu: [-1],
            deferRender: true,
            info: false,
            autoWidth: false,
            paging: true,
            order: [[1, 'asc'], [2, 'asc']],
            responsive: true,
            columnDefs: [
                { className: 'control', orderable: true, targets: 0 },
                { responsivePriority: 1, targets: [1, 2, 3, 4, 7] },
                { responsivePriority: 2, targets: 5 },
                { responsivePriority: 10003, targets: 6 },
                { responsivePriority: 10002, targets: 8 }
            ],
            initComplete: function (settings, json) {
                $('#agrmz').find('input').val('no');
            },
            createdRow: function (row, data, dataIndex) {
                /*console.log(data, row)
                if (!data[2]) {
                    $(row).find('td').attr('colspan', '8');
                }*/
            }
        });
        var LOTEO = () => {
            var q = 'no', cont = 0;
            if (!$('#agrmz').find('input').val()) {
                $('#agrmz').find('input').val('no')
            } else if (parseFloat($('#agrmz').find('input').val()) > 0) {
                q = counter
            }
            lotes.row.add([
                '',
                `<input class="text-center mz" type="text" value="${q}" name="mz" style="width: 100%;" required>`,
                `<input class="text-center lt" type="text" value="${loteo}" name="n" style="width: 100%;" required>`,
                `<input class="text-center mt2" type="text" name="mtr2" style="width: 100%;" required>`,
                `<input class="text-center vmt2" type="text" value="${$('#vmt2').val()}" name="vmtr2" style="width: 100%;" data-mask="000.000.000" data-mask-reverse="true" data-mask-selectonfocus="true" required>`,
                `<input class="text-center vrlt" type="text" name="vrlt" style="width: 100%;" data-mask="000.000.000" data-mask-reverse="true" data-mask-selectonfocus="true" required>`,
                `<input class="text-center vri" type="text" name="vri" style="width: 100%;" data-mask="000.000.000" data-mask-reverse="true" data-mask-selectonfocus="true" required>`,
                `<select size="1" class="text-center std" name="std" required>
                    <option value="9" selected="selected">Disponible</option>
                    <option value="15">Inactivo</option>
                    <option value="13">Vendido</option>
                </select>`,
                `<textarea class="linderos" placeholder="Estipula aqui los linderos del lote" 
                name="descripcion" rows="1" autocomplete="off" style="width: 100%;"></textarea>`,
                `<a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg></a>`
            ]).columns.adjust().draw(false);
            $('.vmt2, .vrlt, .vri').mask('#.##$', { reverse: true, selectOnFocus: true });
            loteo++
            lotes
                .column(2)
                .data()
                .filter(function (value, index) {
                    cont++
                    $('#lts').val(cont);
                });
        }
        $('#agmz').on({
            focus: function () {
                this.select();
            },
            change: function () {
                $('#mzs').val($(this).val())
                if ($(this).val() == 1) {
                    loteo = 1;
                    lotes.rows().remove().draw(false);
                    LOTEO()
                } else if ($(this).val() === 'no') {
                    loteo = 1;
                    lotes.rows().remove().draw(false);
                    $('#mzs').val(0)
                    LOTEO()
                }
            }
        });
        lotes.on('change', 'tr .mt2, .vmt2', function () {
            var sum = 0, vrproy = 0, valor = 0, fila = $(this).parents('tr');
            if ($(this).hasClass('vmt2')) {
                $('#vmt2').val(0);
                valor = fila.find('.mt2').val() * $(this).cleanVal();
            } else {
                valor = $(this).val() * fila.find('.vmt2').cleanVal();
            }
            var inicial = valor * $('#porcentage').val() / 100;
            fila.find('.vrlt').val(Moneda(valor))
            fila.find('.vri').val(Moneda(inicial))
            $('.mt2').each(function (index, element) {
                if ($(this).val()) {
                    sum += parseFloat($(this).val())
                }
            });
            $('.vrlt').each(function (index, element) {
                if ($(this).val()) {
                    vrproy += parseFloat($(this).cleanVal())
                }
            });
            $('#tmt2').val(sum)
            $('#valproyect').val(Math.round(vrproy));
            $('.valproyect').html('$ ' + Moneda(Math.round(vrproy)));
        });
        lotes.on('click', 'tr a', function () {
            var sum = 0, vrproy = 0, fila = $(this).parents('tr'), cont = 0, mz = null;
            lotes.row(fila).remove().draw(false);
            $('.mt2').each(function (index, element) {
                if ($(this).val()) {
                    sum += parseFloat($(this).val())
                }
            });
            $('.vrlt').each(function (index, element) {
                if ($(this).val() !== mz) { mz++ }
            });
            $('.mz').each(function (index, element) {
                if ($(this).val()) {
                    vrproy += $(this).cleanVal()
                }
            });
            $('#tmt2').val(sum)
            $('#valproyect').val(Math.round(vrproy));
            $('.valproyect').html('$ ' + Moneda(Math.round(vrproy)));
            loteo--;
            lotes
                .column(2)
                .data()
                .filter(function (value, index) {
                    cont++
                    $('#lts').val(cont);
                });
        });

        $("#reportrange").daterangepicker({
            locale: {
                'format': 'YYYY/MM/DD',
                'separator': ' - ',
                'applyLabel': 'Aplicar',
                'cancelLabel': 'Cancelar',
                'fromLabel': 'De',
                'toLabel': '-',
                'customRangeLabel': 'Personalizado',
                'weekLabel': 'S',
                'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                'firstDay': 1
            },
            startDate: start,
            endDate: end,
            ranges: {
                '6 Meses': [moment(), moment().add(5, 'month')],
                '1 Año': [moment(), moment().add(1, 'year')],
                '1 Año y medio': [moment(), moment().add(17, 'month')],
                '2 Años': [moment(), moment().add(2, 'year')],
                '2 Años y medio': [moment(), moment().add(29, 'month')],
                '3 Años': [moment(), moment().add(3, 'year')],
                '3 Años y medio': [moment(), moment().add(41, 'month')],
                '4 Años': [moment(), moment().add(4, 'year')]
            }
        }, function (start, end, l) {
            $("#reportrange span").html(start.format("ll") + " - " + end.format("ll"));
            $('#inicio').val(start.format("YYYY-MM-DD"))
            $('#fin').val(end.format("YYYY-MM-DD"))
            SMSj('success', 'La fecha se establecio en ' + l)
        });
    });
    // Math.floor()
    var STAD = (std) => {
        $('#datatable').DataTable().columns(4).search(std).draw();
    }
    function Dtas(n) {
        var table = $('#datatable').DataTable({
            dom: 'Bfrtip',
            lengthMenu: [
                [10, 25, 50, -1],
                ['10 filas', '25 filas', '50 filas', 'Ver todo']
            ],
            buttons: [
                {
                    text: `<input id="min" type="text" class="edi text-center" style="width: 60px; padding: 1px;"
                placeholder="MZ">`,
                    attr: {
                        title: 'Busqueda por MZ',
                        id: ''
                    },
                    className: 'btn btn-secondary min'
                },
                {
                    text: `<input id="max" type="text" class="edi text-center" style="width: 60px; padding: 1px;"
                placeholder="LT">`,
                    attr: {
                        title: 'Busqueda por LT',
                        id: ''
                    },
                    className: 'btn btn-secondary max'
                },
                {
                    extend: 'pageLength',
                    text: 'VER',
                    orientation: 'landscape'
                },
                {
                    extend: 'collection',
                    text: 'STDS',
                    orientation: 'landscape',
                    buttons: [
                        {
                            text: 'COPIAR',
                            extend: 'copy'
                        },
                        {
                            text: `DISPONIBLES`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD('Disponible');
                            }
                        },
                        {
                            text: `INACTIVOS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD('Inactivo');
                            }
                        },
                        {
                            text: `APARTADOS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD('Apartado');
                            }
                        },
                        {
                            text: `SEPARADOS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD('Separado');
                            }
                        },
                        {
                            text: `VENDIDOS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD('Vendido');
                            }
                        },
                        {
                            text: `TODOS`,
                            className: 'btn btn-secondary',
                            action: function () {
                                STAD('');
                            }
                        }
                    ]
                }
            ],
            language: languag2,
            ajax: {
                method: "POST",
                url: "/links/productos/" + n,
                dataSrc: "data"
            },
            columns: [
                {
                    className: 'control',
                    orderable: true,
                    data: null,
                    defaultContent: ''
                },
                { data: "mz" },
                { data: "n" },
                { data: "mtr2" },
                {
                    data: "estado",
                    className: 'c',
                    render: function (data, method, row) {
                        switch (data) {
                            case 1:
                                return `<span class="badge badge-pill badge-warning" title="Estado en el que aun no se a ingresado ningun pago desde el momento de la separacion\nLote ${row.id}">Pendiente</span>`
                                break;
                            case 8:
                                return `<span class="badge badge-pill badge-secondary" title="Pago que se encuentra pendiente de aprobar por el area de contabilidad\nLote ${row.id}">Tramitando</span>`
                                break;
                            case 9:
                                return `<span class="badge badge-pill badge-success" title="Disponible para la venta\nLote ${row.id}">Disponible</span>`
                                break;
                            case 10:
                                return `<span class="badge badge-pill badge-info" title="Pago total del valor de la cuota inicial del lote\nLote ${row.id}">Separado</span>`
                                break;
                            case 12:
                                return `<span class="badge badge-pill badge-dark" title="Primer pago que se le realiza al lote por concepto de separacion\nLote ${row.id}">Apartado</span>`
                                break;
                            case 13:
                                return `<span class="badge badge-pill badge-tertiary" title="Pago total del valor del lote\nLote ${row.id}">Vendido</span>`
                                break;
                            case 14:
                                return `<span class="badge badge-pill badge-danger">Tramitando</span>`
                                break;
                            case 15:
                                return `<span class="badge badge-pill badge-warning" title="No posee ninguna orden en el sistema\nLote ${row.id}">Inactivo</span>` //secondary
                                break;
                        }
                    }
                },
                {
                    data: "valor",
                    render: $.fn.dataTable.render.number('.', '.', 2, '$')
                },
                {
                    data: "inicial",
                    render: $.fn.dataTable.render.number('.', '.', 0, '$')
                },
                {
                    data: "mtr2",
                    render: function (data, method, row) {
                        return '$' + Moneda(Math.round(row.valor / data));
                    }
                }
            ],
            deferRender: true,
            autoWidth: true,
            paging: true,
            search: {
                regex: true,
                caseInsensitive: true,
            },
            responsive: true,
            initComplete: function (settings, json) {
                $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
                $('#datatable_filter').hide()
                $('#ModalEventos').modal('hide');
            },
            columnDefs: [
                //{ "visible": false, "targets": 1 }
            ],
            order: [[1, 'asc'], [2, 'asc']],
            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(1, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            `<tr class="group" style="background: #EB0C5A; color: #FFFFCC;">
                                <td colspan="8">
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
                if (data["estado"] == 9) {
                    $(row).css({ "background-color": "#0CDDEB", "color": "#FFFFFF" });
                } else if (data["estado"] == 12) {
                    $(row).css("background-color", "#00FFFF");
                } else if (data["estado"] == 8) {
                    $(row).css("background-color", "#FFFFCC");
                } else if (data["estado"] == 10) {
                    $(row).css("background-color", "#40E0D0");
                } else if (data["estado"] == 1) {
                    $(row).css({ "background-color": "#162723", "color": "#FFFFFF" });
                } else if (data["estado"] == 13) {
                    $(row).css("background-color", "#40E0D0");
                } /*else if (data["estado"] == 15) {
                    $(row).css({ "background-color": "#C61633", "color": "#FFFFFF" });
                }*/
            }
        });
        $('#min, #max').on('keyup', function () {
            var col = $(this).attr('id') === 'min' ? 1 : 2;
            var buscar = this.value ? "^" + this.value + "$" : '';
            table
                .columns(col)
                .search(buscar, true, false, true)
                .draw();
        });
    }
    $('#datatable').on('click', 'tr .c', function () {
        var fila = $(this).parents('tr');
        var data = $('#datatable').DataTable().row(fila).data();
        //var data = $('#datatable').DataTable().row(this).data();
        var ya = moment(Date()).format('YYYY-MM-DD HH:mm')
        if (data.estado === 9 || data.estado === 14) {
            $('#ModalEventos').modal({
                toggle: true,
                backdrop: 'static',
                keyboard: true,
            });
            fila.toggleClass('selected');
            $('#proyecto').val();
            $('#idproyecto').val();
            var url = `/links/orden?id=${data.id}&h=${ya}`;
            $(location).attr('href', url);
        } else {
            SMSj('info', 'Este Producto no se encuentra disponible')
        }
    });
    $('#datatable2').on('click', '.to button', function () {
        var fila = $(this).parents('tr');
        var data = $('#datatable2').DataTable().row(fila).data();
        if ($(this).parent().prev().val().indexOf(".") > 0 && data.valmtr2 > 0) {
            var datos = { valor: $(this).parent().prev().cleanVal() };
            $('#ModalConfir').modal('toggle');
            $('#bt').on('click', function () {
                $('#ModalEventos').modal({
                    toggle: true,
                    backdrop: 'static',
                    keyboard: true,
                });
                $.ajax({
                    type: "PUT",
                    url: "/links/productos/" + data.id,
                    data: datos,
                    async: false,
                    success: function (data) {
                        $("#datatable2").DataTable().ajax.reload(function (json) {
                            $('#ModalEventos').modal('hide')
                            SMSj('success', 'Nuevo precio del metro cuadrador establecido correctamente')
                            //$("#datatable").DataTable().ajax.reload();
                        })
                    }
                })
            })
        } else if (data.valmtr2 == 0) {
            $("#datatable2").DataTable().ajax.reload(function (json) {
                SMSj('error', 'En este PROYECTO no es posible cambiar el valor del MTR2 ya que varia en los SUBPRODUCTOS de el')
            })
        } else {
            SMSj('error', 'Debe digitar un precio antes de actualizar los datos')
        }

    })
    // Ver Productos
    $('#datatable2').on('click', '.tu', function () {
        var fila = $(this).parents('tr');
        var data = $('#datatable2').DataTable().row(fila).data();
        fila.toggleClass('selected');
        $('#ModalEventos').modal({
            toggle: true,
            keyboard: true,
        });
        $("#cuadro2").show("slow");
        $("#cuadro1").hide("slow");
        $("#cuadro3").hide("slow");
        $("#cuadro4").hide("slow");
        $('#proyecto').val(data.nombre);
        $('#idproyecto').val(data.id);

        if (recargada) {
            recargada = false;
            Dtas(data.id)
        } else if (data.id !== dataid) {
            dataid = data.id;
            $('#datatable').DataTable().ajax.url("/links/productos/" + data.id).load(function () {
                $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
                $('#ModalEventos').modal('hide')
            });
        } else {
            $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
            $('#ModalEventos').modal('hide');
        }
    });
    $('#datatable2').on('click', '.to', function () {
        $(this).find('input').mask('#.##$', { reverse: true });
        $(this).find('input').select()
    });
    var subirExcel = () => {
        var formData = new FormData(document.getElementById("productoExcel"));
        $.ajax({
            url: '/links/excelcrearproducto',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                $('#ModalEventos').modal('toggle');
            },
            success: function (data) {
                if (data.res) {
                    SMSj('success', data.msg)
                } else {
                    SMSj('error', data.msg)
                }
                $('#fileExcel').val(null)
            }
        });
    }
    var table2 = $('#datatable2').DataTable({
        dom: 'Bfrtip',
        buttons: rol.subadmin && ['pageLength',
            /* {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" data-feather="file-text"></i> <span class="align-middle">+ Producto</span>
                        </div>`,
                attr: {
                    title: 'Fecha',
                    id: 'facturar'
                },
                className: 'btn btn-secondary',
                action: function () {
                    tabledit.ajax.url("/links/productos/0").load(function () {
                        tabledit.columns.adjust().draw();
                    });
                    $('#ideditar').val('');
                    $('.datatabledit').hide();
                    $('#cuadro3 input').val('');
                    $('#vmt2').val('0');
                    $('input[name="incentivo"]').val('0');
                    $('#mzs').val(0);
                    $('#lts').val(0);
                    $("#cuadro1").hide("slow");
                    $("#cuadro4").hide("slow");
                    $("#cuadro3").show("slow");
                    $("#reportrange span").html(start.format("ll") + " - " + end.format("ll"));
                    $('#inicio').val(start.format("YYYY-MM-DD"))
                    $('#fin').val(end.format("YYYY-MM-DD"))
                }
            } */
            {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" data-feather="file-text"></i> <span class="align-middle">Crear</span>
                        </div>`,
                attr: {
                    title: 'Descarga formato excel para crear productos',
                    id: 'crear'
                },
                className: 'btn btn-secondary',
                action: function () {
                    window.location.href = '/uploads/CREACION DE PRODUCTOS.xlsx';
                }
            }, {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" type="file" name="image" data-feather="file-text"></i> <span class="align-middle">Subir</span>
                        </div>`,
                attr: {
                    title: 'Sube un excel para crear productos',
                    id: 'subir'
                },
                className: 'btn btn-secondary',
                action: function () {
                    $('#fileExcel').click();
                    //window.location.href = '/uploads/CREACION DE PRODUCTOS.xlsx';
                }
            }
        ],
        deferRender: true,
        autoWidth: false,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        order: [[1, "desc"]],
        columnDefs: [
            { "visible": rol.subadmin ? true : false, "targets": [7, 5, -1] },
            { responsivePriority: 1, targets: -1 },
            { responsivePriority: 2, targets: 3 },
            { responsivePriority: 3, targets: 7 },
            { responsivePriority: 4, targets: 6 }
        ],
        language: languag2,
        ajax: {
            method: "POST",
            url: "/links/productos",
            dataSrc: "data"
        },
        columns: [
            {
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },
            { data: "id", className: 'tu' },
            { data: "proyect", className: 'tu' },
            {
                data: "fechaini", className: 'tu',
                render: function (data, method, row) {
                    return moment.utc(data).format('ll')
                }
            },
            { data: "porcentage", className: 'tu' },
            { data: "totalmtr2", className: 'tu' },
            {
                data: "valmtr2", className: 'to',
                render: function (data, method, row) {
                    return rol.admin ? `<div class="input-group">
                                <input type="text" class="form-control-no-border text-center edi"
                                    autocomplete="off" style="padding: 1px; width: 60px;" value="${Moneda(data)}">
                                <span class="input-group-append">
                                    <button class="btn btn-primary btn-sm"
                                        type="button">ok</button>
                                </span>
                            </div>` : Moneda(data)
                }
            },
            {
                data: "valproyect", className: 'tu',
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            { data: "mzs", className: 'tu' },
            { data: "cantidad", className: 'tu' },
            {
                data: "estados", className: 'tu',
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-info">Procesando</span>`
                            break;
                        case 11:
                            return `<span class="badge badge-pill badge-danger">Agotado</span>`
                            break;
                        case 10:
                            return `<span class="badge badge-pill badge-badge-secondary">Vendido</span>`
                            break;
                        case 7:
                            return `<span class="badge badge-pill badge-success">Activo</span>`
                            break;
                    }
                }
            },
            {
                className: 'lista',
                data: "id",
                render: function (data, method, row) {
                    return `<a href="javascript:LISTAS(${data}, '${row.fechaini}', '${row.fechafin}', '${row.proyect}');" title="Click aqui para descargar lista de lotes disponibles"><i class="fas fa-file-alt"></i></a>`
                }
            },
            {
                className: 'restablecer',
                orderable: false,
                data: null,
                defaultContent: `<div class="dropdown">
                <button type="button" class="btn btn-sm btn-outline-dark dropdown-toggle" data-toggle="dropdown">Acción</button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item estado">True || False</a>
                        <a class="dropdown-item editar">Editar</a>
                        <a class="dropdown-item eliminar">Eliminar</a>
                    </div>
                </div>`
            }
        ]
    });
    table2.on('click', '.eliminar', function () {
        var mensaje = confirm("¿Seguro deseas eliminar este LOTE?");
        if (mensaje) {
            $('#ModalEventos').modal({
                toggle: true,
                backdrop: 'static',
                keyboard: true,
            });
            var fila = $(this).parents('tr');
            var data = table2.row(fila).data();
            var datos = { id: data.id };

            $.ajax({
                type: 'POST',
                url: '/links/productos/eliminar',
                data: datos,
                async: true,
                success: function (data) {
                    if (data) {
                        table2.ajax.reload(null, false)
                        //table2.columns.adjust().draw();
                        $('#ModalEventos').modal('hide')
                        SMSj('error', 'Proyecto eliminado correctamente')
                    }
                }
            })
        }
    });
    /////////////////////* EDITAR *///////////////////////////
    var tabledit = $('#datatabledit').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pageLength',
                text: '<i class="align-middle feather-md" data-feather="calendar"></i>',
                orientation: 'landscape'
            }, //
            {
                text: `<i class="align-middle" data-feather="plus-circle"></i>`,
                attr: { title: 'Agregar Lotes' },
                className: 'btn btn-secondary min',
                action: function () {
                    $('#Modaledit').modal('toggle')
                }
            }
        ],
        ajax: {
            method: "POST",
            url: "/links/productos/0",
            dataSrc: "data"
        },
        columns: [
            {
                data: "mz",
                render: function (data, method, row) {
                    return `<input class="text-center mz" type="text" name="mz" value="${data}" style="width: 100%;">`
                }
            },
            {
                data: "n",
                render: function (data, method, row) {
                    return `<input class="text-center lt" value="${data}" type="text" name="n" style="width: 100%;" required>`
                }
            },
            {
                data: "mtr2",
                render: function (data, method, row) {
                    return `<input class="text-center mt2" value="${data}" type="text" name="mtr2" style="width: 100%;" required>`
                }
            },
            {
                data: "mtr",
                render: function (data, method, row) {
                    return `<input class="text-center mtr" value="${Moneda(data)}" type="text" name="mtr" style="width: 100%;" ${$('.alterable').val() === 'no' ? 'disabled' : ''} required>`
                }
            },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-info" title="Editado por \nultima ves \n${row.ediitado}">Pendiente</span>`
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-dark" title="Editado por \nultima ves \n${row.ediitado}">Tramitando pago</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success" title="Editado por \nultima ves \n${row.ediitado}">Disponible</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="9">Disponible</option>
                                <option value="15">Inactivo</option>
                            </select>`
                            break;
                        case 10:
                            return `<span class="badge badge-pill badge-primary" title="Editado por \nultima ves \n${row.ediitado}">Separado</span>`
                            break;
                        case 12:
                            return `<span class="badge badge-pill badge-secondary" title="Editado por \nultima ves \n${row.ediitado}">Apartado</span>`
                            break;
                        case 13:
                            return `<span class="badge badge-pill badge-tertiary" title="Editado por \nultima ves \n${row.ediitado}">Vendido</span>`
                            break;
                        case 14:
                            return `<span class="badge badge-pill badge-danger" title="Editado por \nultima ves \n${row.ediitado}">Tramitando</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="9">Disponible</option>
                                <option value="15">Inactivo</option>
                            </select>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-warning" title="Editado por \nultima ves \n${row.ediitado}">Inactivo</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="15">Inactivo</option>
                                <option value="9">Disponible</option>
                            </select>` //secondary
                            break;
                    }
                }
            },
            {
                data: "valor",
                render: function (data, method, row) {
                    return `<span class="badge badge-pill badge-dark valor2">${Moneda(data)}</span>
                    <input class="valor" type="hidden" name="valor" value="${data}">`
                }
            },
            {
                data: "inicial",
                render: function (data, method, row) {
                    return `<span class="badge badge-pill badge-dark inicial2">${Moneda(data)}</span>
                    <input class="inicial" type="hidden" name="inicial" value="${data}">`
                }
            },
            {
                data: "descripcion",
                render: function (data, method, row) {
                    return `<textarea class="form-control-no-border float-right mr-1 descripcion" placeholder="Estipula aqui los linderos del lote" 
                        name="descripcion" rows="1" autocomplete="off" style="width: 100%;">${data !== null ? data : ''}</textarea>`
                }
            },
            {
                orderable: false,
                data: null,
                defaultContent: `<a class="no float-right"><i class="align-middle mr-2 fas fa-fw fa-trash"></i></i></a>`
            }
        ],
        //stateSave: true,
        //stateDuration: -1,
        searching: false,
        language: languag2,
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        deferRender: true,
        info: false,
        autoWidth: false,
        paging: true,
        responsive: {
            /*details: {
                type: 'column'
            }*/
            details: {
                display: $.fn.dataTable.Responsive.display.childRowImmediate,
                type: 'none',
                target: ''
            }
        },
        fixedHeader: {
            header: true,
            footer: true
        },
        initComplete: function (settings, json) {
            if ($('#cuadro3').is(':visible')) {
                $('#ModalEventos').modal('toggle');
                $('#ModalEventos').modal('hide')
                //$(`#datatabledit input[name="valor"]`).mask('000.000.000', { reverse: true });
                //$(`#datatabledit input[name="inicial"]`).mask('000.000.000', { reverse: true });
            }
        },
        columnDefs: [
            //{ "visible": false, "targets": 1 }
            { responsivePriority: 1, targets: -1 },
            //{ responsivePriority: 10001, targets: -3 }
        ],
        order: [[0, 'asc'], [1, 'asc']],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        `<tr class="group" style="background: #7f8c8d; color: #FFFFCC;">
                                <td colspan="9">
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
            if (data["estado"] == 9) {
                $(row).css("background-color", "#39E9CC");
            } else if (data["estado"] == 15) {
                $(row).css("background-color", "#FFFFCC");
            }
        }
    });
    var Recorrer = (n) => {
        var totalmetros2 = 0, totalotes = 0, totalmzs = 0, valorproyecto = 0;
        tabledit
            .rows()
            .data()
            .filter(function (value, index) {
                totalmetros2 += parseFloat(value.mtr2)
                totalotes = index + 1
                valorproyecto += value.valor
                if (value.mz === 'no' && index === 1) {
                    totalmzs = 0
                } else if (value.mz !== 'no' && value.mz != totalmzs) {
                    totalmzs++
                }
            });
        $('#datatabledit .lts').val(totalotes)
        $('#datatabledit .mzs').val(totalmzs)
        $('#totalmtrs2').val(totalmetros2.toFixed(3))
        $('#valorproyect').val(Math.round(valorproyecto));
        $('#datatabledit .totalproyect').val('$' + Moneda(Math.round(valorproyecto)));

        var a = $('#cabezal').find('input, textarea, select').serialize();
        //var b = tabledit.$('input, textarea, select').serialize();
        $.ajax({
            type: 'POST',
            url: '/links/productos/update',
            data: a,
            async: true,
            beforeSend: function (xhr) {
                //tabledit.state.save();
            },
            success: function (data) {
                if (data) {
                    tabledit.ajax.reload(null, false)
                    SMSj('success', 'Actualizacion exitosa')
                }
            }
        })
    }
    $('#Modaledit').on('click', '#mas', function (e) {
        e.preventDefault()
        var datos = $('#Modaledit #mast').serialize();
        $('#Modaledit').modal('toggle');
        $.ajax({
            type: 'POST',
            url: '/links/productos/nuevo',
            data: datos,
            async: true,
            success: function (data) {
                if (data) {
                    //tabledit.ajax.reload(null, false)
                    tabledit.ajax.reload(function (json) {
                        tabledit.columns.adjust().draw();
                        Recorre(0)
                        SMSj('success', 'Subproducto agregado correctamente')
                    })
                }
            }
        })
    })
    $('#Modaledit').on('change', '.mt2', function () {
        var valor = $(this).val() * $('#vmt2').cleanVal();
        var inicial = valor * $('#porcentage').val() / 100;
        $('#Modaledit input[name="valor"]').val(valor);
        $('#Modaledit input[name="inicial"]').val(inicial);
        $('#Modaledit #va').html('$ ' + Moneda(Math.round(valor)));
        $('#Modaledit #in').html('$ ' + Moneda(Math.round(inicial)));
        Recorre($(this).val() || 0)
    });
    $('#Modaledit').one('hidden.bs.modal', function () {
        $('#Modaledit .edi, #Modaledit textarea').val('')
        Recorre(0)
    })
    tabledit.on('click', '.no', function () {
        var fila = $(this).parents('tr');
        var data = tabledit.row(fila).data();
        if (data.estado == 9 || data.estado == 15) {
            var mensaje = confirm("¿Seguro deseas eliminar este LOTE?");
            if (mensaje) {
                $('#ModalEventos').modal({
                    toggle: true,
                    backdrop: 'static',
                    keyboard: true,
                });
                var datos = { id: data.id, prod: data.producto };
                $.ajax({
                    type: 'POST',
                    url: '/links/productos/emili',
                    data: datos,
                    async: true,
                    success: function (data) {
                        if (data) {
                            tabledit.ajax.reload(function (json) {
                                tabledit.columns.adjust().draw();
                                Recorre(0)
                                $('#ModalEventos').modal('hide')
                                SMSj('error', 'Proyecto eliminado correctamente')
                            })
                        }
                    }
                })
            }
        } else {
            SMSj('error', 'El subproducto no se puede eliminar ya que no se encuentra en un estado disponible')
        }
    });
    tabledit.on('click', 'tr span:not(.t)', function () {
        var fila = $(this).parents('tr');
        var data = tabledit.row(fila).data();
        if (data.estado == 9 || data.estado == 15) {
            var este = $(this), aquel = $(this).siblings()
            este.hide()
            aquel.fadeToggle(2000)
            setTimeout(function () {
                aquel.hide()
                este.fadeToggle(2000)
            }, 9000);
        }
    })
    tabledit.on('change', '.cabezal', function () {
        Recorrer()
    });
    tabledit.on('change', 'tr input:not(.edi, .c), textarea, select:not(.edi, .c)', function () {
        var fila = $(this).parents('tr');
        var data = tabledit.row(fila).data();
        if (data.estado == 9 || data.estado == 15) {
            if ($(this).hasClass('mt2')) {
                var estevalr = parseFloat($(this).val());
                var xcntag = parseFloat($('#xcntag').val());
                var v = parseFloat($('#valmtr2').cleanVal());
                var valmt2 = v == 0 ? data.mtr : v;
                var vr = estevalr * valmt2;
                var ini = (estevalr * valmt2) * xcntag / 100
                fila.find(`.valor`).val(vr)
                fila.find(`.inicial`).val(ini)
                fila.find(`.valor2`).html(Moneda(vr))
                fila.find(`.inicial2`).html(Moneda(ini))
            }
            var totalmetros2 = 0, totalotes = 0, totalmzs = 0, valorproyecto = 0;
            tabledit
                .rows()
                .data()
                .filter(function (value, index) {
                    totalmetros2 += parseFloat(value.mtr2)
                    totalotes = index + 1
                    valorproyecto += value.valor
                    if (value.mz === 'no' && index === 1) {
                        totalmzs = 0
                    } else if (value.mz !== 'no' && value.mz != totalmzs) {
                        totalmzs++
                    }
                });
            $('#datatabledit .lts').val(totalotes)
            $('#datatabledit .mzs').val(totalmzs)
            $('#totalmtrs2').val(totalmetros2.toFixed(3))
            $('#valorproyect').val(Math.round(valorproyecto));
            $('#datatabledit .totalproyect').val('$' + Moneda(Math.round(valorproyecto)));
            //fila.find('.mtr').prop('disabled')
            //fila.find('.mtr').is(':disabled') ? j = true : '';
            fila.find('.mtr').prop('disabled', false);
            var a = $('#cabezal').find('input, textarea, select').serialize();
            var b = fila.find('input, textarea, select').serialize();
            var d = a + '&idlote=' + data.id + '&' + b;
            $.ajax({
                type: 'POST',
                url: '/links/productos/update',
                data: d,
                async: true,
                beforeSend: function (xhr) {
                    //tabledit.state.save();
                },
                success: function (data) {
                    if (data) {
                        tabledit.ajax.reload(null, false)
                        SMSj('success', 'Actualizacion exitosa')
                    }
                }
            })
            return false;
        } else {
            SMSj('success', 'El subproducto no se puede eliminar ya que no se encuentra en un estado disponible')
            fila.find(`.mz`).val(data.mz)
            fila.find(`.lt`).val(data.n)
            fila.find(`.mt2`).val(data.mtr2)
            fila.find(`.valor`).val(Moneda(data.valor))
            fila.find(`.inicial`).val(Moneda(data.inicial))
            fila.find(`.valor2`).html(Moneda(data.valor))
            fila.find(`.inicial2`).html(Moneda(data.inicial))
            fila.find(`.descripcion`).val(data.descripcion)
        }
    });
    table2.on('click', '.editar', function () {
        var fila = $(this).parents('tr');
        var data = table2.row(fila).data();
        var datos = { id: data.id };
        $.ajax({
            type: 'POST',
            url: '/links/productos/editar',
            data: datos,
            async: true,
            beforeSend: function (xhr) {
                $("#datatabledit select option[value='0']").prop("selected", true);
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            success: function (data) {
                if (data) {
                    $('#ideditar').val(data.id)
                    $(`#datatabledit select[name="categoria"] option[value='${data.categoria}']`).prop("selected", true);
                    $(`#datatabledit .comision option[value='${data.comision.toString()}']`).prop("selected", true);
                    $(`#datatabledit .maxcomis option[value='${data.maxcomis.toString()}']`).prop("selected", true);
                    $(`#datatabledit .linea1 option[value='${data.linea1.toString()}']`).prop("selected", true);
                    $(`#datatabledit .linea2 option[value='${data.linea2.toString()}']`).prop("selected", true);
                    $(`#datatabledit .linea3 option[value='${data.linea3.toString()}']`).prop("selected", true);
                    $(`#xcntag option[value='${data.porcentage.toString()}']`).prop("selected", true);
                    $(`.title`).val(data.proyect);
                    $('#totalmtrs2').val(data.totalmtr2)
                    $('#valmtr2').val(Moneda(data.valmtr2)).prop('disabled', true)
                    $('.alterable').val(data.valmtr2 ? 'no' : 'si')
                    $('.lts').val(data.cantidad)
                    $('.mzs').val(data.mzs)
                    $(`#datatabledit input[name="separacion"]`).val(Moneda(data.separaciones))
                    $(`#datatabledit input[name="incentivo"]`).val(Moneda(data.incentivo) || 0)
                    $('.totalproyect').val('$' + Moneda(data.valproyect))
                    $('#totalproyect').val(data.valproyect)
                    var fi = moment(data.fechaini);
                    var ff = moment(data.fechafin);
                    $("#rangofechas span").html(fi.format("ll") + " - " + ff.format("ll"));
                    $('#finicio').val(fi.format("YYYY-MM-DD"))
                    $('#ffin').val(ff.format("YYYY-MM-DD"))
                    $("#cuadro2").hide("slow");
                    $("#cuadro1").hide("slow");
                    $("#cuadro3").hide("slow");
                    $("#cuadro4").show("slow");
                    tabledit.ajax.url("/links/productos/" + data.id).load(function () {
                        tabledit.columns.adjust().draw();
                        $('#ModalEventos').modal('hide')
                        $("#rangofechas").daterangepicker({
                            locale: {
                                'format': 'YYYY/MM/DD',
                                'separator': ' - ',
                                'applyLabel': 'Aplicar',
                                'cancelLabel': 'Cancelar',
                                'fromLabel': 'De',
                                'toLabel': '-',
                                'customRangeLabel': 'Personalizado',
                                'weekLabel': 'S',
                                'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                                'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                                'firstDay': 1
                            },
                            startDate: fi,
                            endDate: ff,
                            ranges: {
                                '6 Meses': [moment(), moment().add(5, 'month')],
                                '1 Año': [moment(), moment().add(1, 'year')],
                                '1 Año y medio': [moment(), moment().add(17, 'month')],
                                '2 Años': [moment(), moment().add(2, 'year')],
                                '2 Años y medio': [moment(), moment().add(29, 'month')],
                                '3 Años': [moment(), moment().add(3, 'year')],
                                '3 Años y medio': [moment(), moment().add(41, 'month')],
                                '4 Años': [moment(), moment().add(4, 'year')]
                            }
                        }, function (start, end, ll) {
                            $("#rangofechas span").html(start.format("ll") + " - " + end.format("ll"));
                            $('#finicio').val(start.format("YYYY-MM-DD"))
                            $('#ffin').val(end.format("YYYY-MM-DD"))
                            Recorrer()
                        });
                        //Recorre(0)
                    });
                }
            }
        })
    });

    /*
    $('#lts').change(function () {
        var val = $(this).val(), i = 1, e;
        $('#sololotes tr').remove();
        $('#sololotes2 tr').remove();
        while (i <= val) {
            if (i % 2 === 1) {
                $('#sololotes tbody').append(`
                    <tr>
                        <th>
                            <div class="text-left">                                    
                                <i class="feather-md" data-feather="heart"></i> LT 
                                <input class="form-control-no-border text-center lt" value="${i}" type="text" style="padding: 1px; width: 30px; background-color: #FFFFCC;" name="n" required>
                            </div>
                        </th>
                        <th>
                            <div class="text-left">
                            MT² <input class="form-control-no-border text-center mt2" type="text" placeholder="0" style="padding: 1px; width: 50px; background-color: #FFFFCC;" name="mtr2" required>
                                <span class="badge badge-dark text-center text-md-center float-right">$0.000.000.000</span>
                                <input type="checkbox" class="float-right mr-1" name="estado" value="9" checked>
                                <input type="hidden" name="valor">
                                <input type="hidden" name="inicial" value="">
                           </div>
                        </th>  
                        <th>
                            <textarea class="form-control-no-border float-right mr-1" placeholder="Estipula aqui los linderos del lote" 
                            name="descripcion" cols="60" rows="1" autocomplete="off" style="background-color: #FFFFCC;"></textarea>
                        </th>
                    </tr>
                `);
            } else {
                $('#sololotes2 tbody').append(`
                    <tr>
                        <td>
                            <div class="text-left">                                    
                                <i class="feather-md" data-feather="heart"></i> LT 
                                <input class="form-control-no-border text-center lt" value="${i}" type="text" style="padding: 1px; width: 30px; background-color: #FFFFCC;" name="n" required>
                            </div>
                        </td>
                        <td>
                            <div class="text-left">
                                <i class="feather-md" data-feather="heart"></i> MT² 
                                <input class="form-control-no-border text-center mt2" type="text" placeholder="0" style="padding: 1px; width: 50px; background-color: #FFFFCC;" name="mtr2" required>
                                <span class="badge badge-dark text-center text-md-center float-right">$0.000.000.000</span>
                                <input type="checkbox" class="float-right mr-1" name="estado" value="9" checked>
                                <input type="hidden" name="valor">
                                <input type="hidden" name="inicial" value="">
                           </div>
                        </td>  
                        <td>
                            <textarea class="form-control-no-border float-right mr-1" placeholder="Estipula aqui los linderos del lote" 
                            name="descripcion" cols="60" rows="1" autocomplete="off" style="background-color: #FFFFCC;"></textarea>
                        </td>  
                    </tr>
                `);
            }
            i++;
        };
    });
    */
};
/////////////////////////////* ORDEN */////////////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/orden` && !rol.externo) {
    var fch = new Date();
    var Meses = (extra) => {
        var fechs = new Date($('#fechs').val());
        var months = fechs.getMonth() - fch.getMonth() + (12 * (fechs.getFullYear() - fch.getFullYear()));
        months += extra
        fechs = new Date(moment(fechs).add(extra, 'month'));

        if (months > 102) {
            $('#ncuotas').html(`           
            <option value="0">Ninguna</option>
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            <option value="42">42 Cuotas</option>
            <option value="48">48 Cuotas</option>
            <option value="60">60 Cuotas</option>
            <option value="72">72 Cuotas</option>
            <option value="90">90 Cuotas</option>
            <option value="102">102 Cuotas</option>
            <option value="114">114 Cuotas</option>
            `)
        } else if (months > 90) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>            
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            <option value="42">42 Cuotas</option>
            <option value="48">48 Cuotas</option>
            <option value="60">60 Cuotas</option>
            <option value="72">72 Cuotas</option>
            <option value="90">90 Cuotas</option>
            <option value="102">102 Cuotas</option>
            `)
        } else if (months > 72) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            <option value="42">42 Cuotas</option>
            <option value="48">48 Cuotas</option>
            <option value="60">60 Cuotas</option>
            <option value="72">72 Cuotas</option>
            <option value="90">90 Cuotas</option>
            `)
        } else if (months > 60) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            <option value="42">42 Cuotas</option>
            <option value="48">48 Cuotas</option>
            <option value="60">60 Cuotas</option>
            <option value="72">72 Cuotas</option>
            `)
        } else if (months > 48) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            <option value="42">42 Cuotas</option>
            <option value="48">48 Cuotas</option>
            <option value="60">60 Cuotas</option>
            `)
        } else if (months > 42) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            <option value="42">42 Cuotas</option>
            <option value="48">48 Cuotas</option>
            `)
        } else if (months > 36) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            <option value="42">42 Cuotas</option>
            `)

        } else if (months > 30) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            `)

        } else if (months > 24) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            `)

        } else if (months > 18) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            `)

        } else if (months > 12) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            `)

        } else if (months > 6) {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            `)

        } else {
            $('#ncuotas').html(`
            <option value="0">0 Cuota</option>             
            <option value="1">1 Cuota</option>
            <option value="2">2 Cuotas</option>
            <option value="6">6 Cuotas</option>
        `)
        };
    };
    $('.val').mask('#.##$', { reverse: true });
    var meses = 0;
    var groupColumn = 2;
    var dic = 0;
    var jun = 0;
    var fcha = moment(fch).startOf('month').format('YYYY-MM-DD');
    var h = 1;
    var sprcn = parseFloat($('#separacion').val());
    var porcentage = parseFloat($('#porcentage').val());
    var precio = parseFloat($('#vrlote').cleanVal());
    var cpara = sprcn.toString().length > 3 ? sprcn : precio * sprcn / 100;
    var separacion = sprcn.toString().length > 3 ? sprcn : precio * sprcn / 100;
    $('#abono').val(separacion).mask('#.##$', { reverse: true });
    var inicial = parseFloat($('#cuotainicial').cleanVal());
    var cuota = precio - inicial;
    var cuotaextrao;
    var cut = 0;
    var u = parseFloat($('#diferinicial').val());
    var mesesextra = '';
    var D = parseFloat($('#dia').val());
    var oficial70 = '$' + Moneda((100 - porcentage) * precio / 100);
    var oficial30 = '$' + Moneda(inicial);
    var bono = '';
    var meses = 0;
    var cuota30 = Moneda(Math.round((inicial - separacion) / u));
    Meses(0)
    $(`#ncuotas option[value='6']`).prop('selected', true);
    var N = parseFloat($('#ncuotas').val());
    var cuota70 = Moneda(Math.round(cuota / (N - (meses + u) || 1)));
    $('#cuota').val(cuota70.replace(/\./g, ''))
    console.log(cuota, cuota70, meses, u, N, (N - (meses + u) || 1))
    $.ajax({
        url: '/links/tabla/1',
        type: 'POST',
        data: {
            separacion: Moneda(separacion),
            cuota70: N === 1 ? Moneda(precio - separacion) : N === 0 ? 0 : cuota70,
            cuota30: N === 1 ? 0 : cuota30,
            oficial30,
            oficial70,
            N,
            u,
            fcha,
            fcha2: moment(fch).format('YYYY-MM-DD'),
            mesesextra: '',
            extra: ''
        },
        async: false
    });
    $(document).ready(function () {
        if ($('#mesje').text()) {
            $('#ModalMensaje').modal({
                backdrop: 'static',
                keyboard: true,
                toggle: true
            });
        }

        $('.di').css("background-color", "#FFFFCC");
        $(`.pais option[value='57']`).prop("selected", true);
        $('.documento').mask("AAAAAAAAAAA");
        $('.document').mask("AAAAAAAAAAA");
        $('.movil').mask("57 ***-***-****");
        $('.pais').change(function () {
            var card = $(this).parents('div.row').attr("id")
            $(`#${card} .movil`).val('')
            $(`#${card} .movil`).mask(`${$(this).val()} ***-***-****`).focus();
        })
        $('.pai').change(function () {
            $(`.movi`).val('')
            $(`.movi`).mask(`${$(this).val()} ***-***-****`).focus();
        })
        $('.movil, .documento').on('change', function () {
            var card = $(this).parents('div.row').attr("id")
            if (($(this).hasClass("movil") && !$(`#${card} .documento`).val()) || $(this).hasClass("documento")) {
                $.ajax({
                    url: '/links/cel/' + $(this).cleanVal(),
                    type: 'GET',
                    async: false,
                    success: function (data) {
                        if (data.length > 0) {
                            $(`#${card} .client`).val(data[0].idc);
                            $(`#${card} .nombres`).val(data[0].nombre);
                            $(`#${card} .movil`).val(data[0].movil).mask('**** $$$-$$$-$$$$', { reverse: true });
                            var pais = data[0].movil.split(" ");
                            data[0].movil.indexOf(" ") > 0 ? $(`#${card} .pais option[value='${pais[0]}']`).prop("selected", true) :
                                $(`#${card} .pais option[value='57']`).prop("selected", true);
                            $(`#${card} .email`).val(data[0].email);
                            $(`#${card} .documento`).val(data[0].documento).mask('AAAAAAAAAA');
                            $(`#${card} .movil`).mask("57 ***-***-****");
                        } else {
                            SMSj('info', 'Cliente no encontrado, proceda con el registro')
                            $('#AddCliente input').val('')
                            $('#AddCliente .document').val($(`#${card} .documento`).val())
                            $('#AddCliente .movi').val($(`#${card} .movil`).val()).mask('**** $$$-$$$-$$$$', { reverse: true })
                            $('#AddCliente').modal({
                                backdrop: 'static',
                                keyboard: true,
                                toggle: true
                            });
                            $('#crearcliente').submit(function (e) {
                                e.preventDefault();
                                $('.ya').val(moment().format('YYYY-MM-DD HH:mm'))
                                //var fd = $('#crearcliente').serialize();
                                var formData = new FormData(document.getElementById("crearcliente"));
                                $.ajax({
                                    url: '/links/clientes/agregar',
                                    data: formData,
                                    type: 'PUT',
                                    processData: false,
                                    contentType: false,
                                    beforeSend: function (xhr) {
                                        $('#AddCliente').modal('hide')
                                        $('#ModalEventos').modal({
                                            toggle: true,
                                            backdrop: 'static',
                                            keyboard: true,
                                        });
                                    },
                                    success: function (data) {
                                        if (data) {
                                            SMSj('success', 'Cliente registrado correctamente')
                                            $(`#${card} .client`).val(data.code);
                                            $(`#${card} .nombres`).val($('#AddCliente .nombr').val().toLocaleUpperCase());
                                            $(`#${card} .movil`).val($('#AddCliente .movi').val()).mask('**** $$$-$$$-$$$$', { reverse: true });
                                            $(`#${card} .email`).val($('#AddCliente .mail').val());
                                            $(`#${card} .documento`).val($('#AddCliente .document').val()).mask('AAAAAAAAAA');
                                            $('#ModalEventos').modal('hide')
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }
        })
        var ya = moment(fch).format('YYYY-MM-DD HH:mm');
        $('.ya').val(ya)

        var Años = (inic, dia, month) => {
            dic = 0;
            jun = 0;
            var t1 = new Date(moment(fch).add(inic, 'month').startOf('month')).valueOf()
            var t2 = new Date(moment(fch).add(month, 'month').endOf('month')).valueOf()
            var r = $('#Emeses').val() || 0;
            var data = new Array();
            var q = 0;
            var t3

            while (t1 < t2) {
                t1 = new Date(moment(fch).add(inic + q, 'month').endOf('month')).valueOf()
                t3 = new Date(moment(fch).add(inic + q, 'month').startOf('month'))
                data.push(t3)
                q++
            }

            data.filter((r) => {
                return r.getMonth() === 5 || r.getMonth() === 11;
            }).map((r) => {
                r.getMonth() === 5 ? jun++ : dic++;
            });

            /*$('#Emeses option[value="1"]').length ? $('#Emeses option[value="1"]').remove() : '';
            $('#Emeses option[value="2"]').length ? $('#Emeses option[value="2"]').remove() : '';
            $('#Emeses option[value="3"]').length ? $('#Emeses option[value="3"]').remove() : '';*/

            if (jun > 0 && dic > 0) {
                $('#Emeses').html(` 
                            <option value="">Niguna</option>                       
                            <option value="1">Junio</option>
                            <option value="2">Diciembre</option>
                            <option value="3">Jun & Dic</option>
                        `);
            } else if (jun > 0 && dic === 0) {
                $('#Emeses').html(` 
                            <option value="">Niguna</option>                       
                            <option value="1">Junio</option>
                        `);
            } else if (jun === 0 && dic > 0) {
                $('#Emeses').html(`
                            <option value="">Niguna</option>
                            <option value="2">Diciembre</option>
                        `);
            } else {
                $('#Emeses').html(`<option value="">Niguna</option>`);
            }
            if (r) {
                $(`#Emeses option[value='${r}']`).attr("selected", true);
            }
            fcha = moment(fch).format(`YYYY-MM-${dia}`);
        }

        Años(2, 1, 6);
        $('.hoy').text(moment().format('YYYY-MM-DD'))
        $('.totalote').val(Moneda(precio))
        $('#p70').val(Moneda(cuota));

        function Dt() {
            bono = '';
            $('#dto').val('0%');
            $('#ahorro').val('$0');
            $('#bono').val('');
            $('#bonoid').val('');
            $('.totalote').val($('#vrlote').val());
            precio = parseFloat($('#vrlote').cleanVal());
            inicial = precio * porcentage / 100
            $('#cuotainicial').val(Moneda(inicial));
            $('#p70').val(Moneda(precio - inicial));
        };
        $('#AgregarClient').click(function () {
            $('#cliente2').show('slow');
            $('.cliente2 input').prop('required', true);
        });
        $('#AgregarClient2').click(function () {
            $('#cliente3').show('slow');
            $('.cliente3 input').prop('required', true);
        });
        $('#AgregarClient3').click(function () {
            $('#cliente4').show('slow');
            $('.cliente4 input').prop('required', true);
        });
        $('.atras').click(function () {
            $('.cliente2').hide('slow');
            $('.cliente2 input').val('');
            $('.cliente2 input').prop('required', false);
        });
        $('.atras3').click(function () {
            $('.cliente3').hide('slow');
            $('.cliente3 input').val('');
            $('.cliente3 input').prop('required', false);
        });
        $('.atras4').click(function () {
            $('.cliente4').hide('slow');
            $('.cliente4 input').val('');
            $('.cliente4 input').prop('required', false);
        });
        $('.edi').on('change', function () {
            $('#acepto').prop("checked", false)
            u = parseFloat($('#diferinicial').val());
            D = parseFloat($('#dia').val());
            N = parseFloat($('#ncuotas').val());


            if ($(this).attr('id') === 'ncuotas' && $(this).val() === '0') {
                $('#abono').val(Moneda(precio));
            }

            if ($(this).attr('id') === 'abono') {
                if (parseFloat($(this).cleanVal()) < cpara || !$('#abono').val()) {
                    $('#abono').val(Moneda(cpara))
                    SMSj('info', 'El abono debe ser mayor o igual a la separacion ya preestablecida por Grupo Elite')
                } else if (parseFloat($(this).cleanVal()) > precio || !$('#abono').val()) {
                    $('#abono').val(Moneda(cpara))
                    SMSj('info', 'La separacion no ser mayor al valor del producto')
                }
            }
            var abono = parseFloat($('#abono').val().replace(/\./g, ''));

            if ($(`#ncuotas`).is(':disabled') && abono < precio) {
                $(`#ncuotas option[value='1']`).prop('selected', true);
                N = 1;
            }

            if (N > 1 && abono < inicial && $('#diferinicial').val() === '0') {
                $(`#diferinicial option[value='1']`).prop('selected', true);
                u = 1;
            }

            if (N < 6) {
                $(`#Emeses option[value='0']`).attr('selected', true);
                $('#cuotaestrao').val(null);
            }

            if (N === 2 && parseFloat($('#diferinicial').val()) > 1) {
                $(`#diferinicial option[value='1']`).prop('selected', true);
                u = 1;
            }

            Años(u + 1, D, N)
            if ($(this).attr('id') === 'bono') {
                if ($(this).val() !== bono && $(this).val()) {
                    h = 1;
                    $.ajax({
                        url: '/links/bono/' + $(this).val(),
                        type: 'GET',
                        async: false,
                        success: function (data) {
                            if (data.length) {
                                var fecha = moment(data[0].fecha).add(59, 'days').endOf("days");
                                if (data[0].producto != null) {
                                    SMSj('error', 'Este cupon ya le fue asignado a un producto. Para mas informacion comuniquese con el asesor encargado');
                                    Dt();
                                } else if (fecha < new Date()) {
                                    SMSj('error', 'Este cupon de descuento ya ha expirado. Para mas informacion comuniquese con el asesor encargado');
                                    Dt();
                                } else if (data[0].estado != 9) {
                                    SMSj('error', 'Este cupon aun no ha sido autorizado por administración. espere la autorizacion del area encargada');
                                    Dt();
                                } else {
                                    var ahorr = Math.round(precio * data[0].descuento / 100)
                                    $('#bonoid').val(data[0].id);
                                    $('#ahorro').val(Moneda(ahorr));
                                    precio = precio - ahorr;
                                    inicial = precio * porcentage / 100;
                                    $('#dto').val(data[0].descuento + '%');
                                    $('#cuotainicial').val(Moneda(Math.round(inicial)))
                                    $('#p70').val(Moneda(Math.round(precio - inicial)));
                                    $('.totalote').val(Moneda(Math.round(precio)))
                                    parseFloat($('#abono').val().replace(/\./g, '')) > precio ? $('#abono').val(Moneda(precio)) : '';
                                }
                                bono = data[0].pin;
                            } else {
                                Dt();
                                SMSj('error', 'Debe digitar un N° de bono. Comuniquese con uno de nuestros asesores encargado')
                            }
                        }
                    });
                } else {
                    Dt();
                    SMSj('error', 'Cupon de decuento invalido. Comuniquese con uno de nuestros asesores encargado')
                }
            }

            if (u > 1 && h === 1) {
                h = 2
                Dt();
                $('#bono').val('').attr('disabled', true);
                SMSj('info', 'Recuerde que si difiere la cuota inicial a mas de 1 no podra ser favorecido con nuestros descuentos. Para mas info comuniquese con el asesor encargado');
            } else if (u > 1) {
                Dt();
                $('#bono').attr('disabled', true);
            } else {
                h = 1
                $('#bono').attr('disabled', false);
            }

            separacion = abono;
            var Estra = () => {
                cuotaextrao = parseFloat($('#cuotaestrao').cleanVal());
                var co = $('#cuotaestrao').val() ? $('#Emeses').val() : "0";
                switch (co) {
                    case "1":
                        cut = cuotaextrao * jun
                        mesesextra = 6
                        meses = jun
                        break;
                    case "2":
                        cut = cuotaextrao * dic
                        mesesextra = 12
                        meses = dic
                        break;
                    case "3":
                        cut = cuotaextrao * (jun + dic)
                        mesesextra = 2
                        meses = jun + dic
                        break;
                    default:
                        cut = 0
                        mesesextra = 0
                        meses = 0
                }
                cuota = cuota - cut;
                $('#extran').val(meses)
            }
            if (separacion === precio) {
                Años(0, D, N)
                cuota = 0;
                Estra()
                cuota30 = 0;
                cuota70 = 0;
                $(`#diferinicial option[value='0']`).attr('selected', true);
                $(`#Emeses option[value='0']`).attr('selected', true);
                $('#cuotaestrao').val(null);
                $('#cuotaestrao').attr('disabled', true);
                $("#diferinicial").attr('disabled', true);
                $(`#Emeses`).attr('disabled', true);
                $(`#ncuotas`).attr('disabled', true);
                $(`#dia`).attr('disabled', true);

            } else if (separacion >= inicial) {
                Años(0, D, N)
                resl = separacion - inicial;
                cuota = Math.round(precio - resl - inicial);
                Estra()
                cuota30 = 0;
                cuota70 = Moneda(Math.round(cuota / (N - meses)));
                $(`#diferinicial option[value='0']`).attr('selected', true);
                $("#diferinicial").attr('disabled', true);
            } else {
                cuota = Math.round(precio - inicial);
                Estra()
                cuota30 = Moneda(Math.round((inicial - separacion) / u))
                cuota70 = Moneda(Math.round(cuota / (N - (meses + u) || 1)));
                $("#diferinicial").prop('disabled', false);
                $(`#Emeses`).prop('disabled', false);
                $('#cuotaestrao').prop('disabled', false);
                $(`#dia`).attr('disabled', false);
                $(`#ncuotas`).attr('disabled', false);
            }

            recolecta = {
                separacion: Moneda(separacion),
                cuota70: N === 1 ? Moneda(precio - separacion) : N === 0 ? 0 : cuota70,
                cuota30: N === 1 ? 0 : cuota30,
                oficial30,
                oficial70,
                N,
                u,
                fcha,
                fcha2: moment(fch).format('YYYY-MM-DD'),
                mesesextra,
                extra: $('#cuotaestrao').val()
            }
            cuota70 ? $('#cuota').val(cuota70.replace(/\./g, '')) : $('#cuota').val(0);
            $.ajax({
                url: '/links/tabla/1',
                type: 'POST',
                data: recolecta,
                async: false,
                success: function (data) {
                    tabla.ajax.reload(function (json) {
                        //SMSj('success', 'Se realizaron cambios exitosamente')
                    }); console.log('aqi')
                }
            });
        })
        var tabla = $("#datatables-clients").DataTable({
            dom: '<"toolbar">',
            info: false,
            /*responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.childRowImmediate,
                    type: 'none',
                    target: ''
                }
            }*/
            responsive: true,
            ajax: {
                method: "POST",
                url: "/links/tabla/2",
                dataSrc: "data"
            },
            columns: [
                { data: "n" },
                {
                    data: "fecha",
                    render: function (data, method, row) {
                        return moment.utc(data).format('YYYY-MM-DD') + `<input value="${moment(data).format('YYYY-MM-DD')}" type="hidden" name="fecha">`
                    }
                },
                { data: "oficial" },
                { data: "cuota" },
                { data: "stado" },
                { data: "n2" },
                {
                    data: "fecha2",
                    render: function (data, method, row) {
                        return data ? moment.utc(data).format('YYYY-MM-DD') + `<input value="${moment(data).format('YYYY-MM-DD')}" type="hidden" name="fecha">` : '';
                    }
                },
                { data: "cuota2" },
                { data: "stado2" }
            ],
            columnDefs: [
                { "visible": false, "targets": groupColumn },
                { responsivePriority: 1, targets: 0 },
                { responsivePriority: 2, targets: 1 },
                { responsivePriority: 3, targets: 3 },
                { responsivePriority: 4, targets: 4 }
            ],
            order: [[groupColumn, 'asc']],
            displayLength: 50,
            initComplete: function (settings, json) {
                //hacer algo apenas cargue la tabla
            },
            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class="group"><td colspan="8">' + group + '</td></tr>'
                        );

                        last = group;
                    }
                });
            }
        });
    });
    var opcion = 'no';
    $('#enviodeorden').submit(function (e) {
        if (opcion === 'no') {
            e.preventDefault();
            var datos = { movil: $('#movil').cleanVal() }
            $.ajax({
                url: '/links/codigo',
                type: 'POST',
                data: datos,
                //async: false,
                success: function (data) {
                    $('#codigodeverificacion').val(data);
                }
            });
            $('#modalorden').modal('toggle');
            $('#modalorden').one('shown.bs.modal', function () {
                $('#modalorden #codeg').focus();
            })
        } else {
            $('#enviodeorden input').prop('disabled', false);
        }

    })
    $('#enviarorden').click(function () {
        var code1 = $('#codigodeverificacion').val()
        var code2 = $('#codeg').val()
        if (code1 == code2) {
            opcion = 'si';
            $('#modalorden').modal('toggle');
            $('#enviodeorden').submit();
        } else {
            $('#modalorden').modal('toggle');
            SMSj('error', 'Codigo de confirmación incorrecto, intentelo nuevamente')
        }

    })
};
/////////////////////////////* SOLICITUDES *//////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/solicitudes`) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');
    minDateFilter = "";
    maxDateFilter = "";
    var idExtracto = false;
    var dateExtracto = false;

    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[3]).getTime()
                //console.log(aData._date, aData[3], aData.length)
            }
            if (minDateFilter && !isNaN(minDateFilter)) {
                if (aData._date < minDateFilter) {
                    return false;
                }
            }
            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (aData._date > maxDateFilter) {
                    return false;
                }
            }
            return true;
        }
    );
    $('.card-header').on('click', function () {
        var papa = $(this).parents('.accordion');
        if ($(this).find('i').hasClass('fa-angle-down')) {
            $(papa).find('.card-header i').removeClass("fa-angle-up");
            $(papa).find('.card-header i').addClass("fa-angle-down");

            $(this).find('i').removeClass("fa-angle-down");
            $(this).find('i').addClass("fa-angle-up");

        } else {
            $(this).find('i').removeClass("fa-angle-up");
            $(this).find('i').addClass("fa-angle-down");
        }
    });
    $(document).ready(function () {
        $("#Date_search").html("");
        $('a.toggle-vis').on('click', function (e) {
            e.preventDefault();
            var column = table.column($(this).attr('data-column'));
            column.visible(!column.visible());
        });
    });
    var Color = (val) => {
        var elemen = $(`#t-${val}`);
        if (elemen.hasClass('i')) {
            elemen.css('background-color', 'transparent');
            elemen.removeClass('.i');
        } else {
            elemen.css('background-color', '#FFFFCC');
            elemen.addClass('i');
        }
    }
    var Recibos = $('#Recibos').DataTable({
        //lengthMenu: -1,
        deferRender: true,
        paging: true,
        autoWidth: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        order: [[0, "desc"]], //[0, "asc"]
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/solicitudes/pago",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
            //$('#datatable_filter').prepend("<h3 class='float-left mt-2'>PAGOS</h3>");
        },
        columns: [
            {
                className: 't',
                data: "ids"
            },
            { data: "fullname" },
            { data: "nombre" },
            {
                data: "fech",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD HH:mm A') //pone la fecha en un formato entendible
                }
            },
            { data: "proyect" },
            { data: "mz" },
            { data: "n" },
            { data: "descp" },
            {
                data: "monto",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            { data: "facturasvenc" },
            {
                data: "recibo",
                render: function (data, method, row) {
                    return data.replace(/~/g, '')
                }
            },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-success">Aprobada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Anulada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">sin formato</span>`
                    }
                }
            },
            {
                className: 't',
                data: "pdf",
                render: function (data, method, row) {
                    return data ? `<a href="${data}" target="_blank" title="Click para ver recibo"><i class="fas fa-file-alt"></i></a>`
                        : `<a title="No posee ningun recibo"><i class="fas fa-exclamation-circle"></i></a>`;
                }
            },
            { data: "aprueba" },
            {
                data: "estado",
                className: 'te',
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-warning" title="Estado en el que aun no se a ingresado ningun pago desde el momento de la separacion\nLote ${row.lote}">Pendiente</span>`
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-info" title="Pago que se encuentra pendiente de aprobar por el area de contabilidad\nLote ${row.lote}">Tramitando</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-danger" title="Lote ${row.lote}">Anulada</span>`
                            break;
                        case 10:
                            return `<span class="badge badge-pill badge-success" title="Pago total del valor de la cuota inicial del lote\nLote ${row.lote}">Separado</span>`
                            break;
                        case 12:
                            return `<span class="badge badge-pill badge-dark" title="Primer pago que se le realiza al lote por concepto de separacion\nLote ${row.lote}">Apartado</span>`
                            break;
                        case 13:
                            return `<span class="badge badge-pill badge-primary" title="Pago total del valor del lote\nLote ${row.lote}">Vendido</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-tertiary" title="Lote ${row.lote}">Inactivo</span>` //secondary
                            break;
                    }
                }
            },
            { data: "tipobsevacion" },
            { data: "descrip" },
            { data: "cparacion" },
            { data: "bonoanular" },
            {
                data: "montoa",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            { data: "ordenanu" }
        ],
        rowCallback: function (row, data, index) {
            if (data["stado"] == 6) {
                $(row).css({ "background-color": "#C61633", "color": "#FFFFFF" });
            } else if (data["stado"] == 3) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["stado"] == 4) {
                $(row).css("background-color", "#40E0D0");
            }
        }
    });
    var table = $('#datatable').DataTable({
        //dom: 'Bfrtip',
        /*lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],*/
        lengthChange: false,
        /*buttons: [{
            extend: 'pageLength',
            text: 'Ver',
            orientation: 'landscape'
        },
        {
            text: `ed`,
            attr: {
                title: 'Fecha',
                id: 'gg'
            },
            className: 'btn btn-secondary'
        },
        {
            text: `<input id="min" type="text" class="edi text-center" style="width: 40px; padding: 1px;"
            placeholder="MZ">`,
            attr: {
                title: 'Busqueda por MZ',
                id: ''
            },
            className: 'btn btn-secondary min'
        },
        {
            text: `<input id="max" type="text" class="edi text-center" style="width: 40px; padding: 1px;"
            placeholder="LT">`,
            attr: {
                title: 'Busqueda por LT',
                id: ''
            },
            className: 'btn btn-secondary max'
        }, //<i class="align-middle feather-md" data-feather="calendar"></i> src\public\bank\Movimientos.xlsm
        admin === '1' ? {
            text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
            stroke-linecap="round" stroke-linejoin="round" class="feather feather-download">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>`,
            attr: {
                title: 'Descargar movimientos bacarios'
            },
            className: 'btn btn-secondary',
            action: function () {
                const link = document.createElement('a');
                link.href = '/bank/Movimientos.xlsm';
                link.download = "Movimientos.xlsm";
                link.dispatchEvent(new MouseEvent('click'));
            }
        } : '',
        {
            extend: 'collection',
            text: 'Stds',
            orientation: 'landscape',
            buttons: [
                {
                    text: 'COPIAR',
                    extend: 'copy'
                },
                {
                    text: `PENDIENTES`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD(11, 'Pendiente');
                    }
                },
                {
                    text: `APROBADOS`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD(11, 'Aprobada');
                    }
                },
                {
                    text: `ANULADOS`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD(11, 'Anulada');
                    }
                },
                {
                    text: `TODOS`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD('', '');
                    }
                }
            ]
        }
        ],*/
        deferRender: true,
        paging: true,
        autoWidth: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        order: [[0, "desc"]], //[0, "asc"]
        language: languag2,
        ajax: {
            method: "POST",
            url: "/links/solicitudes/pago",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
            //$('#datatable_filter').prepend("<h3 class='float-left mt-2'>PAGOS</h3>");
        },
        columns: [
            {
                className: 't',
                data: "ids"
            },
            { data: "fullname" },
            { data: "nombre" },
            {
                data: "fech"
            },
            {
                data: "fecharcb",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            { data: "proyect" },
            { data: "mz" },
            { data: "n" },
            { data: "descp" },
            {
                data: "monto",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            { data: "facturasvenc" },
            {
                data: "recibo",
                render: function (data, method, row) {
                    return data.replace(/~/g, '')
                }
            },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-success">Aprobada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Anulada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">sin formato</span>`
                    }
                }
            },
            {
                className: 't',
                data: "pdf",
                render: function (data, method, row) {
                    return data ? `<a href="${data}" target="_blank" title="Click para ver recibo"><i class="fas fa-file-alt"></i></a>`
                        : `<a title="No posee ningun recibo"><i class="fas fa-exclamation-circle"></i></a>`;
                }
            },
            { data: "aprueba" },
            {
                data: "estado",
                className: 'te',
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-warning" title="Estado en el que aun no se a ingresado ningun pago desde el momento de la separacion\nLote ${row.lote}">Pendiente</span>`
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-info" title="Pago que se encuentra pendiente de aprobar por el area de contabilidad\nLote ${row.lote}">Tramitando</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-danger" title="Lote ${row.lote}">Anulada</span>`
                            break;
                        case 10:
                            return `<span class="badge badge-pill badge-success" title="Pago total del valor de la cuota inicial del lote\nLote ${row.lote}">Separado</span>`
                            break;
                        case 12:
                            return `<span class="badge badge-pill badge-dark" title="Primer pago que se le realiza al lote por concepto de separacion\nLote ${row.lote}">Apartado</span>`
                            break;
                        case 13:
                            return `<span class="badge badge-pill badge-primary" title="Pago total del valor del lote\nLote ${row.lote}">Vendido</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-tertiary" title="Lote ${row.lote}">Inactivo</span>` //secondary
                            break;
                    }
                }
            },
            { data: "cparacion" },
            { data: "extr" },
            {
                data: "consignado",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            {
                data: "date",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            { data: "description" },
            { data: "lugar" },
            { data: "tipobsevacion" },
            { data: "descrip" },
            { data: "bonoanular" },
            {
                data: "montoa",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            { data: "ordenanu" }
        ],
        rowCallback: function (row, data, index) {
            if (data["stado"] == 6) {
                $(row).css({ "background-color": "#C61633", "color": "#FFFFFF" });
            } else if (data["stado"] == 3) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["stado"] == 4) {
                $(row).css("background-color", "#40E0D0");
            }
        }
    });
    $('#busq').on('keyup', function () {
        table.search(this.value).draw();
    });
    $('#datatable_filter').hide();
    $('#min, #max').on('keyup', function () {
        var col = $(this).attr('id') === 'min' ? 6 : 7;
        table
            .columns(col)
            .search(this.value)
            .draw();
    });
    table.on('click', 'td:not(.t)', function () {
        var fila = $(this).parents('tr');
        var data = table.row(fila).data(); //console.log(data)
        var imagenes = data.img === null ? '' : data.img.indexOf(",") > 0 ? data.img.split(",") : data.img
        IDS = data.ids
        fila.toggleClass('selected');
        BancoExt.$('tr.selected').removeClass('selected');

        if (Array.isArray(imagenes)) {
            var marg = 100 / (imagenes.length - 1);
            imge = imagenes.length - 1
            //$("#Modalimg img:not(.foto)").remove();
            $("#Modalimg .foto").remove();
            $("#descargaimg .imag").remove();
            imagenes.map((e) => {
                if (e) {
                    $("#descargaimg").append(`<a class="imag mr-2" href="${e}" target="_blank"><span class="badge badge-dark">Img</span></a>`)
                    $("#Modalimg .fotos").append(
                        `<div class="foto" style="
                        width: ${marg}%;
                        padding-top: calc(100% / (16/9));
                        background-image: url('${e}');
                        background-size: 100%;
                        background-position: center;
                        background-repeat: no-repeat;float: left;">
                    </div>`);
                }
            })
        } else if (imagenes) {
            imge = 1
            $("#Modalimg .foto").remove();
            $("#descargaimg .imag").remove();
            $("#descargaimg").html(`<a class="imag" href="${data.img}" target="_blank"><span class="badge badge-dark">Img</span></a>`)
            $("#Modalimg .fotos").append(
                `<div class="foto" style="
                    width: 100%;
                    padding-top: calc(100% / (16/9));
                    background-image: url('${data.img}');
                    background-size: 100%;
                    background-position: center;
                    background-repeat: no-repeat;float: left;">
                </div>`);
        }

        $('.imag').on('click', function () {
            const link = document.createElement('a');
            link.href = $(this).attr('href'); //'/bank/Movimientos.xlsm';
            link.download = "recibo" + data.ids + ".jpg";
            link.dispatchEvent(new MouseEvent('click'));
        });
        var fechaRecibo = moment.utc(data.fecharcb).format('YYYY-MM-DD');
        var fechaExtrato = moment.utc(data.date).format('YYYY-MM-DD');
        $('#Modalimg .fecha').html(moment.utc(data.fech).format('YYYY-MM-DD HH:mm'));
        $('#Modalimg .cliente').html(data.nombre);
        $('#Modalimg .proyecto').html(data.proyect);
        $('#Modalimg .mz').html('MZ: ' + data.mz);
        $('#Modalimg .lote').html('LT: ' + data.n);
        $('#Modalimg .recibo').html('RCB ' + data.recibo.replace(/~/g, ' ')).parents('tr').css({ "background-color": "#162723", "color": "#FFFFFF" });
        $('#Modalimg .fechaRcb').html(fechaRecibo);
        $('#Modalimg .fatvc').html(data.facturasvenc); //'FAT.VEC: ' + 
        $('#Modalimg .monto').html('$' + Moneda(data.monto)).parents('td').css({ "background-color": "#162723", "color": "#FFFFFF" });;
        $('#montopago').val(data.monto);
        $('#Modalimg .bonoo').html(data.bono || 'NO APLICA');
        $('#Modalimg .bonom').html('$' + Moneda(data.mount || 0));
        $('#apde').attr('data-toggle', "dropdown");
        $('#apde').next().html(`<a class="dropdown-item">Enviar</a>`);
        $('#stadopago').val(data.stado);
        $('#idSolicitud').val(data.ids);
        $('#aprobadoEl').html(data.aprobado && 'Aprobado el ' + moment(data.aprobado).format('llll'));

        let esFecha = moment(data.fecharcb, true).isValid();
        !esFecha && alert('Debe establecer una fecha al recibo a continuacion donde se muestra "Fecha inválida"');

        var nuevaFechaRecibo = moment($('#Modalimg .fechaRcb').html(), true).isValid()
            ? $('#Modalimg .fechaRcb').html() : false;

        var diferenciaDeFechas = Math.abs(moment(data.fecharcb).diff(moment(data.date), 'days'));

        fechaExtrato < fechaRecibo && alert('La fecha del recibo no coincide con la del extrato, y esto no es posible ya que causara una contabilidad erronea');

        if (!isNaN(diferenciaDeFechas) && diferenciaDeFechas > 5) {
            alert('La diferencia de dias entre la fecha del extato y la fecha del recibo es de ' + diferenciaDeFechas + ' dias, para fines contables esto no debe ser posible por favor revice el caso, de lo contrario seguira generandose este aviso');
        }
        switch (data.stado) {
            case 4:
                $('#Modalimg .estado').html(`<span class="badge badge-pill badge-success">Aprobada</span>`);
                if (data.extr && !rol.externo) {
                    BuscarFechaRcb(data.fecharcb, data.extr)
                    //BancoExt.columns(0,).search(data.extr).draw();
                    $('#apde').next().html(`<a class="dropdown-item">Desasociar</a>
                                            <a class="dropdown-item">Enviar</a>`);
                } else if (!rol.externo) {
                    //BancoExt.columns(0).search('').draw();
                    BuscarFechaRcb(data.fecharcb)
                    $('#apde').next().html(`<a class="dropdown-item">Asociar</a>
                                            <a class="dropdown-item">Enviar</a>`);
                }
                break;
            case 6:
                $('#Modalimg .estado').html(`<span class="badge badge-pill badge-danger">Declinada</span>`);
                break;
            case 3:
                $('#Modalimg .estado').html(`<span class="badge badge-pill badge-info">Pendiente</span>`);
                //BancoExt.columns(0).search('').draw();
                !rol.externo && BuscarFechaRcb(data.fecharcb);
                $('#apde').next().html(`<a class="dropdown-item">Aprobar</a>
                                        <a class="dropdown-item">Declinar</a>`);
                break;
            default:
                $('#Modalimg .estado').html(`<span class="badge badge-pill badge-secondary">sin formato</span>`);
        }
        var zoom = 200
        $(".foto").on({
            mousedown: function () {
                zoom += 50
                $(this).css("background-size", zoom + "%")
            },
            mouseup: function () {

            },
            mousewheel: function (e) {
                //console.log(e.deltaX, e.deltaY, e.deltaFactor);
                if (e.deltaY > 0) { zoom += 50 } else { zoom < 150 ? zoom = 100 : zoom -= 50 }
                $(this).css("background-size", zoom + "%")
            },
            mousemove: function (e) {
                let width = this.offsetWidth;
                let height = this.offsetHeight;
                let mouseX = e.offsetX;
                let mouseY = e.offsetY;

                let bgPosX = (mouseX / width * 100);
                let bgPosY = (mouseY / height * 100);

                this.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
            },
            mouseenter: function (e) {
                $(this).css("background-size", zoom + "%")
            },
            mouseleave: function () {
                $(this).css("background-size", "100%")
                this.style.backgroundPosition = "center";
            }
        });
        if (rol.contador) {
            $('.dropdown-item').show()
            $('#nove').show()
        } else {
            $('.dropdown-item').hide()
        }
        $('#Modalimg').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });

        $('.dropdown-item').on('click', function () {
            var accion = $(this).text(), porque = '', fd = new FormData(), mensaje = false;
            //console.log(accion)
            //var w = Seleccion();
            fd.append('pdef', data.pdf);
            fd.append('ids', data.ids);
            fd.append('movil', data.movil);
            fd.append('nombre', data.nombre);
            fd.append('extr', extr);
            fd.append('Orden', data.cparacion)
            fd.append('ahora', moment().format('YYYY-MM-DD HH:mm'));

            idExtracto && fd.append('idExtracto', idExtracto);
            //console.log(w.length, imge, accion, totalasociados);

            if (accion === 'Declinar' && rol.contador) {
                porque = prompt("Deje en claro el motivo de la declinacion, este mensaje le sera enviado al asesor a cargo para que diligencie y haga la correccion del pago", "Solicitud rechazada por que");
                if (porque) {
                    fd.append('img', data.img);
                    fd.append('por', porque);
                    fd.append('fullname', data.fullname);
                    fd.append('cel', data.cel);
                    fd.append('mz', data.mz);
                    fd.append('n', data.n);
                    fd.append('proyect', data.proyect);
                    $.ajax({
                        type: 'PUT',
                        url: '/links/solicitudes/' + accion,
                        data: fd,
                        processData: false,
                        contentType: false,
                        beforeSend: function (xhr) {
                            $('#Modalimg').modal('hide');
                            $('#ModalEventos').modal({
                                backdrop: 'static',
                                keyboard: true,
                                toggle: true
                            });
                        },
                        success: function (data) {
                            if (data) {
                                SMSj('success', `Solicitud procesada correctamente`);
                                table.ajax.reload(null, false)
                                $('#ModalEventos').modal('hide')
                            } else {
                                SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`)
                                $('#ModalEventos').modal('hide')
                            }
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    })
                }
            } else if (accion === 'Asociar' && rol.contador && !rol.externo) {
                if (!idExtracto) {
                    alert('Debe seleccionar un extrato antes de intentar asociar al pago');
                    return false;
                }

                if (!nuevaFechaRecibo) {
                    alert('Debe establecer una fecha al recibo antes de asociar');
                    return false;
                }
                $.ajax({
                    type: 'PUT',
                    url: '/links/solicitudes/' + accion,
                    data: fd,
                    processData: false,
                    contentType: false,
                    beforeSend: function (xhr) {
                        $('#Modalimg').modal('hide');
                        $('#ModalEventos').modal({
                            backdrop: 'static',
                            keyboard: true,
                            toggle: true
                        });
                    },
                    success: function (data) {
                        if (data) {
                            SMSj('success', `Solicitud procesada correctamente`);
                            $('#ModalEventos').modal('hide')
                            table.ajax.reload(null, false)
                            BancoExt.ajax.reload(null, false)
                        } else {
                            SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`);
                            $('#ModalEventos').modal('hide')
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            } else if (accion === 'Desasociar' && rol.contador && !rol.externo) {
                //console.log(extr)
                if (!idExtracto) {
                    alert('Debe tener asociado un extrato del banco con esta solicitud de pago para realizar esta acción');
                } else if (confirm("Seguro deseas desasociar este extrato del pago?")) {
                    var ed = data.ids;
                    $.ajax({
                        type: 'PUT',
                        url: '/links/solicitudes/' + accion,
                        data: fd,
                        processData: false,
                        contentType: false,
                        beforeSend: function (xhr) {
                            $('#Modalimg').modal('hide');
                            $('#ModalEventos').modal({
                                backdrop: 'static',
                                keyboard: true,
                                toggle: true
                            });
                        },
                        success: function (data) {
                            if (data) {
                                SMSj('success', `Solicitud procesada correctamente`);
                                table.ajax.reload(null, false)
                                BancoExt.ajax.reload(null, false)
                                $('#ModalEventos').modal('hide')
                                Buscar(ed);
                            } else {
                                SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`);
                                $('#ModalEventos').modal('hide')
                            }
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    })
                }
            } else if ((accion === 'Enviar' || accion === 'Aprobar') && rol.contador) {
                if (!rol.externo && !idExtracto && accion === 'Aprobar') {
                    alert('Debe asociar un extrato al pago que desea aprobar');
                    return false;
                }
                if (!rol.externo && !nuevaFechaRecibo) {
                    alert('Debe establecer una fecha al recibo antes de realizar esta accion');
                    return false;
                }

                data.pdf ? mensaje = confirm("Esta solicitud ya contiene un recibo ¿Desea generar un nuevo RECIBO DE CAJA?. Si preciona NO se enviara el mismo que ya se le habia generado anteriormente")
                    : mensaje = true;

                if (mensaje) {
                    $.ajax({
                        type: 'POST',
                        url: '/links/solicitudes/saldo',
                        data: {
                            solicitud: data.ids,
                            lote: data.lote,
                            fecha: data.fech
                        },
                        async: true,
                        beforeSend: function (xhr) {
                            $('#Modalimg').modal('hide');
                            $('#ModalEventos').modal({
                                backdrop: 'static',
                                keyboard: true,
                                toggle: true
                            });
                        },
                        success: function (dat) {
                            /////////////////////////////////////////* PDF *//////////////////////////////////////////////
                            if (dat) {
                                var acumulad = dat.d === 'NO' ? 0 : dat.d;
                                var doc = new jsPDF('l', 'mm', 'a5');
                                var totall = data.valor - data.ahorro;
                                var fech = data.fech
                                var saldo = totall - acumulad;
                                var bon = data.mount === null ? 0 : data.mount;
                                var totl = data.formap === 'BONO' ? parseFloat(data.monto) : parseFloat(data.monto) + bon
                                var img2 = new Image();
                                var img = new Image();
                                img.src = '/img/avatars/avatar.png'
                                img2.src = `https://api.qrserver.com/v1/create-qr-code/?data=https://grupoelitered.com.co/links/pagos`
                                var totalPagesExp = '{total_pages_count_string}'
                                //doc.addPage("a3"); 
                                doc.autoTable({
                                    head: [
                                        { id: 'ID', name: 'Name', email: 'Email', city: 'City', expenses: 'Sum' },
                                    ],
                                    body: [{
                                        id: '',
                                        name: '',
                                        email: '',
                                        city: 'RECIBO DE CAJA',
                                        expenses: data.ids
                                    },
                                    {
                                        id: 'CLIENTE',
                                        name: data.nombre + ' ' + data.email,
                                        email: 'CC: ' + data.documento,
                                        city: data.movil,
                                        expenses: ''
                                    },
                                    {
                                        id: 'PRODUCTO',
                                        name: data.proyect,
                                        email: 'MZ. ' + data.mz,
                                        city: 'LT. ' + data.n,
                                        expenses: ''
                                    },
                                    {
                                        id: 'CONCEPTO',
                                        name: 'PAGO',
                                        email: data.descp,
                                        city: 'CUOTA #',
                                        expenses: data.ncuota === null ? 'NO APLICA' : data.ncuota
                                    },
                                    {
                                        id: 'F PAGO',
                                        name: data.formap,
                                        email: 'R ' + data.recibo,
                                        city: 'MONTO',
                                        expenses: '$' + Moneda(data.monto)
                                    },
                                    {
                                        id: 'BONO',
                                        name: data.bono === null ? 'NO APLICA' : data.bono,
                                        email: data.producto === null ? 'R5 0' : 'R5 ' + data.producto,
                                        city: 'MONTO',
                                        expenses: '$' + Moneda(bon)
                                    },
                                    {
                                        id: 'TOTAL',
                                        name: `${NumeroALetras(totl)} MCT********`,
                                        email: '',
                                        city: '',
                                        expenses: '$' + Moneda(totl)
                                    },
                                    {
                                        id: 'SLD FECHA',
                                        name: `${NumeroALetras(saldo)} MCT********`,
                                        email: '',
                                        city: '',
                                        expenses: '$' + Moneda(saldo)
                                    },
                                    {
                                        id: 'TOTAL SLD',
                                        name: `${NumeroALetras(saldo - totl)} MCT********`,
                                        email: '',
                                        city: '',
                                        expenses: '$' + Moneda(saldo - totl)
                                    }],
                                    //html: '#tablarecibo',
                                    showHead: false,
                                    columnStyles: {
                                        //id: { fillColor: 120, textColor: 255, fontStyle: 'bold' },
                                        id: { textColor: 0, fontStyle: 'bold' },
                                        0: { cellWidth: '50' },
                                        1: { cellWidth: 'auto' },
                                        2: { cellWidth: 'wrap' },
                                        3: { cellWidth: 'wrap' },
                                    },
                                    didDrawPage: function (data) {
                                        // Header
                                        doc.setTextColor(0)
                                        doc.setFontStyle('normal')
                                        if (img) {
                                            doc.addImage(img, 'png', data.settings.margin.left, 10, 15, 20)
                                            doc.addImage(img2, 'png', data.settings.margin.left + 160, 10, 20, 20)
                                        }
                                        doc.setFontSize(15)
                                        doc.text('GRUPO ELITE FINCA RAÍZ SAS', data.settings.margin.left + 18, 15)
                                        doc.setFontSize(7)
                                        doc.text(fech, data.settings.margin.left + 165, 8)
                                        doc.setFontSize(10)
                                        doc.text('Nit: 901311748-3', data.settings.margin.left + 18, 20)
                                        doc.setFontSize(10)
                                        doc.text('Tel: 300-775-3983', data.settings.margin.left + 18, 25)
                                        doc.setFontSize(8)
                                        doc.text(`Domicilio: Mz 'L' Lt 17 Urb. La granja Turbaco, Bolivar`, data.settings.margin.left + 18, 30)

                                        // Footer
                                        var str = 'Page ' + doc.internal.getNumberOfPages()
                                        // Total page number plugin only available in jspdf v1.0+
                                        if (typeof doc.putTotalPages === 'function') {
                                            str = str + ' of ' + totalPagesExp
                                        }
                                        doc.setFontSize(8)

                                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                                        var pageSize = doc.internal.pageSize
                                        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                                        doc.text(/*str*/ `https://grupoelitered.com.co/links/pagos`, data.settings.margin.left, pageHeight - 10)
                                    },
                                    margin: { top: 34 },
                                })
                                // Total page number plugin only available in jspdf v1.0+
                                if (typeof doc.putTotalPages === 'function') {
                                    doc.putTotalPages(totalPagesExp)
                                }
                                var blob = doc.output('blob')
                                /////////////////////////////////////////* PDF *//////////////////////////////////////////////
                                fd.append('pdf', blob);
                                fd.append('acumulado', acumulad);
                                $.ajax({
                                    type: 'PUT',
                                    url: '/links/solicitudes/' + accion,
                                    data: fd,
                                    processData: false,
                                    contentType: false,
                                    success: function (data) {
                                        if (data.std) {
                                            SMSj('success', data.msg);
                                            table.ajax.reload(null, false)
                                            $('#ModalEventos').modal('hide')
                                        } else {
                                            SMSj('error', data.msg)
                                            $('#ModalEventos').modal('hide')
                                        }
                                    },
                                    error: function (data) {
                                        console.log(data);
                                    }
                                })
                            } else {
                                SMSj('error', 'Este producto tiene otras solicitudes antriores a esta aun pendiente por aprobar');
                                $('#ModalEventos').modal('hide');
                            }
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    })
                } else {
                    $.ajax({
                        type: 'PUT',
                        url: '/links/solicitudes/' + accion,
                        data: fd,
                        processData: false,
                        contentType: false,
                        beforeSend: function (xhr) {
                            $('#Modalimg').modal('hide');
                            $('#ModalEventos').modal({
                                backdrop: 'static',
                                keyboard: true,
                                toggle: true
                            });
                        },
                        success: function (data) {
                            if (data) {
                                SMSj('success', `Solicitud procesada correctamente`);
                                table.ajax.reload(null, false);
                                $('#ModalEventos').modal('hide');
                            } else {
                                SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`);
                                $('#ModalEventos').modal('hide');
                            }
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    })
                }
            }

        })
        $('#Modalimg').one('hidden.bs.modal', function () {
            fila.toggleClass('selected');
        })
        $(".fechaRcb").daterangepicker({
            locale: {
                'format': 'YYYY-MM-DD',
                'separator': ' - ',
                'applyLabel': 'Aplicar',
                'cancelLabel': 'Cancelar',
                'fromLabel': 'De',
                'toLabel': '-',
                'customRangeLabel': 'Personalizado',
                'weekLabel': 'S',
                'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                'firstDay': 1
            },
            singleDatePicker: true,
            showDropdowns: true,
            minYear: 2017,
            maxYear: parseInt(moment().format('YYYY'), 10),
        }, function (start, end, label) {
            if (data.extr) {
                alert('Si deseaa cambiar la fecha del recibo debera antes desasociar el extrato, de lo contrario no sera posible realizar esta accion.')
                return false
            }
            $('.dropdown-item').hide()
            var did = data.ids;
            var fechaRCB = moment(start).format('YYYY-MM-DD');
            $.ajax({
                type: 'POST',
                url: '/links/solicitudes/fechas',
                data: { id: did, fecha: fechaRCB },
                success: function (data) {
                    if (data) {
                        $('#Modalimg .fechaRcb').html(fechaRCB)
                        table.ajax.reload(null, false);
                        SMSj('success', 'Fecha actualizada correctamente')
                        BuscarFechaRcb(start);
                    }
                }
            })
        });
    })
    var devoluciones = $('#devoluciones').DataTable({
        dom: 'Bfrtip',
        lengthMenu: [
            [10, 25, 50, 100, -1],
            ['10 filas', '25 filas', '50 filas', '100 filas', 'Ver todo']
        ],
        buttons: [
            {
                extend: 'pageLength',
                text: 'Ver',
                orientation: 'landscape'
            }
        ],
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: true,
            targets: 0
        },
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 1, targets: -2 }],
        //{className: "dt-center", targets: "_all"}],
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/solicitudes/devoluciones",
            dataSrc: "data"
        },
        /*initComplete: function (settings, json, row) {
                                        alert(row);
        },*/
        columns: [
            {
                data: null,
                defaultContent: ''
            },
            { data: "ids" },
            {
                data: "fech",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            { data: "nombre" },
            {
                data: "total",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "facturasvenc" },
            {
                data: "porciento",
                render: function (data, method, row) {
                    return `%${(data * 100).toFixed(2)}` //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "pagar",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "concepto" },
            { data: "descp" },
            { data: "formap" },
            { data: "proyect" },
            { data: "mz" },
            { data: "n" },
            { data: "fullname" },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-dark">Pagada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Declinada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-warning">Inactiva</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success">Disponible</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-primary">Sin info</span>`
                    }
                }
            },
            { data: 'descrip' },
            { data: 'orden' },
            {
                className: 't',
                data: "ids",
                //defaultContent: 
                render: function (data, method, row) {
                    return rol.contador ? `<div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu">
                                            
                                        </div>
                                    </div>` : ''
                }
            }/*<a class="dropdown-item" onclick="EstadoCC(${data}, 9, ${row.stado})">Habilitar</a>
                                            <a class="dropdown-item" onclick="EstadoCC(${data}, 15, ${row.stado})">Inhabilitar</a>
                                            <a class="dropdown-item" onclick="EstadoCC(${data}, 4, ${row.stado})">Cancelada</a>*/
        ],
        rowCallback: function (row, data, index) {
            if (data["stado"] == 3) {
                $(row).css("background-color", "#00FFFF");
            } else if (data["stado"] == 4) {
                $(row).css({ "background-color": "#008080", "color": "#FFFFCC" });
            } else if (data["stado"] == 9) {
                $(row).css("background-color", "#40E0D0");
            } else if (data["stado"] == 15) {
                $(row).css("background-color", "#FFFFCC");
            }
        }
    });
    var body = [];
    var comisiones = $('#comisiones').DataTable({
        dom: 'Bfrtip',
        deferRender: true,
        paging: true,
        lengthMenu: [
            [10, 25, 50, 100, -1],
            ['10 filas', '25 filas', '50 filas', '100 filas', 'Ver todo']
        ],
        buttons: [{
            extend: 'pageLength',
            text: 'Ver',
            orientation: 'landscape'
        },
        {
            extend: 'collection',
            text: 'Stds',
            orientation: 'landscape',
            buttons: [
                {
                    text: 'COPIAR',
                    extend: 'copy'
                },
                {
                    text: `PENDIENTES`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD('#comisiones', 16, 'Pendiente');
                    }
                },
                {
                    text: `APROBADOS`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD('#comisiones', 16, 'Pagada');
                    }
                },
                {
                    text: `ANULADOS`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD('#comisiones', 16, 'Declinada');
                    }
                },
                {
                    text: `TODOS`,
                    className: 'btn btn-secondary',
                    action: function () {
                        STAD('#comisiones', '', '');
                    }
                }
            ]
        },
        {
            text: `<i class="align-middle" data-feather="file-text"></i>`,
            attr: {
                title: 'Fecha',
                id: 'facturar'
            },
            className: 'btn btn-secondary',
            action: function () {
                var doc = new jsPDF('p', 'mm', [612, 792]);
                var img = new Image();
                var fech = moment().format('llll');
                img.src = '/img/avatars/avatar.png'
                var totalPagesExp = '{total_pages_count_string}'
                doc.autoTable({
                    head: [
                        { id: 'id', id2: 'std', id3: 'producto', id4: 'benefactor', id5: 'cliente', id6: '%', id7: 'monto', id8: 'concepto' },
                    ],
                    body,
                    includeHiddenHtml: false,
                    theme: 'plain',
                    didDrawPage: function (data) {
                        // Header
                        doc.setTextColor(0)
                        doc.setFontStyle('normal')
                        if (img) {
                            doc.addImage(img, 'png', data.settings.margin.left, 2, 7, 10)
                        }
                        doc.setFontSize(13)
                        doc.text('CUENTAS DE COBRO', data.settings.margin.left + 9, 9)
                        doc.setFontSize(7)
                        doc.text(fech, data.settings.margin.left + 153, 8)
                        // Footer
                        var str = 'Page ' + doc.internal.getNumberOfPages()
                        // Total page number plugin only available in jspdf v1.0+
                        if (typeof doc.putTotalPages === 'function') {
                            str = str + ' of ' + totalPagesExp
                        }
                    },
                    margin: { top: 13 },
                })
                doc.output('dataurlnewwindow')
            }
        }
        ],
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [
            //{ "visible": false, "targets": 1 }
        ],
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/solicitudes/comision",
            dataSrc: "data"
        },
        drawCallback: function (settings) {
            var api = this.api(); body = [];
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null, totales = 0, pagar = 0, cont = 0, total = 0;
            var filas = api.rows({ page: 'current' }).data();
            filas.each(function (group, i) {
                if (last !== group.cuentadecobro) {
                    if (last != null) {
                        $(rows).eq(i - 1).after(
                            `<tr class="group" style="background: #${total !== pagar ? 'F08080' : 'FFFFCC'}; color: #${total !== pagar ? 'FFFFCC' : '7f8c8d'};">
                                <td>
                                    <div class="text-center">
                                        ${cont}
                                    </div>
                                </td>
                                <td colspan="16">
                                    <div class="text-center">
                                        $${Moneda(pagar)}
                                    </div>
                                </td>                            
                            </tr>`
                        );
                        body.push(
                            {
                                id: {
                                    content: cont, colSpan: 1, styles: {
                                        halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 8, fillColor: total !== pagar ? '#F08080' : '#7f8c8d'
                                    }
                                },
                                id2: {
                                    content: Moneda(pagar), colSpan: 7, styles: {
                                        halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 8, fillColor: total !== pagar ? '#F08080' : '#7f8c8d'
                                    }
                                }
                            }
                        );
                        pagar = 0; cont = 0;
                    }
                    var fechg = moment(group.fechas).format('YYYY-MM-DD hh:mm A');
                    var std = 0; totales += group.deuda;
                    //console.log(group)
                    $(rows).eq(i).before(
                        `<tr class="group" style="background: #7f8c8d; color: #FFFFCC;">
                            <td>
                                <div class="text-center">
                                    ${group.cuentadecobro}
                                </div>
                            </td>
                            <td colspan="2">
                                <div class="text-center">
                                    ${fechg} 
                                </div>
                            </td>
                            <td>
                                <div class="text-center">
                                    ${group.nam} 
                                </div>
                            </td>
                            <td>
                                <div class="text-center">
                                    $${Moneda(group.deuda)}
                                </div>
                            </td>
                            <td colspan="12">
                                <div class="text-center">
                                    <div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                         aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu">
                                        ${group.cuentacobro ? `<a class="dropdown-item" href="${group.cuentacobro}" target="_blank" title="Click para ver recibo"><i class="fas fa-file-alt"></i> Cuenta C.</a>` : ''}                                            
                                            <a class="dropdown-item" onclick="Eliminar(${group.cuentadecobro}, '${group.cuentacobro}', '${group.nam}', '${group.clu}')"><i class="fas fa-trash-alt"></i> Declinar</a>
                                            <a class="dropdown-item" onclick="PagarCB(${group.cuentadecobro}, '${group.nam}')"><i class="fas fa-business-time"></i> Pagar</a>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>`
                    );

                    //console.log(window.location.origin + group.cuentacobro)
                    body.push(
                        {
                            id: {
                                content: group.cuentadecobro, colSpan: 1, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 10, fillColor: "#FFFFCC"
                                }
                            },
                            id2: {
                                content: fechg, colSpan: 2, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 10, fillColor: "#FFFFCC"
                                }
                            },
                            id4: {
                                content: group.nam, colSpan: 3, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 10, fillColor: "#FFFFCC"
                                }
                            },
                            id7: {
                                content: '$' + Moneda(group.deuda), colSpan: 2, styles: {
                                    halign: 'right', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 10, fillColor: "#FFFFCC"
                                }
                            }
                        }
                    )
                    last = group.cuentadecobro;
                }
                switch (group.stado) {
                    case 4:
                        std = `Pagada`
                        break;
                    case 6:
                        std = `Declinada`
                        break;
                    case 3:
                        std = `Pendiente`
                        break;
                    case 15:
                        std = `Inactiva`
                        break;
                    case 9:
                        std = `Disponible`
                        break;
                    default:
                        std = `Sin info`
                }
                body.push(
                    {
                        id: { content: group.ids, styles: { fontSize: 8, fontStyle: 'bold' } },
                        id2: { content: std, styles: { fontSize: 8, fontStyle: 'bold' } },
                        id3: { content: `${group.proyect} ${group.mz}-${group.n}`, styles: { fontSize: 8, fontStyle: 'bold' } },
                        id4: { content: group.fullname, styles: { fontSize: 8, fontStyle: 'bold' } },
                        id5: { content: group.nombre, styles: { fontSize: 8, fontStyle: 'bold' } },
                        id6: { content: (group.porciento * 100).toFixed(2) + `%`, styles: { fontSize: 8, fontStyle: 'bold' } },
                        id7: { content: '$' + Moneda(group.pagar), styles: { fontSize: 8, fontStyle: 'bold' } },
                        id8: { content: group.descp, styles: { fontSize: 8, fontStyle: 'bold' } }
                    }
                );
                total = group.deuda;
                pagar += group.pagar; cont++;
                if (i == filas.length - 1) {
                    $(rows).eq(i).after(
                        `<tr class="group" style="background: #${total !== pagar ? 'F08080' : 'FFFFCC'}; color: #${total !== pagar ? 'FFFFCC' : '7f8c8d'};">                          
                            <td>
                                <div class="text-center">
                                    ${cont}
                                </div>
                            </td>
                            <td colspan="16">
                                <div class="text-center">
                                    $${Moneda(pagar)}
                                </div>
                            </td>                            
                        </tr>`
                    );
                    body.push(
                        {
                            id: {
                                content: cont, colSpan: 1, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 8, fillColor: total !== pagar ? '#F08080' : '#7f8c8d'
                                }
                            },
                            id2: {
                                content: Moneda(pagar), colSpan: 7, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 8, fillColor: total !== pagar ? '#F08080' : '#7f8c8d'
                                }
                            }
                        },
                        {
                            id: {
                                content: 'TOTAL A PAGAR', colSpan: 4, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 9, textColor: '#FFFFCC', fillColor: "#000000"
                                }
                            },
                            id5: {
                                content: '$' + Moneda(totales), colSpan: 4, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 9, textColor: '#FFFFCC', fillColor: "#000000"
                                }
                            }
                        },
                        {
                            id: {
                                content: `${NumeroALetras(totales)} MCT********`, colSpan: 8, styles: {
                                    halign: 'center', cellWidth: 'wrap', fontStyle: 'bolditalic', fontSize: 7, textColor: '#FFFFCC', fillColor: "#000000"
                                }
                            }
                        }
                    )
                }
            });
        },
        /*initComplete: function (settings, json, row) {
                                        alert(row);
        },*/
        columns: [
            { data: "ids" },
            { data: "cuentadecobro" },
            {
                data: "fech",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            { data: "fullname" },
            { data: "nombre" },
            {
                data: "total",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "porciento",
                render: function (data, method, row) {
                    return `%${(data * 100).toFixed(2)}` //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "retefuente",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "reteica",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "pagar",
                render: function (data, method, row) {
                    return '$' + Moneda(Math.round(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "concepto" },
            { data: "descp" },
            { data: "proyect" },
            { data: "mz" },
            { data: "n" },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-dark">Pagada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Declinada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-tertiary">Pendiente</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-warning">Inactiva</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success">Disponible</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-primary">Sin info</span>`
                    }
                }
            }
        ]
    });
    var bajarPdf = () => {
        const link = document.createElement('a');
        link.href = '/bank/Movimientos.xlsm';
        link.download = "Movimientos.xlsm";
        link.dispatchEvent(new MouseEvent('click'));
    }
    var Eliminar = (id, pdf, nombre, movil) => {
        var porque = '';
        porque = prompt("Deje en claro por que quiere eliminar la solicitud, le enviaremos este mensaje al asesor para que pueda corregir y generar nuevamene la solicitud", "Solicitud rechazada por que");
        if (porque != null) {
            var D = { k: id, pdf, porque, nombre, movil };
            $.ajax({
                url: '/links/solicitudes/eliminar',
                data: D,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('#ModalEventos').modal({
                        backdrop: 'static',
                        keyboard: true,
                        toggle: true
                    });
                },
                success: function (data) {
                    if (data.r) {
                        comisiones.ajax.reload(null, false)
                        SMSj('success', data.m);
                        $('#ModalEventos').modal('hide');
                    } else {
                        SMSj('error', data.m);
                        $('#ModalEventos').modal('hide');
                    }
                }
            });
        }
    }
    var PagarCB = (id, nombre) => {
        $('#nombr').html(nombre)
        $('#ids').val(id)
        //});
        $('#PagOCC').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });
    }
    var BuscarFechaRcb = (start, extra) => {
        BancoExt.$('tr.selected').removeClass('selected');
        BancoExt.column(0).search("").draw();
        BancoExt.column(1).search("").draw();
        idExtracto = false;
        dateExtracto = false;
        var fechaAnt = moment(start).subtract(1, 'days').format('YYYY-MM-DD');
        var fechaRCB = moment(start).format('YYYY-MM-DD');
        var fechaPos1 = moment(start).add(1, 'days').format('YYYY-MM-DD')
        var fechaPos2 = moment(start).add(2, 'days').format('YYYY-MM-DD')
        var fechaPos3 = moment(start).add(3, 'days').format('YYYY-MM-DD')
        var fechaPos4 = moment(start).add(4, 'days').format('YYYY-MM-DD')
        let buscar = new RegExp(`${fechaAnt}|${fechaRCB}|${fechaPos1}|${fechaPos2}|${fechaPos3}|${fechaPos4}`);
        //console.log(buscar, extra, start)
        extra ? BancoExt.column(0).search(extra).draw() :
            BancoExt.column(1).search(buscar, true, false).draw();
        $('.dropdown-item').show();
    }
    /* INABILITADOS */
    var bonos = $('#bonos').DataTable({
        /*deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        order: [[0, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/solicitudes/bono",
            dataSrc: "data"
        },
        columns: [
            { data: "ids" },
            { data: "fullname" },
            {
                data: "fech",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            {
                data: "total",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            {
                data: "porciento",
                render: function (data, method, row) {
                    return '%' + (parseFloat(data) * 100) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "retefuente",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "reteica",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            }, {
                data: "pagar",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "concepto" },
            { data: "descp" },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-success">Aprobada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Declinada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-dark">Disponible</span>`
                    }
                }
            },
            {
                className: 't',
                defaultContent: admin == 1 ? `<div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item">Aprobar</a>
                                            <a class="dropdown-item">Declinar</a>
                                        </div>
                                    </div>` : ''
            }
        ]*/
    });
    var premios = $('#premios').DataTable({
        /*deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: {
            details: {
                type: 'column'
            }
        },
        order: [[0, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/solicitudes/premio",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
                                        alert(row);
        },
        columns: [
            { data: "ids" },
            { data: "nombre" },
            {
                data: "fech",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            { data: "proyect" },
            { data: "n" },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "facturasvenc" },
            { data: "recibo" },
            {
                data: "stado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-success">Aprobada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Declinada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Pendiente</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">sin formato</span>`
                    }
                }
            },
            {
                className: 't',
                defaultContent: admin == 1 ? `<div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item">Aprobar</a>
                                            <a class="dropdown-item">Declinar</a>
                                        </div>
                                    </div>` : ''
            }
        ]*/
    });
    /* INABILITADOS */


    $('#recbo').submit(function (e) {
        e.preventDefault();
        var dat = new FormData(this); //$('#recbo').serialize();
        $('#ahora').val(moment().format('YYYY-MM-DD HH:mm'));
        $('#g').val(1);
        $.ajax({
            type: 'POST',
            url: '/links/recibo',
            data: dat,
            //async: true,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                $('#PagO').modal('hide');
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            success: function (data) {
                if (data.std) {
                    SMSj('success', data.msj);
                    $('#ModalEventos').modal('hide');
                    //table.ajax.reload(null, false)
                } else {
                    SMSj('error', data.msj);
                    $('#ModalEventos').modal('hide');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    });
    $('#recboCC').submit(function (e) {
        e.preventDefault();
        var dat = new FormData(this); //$('#recbo').serialize();
        $.ajax({
            type: 'POST',
            url: '/links/solicitudes/rcbcc',
            data: dat,
            //async: true,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                $('#PagOCC').modal('hide');
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            success: function (data) {
                if (data.std) {
                    SMSj('success', `Solicitud procesada correctamente`);
                    comisiones.ajax.reload(null, false);
                    $('#ModalEventos').modal('hide');
                } else {
                    $('#ModalEventos').modal('hide');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    });
    window.preview = function (input) {
        if (input.files && input.files[0]) {
            var marg = 100 / $('#file2')[0].files.length;
            $('#recibos1').html('');
            $('.op').remove();
            $('#montorecibos').val('').hide('slow');
            $(input.files).each(function () {
                var reader = new FileReader();
                reader.readAsDataURL(this);
                reader.onload = function (e) {
                    $('#recibos1').append(
                        //`<img id="img_02" src="${e.target.result}" width="${marg}%" height="100%" alt="As">`
                        `<div class="image" style="
                            width: ${marg}%;
                            padding-top: calc(100% / (16/9));
                            background-image: url('${e.target.result}');
                            background-size: 100%;
                            background-position: center;
                            background-repeat: no-repeat;float: left;"></div>`
                    );
                    $('#trarchivos').after(`
                    <tr class="op">
                        <th>                     
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                        stroke-linejoin="round" class="feather feather-file-text">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <input class="recis" type="text" name="nrecibo" placeholder="Recibo"
                             autocomplete="off" style="padding: 1px; width: 50%;" required>
                        </th>
                        <td>
                            <input class="montos text-center" type="text" name=""
                             placeholder="Monto" autocomplete="off" style="padding: 1px; width: 100%;" required>
                        </td>
                    </tr>`
                    );
                    $('.montos').mask('###.###.###', { reverse: true });
                    $('.montos').on('change', function () {
                        var avl = 0;
                        $('#montorecibos').show('slow')
                        $('.montos').map(function () {
                            s = parseFloat($(this).cleanVal()) || 0
                            avl = avl + s;
                        });
                        $('.montorecibos').html(Moneda(avl))
                        $('#montorecibos').val(avl);
                    })
                    $('.recis').on('change', function () {
                        var avl = '';
                        $('.recis').map(function () {
                            s = $(this).val() ? '~' + $(this).val().replace(/^0+/, '') + '~,' : '';
                            avl += s;
                        });
                        $('#nrbc').val(avl.slice(0, -1));
                    })
                    var zom = 200
                    $(".image").on({
                        mousedown: function () {
                            zom += 50
                            $(this).css("background-size", zom + "%")
                        },
                        mouseup: function () {

                        },
                        mousewheel: function (e) {
                            //console.log(e.deltaX, e.deltaY, e.deltaFactor);
                            if (e.deltaY > 0) { zom += 50 } else { zom < 150 ? zom = 100 : zom -= 50 }
                            $(this).css("background-size", zom + "%")
                        },
                        mousemove: function (e) {
                            let width = this.offsetWidth;
                            let height = this.offsetHeight;
                            let mouseX = e.offsetX;
                            let mouseY = e.offsetY;

                            let bgPosX = (mouseX / width * 100);
                            let bgPosY = (mouseY / height * 100);

                            this.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                        },
                        mouseenter: function (e) {
                            $(this).css("background-size", zom + "%")
                        },
                        mouseleave: function () {
                            $(this).css("background-size", "100%")
                            this.style.backgroundPosition = "center";
                        }
                    });
                }
            });
        }

    }
    var BancoExt = $('#BancoExt').DataTable({
        //scrollY: "200px",
        //scrollCollapse: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        //ordering: false,
        lengthChange: false,
        info: false,
        //searching: false,
        //deferRender: true,
        autoWidth: true,
        responsive: true,
        /* columnDefs: [
            {
                render: function (data, type, row) {
                    return `El día ${moment(row[3]).format('ll')}, ${row[2]} pasajeros fueron trasladados de ${row[4]} con destino a ${row[5]}. ${row[8] ? row[8] + '.' : ''} Grupo o pasajero que hace referencia a la reserva ${row[10] ? row[10] : row[9]}`;
                },
                targets: 1
            },
            {
                render: function (data, type, row) {
                    return '$' + data//Moneda(parseFloat(data.replace(/(?!\w|\s).| /g, "")));
                },
                targets: 10
            },
            { visible: false, targets: [2, 3, 4, 5, 6, 7, 8, 9] }
        ], */
        order: [[1, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/solicitudes/extractos",
            dataSrc: "data"
        },
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var xtrato = null;
            var pagos = null;
            api.rows({ page: 'current' }).data().each(function (group, i) {

                /* if (xtrato !== group.xtrabank && pagos !== group.pagos && group.xtrabank) {
                    $(rows).eq(i).css("background-color", "#40E0D0");
                    pagos = group.pagos;
                    xtrato = group.xtrabank;
                } else if ((xtrato === group.xtrabank || pagos === group.pagos) && group.xtrabank) {
                    $(rows).eq(i).css("background-color", "#40E0D0");
                } */
            });
        },
        columns: [
            { data: "id" },
            {
                data: "date",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD')
                }
            },
            { data: "description" },
            { data: "lugar" },
            { data: "concpt1" },
            {
                data: "consignado",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            { data: "ids" },
            {
                data: "monto",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            }
        ]
    });
    $('#BancoExt_filter').hide();
    BancoExt.on('click', 'tr', function () { //'td:not(.control, .t)'
        var data = BancoExt.row(this).data();
        var monto = parseFloat($('#montopago').val());
        var stad = parseFloat($('#stadopago').val());
        var montos = data.monto || 0;
        var excedentes = monto + montos;
        var acum = 0, acu = 0, U = false; console.log(data, monto, stad)

        if ($(this).hasClass('selected')) {
            BancoExt.$('tr.selected').removeClass('selected');
            idExtracto = false;
            dateExtracto = false;
            return false;
        } else {
            BancoExt.$('tr.selected').removeClass('selected');
            $(this).toggleClass('selected');
        }


        if (monto > data.consignado) {
            alert('No es posible asociar el pago a este extrato ya que su monto supera el monto del extrato');
            $(this).toggleClass('selected');
            idExtracto = false;
            dateExtracto = false;
            return false;
        } else if (data.monto >= data.consignado) {
            alert('No sera posible asociar el pago a este extrato ya que este posee un pago que cubre todo su monto');
            $(this).toggleClass('selected');
            idExtracto = false;
            dateExtracto = false;
            return false;
        } else if (excedentes > data.consignado) {
            alert('No es posible asociar el pago a este extrato ya que con su monto supera el monto del extrato');
            $(this).toggleClass('selected');
            idExtracto = false;
            dateExtracto = false;
            return false;
        }
        if (data.consignado < monto) {
            alert('No es posible asociar el pago a este extrato ya que el valor es menor al pago aprovar');
            $(this).toggleClass('selected');
            idExtracto = false;
            dateExtracto = false;
            return false;
        }
        idExtracto = data.id;
        dateExtracto = moment.utc(data.date).format('YYYY-MM-DD');
        /* BancoExt
            //.column(6)
            .rows()
            .data()
            .filter(function (value, index) {
                if (value.ids === data.ids && data.ids) {
                    acum += value.consignado;
                    console.log(value)
                }
                if (value.id === data.id) {
                    acu += parseFloat(value.monto);
                }
                if (value.ids === IDS) {
                    U = true;
                }
            });
        if ((acum - acu) >= monto || U || !data.ids) {
            $(this).toggleClass('selected');
            var w = Seleccion(); //console.log(w.length);
            if (w.length > imge) {
                alert('El numero de extractos debe ser igual al numero de recibos que halla');
                $(this).toggleClass('selected');
                Seleccion();
            }
            //console.log(extr)
        } else {
            alert('El monto ha aprobar excede el excedente acumulado de los pagos');
        } */
    });
    /*$('button').click(function () {
        var data = table.$('input, select').serialize();
        alert(
            "The following data would have been submitted to the server: \n\n" +
            data.substr(0, 120) + '...'
        );
        return false;
    });*/
    // Daterangepicker
    /*var start = moment().subtract(29, "days").startOf("hour");
    var end = moment().startOf("hour").add(32, "hour");*/

    $('#collapse').on('shown.bs.collapse', function () {
        table.columns.adjust().responsive.recalc();
    });
    $('#collapse2').on('shown.bs.collapse', function () {
        devoluciones.columns.adjust().responsive.recalc();
    });
    $('#collapse3').on('shown.bs.collapse', function () {
        comisiones.columns.adjust().responsive.recalc();
    });
    $(".fech").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        //autoApply: false,
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        ranges: {
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Hoy': [moment().startOf('days'), moment().endOf("days")]
        }
    }, function (start, end, label) {
        maxDateFilter = new Date(end).getTime();
        minDateFilter = new Date(start).getTime();
        table.draw();
        console.log(maxDateFilter, minDateFilter)
        $("#Date_search").val(start.format('YYYY-MM-DD') + ' a ' + end.format('YYYY-MM-DD'));
    });
    $(".fechaRcbs").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        //autoApply: false,
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        ranges: {
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Hoy': [moment().startOf('days'), moment().endOf("days")]
        }
    }, function (start, end, label) {
        maxDateFilter = new Date(end).getTime();
        minDateFilter = new Date(start).getTime();
        table.draw();
        console.log(maxDateFilter, minDateFilter)
        $("#Date_search").val(start.format('YYYY-MM-DD') + ' a ' + end.format('YYYY-MM-DD'));
    });
    $(".fechs").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        //autoApply: false,
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        ranges: {
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Hoy': [moment().startOf('days'), moment().endOf("days")],
            'Mañana': [moment().add(1, 'days').startOf('days'), moment().add(1, 'days').endOf('days')],
            'Proximos 30 Días': [moment().startOf('days'), moment().add(29, 'days').endOf("days")],
            'Próximo Mes': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
        }
    }, function (start, end, label) {
        tiem = 2
        //alert(t)
        maxDateFilter = end;
        minDateFilter = start;
        BancoExt.draw();
        $("#Date_search").val(start.format('YYYY-MM-DD') + ' a ' + end.format('YYYY-MM-DD'));
    });
    $('.fech').on('cancel.daterangepicker', function (ev, picker) {
        //do something, like clearing an input
        maxDateFilter = "";
        minDateFilter = "";
        table.draw();
    });
};
/////////////////////////////* RED */////////////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/red` && !rol.externo) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[3]).getTime();
            }
            if (minDateFilter && !isNaN(minDateFilter)) {
                if (aData._date < minDateFilter) {
                    return false;
                }
            }
            if (maxDateFilter && !isNaN(maxDateFilter)) {
                if (aData._date > maxDateFilter) {
                    return false;
                }
            }
            return true;
        }
    );
    $(document).ready(function () {
        $("#Date_search").html("");
        $('a.toggle-vis').on('click', function (e) {
            e.preventDefault();
            // Get the column API object
            var column = table.column($(this).attr('data-column'));
            // Toggle the visibility
            column.visible(!column.visible());
        });
    });
    var Color = (val) => {
        var elemen = $(`#t-${val}`);
        if (elemen.hasClass('i')) {
            elemen.css('background-color', 'transparent');
            elemen.removeClass('.i');
        } else {
            elemen.css('background-color', '#FFFFCC');
            elemen.addClass('i');
        }
    }
    var red2 = $('#red2').DataTable({
        processing: true,
        autowidth: true,
        columnDefs: [
            { responsivePriority: 2, targets: [1, 3, 5] },
            { responsivePriority: 1, targets: [2, 6, 7, 8] }],
        order: [2, 'asc'],
        ajax: {
            method: "POST",
            url: "/links/reds",
            dataSrc: "data"
        },
        columns: [
            {
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },
            { data: "acreedor" },
            { data: "fullname" },
            { data: "cel" },
            { data: "username" },
            { data: "cli" },
            {
                data: "sucursal",
                render: function (data, method, row) {
                    return `<input type="text" class="text-center edir" id="${row.pin}" style="width:40px"
                    data-toggle="tooltip" data-placement="top" data-container="body" onClick="this.select();"
                    title="Digite porcentage" autocomplete="off" value="${data ? (data * 100).toFixed(1) : 'Red'}"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onchange="Porcentag(this);">`
                }
            },
            {
                data: "nrango",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-tertiary">Presidente</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="1">Presidente</option>
                                <option value="2">Vicepresidente</option>
                                <option value="3">Gerente Elite</option>
                                <option value="4">Gerente</option>
                                <option value="5">Director</option>
                                <option value="6">Inversionista</option>
                            </select>`
                            break;
                        case 2:
                            return `<span class="badge badge-pill badge-primary">Vicepresidente</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="2">Vicepresidente</option>
                                <option value="1">Presidente</option>
                                <option value="3">Gerente Elite</option>
                                <option value="4">Gerente</option>
                                <option value="5">Director</option>
                                <option value="6">Inversionista</option>
                            </select>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-info">Gerente Elite</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="3">Gerente Elite</option>
                                <option value="1">Presidente</option>
                                <option value="2">Vicepresidente</option>
                                <option value="4">Gerente</option>
                                <option value="5">Director</option>
                                <option value="6">Inversionista</option>
                            </select>`
                            break;
                        case 4:
                            return `<span class="badge badge-pill badge-success">Gerente</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="4">Gerente</option>
                                <option value="1">Presidente</option>
                                <option value="2">Vicepresidente</option>
                                <option value="3">Gerente Elite</option>
                                <option value="5">Director</option>
                                <option value="6">Inversionista</option>
                            </select>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-secondary">Director</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="5">Director</option>
                                <option value="1">Presidente</option>
                                <option value="2">Vicepresidente</option>
                                <option value="3">Gerente Elite</option>
                                <option value="4">Gerente</option>
                                <option value="6">Inversionista</option>
                            </select>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-dark">Inversionista</span>
                            <select class="form-control-no-border estado" name="estado"
                            style="padding: 1px; width: 100%; display: none;">
                                <option value="6">Inversionista</option>
                                <option value="1">Presidente</option>
                                <option value="2">Vicepresidente</option>
                                <option value="3">Gerente Elite</option>
                                <option value="4">Gerente</option>
                                <option value="5">Director</option>
                            </select>`
                            break;
                        case 7:
                            return `<span class="badge badge-pill badge-danger">Independiente</span>`
                            break;
                        default:
                            return ``
                    }
                }
            },
            {
                data: "bonoextra",
                render: function (data, method, row) {
                    return `<input type="text" class="text-center edir" id="${row.pin}" style="width:40px"
                    data-toggle="tooltip" data-placement="top" data-container="body" onClick="this.select();"
                    title="Digite porcentage" autocomplete="off" value="${(data * 100).toFixed(1)}"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onchange="PorcentagBEx(this);">`
                }
            },
            { data: "idpapa" },
            { data: "namepapa" },
            { data: "rangopapa" },
            { data: "idabuelo" },
            { data: "nameabuelo" },
            { data: "rangoabuelo" },
            { data: "idbisabuelo" },
            { data: "namebisabuelo" },
            { data: "rangobisabuelo" },
        ],
        dom: 'Bfrtip',
        buttons: [{
            extend: 'collection',
            text: '<i class="align-middle feather-md" data-feather="menu"></i>',
            orientation: 'landscape',
            buttons: [{
                text: '<i class="align-middle feather-md" data-feather="copy"></i> Copiar',
                extend: 'copy'
            },
            {
                text: '<i class="align-middle feather-md" data-feather="printer"></i> Imprimir',
                extend: 'print',
                title: ``,
                orientation: 'landscape',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    //modifier: true
                },
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '10pt')
                        .prepend(
                            `                
                    <div class="card">
                        <!--<div class="text-right mb-2">
                            <span class="badge badge-dark text-md-center">PRADOS DE PONTEVEDRA</span>
                        </div>-->
                        <div class="row">
                            <div class="col-sm-5">
                                <div class="card border-primary text-left">
                                    <div class="row no-gutters">
                                        <div class="col-md-2">
                                            <img src="https://grupoelitered.com.co/img/avatars/avatar.svg" class="card-img" alt="...">
                                        </div>
                                        <div class="col-md-9">
                                            <div class="card-body text-primary h4">
                                                <div class="mb-0">
                                                    <span class="align-middle text-dark">GRUPO ELITE FINCA RAIZ S.A.S</span>
                                                </div>   
                                                <div class="mb-0">
                                                    <span class="align-middle card-text">${Fehsi + '/' + Fehsf}</span>
                                                </div>
                                                <div class="mb-0">
                                                    <span class="align-middle text-dark">PRODUCTOS</span>
                                                    <span class="align-middle card-text">${productos} LOTES</span>
                                                </div>
                                                <div class="mb-0">
                                                    <span class="align-middle text-dark">AREA</span>
                                                    <span class="align-middle card-text">${Math.round(area, 2)} MTR2</span>
                                                </div>                                            
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div class="col-sm-7">
                            <div class="card border-primary text-left">
                            <div class="row no-gutters">
                                <div class="col-md-6">
                                    <div class="card-body text-primary h4">
                                        <div class="mb-0">                                          
                                            <span class="align-middle text-dark">DESCUENTOS</span>
                                            <span class="align-middle text-danger">$${Moneda(descuentos)}</span>
                                        </div>
                                        <div class="mb-0">
                                            <span class="align-middle text-dark">TOTALES</span>
                                            <span class="align-middle card-text">$${Moneda(total)}</span>
                                        </div>
                                        <div class="mb-0">
                                            <span class="align-middle text-dark">ABONOS</span>
                                            <span class="align-middle text-success">$${Moneda(abonos)}</span>
                                        </div>
                                        <div class="mb-0">
                                            <span class="align-middle text-dark">SALDOS</span>
                                            <span class="align-middle text-warning">$${Moneda(total - abonos)}</span>
                                        </div>                                            
                                    </div>
                                </div>
                                <div class="col-md-6">
                                <div class="card-body text-primary h4">
                                <div class="mb-0">
                                    <span class="align-middle text-warning">${proyct}</span>
                                </div>
                                <div class="mb-0">
                                    <span class="align-middle card-text">ESTADOS DE CUENTAS</span>
                                </div>
                                <div class="mb-0">
                                    <span class="align-middle card-text">CONCEPTO RESUMEN</span>
                                </div>
                                <div class="mb-0">
                                    <span class="align-middle card-text">SISTEMA DE REPORTES</span>
                                </div>                                            
                            </div>
                                </div>
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>`
                        );

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                },
                autoPrint: true
            }
            ]
        },
        {
            extend: 'pageLength',
            text: '<i class="align-middle feather-md" data-feather="eye-off"></i>',
            orientation: 'landscape'
        }
        ],
        ordering: true,
        language: languag,
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        //searching: false,
        responsive: {
            details: {
                type: 'column'
            }
        },
        initComplete: function (settings, json) {
            //console.log(Math.round(area, 2), productos, descuentos, total, abonos, total - abonos)
        },
        rowCallback: function (row, data, index) {
            //$(row).find(`.papa`).css({ "background-color": "#EB0C1A", "color": "#FFFFFF" });
            /*if (data["estado"] == 9) {
                $(row).css({ "background-color": "#C61633", "color": "#FFFFFF" });
            }*/
        }
    });
    red2.on('change', 'tr select', function () {
        var fila = $(this).parents('tr');
        var data = red2.row(fila).data();
        var dato = $(this).val()
        $.ajax({
            type: 'PUT',
            url: '/links/red',
            data: { S: 1, F: data.pin, U: dato },
            beforeSend: function (xhr) {
            },
            success: function (dat) {
                if (dat) {
                    red2.ajax.reload(null, false)
                }
            },
            error: function (data) {
                console.log(data);
            }
        })
    })
    red2.on('click', 'tr span', function () {
        var fila = $(this).parents('tr');
        var data = red2.row(fila).data();
        if (data.nrango !== 7) {
            var este = $(this), aquel = $(this).siblings()
            este.hide()
            aquel.fadeToggle(2000)
            setTimeout(function () {
                aquel.hide()
                este.fadeToggle(2000)
            }, 9000);
        }
    })
    function Porcentag(F) {
        if (!isNaN(F.value)) {
            $.ajax({
                type: 'PUT',
                url: '/links/red',
                data: { S: null, F: F.id, U: F.value / 100 },
                beforeSend: function (xhr) {
                },
                success: function (dat) {
                    if (dat) {
                        red2.ajax.reload(null, false)
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            })
        } else {
            alert('digite un numero para el porcentage valido')
        }
    }
    function PorcentagBEx(F) {
        /*if (!isNaN(F.value)) {
            $.ajax({
                type: 'PUT',
                url: '/links/reds',
                data: { S: null, F: F.id, U: F.value / 100 },
                beforeSend: function (xhr) {
                },
                success: function (dat) {
                    if (dat) {
                        red2.ajax.reload(null, false)
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            })
        } else {
            alert('digite un numero para el porcentage valido')
        }*/
    }
    var red = $('#red').DataTable({
        dom: 'Bfrtip',
        lengthMenu: -1,
        buttons: [
            {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" data-feather="calendar"></i> <span class="align-middle">Fecha</span>
                        </div>`,
                attr: {
                    title: 'Fecha',
                    id: 'Date'
                },
                className: 'btn btn-secondary fech'
            }
        ],
        deferRender: true,
        paging: true,
        autoWidth: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        language: languag2,
        ajax: {
            method: "POST",
            url: "/links/red",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
            $('#datatable_filter').prepend("<h3 class='float-left mt-2'>PAGOS</h3>");
        },
        columns: [
            { data: "fullname" },
            {
                data: "nrango",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-tertiary">Presidente</span>`
                            break;
                        case 2:
                            return `<span class="badge badge-pill badge-success">Vicepresidente</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary">Gerente</span>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-danger">Inversionista</span>`
                            break;
                        case 4:
                            return `<span class="badge badge-pill badge-secondary">Director</span>`
                            break;
                        default:
                            return ``
                    }
                }
            },
            {
                data: "nombre1",
                render: function (data, method, row) {
                    return data ? data.toLocaleLowerCase() : '';
                }
            },
            {
                data: "rango1",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-tertiary">Presidente</span>`
                            break;
                        case 2:
                            return `<span class="badge badge-pill badge-success">Vicepresidente</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary">Gerente</span>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-danger">Inversionista</span>`
                            break;
                        case 4:
                            return `<span class="badge badge-pill badge-secondary">Director</span>`
                            break;
                        default:
                            return ``
                    }
                }
            },
            {
                data: "nombre2",
                render: function (data, method, row) {
                    return data ? data.toLocaleLowerCase() : '';
                }
            },
            {
                data: "rango2",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-tertiary">Presidente</span>`
                            break;
                        case 2:
                            return `<span class="badge badge-pill badge-success">Vicepresidente</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary">Gerente</span>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-danger">Inversionista</span>`
                            break;
                        case 4:
                            return `<span class="badge badge-pill badge-secondary">Director</span>`
                            break;
                        default:
                            return ``
                    }
                }
            },
            {
                data: "nombre3",
                render: function (data, method, row) {
                    return data ? data.toLocaleLowerCase() : '';
                }
            },
            {
                data: "rango3",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-tertiary">Presidente</span>`
                            break;
                        case 2:
                            return `<span class="badge badge-pill badge-success">Vicepresidente</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary">Gerente</span>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-danger">Inversionista</span>`
                            break;
                        case 4:
                            return `<span class="badge badge-pill badge-secondary">Director</span>`
                            break;
                        default:
                            return ``
                    }
                }
            }
        ],
        columnDefs: [
            { "visible": false, "targets": 0 },
            { "visible": false, "targets": 1 }/*,
            { responsivePriority: 10002, targets: 5 },
            { responsivePriority: 10003, targets: 6 },
            { responsivePriority: 10004, targets: 7 },
            { responsivePriority: 10005, targets: 8 }*/
        ],
        order: [[0, 'asc'], [6, 'desc'], [4, 'desc'], [2, 'desc']],
        displayLength: -1,
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    var datos = api.rows(i).data(), e = '';
                    switch (datos[0].nrango) {
                        case 1:
                            e = `<span class="badge badge-pill badge-tertiary">Presidente</span>`
                            break;
                        case 2:
                            e = `<span class="badge badge-pill badge-success">Vicepresidente</span>`
                            break;
                        case 3:
                            e = `<span class="badge badge-pill badge-primary">Gerente</span>`
                            break;
                        case 5:
                            e = `<span class="badge badge-pill badge-danger">Inversionista</span>`
                            break;
                        case 4:
                            e = `<span class="badge badge-pill badge-secondary">Director</span>`
                            break;
                    }
                    $(rows).eq(i).before(
                        `<tr class="group">
                            <td colspan="8">
                                <div class="text-center text-muted">
                                    ${group.toLocaleUpperCase()} 
                                </div>
                                ${e}
                            </td>
                        </tr>`
                    );
                    last = group;
                    $(rows).eq(i).hide();
                } else {
                    //$('.table-sortable').find('tr:not(.' + vClass + ')').hide();
                    $(rows).eq(i).hide();
                }
            });
        }
    }); //table.buttons().container().appendTo("#datatable_wrapper .col-sm-12 .col-md-6");
    red.on('click', 'tr', function () {
        $(this).toggleClass('selected')
        var rows = red.rows({ page: 'current' }).nodes();
        var last = $(this).find('div').text().toLocaleLowerCase().trim();

        red.column(0, { page: 'current' }).data().each(function (group, i) {
            if (last == group.toLocaleLowerCase().trim() && $(rows).eq(i).is(':hidden')) {
                $(rows).eq(i).show();
            } else if (last == group.toLocaleLowerCase().trim()) {
                $(rows).eq(i).hide();
            }
        });
    })
    // Daterangepicker
    /*var start = moment().subtract(29, "days").startOf("hour");
    var end = moment().startOf("hour").add(32, "hour");*/
    $(".fech").daterangepicker({
        locale: {
            'format': 'YYYY-MM-DD HH:mm',
            'separator': ' a ',
            'applyLabel': 'Aplicar',
            'cancelLabel': 'Cancelar',
            'fromLabel': 'De',
            'toLabel': 'A',
            'customRangeLabel': 'Personalizado',
            'weekLabel': 'S',
            'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            'firstDay': 1
        },
        opens: "center",
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 15,
        opens: "right",
        alwaysShowCalendars: false,
        //autoApply: false,
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
        ranges: {
            'Ayer': [moment().subtract(1, 'days').startOf("days"), moment().subtract(1, 'days').endOf("days")],
            'Ultimos 7 Días': [moment().subtract(6, 'days'), moment().endOf("days")],
            'Ultimos 30 Días': [moment().subtract(29, 'days'), moment().endOf("days")],
            'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Hoy': [moment().startOf('days'), moment().endOf("days")],
            'Mañana': [moment().add(1, 'days').startOf('days'), moment().add(1, 'days').endOf('days')],
            'Proximos 30 Días': [moment().startOf('days'), moment().add(29, 'days').endOf("days")],
            'Próximo Mes': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
        }
    }, function (start, end, label) {
        maxDateFilter = end;
        minDateFilter = start;
        table.draw();
        $("#Date_search").val(start.format('YYYY-MM-DD') + ' a ' + end.format('YYYY-MM-DD'));
    });
};
///// https://api.chat-api.com/instance107218/checkPhone?token=5jn3c5dxvcj27fm0&phone=14081472583 verificar si se puede enviar un whatsapp a un numero eliminar los espacios en el numero////////////

/////////////////////////////* CLIENTES */////////////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/clientes` && !rol.externo) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');
    $(document).ready(function () {
        $('#creacliente').submit(function (e) {
            e.preventDefault();
            $('.ya').val(moment().format('YYYY-MM-DD HH:mm'))
            //var fd = $('#creacliente').serialize();
            var formData = new FormData(document.getElementById("creacliente"));
            $.ajax({
                url: '/links/clientes/agregar',
                data: formData,
                type: 'PUT',
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#ModalEventos').modal({
                        toggle: true,
                        backdrop: 'static',
                        keyboard: true,
                    });
                },
                success: function (data) {
                    if (data) {
                        clientes.ajax.reload(null, false)
                        $('#ModalEventos').modal('hide')
                        $('#agrecli').show("slow")
                        $("#addcliente").hide("slow");
                        $("#addcliente input").val('')
                        $('#ModalEventos').modal('hide');
                    }
                }
            });
        });
        $('.atras').click(function () {
            $('#agrecli').show("slow")
            $("#addcliente").hide("slow");
            $("#addcliente input").val('')
        })
        $('.movil').mask("57 ***-***-****");

        $('#pais').change(function () {
            $('.movil').val('')
            $('.movil').mask(`${$(this).val()} ***-***-****`).focus();
        })
        $('.tipod').change(function () {
            $('.documento').val('')
            if ($(this).val() === "Cedula de extranjeria" || $(this).val() === "Pasaporte" || $(this).val() === "Nit") {
                $('.documento').unmask().focus();
            } else {
                $('.documento').mask('#.##$', { reverse: true, selectonfocus: true }).focus();
            }
        })
    });
    function Consul(tipo, code) {
        var dw = Consultar(tipo, code);
        $.ajax({
            url: dw.url,
            method: 'POST',
            timeout: 0,
            headers: {
                "Authorization": "nci2upw280kxoy3o1dlc2q0gq28f5pfc9z58b3piryylih19",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: dw.dat,
            //async: false,
            success: function (dat) {
                if (jQuery.isEmptyObject(dat.data)) {
                    $('.name').prop('disabled', false).focus();
                } else {
                    $('.name').val(dat.data.fullName);
                }
            }
        });
    }
    var clientes = $('#clientes').DataTable({
        dom: 'Bfrtip',
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        buttons: [
            {
                extend: 'collection',
                text: '<i class="align-middle feather-md" data-feather="menu"></i>',
                orientation: 'landscape',
                buttons: [{
                    text: '<i class="align-middle feather-md" data-feather="copy"></i> Copiar',
                    extend: 'copy'
                }]
            },
            {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" data-feather="user-plus"></i> <span class="align-middle">Ingresar Cliente</span>
                        </div>`,
                attr: {
                    title: 'Agregar-Clientes',
                    id: 'agrecli'
                },
                className: 'btn btn-outline-dark',
                action: function () {
                    $('#agrecli').hide("slow")
                    $("#addcliente").show("slow");
                }
            }
        ],
        deferRender: true,
        paging: true,
        autoWidth: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        columnDefs: [{
            responsivePriority: 1, targets: [11, 12]
        }],
        order: [[0, "desc"]], //[0, "asc"]
        language: languag2,
        ajax: {
            method: "POST",
            url: "/links/clientes",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
            $('#datatable_filter').prepend("<h3 class='text-center mt-2'>CLIENTES</h3>");
        },
        columns: [
            {
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },
            { data: "idc" },
            { data: "nombre" },
            { data: "documento" },
            {
                data: "fechanacimiento",
                render: function (data, method, row) {
                    return data ? moment(data).format('YYYY-MM-DD') : '';
                }
            },
            { data: "lugarexpedicion" },
            {
                data: "fechaexpedicion",
                render: function (data, method, row) {
                    return data ? moment(data).format('YYYY-MM-DD') : '';
                }
            },
            { data: "estadocivil" },
            { data: "movil" },
            { data: "email" },
            { data: "direccion" },
            {
                data: "imags",
                render: function (data, method, row) {
                    if (data) {
                        var fr = '', p = data.split(",");
                        p.map((e) => {
                            fr += e ? `<a href="${e}" target="_blank" title="Click para ver documento" class="mr-1"><i class="fas fa-address-card"></i></a>` : ``
                        })
                        return fr;
                    } else {
                        return `<a title="No posee ningun documento"><i class="fas fa-exclamation-circle"></i></a>`;
                    }
                }
            },
            {
                data: "idc",
                render: function (data, method, row) {
                    return rol.subadmin ? `<div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" onclick="AdjuntarCC(${data})"><i class="fas fa-paperclip"></i> Adjuntar</a>
                                            <a class="dropdown-item editar"><i class="fas fa-edit"></i> Editar</a>
                                            <a class="dropdown-item" onclick="Eliminar(${data})"><i class="fas fa-trash-alt"></i> Eliminar</a>
                                        </div>
                                    </div>` : `<a class="dropdown-item" onclick="AdjuntarCC(${data})"><i class="fas fa-paperclip"></i> Adjuntar</a>`
                }
            }
        ]
    });
    clientes.on('click', 'td .editar', function () {
        var fila = $(this).parents('tr');
        var data = clientes.row(fila).data();
        var indic = data.movil.indexOf(' ');
        var Mvl = indic != -1 ? data.movil.substr(0, indic) : '57';
        $('.Movil').unmask();
        $('#ModalClints input, #ModalClints select').val(null);
        $('#idcc').val(data.idc);
        $('.name').val(data.nombre).prop('disabled', true);
        $(`.tipod option[value='${data.tipo}']`).prop("selected", true);
        $('.docu').val(data.documento);
        $('.fnaci').val(moment(data.fechanacimiento).format('YYYY-MM-DD'));
        $('.lugarex').val(data.lugarexpedicion);
        $('.fehex').val(moment(data.fechaexpedicion).format('YYYY-MM-DD'));
        $(`.ecivil option[value='${data.estadocivil}']`).prop("selected", true);
        $(`.pais option[value='${Mvl}']`).prop("selected", true);
        $('.Movil').val(indic != -1 ? data.movil.slice(indic + 1) : data.movil).mask(`***-***-****`);
        $('.email').val(data.email);
        $('.adres').val(data.direccion);

        $('#Movl').html('+' + Mvl);
        $('#ModalClints').modal('toggle');
        $(".f").daterangepicker({
            locale: {
                'format': 'YYYY-MM-DD',
                'separator': ' - ',
                'applyLabel': 'Aplicar',
                'cancelLabel': 'Cancelar',
                'fromLabel': 'De',
                'toLabel': '-',
                'customRangeLabel': 'Personalizado',
                'weekLabel': 'S',
                'daysOfWeek': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
                'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                'firstDay': 1
            },
            singleDatePicker: true,
            showDropdowns: true,
            minYear: 2017,
            maxYear: parseInt(moment().format('YYYY'), 10) + 5,
        });
        $('.pais').change(function () {
            $('#Movl').html('+' + $(this).val());
        })
    });
    /*$('.tipod').on('change', function () {
        var tpo = $(this).val().split('-')[0];
        var docu = $('.docu').val() || 0
        docu ? Consul(tpo, docu) : '';
    })
    $('.docu').on('change', function () {
        var tpo = $('.tipod').val().split('-')[0] || 0;
        var docu = $(this).val() || 0
        docu && tpo ? Consul(tpo, docu) : '';
    })*/
    function AdjuntarCC(id) {
        $('#AdjutarDoc').modal({
            toggle: true,
            backdrop: 'static',
            keyboard: true,
        });

        $('#enviarDoc').submit(function (e) {
            e.preventDefault();
            var formData = new FormData(document.getElementById("enviarDoc"));
            formData.append('idc', id);
            $.ajax({
                url: '/links/adjuntar',
                data: formData,
                type: 'POST',
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#AdjutarDoc').modal('hide');
                    $('#ModalEventos').modal({
                        toggle: true,
                        backdrop: 'static',
                        keyboard: true,
                    });
                },
                success: function (data) {
                    if (data) {
                        clientes.ajax.reload(null, false)
                        SMSj('success', 'Documento agregado exitosamente');
                        $('#ModalEventos').modal('hide');
                    }
                }
            });
        });
    }
    function Eliminar(id) {
        if (confirm("Seguro deseas eliminar esta separacion?")) {
            $.ajax({
                url: '/links/elicliente',
                data: { id },
                type: 'POST',
                success: function (data) {
                    if (data) {
                        clientes.ajax.reload(null, false)
                        SMSj('success', 'Documento agregado exitosamente')
                    } else {
                        SMSj('error', 'No es posible eliminar este cliente ya que cuenta conuna separacion')
                    }
                }
            });
        }
    }
    $('#datclient').submit(function (e) {
        e.preventDefault();
        $('.name').prop('disabled', false);
        var formData = new FormData($('#datclient')[0]);
        $.ajax({
            type: 'PUT',
            url: '/links/editclientes',
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function (s) {
                $('#ModalClints').modal('toggle');
                $('#ModalEventos').modal({
                    backdrop: 'static',
                    keyboard: true,
                    toggle: true
                });
            },
            success: function (data) {
                if (data) {
                    SMSj('success', 'datos editados correctamente');
                    $('#ModalEventos').modal('toggle');
                    clientes.ajax.reload(null, false)
                } else {
                    SMSj('error', 'Error al intentar editar los datos');
                    $('#ModalEventos').modal('toggle');
                }
            }
        });
    })
};
/////////////////////////////* CUPONES */////////////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/cupones` && !rol.externo) {
    $('.sidebar-item').removeClass('active');
    $(`a[href='${window.location.pathname}']`).parent().addClass('active');

    var clientes = $('#client');
    $.ajax({
        type: 'POST',
        url: '/links/cupones/clientes'
    }).then(function (data) {
        //clientes.append(new Option(`Selecciona un Cliente`, 0, true, true))
        data.clientes.map((x, v) => {
            clientes.append(new Option(`${x.nombre}  CC ${x.documento}`, x.idc, false, false))
        });
        clientes.val(null).trigger('change');
    });
    $(document).ready(function () {
        $(".select2").each(function () {
            $(this)
                .wrap("<div class=\"position-relative\"></div>")
                .select2({
                    placeholder: 'Selecciona un Cliente',
                    dropdownParent: $(this).parent(),
                    allowClear: true
                });
        });
        $('.atras').click(function () {
            $('#gBono').show("slow")
            $("#addBonos").hide("slow");
            $("#addBonos input, textarea").val('');
            $('#gb').prop('disabled', false);
            clientes.val(null).trigger('change');
        })
        $('#generarBonos').submit(function (e) {
            e.preventDefault();
            $('.ahora').val(moment().format('YYYY-MM-DD HH:mm'));
            var formData = new FormData(document.getElementById("generarBonos"));
            $.ajax({
                url: '/links/bonos/crear',
                data: formData,
                type: 'POST',
                processData: false,
                contentType: false,
                beforeSend: function (xhr) {
                    $('#gb').prop('disabled', true);
                    $('#ModalEventos').modal({
                        toggle: true,
                        backdrop: 'static',
                        keyboard: true,
                    });
                },
                success: function (data) {
                    if (data) {
                        cupones.ajax.reload(null, false)
                        $('#ModalEventos').modal('hide')
                        $('#gBono').show("slow")
                        $("#addBonos").hide("slow");
                        $("#addBonos input, textarea").val('');
                        $('#gb').prop('disabled', false);
                        clientes.val(null).trigger('change');
                        SMSj('success', 'Bono generado exitosamente')
                    }
                }
            });
        });
    })
    var cupones = $('#tablacupones').DataTable({
        dom: 'Bfrtip',
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        buttons: rol.auxicontbl ? [
            { extend: 'pageLength', text: 'Ver', orientation: 'landscape' },
            {
                text: `<div class="mb-0">
                            <i class="align-middle mr-2" data-feather="tag"></i> <span class="align-middle">Generar Bono</span>
                        </div>`,
                attr: {
                    title: 'Generar Bono',
                    id: 'gBono'
                },
                className: 'btn btn-outline-dark',
                action: function () {
                    $('#gBono').hide("slow")
                    $("#addBonos").show("slow");
                    let bono = ID(5);
                    $('.pinBono').val(bono);
                }
            }
        ] : [{ extend: 'pageLength', text: 'Ver', orientation: 'landscape' }],
        deferRender: true,
        paging: true,
        autoWidth: true,
        search: {
            regex: true,
            caseInsensitive: true,
        },
        responsive: true,
        columnDefs: [{ responsivePriority: 1, targets: -1 },
        { visible: rol.auxicontbl ? true : false, targets: -1 }],
        order: [[1, "desc"]], //[0, "asc"]
        language: languag2,
        ajax: {
            method: "POST",
            url: "/links/cupones",
            dataSrc: "data"
        },
        initComplete: function (settings, json, row) {
            $('#datatable_filter').prepend("<h3 class='text-center mt-2'>CLIENTES</h3>");
        },
        columns: [
            {
                className: 'control',
                orderable: true,
                data: null,
                defaultContent: ''
            },
            { data: "id" },
            { data: "pin" },
            {
                data: "descuento",
                render: function (data, method, row) {
                    return data + '%';
                }
            },
            {
                data: "fecha",
                render: function (data, method, row) {
                    return data ? moment(data).format('YYYY-MM-DD') : '';
                }
            },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 14:
                            return `<span class="badge badge-pill badge-dark">Usado</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success">Disponible</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary">Pendiente</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-danger">Inactivo</span>`
                    }
                }
            },
            {
                data: "ahorro",
                render: $.fn.dataTable.render.number('.', '.', 0, '$')
            },
            { data: "proyect" },
            { data: "mz" },
            { data: "n" },
            { data: "nombre" },
            {
                className: 't',
                defaultContent: rol.auxicontbl ? `<div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu"></div>
                                    </div>` : ''
            }
        ]
    });
    cupones.on('click', '.btnaprobar', function () {
        var fila = $(this).parents('tr');
        var data = cupones.row(fila).data();
        if (data.estado == 3) {
            $(this).attr('data-toggle', "dropdown")
            $(this).next().html(`<a class="dropdown-item">Aprobar</a>
                                 <a class="dropdown-item">Declinar</a>`);
        }
    })
    cupones.on('click', '.dropdown-item', function () {
        var fila = $(this).parents('tr');
        var data = cupones.row(fila).data();
        var dts = data
        $.ajax({
            type: 'POST',
            url: '/links/cupones/' + $(this).text(),
            data: dts,
            success: function (data) {
                cupones.ajax.reload(null, false)
                if (data) {
                    SMSj('success', `Cupon de descuento enviado al solicitante correctamente`);
                } else {
                    SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`)
                }
            }
        })
    })
};
////////////////////////////* PRUEBAS *//////////////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/prueba`) {

};
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
}
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
} //Unidades()
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

    if (strMillones == "")
        return strMiles;

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
    if (data.enteros == 1)
        return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
        return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
} //NumeroALetras()
//return a promise that resolves with a File instance
function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
}
function ID(lon) {
    let chars = "0A1B2C3D4E5F6G7H8I9J0KL1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z",
        code = "";
    for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
    };
    return code;
};
var LISTA = '';
function LISTAS(n, fi, ff, p) {
    var fch = new Date();
    var FI = moment(fi).format('YYYY-MM-DD'), FF = moment(ff).format('YYYY-MM-DD')
    var fechs = new Date(ff);
    var months = fechs.getMonth() - fch.getMonth() + (12 * (fechs.getFullYear() - fch.getFullYear()));
    var maxcuotas = 0;

    if (months > 102) { maxcuotas = 114; } else if (months > 90) { maxcuotas = 102; } else if (months > 72) { maxcuotas = 90; } else if (months > 60) { maxcuotas = 72; }
    else if (months > 48) { maxcuotas = 60; } else if (months > 42) { maxcuotas = 48; } else if (months > 36) { maxcuotas = 42; } else if (months > 30) { maxcuotas = 36; }
    else if (months > 24) { maxcuotas = 30; } else if (months > 18) { maxcuotas = 24; } else if (months > 12) { maxcuotas = 18; } else if (months > 6) { maxcuotas = 12; }
    else { maxcuotas = 6; };
    var PDF = () => {
        var doc = new jsPDF('p', 'mm', 'a4');
        var img = new Image();
        var totalPagesExp = '{total_pages_count_string}'
        img.src = '/img/avatars/avatar.png'

        doc.autoTable({
            html: '#listas',
            useCss: true,
            didDrawPage: function (data) {
                // Header
                doc.setTextColor(0)
                doc.setFontStyle('normal')
                if (img) {
                    doc.addImage(img, 'png', data.settings.margin.left, 10, 15, 20)
                }
                doc.setFontSize(9)
                doc.text(moment().format('lll'), data.settings.margin.left + 157, 10)
                doc.setFontSize(15)
                doc.text('GRUPO ELITE FINCA RAÍZ S.A.S', 105, 15, null, null, "center");
                doc.setFontSize(12)
                doc.text(p, 105, 20, null, null, "center")
                doc.setFontSize(9)
                doc.text('LISTADO DE PRODUCTOS', 105, 25, null, null, "center")
                doc.setFontSize(8)
                doc.text(`Proyecto iniciado en ${FI} y proyectado a finalizar en ${FF}`, data.settings.margin.left, 33)

                // Footer
                var str = 'Page ' + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + ' of ' + totalPagesExp
                }
                doc.setFontSize(8)

                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                //doc.text(/*str*/ `Atententamente:`, data.settings.margin.left, pageHeight - 45)
                doc.text(/*str*/ `Debe tener en cuenta que esta informacion no es cien por ciento veras, ya que en cualquier instante puede cambiar el estado de un producto.\nRED ELITE recomienda hacer uso del sistema el cual si posee el estado veras del producto, con el fin de no mal informar al cliente inetresado.\nLos productos demarcados con azul estan pedientes por pagos pasados 24 horas habil volveran a estar disponibles en caso que no se confirme`, data.settings.margin.left, pageHeight - 15)
                doc.text(str, data.settings.margin.right, pageHeight - 5)
            },
            margin: { top: 35 },
        })
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }
        doc.output('save', `LISTADO ${p}.pdf`)
        SMSj('success', `Lista de ${p} descargada exitosamente`);
        $('#ModalEventos').modal('hide');
    }
    $.ajax({
        type: 'POST',
        url: "/links/productos/" + n,
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
                        method: "POST",
                        url: "/links/productos/" + n,
                        dataSrc: "data"
                    },
                    columns: [
                        { data: "mz" },
                        { data: "n" },
                        { data: "mtr2" },
                        {
                            data: "estado",
                            className: 'c',
                            render: function (data, method, row) {
                                switch (data) {
                                    case 1:
                                        return `<span class="badge badge-pill badge-info">Pendiente</span>`
                                        break;
                                    case 8:
                                        return `<span class="badge badge-pill badge-dark">Tramitando</span>`
                                        break;
                                    case 9:
                                        return `<span class="badge badge-pill badge-success">Disponible</span>`
                                        break;
                                    case 10:
                                        return `<span class="badge badge-pill badge-primary">Separado</span>`
                                        break;
                                    case 12:
                                        return `<span class="badge badge-pill badge-secondary">Apartado</span>`
                                        break;
                                    case 13:
                                        return `<span class="badge badge-pill badge-tertiary">Vendido</span>`
                                        break;
                                    case 14:
                                        return `<span class="badge badge-pill badge-danger">Tramitando</span>`
                                        break;
                                    case 15:
                                        return `<span class="badge badge-pill badge-warning">Inactivo</span>` //secondary
                                        break;
                                }
                            }
                        },
                        {
                            data: "valor",
                            render: $.fn.dataTable.render.number('.', '.', 2, '$')
                        },
                        {
                            data: "inicial",
                            render: $.fn.dataTable.render.number('.', '.', 0, '$')
                        },
                        {
                            data: "mtr2",
                            render: function (data, method, row) {
                                return '$' + Moneda(Math.round(row.valor / data));
                            }
                        },
                        {
                            data: null,
                            defaultContent: maxcuotas
                        },
                        {
                            data: "valor",
                            render: function (data, method, row) {
                                return '$' + Moneda(Math.round((data - row.inicial) / (maxcuotas - 1)));
                            }
                        }
                    ],
                    //autoWidth: true,
                    //responsive: true,
                    initComplete: function (settings, json) {
                        PDF()
                    },
                    search: false,
                    info: false,
                    paging: false,
                    order: [[0, 'asc'], [1, 'asc']],
                    drawCallback: function (settings) {
                        var api = this.api();
                        var rows = api.rows({ page: 'current' }).nodes();
                        var last = null;

                        api.column(0, { page: 'current' }).data().each(function (group, i) {
                            if (last !== group) {
                                $(rows).eq(i).before(
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
                        if (data["estado"] == 15) {
                            $(row).css("background-color", "#FFFFCC");
                        } else if (data["estado"] == 1) {
                            $(row).css("background-color", "#00FFFF");
                        } else if (data["estado"] == 9) {
                            $(row).css("background-color", "#40E0D0");
                        }
                    }
                });
            } else {
                LISTA.ajax.url("/links/productos/" + n).load(function () {
                    PDF()
                });
            }
        },
        error: function (data) {
            console.log(data);
        }
    })
};
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