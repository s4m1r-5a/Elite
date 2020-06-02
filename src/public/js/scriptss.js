//import { check } from "express-validator/check";

/////////////////////* FUNCIONES GLOBALES *///////////////////////
function Moneda(valor) {
    valor = valor.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
    valor = valor.split('').reverse().join('').replace(/^[\.]/, '');
    return valor;
}
//lenguaje
let languag = {
    "lengthMenu": "Ver 10 filas",
    "sProcessing": "Procesando...",
    "sLengthMenu": "",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible",
    "sInfo": "",
    "sInfoEmpty": "",
    "sInfoFiltered": "",
    "sInfoPostFix": "",
    "sSearch": "",
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
/*let languag = {
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
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};*/
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
var admin = $('#usuarioadmin').val()
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
$(document).ready(function () {
    moment.locale('es');
    if ($('#nivel').html() == 'Inversionista') {
        $('#nivel').addClass('badge-warning')
    } else if ($('#nivel').html() == 'Director') {
        $('#nivel').addClass('badge-info')
    } else if ($('#nivel').html() == 'Gerente') {
        $('#nivel').addClass('badge-dark')
    } else if ($('#nivel').html() == 'Vicepresidente') {
        $('#nivel').addClass('badge-tertiary')
    } else {
        $('#nivel').addClass('badge-success')
    }
    $('#disable').on('click', function () {
        SMSj('error', 'Aun no se encuentra habilitada esta opcion, trabajamos en ello. RedFlix...')
    })
    var saldoact = $('#saldoactual').text()
    $('#saldoactual').html(Moneda(saldoact))
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
            this.select();
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

});
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




//////////////////////////////////////////////////////////////////
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
    var fd = $('form').serialize();
    let skdt;
    $.ajax({
        url: '/links/id',
        data: fd,
        type: 'POST',
        async: false,
        success: function (data) {
            //alert(data)
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

$('.pagarpayu').attr("disabled", true);
$('.ntfx').attr("disabled", true);
$('input[name="nombre"]').attr("disabled", true);

/*$('.pagar').change(function () {
    card = $(this).parents('div.card').attr("id")
    var fd = $(`#${card} form`).serialize();
    actualizardatos(card, fd)
});*/

function actualizardatos(card, fd, ot) {
    $.ajax({
        url: '/links/cliente',
        data: fd,
        type: 'POST',
        async: false,
        success: function (data) {
            if (data[0] !== 'smg') {
                $(`#${card} .pagarpayu`).attr("disabled", false);
                if (ot) {
                    $(`.pagarpayu`).attr("disabled", false);
                    $(`input[name="telephone"]`).val(data[2][0].id);
                    $(`input[name="buyerFullName"]`).val(data[2][0].name);
                    $(`input[name="buyerEmail"]`).val(data[2][0].email);
                }
                $('input[name="signature"]').val(data[0]);
                $('input[name="referenceCode"]').val(data[1]);
                $(`#${card} form`).submit();
                $('#ModalEventos').one('shown.bs.modal', function () {
                    $('#ModalEventos').modal('hide')
                }).modal('show');
            } else {
                $('#actualizardatos').html(`${data[1]}Si desea realizar alguna modificacion a tu cuenta presione editar, en caso contrario verifique bien los datos ingresados e intentelo nuevamente, para mayor informacion puede contactarnos al 3012673944 Wtspp`)
                //$('#actualizar').modal('toggle');
                $('#ModalEventos').one('shown.bs.modal', function () {
                    $('#ModalEventos').modal('hide')
                }).modal('show');
                $('#ModalEventos').one('hidden.bs.modal', function () {
                    $('#actualizar').modal('show');
                }).modal('hide');
                let cont = 0;
                let dat = data[2].map((r) => {
                    cont++
                    return `<li class="mb-4">
                            <input type="text" name="telephone" class="form-control pagar g${cont}" placeholder="Movil"
                            style="text-align:center" value="${r.id}">
                        </li>
                        <li class="mb-4">
							<input type="hidden" name="actualizar" class="g${cont}" value="${r.id}">
						</li>
                        <li class="mb-4">
                            <input type="text" name="buyerFullName" class="form-control pagar g${cont}"
                            placeholder="Nombre completo" style="text-align:center;" value="${r.name}">
                        </li>
                        <li class="mb-4">
                            <input type="email" name="buyerEmail" class="form-control pagar g${cont}" placeholder="Email"
                            style="text-align:center;" value="${r.email}">
                        </li>
                        <li class="mb-4">
                            <hr width=400>
                        </li>`
                });
                $('#datosactualiza').html(dat);
            }
        }
    });
}
$('.pagarp').click(function () {
    card = $(this).parents('div.card').attr("id")
    if ($(`#${card} input[name="telephone"]`).val() != "" && $(`#${card} input[name="buyerFullName"]`).val() != "" && $(`#${card} input[name="buyerEmail"]`).val() != "") {
        $('#ModalEventos').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });
        var fd = $(`#${card} form`).serialize();
        actualizardatos(card, fd)
    } else {
        alert('Debes completar todos los campos');
    }
});

$(".pagar").keydown(function () {
    $(`.pagarpayu`).attr("disabled", true);
});
$('#meterdat').on('click', function () {
    card = $(this).parents('div.card').attr("id")
    var fd = $(`#${card} form`).serialize(), ot = 'ot';
    actualizardatos(card, fd, ot)
});
$('#eliminard').on('click', function () {
    $(".g2").remove('input');
    $(".g1").remove('input');
});
$('#datosactualiza').on('change', '.g1', function () {
    $(".g2").remove('input');
});
$('#datosactualiza').on('change', '.g2', function () {
    $(".g1").remove('input');
});
if ($('#iuxemail').html() == '' && $('#iuxemail').is(':visible')) {
    window.location.href = "https://iux.com.co/app/login";
};
if ($('#msg').html() == 'aprobada') {
    history.pushState(null, "", "planes?iux=ir");
};
$('#iriux').click(function () {
    window.location.href = "https://iux.com.co/app/login";
});
if ($('#pin').is(':visible') || $('.ver').is(':visible')) {
    $('.h').attr("disabled", true);
} else {
    $("nav.navbar").show();
};
$('#quien').change(function () {
    if ($(this).val() === 'Patrocinador') {
        var fd = { quien: $('#quien').val() };
        $.ajax({
            url: '/links/patro',
            data: fd,
            type: 'POST',
            success: function (data) {
                if (!data[0].usuario) {
                    SMSj('error', 'Esta cuenta es Administrativa y no puede recargarse asimisma, ponte en contacto con el encargado del sistema')
                } else {
                    $('#id').val(data[0].id);
                    $('input[name="id"]').val(data[0].usuario);
                }
            }
        });
    } else {
        $('#id').val('');
        $('#id').focus();
    }
});

$('#ventaiux').click(function () {
    var fd = $('#formulario').serialize();
    //alert($('input[name="movil"]').val());
    $.ajax({
        url: 'https://iux.com.co/x/venta.php',
        data: fd,
        type: 'POST',
        success: function (data) {
            alert(data);
        }
    });
});
$('#canjear').click(function () {
    var fd = { pin: $('#pin').val() };
    $.ajax({
        url: '/links/canjear',
        data: fd,
        type: 'POST',
        success: function (data) {
            if (data !== 'Pin invalido!' && data !== 'Este pin ya fue canjeado!') {
                $('#precio').html('$' + data[0].precio);
                $('#tiempo').html(data[0].dias + ' Dias');
                $('input[name="pin"]').val(data[0].pin);
                $('.z').show("slow");
                $('.y').hide("slow");
            } else {
                alert(data)
            }
        }
    });
});
$('#ediact').click(function () {
    $('.p').hide("slow");
    $('.q').show("slow");
});
$('.plancito').click(function () {
    card = $(this).parents('div.card').attr("id")
    let clase = $(this).attr('href');
    $(`#${card} ${clase}`).show("slow");
    $(`#${card} .z`).hide("slow");
});
$('.payu').click(function () {
    card = $(this).parents('div.card').attr("id")
    let clase = $(this).attr('name');
    $(`#${card} ${clase}`).show("slow");
});
$('.plancit').click(function () {
    let clase = $(this).attr('href');
    $(clase).hide("slow");
    $('.x').hide("slow");
    $('.z').show("slow");
});
//////////////////////////* VENTAS */////////////////////////////////////////
/* Ventas Contenido Digital */
/*var formu
$('form').click(function () {
    formu = $(this).attr('id')
})*/
$(`.movil`).change(function () {
    $('#Modalventa input[name="nombre"]').val("");
    $('#Modalventainput[name="user"]').val("");
    if ($(`#Modalventa .nom`).is(':visible')) {
        var fd = { movil: $(this).cleanVal() };
        $.ajax({
            url: '/links/movil',
            data: fd,
            type: 'POST',
            success: function (data) {
                $(`#Modalventa input[name="nombre"]`).val(data[0].nombre);
                $(`#Modalventa .user`).val(data[0].id);
            }
        });
        $(`#Modalventa input[name="nombre"]`).attr("disabled", true);
        //$(`form .ntfx`).attr("disabled", true);
        $(`#Modalventa input[name="nombre"]`).attr("disabled", false);
        //$(`#Modalventa .ntfx`).attr("disabled", false);
    }
});

////////////////
$(document).ready(function () {
    var docu = 0
    $('#cambio').attr("disabled", true);
    $('#banco').attr("disabled", true);
    $(".media-body").on("click", ".btn", function () {
        var papa = $(this).attr('id')
        var product = $(`.${papa} .product`).val();
        var prod = $(`.${papa} .prod`).val();
        var nompro = $(`.${papa} .nompro`).val();
        var img = $(`.${papa} .img`).attr('src');
        prod === 'IUX' ? $(`#Modalventa .nom`).hide() : 0;
        $("#Modalventa .product").val(product);
        $("#Modalventa .prod").val(prod);
        $("#Modalventa .nompro").val(nompro);
        $("#Modalventa .img").attr('src', img);
        $('#Modalventa').modal({
            backdrop: 'static',
            keyboard: true,
            toggle: true
        });
    })
    $('#Modalventa').one('hidden.bs.modal', function () {
        $("#Modalventa input").val('');
    })

    $('#monto').change(function () {
        let re = Math.round($(this).cleanVal() / ($('#tasa').text() / 10));
        let utilidad = Math.round($(this).cleanVal() * 0.06);
        let neta = Math.round($(this).cleanVal() * 0.08);
        $('#cambio').val(Moneda(re));
        $('#utild1').val(utilidad);
        $('#utild2').val(neta);
    });
    $(`#docuremi`).change(function () {
        var fd = { cedula: $(this).val() };
        $.ajax({
            url: '/links/cedulav',
            data: fd,
            type: 'POST',
            success: function (data) {
                var dta = '', dto = '';
                $("input").not("#docuremi, #monto, #cambio, #tasa, #utild1, #utild2").val('');
                $('#nomdest').val('').trigger('change');
                if (Array.isArray(data)) {
                    $(`.nombrev`).val(data[0][0].nombre);
                    $('#movilremit').val(data[0][0].movil).mask('000-000-0000', { reverse: true });
                    $('#remitente').val(data[0][0].id)
                    data[1].map((r) => {
                        dta += `<option value="${r.destinatario}">${r.nombre}</option>`;
                        dto += `<input type="hidden" id="d${r.destinatario}" value="${r.documento}">
                                <input type="hidden" id="m${r.destinatario}" value="${r.movil}">`;
                    });
                    $('#nomdest').html(dta).trigger('change');
                    $('#datosocultos').html(dto);
                    var t = $('#nomdest').val();
                    var h = $('#d' + t).val();
                    var p = parseFloat($('#m' + t).val());
                    $('#docudest').val(h);
                    $('#movildest').val(p).mask('000-000-0000', { reverse: true });
                } else if (data.primer_nombre === undefined) {
                    alert('Persona no encontrada, digite su nombre manualmente...');
                    $(`.nombrev`).attr('disabled', false);
                    $(`.nombrev`).focus();
                } else {
                    $(`.nombrev`).attr('disabled', true);
                    $(`.nombrev`).val(data.primer_nombre + ' ' + data.segundo_nombre + ' ' + data.primer_apellido + ' ' + data.segundo_apellido);
                }
            }
        });
    });
    $(`#docudest`).change(function () {
        var fd = { cedula: $(this).val(), o: 1 };
        $.ajax({
            url: '/links/cedulav?o=1',
            data: fd,
            type: 'POST',
            success: function (data) {
                var dta = '';
                $(`#movildest`).val('');
                if (Array.isArray(data)) {
                    docu = 1
                    dta = `<option value="${data[1][0].destinatario}">${data[1][0].nombre}</option>`;
                    $('#nomdest').html(dta).trigger('change');
                    $('#movildest').val(data[1][0].movil).mask('000-000-0000', { reverse: true });
                    console.log(data)
                } else if (data.primer_nombre === undefined) {
                    alert('Persona no encontrada, digite su nombre manualmente...');
                    $(`#nomdest`).focus();
                } else {
                    var u = data.primer_nombre + ' ' + data.segundo_nombre + ' ' + data.primer_apellido + ' ' + data.segundo_apellido;
                    dta = `<option value="${u}">${u}</option>`;
                    $("input").filter("#banco, #cuenta").val('');
                    $('#nomdest').html(dta).trigger('change');
                }
            }
        });
    });
    $('#cuenta').on('change', function () {
        Banco($(this).val());
    })

    function Banco(dato) {
        d = { bank: dato.slice(0, 4) };
        $.ajax({
            url: '/links/cuenta',
            data: d,
            type: 'POST',
            success: function (data) {
                $('#idbanco').val(data[0].id_banco);
                $('#banco').val(data[0].banco);
                $('#tiempotranf').html(data[0].tiempodeposito);
                docu = 0;
            }
        });
    }

    $("#nomdest").on('change', function () {
        var t = $(this).val();
        if (!isNaN(t)) {
            var h = $('#d' + t).val();
            var p = parseFloat($('#m' + t).val());
            docu == 0 ? $('#docudest').val(h) : 0;
            $('#movildest').val(p).mask('000-000-0000', { reverse: true });
            var fd = { desti: t };
            $.ajax({
                url: '/links/cuenta',
                data: fd,
                type: 'POST',
                success: function (data) {
                    if (data.length <= 1) {
                        $('#cuenta').val(data[0].cuenta);
                        Banco(data[0].cuenta)
                    } else {
                        alert('hay que crear un select2')
                    }
                }
            });
        }
    })
    $(".select2").each(function () {
        $(this)
            .wrap("<div class=\"position-relative\"></div>")
            .select2({
                tags: true,
                placeholder: "Seleccione o Digite Nombre Completo",
                dropdownParent: $(this).parent()
            }).val(null);
    })
    $('#tranfer').submit(function () {
        $("input").prop('disabled', false);
    })
    //////* Evitar que se envie formulario con la tecla enter *//////
    /*$("input").keydown(function (e) {
        // Capturamos qué telca ha sido
        var keyCode = e.which;
        // Si la tecla es el Intro/Enter
        if (keyCode == 13) {
            // Evitamos que se ejecute eventos
            event.preventDefault();
            // Devolvemos falso
            return false;
        }
    });*/
});
//////////////////////////* INDEX */////////////////////////////////////////
/*if (window.location.pathname == `/`) {
    var scaling = 1;
    //count
    var currentSliderCount = 0;
    var videoCount = $(".row").children().length;
    var showCount = 0;
    var sliderCount = 1;
    var controlsWidth = 40;
    var scollWidth = 0;
    var win = $(window);
    var prev = $(".prev");
    var next = $(".next");
    //sizes
    var windowWidth = 0;
    var frameWidth = 0;

    $(document).ready(function () {
        var player = new Playerjs({ id: "player" });
        var player2 = new Playerjs({ id: "player2" });
        var player3 = new Playerjs({ id: "player3" });
        var player4 = new Playerjs({ id: "player4" });
        var player5 = new Playerjs({ id: "player5" }); ///storage/new4tb/504562/aplay1080720.m3u8
        $(".tile").on({
            mouseenter: function () {
                play = $(this).children('.tile__media').attr("id");
                pley = play + '.api("play", "https://mdstrm.com/live-stream-playlist/57d01d6c28b263eb73b59a5a.m3u8");';
                sto = play + '.api("stop");';
                eval(pley);
            },
            mouseleave: function () {
                eval(sto);
            }
        });
        init();
    });

    $(window).resize(function () {
        init();
    });

    function init() {
        windowWidth = win.width();
        frameWidth = win.width() - 80;
    }

    next.on("click", function () {
        var padre = $(this).parent();
        scollWidth = parseFloat(padre.children(".px").val());
        scollWidth = scollWidth - frameWidth;
        padre.children(".px").val(scollWidth)
        padre.children("div.row").velocity({
            left: scollWidth
        }, {
            duration: 700,
            easing: "swing",
            queue: "",
            loop: false, // Si la animación debe ciclarse
            delay: false, // Demora
            mobileHA: true // Acelerado por hardware, activo por defecto
        });
        padre.children("div.row").css("left", scollWidth);
        currentSliderCount--;
        padre.children(".ctn").val(currentSliderCount);        
    });

    prev.on("click", function () {
        var padre = $(this).parent();
        scollWidth = parseFloat(padre.children(".px").val());
        scollWidth = scollWidth + frameWidth;
        padre.children(".px").val(scollWidth)        
        if (parseFloat(padre.children(".ctn").val()) >= sliderCount - 1) {
            padre.children("div.row").css("left", 0);
            currentSliderCount = 0;
            padre.children(".ctn").val(currentSliderCount);
            //scollWidth = 0;
            padre.children(".px").val(0)
        } else {
            currentSliderCount++;
            padre.children(".ctn").val(currentSliderCount);
            padre.children('div.row').velocity({
                left: scollWidth
            }, {
                duration: 700,
                easing: "swing",
                queue: "",
                //begin: function() {
                //console.log("iniciando animación")
                //},
                //progress: function() {
                //console.log("animación en proceso")
                //},
                //complete: function() {
                // console.log("animación completada")
                //},
                loop: false, // Si la animación debe ciclarse
                delay: false, // Demora
                mobileHA: true // Acelerado por hardware, activo por defecto
            });
        }
    });
}*/
//////////////////////////* INICIO *///////////////////////////////////////
if (window.location.pathname == `/`) {
    $(document).ready(function () {
        var players = new Playerjs({ id: "player", file: 'video/ProyectoGrupoElite.MP4', player: 2 });
        players.api("play")
    });
}
//////////////////////////* TABLERO *///////////////////////////////////////
if (window.location.pathname == `/tablero`) {
    new Chart(document.getElementById("chartjs-dashboard-pie"), {})
    //new Chart(document.getElementById("chartjs-line"), {})

    var canvas2 = document.getElementById("chartjs-line").getContext('2d');
    var canvas = document.getElementById("chartjs-dashboard-pie").getContext('2d');
    var reportes = new Array()
    var f = new Date();
    var m = f.getMonth() + 1;
    var fe = f.getMonth();
    var d = 90//parseFloat($('.p' + m).val())
    var datosTabla6

    $('#promedio').html($('.d' + m).val());
    $('#ventaprecio').html($('.v' + m).val());
    $('#utilidad').html($('.u' + m).val());
    $('#utilidadneta').html($('.c' + m).val());
    $('#ventames').html($('.m' + m).val());

    $('#utilidadneta').mask('000,000,000', { reverse: true });
    $('#utilidad').mask('000,000,000', { reverse: true });
    $('#ventaprecio').mask('000,000,000', { reverse: true });

    var reportes = [
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },
        { año: 0, mes: 0, cuentas: 0, venta: 0, utilidad: 0, l1: 0, l2: 0, l3: 0, u1: 0, u2: 0, u3: 0, t1: 0, t2: 0, t3: 0, comision: 0, total: 0 },

    ]
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
                label: "Ventas ($)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.success,
                data: [$('.v1').val(), $('.v2').val(), $('.v3').val(), $('.v4').val(), $('.v5').val(), $('.v6').val(),
                $('.v7').val(), $('.v8').val(), $('.v9').val(), $('.v10').val(), $('.v11').val(), $('.v12').val()]
            },
            {
                label: "Ventas ($)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.primary,
                data: [$('.u1').val(), $('.u2').val(), $('.u3').val(), $('.u4').val(), $('.u5').val(), $('.u6').val(),
                $('.u7').val(), $('.u8').val(), $('.u9').val(), $('.u10').val(), $('.u11').val(), $('.u12').val()]
            },
            {
                label: "Ventas ($)",
                fill: true,
                backgroundColor: "transparent",
                borderColor: window.theme.secondary,
                data: [$('.c1').val(), $('.c2').val(), $('.c3').val(), $('.c4').val(), $('.c5').val(), $('.c6').val(),
                $('.c7').val(), $('.c8').val(), $('.c9').val(), $('.c10').val(), $('.c11').val(), $('.c12').val()]
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

    window.pie = new Chart(canvas, datos);
    window.pie2 = new Chart(canvas2, datos2);

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

    $.ajax({
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
    });

    var date = new Date()
    // Bar chart
    new Chart(document.getElementById("chartjs-dashboard-bar"), {
        type: "bar",
        data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            datasets: [{
                label: "Last year",
                backgroundColor: window.theme.primary,
                borderColor: window.theme.primary,
                hoverBackgroundColor: window.theme.primary,
                hoverBorderColor: window.theme.primary,
                data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79]
            }, {
                label: "This year",
                backgroundColor: "#E8EAED",
                borderColor: "#E8EAED",
                hoverBackgroundColor: "#E8EAED",
                hoverBorderColor: "#E8EAED",
                data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68]
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
                        stepSize: 20
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
    //alert('sajljsdlaj')
    var validationForm = $("#smartwizard");
    validationForm.smartWizard({
        theme: "arrows",
        showStepURLhash: false,
        lang: {
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
        autoAdjustHeight: true,
        backButtonSupport: false,
        useURLhash: false
    }).on("leaveStep", () => {
        let skdt;
        if (!$('.Cliente').html()) {
            $.ajax({
                url: '/links/pagos/' + $('#cedula').val(),
                type: 'GET',
                async: false,
                success: function (data) {
                    //alert(data)
                    if (data.status) {
                        console.log(data);
                        $('.Cliente').html(data.paquete.cliente);
                        $('.Cliente').val(data.paquete.cliente);
                        $('#Code').val(data.paquete.idcliente + '-' + data.paquete.asesor + '-' + data.paquete.id);
                        $('.nombreproyecto').html(data.paquete.nombre);
                        $('.Lote').html(data.paquete.n);
                        $('#Cupon').html(data.paquete.pin);
                        $('#Dto').html(data.paquete.descuento);
                        $('#Ahorro').html(Moneda(data.paquete.ahorro));
                        $('#Proyecto').html(Moneda(data.paquete.vr));
                        $('#Proyecto-Dto').html(Moneda(data.paquete.valor));
                        $('#Concepto').html(data.paquete.concepto);
                        $('#Cuota').html(Moneda(data.paquete.cuota));
                        $('#Mora').html(Moneda(data.paquete.mora));
                        $('.Total').html(Moneda(data.paquete.total));
                        $('#Movil').val(data.paquete.movil);
                        $('#Email').val(data.paquete.email);
                        $('#Total').val(data.paquete.total);
                        $('#Description').val(data.paquete.concepto + '-' + data.paquete.nombre + ' Lote: ' + data.paquete.n);
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

            return skdt;

        } else {
            return true;
        }
        //return true;
    });
    $('.Total2').change(function () {
        alert('lkjdljhdjol')
        var resul = $(this).val();
        $('#Total').val(resul)
    });
    $('form').submit(function () {
        $('input').prop('disabled', false);
        var fd = $('form').serialize();
        $.ajax({
            url: '/links/pagos',
            data: fd,
            type: 'POST',
            async: false,
            success: function (data) {
                $('input[name="signature"]').val(data);
            }
        });
    });
}

//////////////////////////////////* REPORTES */////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/reportes`) {
    let p = '', fecha = new Date(), fechs = new Date();
    fecha.setDate(fecha.getDate() + 30)
    function RecogerDatos() {
        dts = {
            id_venta: $('#idsms').val(),
            correo: $('#correo').val(),
            clave: $('#contraseña').val(),
            client: $('#cliente').val(),
            smss: $('#smsdescripcion').text(),
            movil: $("#cels").val(),
            fechadeactivacion: moment.utc(fechs).format('YYYY-MM-DD'),
            fechadevencimiento: moment.utc(fecha).format('YYYY-MM-DD')
        };
    };
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[1]).getTime();
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
    /*$('#datatable2').on('click', '.te', function () {
        if ($('#usuarioadmin').val() == 1) {
            var fila = $(this).parents('tr');
            if ($(fila).hasClass('selected')) {
                $(fila).removeClass('selected');
            } else {
                $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
                $(fila).addClass('selected');
            }
            var data = $('#datatable2').DataTable().row(fila).data();
            $("#idsms").val(data.id);
            $("#car").attr("src", data.imagenes);
            $("#cliente").val(data.client);
            $("#correo").val(data.correo);
            $("#cels").val(data.movildecompra);
            $('#ModalOrden').modal('toggle');
        }
    });

    $('#ModalOrden').on('hidden.bs.modal', function () {
        $('#datatable2 tr.selected').toggleClass('selected');
        $("#ModalOrden input").val('');
        $("#car").attr("src", '/img/car.jpg');
    });

    // Guardar o Actualizar Orden
    $('#guardarOrden').on('click', function () {
        RecogerDatos()
        $.ajax({
            type: 'PUT',
            url: '/links/reportes',
            data: dts,
            success: function (data) {
                tableOrden.ajax.reload(function (json) {
                    $('#ModalOrden').modal('toggle');
                    SMSj('success', 'Cuenta enviada exitosamente')
                });
            }
        })
    });*/
    /*$('#datatable2').on('click', 'tr', function () {
        var data = $('#datatable2').DataTable().row(this).data();
        $(this).toggleClass('selected');
        var facturas = $('#datatable2').DataTable().rows('.selected').data().length;
        $('.facturas').html(facturas);
        if ($(`span.${data.id}`).length) {
            $("span").remove(`.${data.id}`);
            total -= parseFloat(data.valor.replace(/(?!\w|\s).| /g, ""));
        } else {
            $('#facturas').append(factura);
            total += parseFloat(data.valor.replace(/(?!\w|\s).| /g, ""));
        }
        $('span.total').mask('000,000,000', { reverse: true });
        $('span.total').text(Moneda(total));

    });*/
    //////////////////////* Table2 */////////////////////// 
    var tableOrden = $('#datatable2').DataTable({
        dom: 'Bfrtip',
        buttons: ['pageLength',
            {
                text: `<div class="mb-0">
                    <i class="align-middle mr-2" data-feather="calendar"></i> <span class="align-middle">Fecha</span>
               </div>`,
                attr: {
                    title: 'Fecha',
                    id: 'Date'
                },
                className: 'btn btn-secondary fech',
            }
        ],
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
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
        }],
        order: [[0, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/table2",
            dataSrc: "data"
        },
        columns: [
            { data: "id" },
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
                className: 'te'
            },
            {
                data: "estado",
                className: 'te',
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-info">En Proceso</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success">Disponible</span>`
                            break;
                        case 10:
                            return `<span class="badge badge-pill badge-primary">Vendido</span>`
                            break;
                        case 12:
                            return `<span class="badge badge-pill badge-secondary">Separado</span>`
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
                className: 'te',
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') //pone la fecha en un formato entendible
                }
            },
            {
                data: "fullname",
                className: 'te'
            },
            {
                data: "id",
                render: function (data, method, row) {
                    return `<a type="button" class="btn btn-sm btn-outline-dark" href="/links/ordendeseparacion/${data}" target="_blank"><i class="fas fa-print"></i> Print</a>`
                }
            }
        ]
    });
    //////////////////////* Table3 *///////////////////////    
    var table3 = $('#datatable3').DataTable({
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
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
        }],
        order: [[0, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/table3",
            dataSrc: "data"
        },
        columns: [
            { data: "id" },
            {
                data: "fecha",
                render: function (data, method, row) {
                    return moment.utc(data).format('YYYY-MM-DD HH:mm A') //pone la fecha en un formato entendible
                }
            },
            { data: "fullname" },
            { data: "venefactor" },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "metodo" },
            { data: "idrecarga" },
            {
                data: "fechtrans",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD HH:mm A') //pone la fecha en un formato entendible
                }
            },
            {
                data: "saldoanterior",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "numeroventas" },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 'Aprobada':
                            return `<span class="badge badge-pill badge-success">${data}</span>`
                            break;
                        case 'Declinada':
                            return `<span class="badge badge-pill badge-danger">${data}</span>`
                            break;
                        case 'Procesando':
                            return `<span class="badge badge-pill badge-info">${data}</span>`
                            break;
                        case 'Pendiente':
                            return `<span class="badge badge-pill badge-warning">${data}</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">${data}</span>`
                    }
                }
            },
            { data: "recibo" },
        ]
    });
    //////////////////////* Table4 *///////////////////////    
    var table4 = $('#datatable4').DataTable({
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
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
        }],
        order: [[0, "desc"]],
        language: languag,
        ajax: {
            method: "POST",
            url: "/links/reportes/table4",
            dataSrc: "data"
        },
        columns: [
            { data: "id" },
            {
                data: "fechsolicitud",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD hh:mm A') //pone la fecha en un formato entendible
                }
            },
            { data: "fullname" },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "transaccion" },
            { data: "metodo" },
            { data: "producto" },
            {
                data: "fechadecompra",
                render: function (data, method, row) {
                    return moment(data).format('YYYY-MM-DD') || '' //pone la fecha en un formato entendible
                }
            },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 4:
                            return `<span class="badge badge-pill badge-success">Aprobada</span>`
                            break;
                        case 6:
                            return `<span class="badge badge-pill badge-danger">Declinada</span>`
                            break;
                        case 1:
                            return `<span class="badge badge-pill badge-info">Procesando</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-warning">Pendiente</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">Indefinida</span>`
                    }
                }
            }
        ]
    });
    // Daterangepicker  
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
        tableOrden.draw();
        table3.draw();
        table4.draw();
    });
}
if (window.location.pathname == `/links/ordendeseparacion/${window.location.pathname.split('/')[3]}`) {
    $('footer').hide()
    $('nav').hide()
    var table = $('#datatable').DataTable({
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        //deferRender: true,
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
                data: "fecha",
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
                            return `<span class="badge badge-pill badge-success">Pagada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary">Pendiente</span>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-danger">Vencida</span>`
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-secondary">Abono</span>`
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
                            return `<span class="badge badge-pill badge-success">Pagada</span>`
                            break;
                        case 3:
                            return `<span class="badge badge-pill badge-primary">Pendiente</span>`
                            break;
                        case 5:
                            return `<span class="badge badge-pill badge-danger">Vencida</span>`
                            break;
                        case 8:
                            return `<span class="badge badge-pill badge-secondary">Abono</span>`
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
        order: [[1, 'asc']],
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
        $('#fechaFactura').html(moment(g).format('YYYY-MM-DD'))
        $('.totales').text('$' + Moneda(parseFloat($('#vLetras').val())))


        //window.print();
        //<a href="invoice-print.html" target="_blank" class="btn btn-default"><i class="fas fa-print"></i> Print</a>
        //window.addEventListener("load", window.print());
    })
} else {
    $('footer').show()
    $('nav').show()
}




//////////////////////////////////* PRODUCTOS */////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/productos`) {
    let recargada = true,
        dataid = 0,
        total = 0,
        cliente = "";
    minDateFilter = "";
    maxDateFilter = "";
    $.fn.dataTableExt.afnFiltering.push(
        function (oSettings, aData, iDataIndex) {
            if (typeof aData._date == 'undefined') {
                aData._date = new Date(aData[5]).getTime();
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
        $('.proveedor, .socio').change(function () {
            if ($(this).val() === '0') {
                $('#datosproveedor').show('slow');
                $("#datosproveedor input, #datosproveedor select").prop('disabled', false)
                if ($(this).hasClass("socio")) {
                    $('#titu').html('DATOS SOCIO COMERCIAL');
                    $(`.proveedor select option[value='1']`).attr("selected", true);
                } else {
                    $('#titu').html('DATOS PROVEEDOR');
                    $(`.socio select option[value='1']`).attr("selected", true);
                }
            } else {
                $('#datosproveedor').hide('slow');
                $('#datosproveedor input').val('');
                $(`#datosproveedor select option[value='nada']`).attr("selected", true);
                $("#datosproveedor input, #datosproveedor select").prop('disabled', true)
            }
        })
        $('a.atras').on('click', function () {
            $("#cuadro2").hide("slow");
            $("#cuadro3").hide("slow");
            $("#cuadro1").show("slow");
        });
        $('.v').change(function () {
            if ($('#tmt2').val() && $('#vmt2').val()) {
                var valor = $('#tmt2').val() * $('#vmt2').cleanVal();
                $('#valproyect').val(valor);
                $('.valproyect').html('$ ' + Moneda(Math.round(valor)));
            }
        });
        $("form input:not(.edi)").on({
            focus: function () {
                this.select();
            }
        });
        $('#MANZANAS').change(function () {
            if ($(this).prop('checked')) {
                $('#mzs').css({
                    background: '#FFFFCC',
                    color: '#7f8c8d'
                })
                $('#mzs').prop('disabled', false);
                $('#lts').val('');
                $('#lts').prop('disabled', true);
                $('#lts').css({
                    background: '#7f8c8d',
                    color: '#FFFFCC'
                });
                $('#sololotes tr').remove();
                $('#sololotes2 tr').remove();
                $('#mzs').focus().select()
            } else {
                $('#lts').css({
                    background: '#FFFFCC',
                    color: '#7f8c8d'
                })
                $('#lts').prop('disabled', false);
                $('#lts').val('');
                $('#mzs').val('');
                $('#mzs').prop('disabled', true);
                $('#mzs').css({
                    background: '#7f8c8d',
                    color: '#FFFFCC'
                });
                $('#datosproducto table').remove();
                $('#datosproducto2 table').remove();
                $('#lts').focus()
            }
        });
        $('#mzs').change(function () {
            var val = $(this).val(), i = 1;
            $('#datosproducto table').remove();
            $('#datosproducto2 table').remove();
            /*$('#datosproducto table:last').remove();
            $('#datosproducto2 table:last').remove();*/
            while (i <= val) {
                if (i % 2 === 1) {
                    $('#datosproducto').append(`
                <table class="table table-sm my-2" id="tabla${i}">
                    <thead style="background: #7f8c8d; color: #FFFFCC;">
                        <tr>
                            <th>
                                <div class="text-left">                                    
                                    MANZANA 
                                    <input class="form-control-no-border text-uppercase text-center mzs" type="text" placeholder="'a'" style="padding: 1px; width: 40px; background-color: #FFFFCC;">
                                </div>
                            </th>
                            <th>
                                <div class="text-left">
                                    LOTES 
                                    <input class="form-control-no-border text-center lts" type="number" placeholder="0" style="padding: 1px; width: 50px; background-color: #FFFFCC;">
                               </div>
                            </th>  
                            <th>                                
                                <div class="custom-control custom-switch float-right">
                                    <input type="checkbox" class="custom-control-input estado" id="estado${i}">
                                    <label class="custom-control-label" for="estado${i}">.</label>
                                </div>
                            </th>  
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`);
                } else {
                    $('#datosproducto2').append(`
                <table class="table table-sm my-2" id="tabla${i}">
                    <thead style="background: #7f8c8d; color: #FFFFCC;">
                        <tr>
                            <th>
                                <div class="text-left">                                    
                                    MANZANA 
                                    <input class="form-control-no-border text-uppercase text-center mzs" type="text" placeholder="'a'" style="padding: 1px; width: 40px; background-color: #FFFFCC;">
                                </div>
                            </th>
                            <th>
                                <div class="text-left">
                                    LOTES 
                                    <input class="form-control-no-border text-center lts" type="number" placeholder="0" style="padding: 1px; width: 50px; background-color: #FFFFCC;">
                               </div>
                            </th>  
                            <th>                                
                                <div class="custom-control custom-switch float-right">
                                    <input type="checkbox" class="custom-control-input estado" id="estado${i}">
                                    <label class="custom-control-label" for="estado${i}">.</label>
                                </div>
                            </th>  
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`);
                }
                i++;
            };
        });
        $('#datosproducto, #datosproducto2').on('change', 'table .estado', function () {
            var padre = $(this).parents('table').attr('id');
            var abuelo = $(this).parents('table').parent().attr('id');

            if ($(`#${abuelo} #${padre} .estado`).prop('checked')) {

                $(`#${abuelo} #${padre} tbody .estados`).each(function (index, element) {
                    $(this).val(9)
                });
            } else {
                $(`#${abuelo} #${padre} tbody .estados`).each(function (index, element) {
                    $(this).val(15)
                });
            }
        });
        $('#datosproducto, #datosproducto2').on('change', 'table .lts', function () {
            var padre = $(this).parents('table').attr('id');
            var abuelo = $(this).parents('table').parent().attr('id');
            if ($(`#${abuelo} #${padre} .mzs`).val()) {
                var val = $(this).val(), i = 0, e;
                if ($(`#${abuelo} #${padre} tr`).length > 0) {
                    $(`#${abuelo} #${padre} tr`).each(function (index, element) {
                        e = index;
                        i++;
                    });
                }
                e + 1;
                if (e > val) {
                    while (e != val) {
                        $(`#${abuelo} #${padre} tr:last`).remove();
                        e--;
                    };
                }
                while (i <= val) {
                    $(`#${abuelo} #${padre} tbody`).append(`
                        <tr>
                            <th>
                                <input type="hidden" name="mz" value="${$(`#${abuelo} #${padre} .mzs`).val()}">
                                <input type="hidden" class="estados" name="estado" value="${$(`#${abuelo} #${padre} .estado`).prop('checked') ? 9 : 15}">
                                <div class="text-left">                                    
                                    <i class="feather-md" data-feather="heart"></i> LT 
                                    <input class="form-control-no-border text-center lt" value="${i}" type="text" style="padding: 1px; width: 30px; background-color: #FFFFCC;" name="n" required>
                                </div>
                            </th>
                            <th>
                                <div class="text-left">
                                    <i class="feather-md" data-feather="heart"></i> MT² 
                                    <input class="form-control-no-border text-center mt2" type="text" placeholder="0" style="padding: 1px; width: 50px; background-color: #FFFFCC;" name="mtr2" required>
                                    <span class="badge badge-dark text-center text-md-center float-right">$0.000.000.000</span>
                                    <input type="hidden" name="valor" value="">
                                    <input type="hidden" name="inicial" value="">
                               </div>
                            </th>  
                            <th>
                                <textarea class="form-control-no-border float-right mr-1" placeholder="Estipula aqui los linderos del lote" 
                                name="descripcion" cols="60" rows="1" autocomplete="off" style="background-color: #FFFFCC;"></textarea>
                            </th>  
                        </tr>
                    `);
                    i++;
                };
                $('#lts').val($('.lt').length);
            } else {
                SMSj('info', 'Debe establecer una "LETRA" a la mazana')
            }
        });
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
                            <th>
                                <div class="text-left">                                    
                                    <i class="feather-md" data-feather="heart"></i> LT 
                                    <input class="form-control-no-border text-center lt" value="${i}" type="text" style="padding: 1px; width: 30px; background-color: #FFFFCC;" name="n" required>
                                </div>
                            </th>
                            <th>
                                <div class="text-left">
                                    <i class="feather-md" data-feather="heart"></i> MT² 
                                    <input class="form-control-no-border text-center mt2" type="text" placeholder="0" style="padding: 1px; width: 50px; background-color: #FFFFCC;" name="mtr2" required>
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
                }
                i++;
            };
        });
        $('#pro form').submit(function (e) {
            $('#ModalEventos').modal({
                toggle: true,
                backdrop: 'static',
                keyboard: true,
            });
            var metroscuadrados = 0;
            $('.mt2').each(function (index, element) {
                metroscuadrados += parseFloat($(this).val())
            });
            if ($('#tmt2').val() != metroscuadrados) {
                e.preventDefault()
                $('#ModalEventos').one('shown.bs.modal', function () {
                    $('#ModalEventos').modal('hide')
                }).modal('show');
                SMSj('error', 'los datos no concuerdan con la totalidad de los metros cuadrados que se registro, rectifique e intentelo nuevamente')
            } else {
                $('#lts').prop('disabled', false);
            }
        })
        $('#vmt2, #porcentage').change(function () {
            var valor, inicial;
            if ($(this).attr('id') === 'porcentage' && $('#ideditar').val()) {
                var datos = { valor: $(this).val() }
                $.ajax({
                    type: "PUT",
                    url: "/links/produc/" + $('#ideditar').val(),
                    data: datos,
                    async: false,
                    success: function (data) {
                        if (data) {
                            tabledit.ajax.reload(function (json) {
                                SMSj('success', 'Nuevo porcentage establecido correctamente')
                            })
                        }
                    }
                })
            } else {
                $('.mt2').each(function (index, element) {
                    if ($(this).val()) {
                        valor = $(this).val() * $('#vmt2').cleanVal();
                        inicial = valor * $('#porcentage').val() / 100;
                        $(this).siblings('input[name="valor"]').val(valor);
                        $(this).siblings('input[name="inicial"]').val(inicial);
                        $(this).next('span').text('$ ' + Moneda(Math.round(valor)));
                    }
                });
            }
        });
        $('#datosproducto, #datosproducto2, #sololotes, #sololotes2').on('change', 'table tbody .mt2', function () {
            if ($('#vmt2').val()) {
                var valor = $(this).val() * $('#vmt2').cleanVal();
                var inicial = valor * $('#porcentage').val() / 100;
                var sum = 0;
                $(this).siblings('input[name="valor"]').val(valor);
                $(this).siblings('input[name="inicial"]').val(inicial);
                $(this).next('span').text('$ ' + Moneda(Math.round(valor)));
                $('.mt2').each(function (index, element) {
                    if ($(this).val()) {
                        sum += parseFloat($(this).val())
                    }
                });
                $('#calculom').text(sum)
                $('#tmt2').val(sum)
                var valor = $('#tmt2').val() * $('#vmt2').cleanVal();
                $('#valproyect').val(valor);
                $('.valproyect').html('$ ' + Moneda(Math.round(valor)));
            } else {
                SMSj('info', 'Establezaca primero los valores del proyecto');
                $(this).val('');
                $('#vmt2').focus();
            }
        });
        var start = moment(), end = moment().add(2, 'year');
        $('#inicio').val(start.format("YYYY-MM-DD"))
        $('#fin').val(end.format("YYYY-MM-DD"))

        function cb(start, end) {
            $("#reportrange span").html(start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY"));
            $('#inicio').val(start.format("YYYY-MM-DD"))
            $('#fin').val(end.format("YYYY-MM-DD"))
        }
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
        }, cb);
        cb(start, end);
    });

    function Dtas(n) {
        var table = $('#datatable').DataTable({
            dom: 'Bfrtip',
            buttons: ['pageLength',
                {
                    text: `<div class="mb-0">
                                        <i class="align-middle mr-2" data-feather="calendar"></i> <span class="align-middle">Fecha</span>
                                    </div>`,
                    attr: {
                        title: 'Fecha',
                        id: 'Date'
                    },
                    className: 'btn btn-secondary fech',
                },
                {
                    text: `<div class="mb-0">
                                        <i class="align-middle mr-2" data-feather="file-text"></i> <span class="align-middle">Generar Factura</span>
                                    </div>`,
                    attr: {
                        title: 'FacturaG',
                        id: 'factu'
                    },
                    className: 'btn btn-secondary',
                    action: function () {
                        if ($('#facturas span').text().length) {
                            let datosfactura = {
                                cliente,
                                nreservas: $('.facturas').text(),
                                reservas: $('#facturas').text().trim().replace(/(?!\w|\s).|  /g, "-"),
                                total: $('.total').text().replace(/(?!\w|\s).| /g, ""),
                                estado: 'pendiente'
                            };

                            $.ajax({
                                type: "POST",
                                url: '/links/generarafactura',
                                data: datosfactura,
                                success: function (data) {
                                    table.rows('.selected').remove().draw(false);
                                    total = 0;
                                    $('#facturas span').remove();
                                    $('span.total').text('');
                                    $('p.clientes').text('');
                                    $('.facturas').html('0');
                                    SMSj('success', 'Factura generada exitosamente')
                                    table2.ajax.reload(function (json) {
                                        $("#cuadro2").hide("slow");
                                        $("#cuadro1").show("slow");
                                    });
                                }
                            })
                        } else {
                            SMSj('warning', 'Debebe seleccionar las reservas a facturar antes de generar la factura')
                        }
                    }
                }
            ],
            language: {
                "lengthMenu": "Mostrar 10 filas",
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar : ",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
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
                {
                    data: "n",
                    render: function (data, method, row) {
                        return `<span class="badge badge-dark text-center text-uppercase">${data}</span>`
                    }
                },
                { data: "mtr2" },
                {
                    data: "estado",
                    className: 'c',
                    render: function (data, method, row) {
                        switch (data) {
                            case 1:
                                return `<span class="badge badge-pill badge-info">En Proceso</span>`
                                break;
                            case 9:
                                return `<span class="badge badge-pill badge-success">Disponible</span>`
                                break;
                            case 10:
                                return `<span class="badge badge-pill badge-primary">Vendido</span>`
                                break;
                            case 12:
                                return `<span class="badge badge-pill badge-secondary">Separado</span>`
                                break;
                            case 15:
                                return `<span class="badge badge-pill badge-warning">Inactivo</span>`
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
                { data: "descripcion" }
            ],
            deferRender: true,
            paging: true,
            search: {
                regex: true,
                caseInsensitive: false,
            },
            responsive: {
                details: {
                    type: 'column'
                }
            },
            initComplete: function (settings, json) {
                $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
                $('#ModalEventos').modal('toggle');
                $('#ModalEventos').modal('hide')
            },
            columnDefs: [
                { "visible": false, "targets": 1 }
            ],
            order: [[1, 'asc']],
            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(1, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            `<tr class="group" style="background: #7f8c8d; color: #FFFFCC;">
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
            }
        });

        // Daterangepicker
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
                'Hoy': [moment().startOf('days'), moment().endOf("days")],
                'Mañana': [moment().add(1, 'days').startOf('days'), moment().add(1, 'days').endOf('days')],
                'Proximos 30 Días': [moment().startOf('days'), moment().add(29, 'days').endOf("days")],
                'Próximo Mes': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
            }
        }, function (start, end, label) {
            maxDateFilter = end;
            minDateFilter = start;
            table.draw();
        });
    }
    $('#datatable').on('click', 'tr .c', function () {
        var fila = $(this).parents('tr');
        var data = $('#datatable').DataTable().row(fila).data();
        //var data = $('#datatable').DataTable().row(this).data();
        if (data.estado === 9) {
            $('#ModalEventos').modal({
                toggle: true,
                backdrop: 'static',
                keyboard: true,
            });
            fila.toggleClass('selected');
            $('#proyecto').val();
            $('#idproyecto').val();
            var url = `/links/orden?id=${data.id}`;
            $(location).attr('href', url);
        } else {
            SMSj('info', 'Producto no disponible')
        }
    });
    $('#datatable2').on('click', '.to button', function () {
        var fila = $(this).parents('tr');
        var data = $('#datatable2').DataTable().row(fila).data();
        if ($(this).parent().prev().val().indexOf(",") > 0) {
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
            backdrop: 'static',
            keyboard: true,
        });
        $("#cuadro2").show("slow");
        $("#cuadro1").hide("slow");
        $("#cuadro3").hide("slow");
        $('#proyecto').val(data.nombre);
        $('#idproyecto').val(data.id);

        if (recargada) {
            recargada = false;
            Dtas(data.id)
        } else if (data.id !== dataid) {
            dataid = data.id;
            $('#datatable').DataTable().ajax.url("/links/productos/" + data.id).load(function () {
                $('#ModalEventos').modal('hide')
                $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
            });
        } else {
            $('#ModalEventos').one('shown.bs.modal', function () {
                $('#ModalEventos').modal('hide')
            }).modal('show');
            $('#datatable2').DataTable().$('tr.selected').removeClass('selected');
        }
    });
    $('#datatable2').on('click', '.to', function () {
        $(this).find('input').mask('000,000,000', { reverse: true });
        $(this).find('input').select()
    });
    var table2 = $('#datatable2').DataTable({
        dom: 'Bfrtip',
        buttons: ['pageLength',
            admin === '1' ? {
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
                    $('#ideditar').val('')
                    $('.datatabledit').hide()
                    $('#cuadro3 input').val('')
                    $("#cuadro1").hide("slow");
                    $("#cuadro3").show("slow");
                }
            } : 'print',
        ],
        deferRender: true,
        autoWidth: false,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
        },
        responsive: true,
        order: [[1, "desc"]],
        columnDefs: [
            { "visible": admin === '1' ? true : false, "targets": [7, 5, -1] },
            { responsivePriority: 1, targets: -1 },
            { responsivePriority: 2, targets: 3 },
            { responsivePriority: 3, targets: 7 },
            { responsivePriority: 4, targets: 6 }
        ],
        language: {
            "lengthMenu": "Mostrar 10 filas",
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar : ",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
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
                data: "fecha", className: 'tu',
                render: function (data, method, row) {
                    return moment.utc(data).format('ll')
                }
            },
            { data: "porcentage", className: 'tu' },
            { data: "totalmtr2", className: 'tu' },
            {
                data: "valmtr2", className: 'to',
                render: function (data, method, row) {
                    return admin === '1' ? `<div class="input-group">
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
                data: "estado", className: 'tu',
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
                    table2.ajax.reload(function (json) {
                        table2.columns.adjust().draw();
                        $('#ModalEventos').modal('hide')
                        SMSj('error', 'Proyecto eliminado correctamente')
                    })
                }
            }
        })
    });
    var tabledit = $('#datatabledit').DataTable({
        ajax: {
            method: "POST",
            url: "/links/productos/0",
            dataSrc: "data"
        },
        columns: [
            {
                data: "mz",
                render: function (data, method, row) {
                    return `<input class="form-control-no-border text-center text-uppercase mz" type="text" name="mz" value="${data}" style="padding: 1px; width: 30px; background-color: #FFFFCC;">`
                }
            },
            {
                data: "n",
                render: function (data, method, row) {
                    return `<input class="form-control-no-border text-center lt" value="${data}" type="text" style="padding: 1px; width: 30px; background-color: #FFFFCC;" name="n" required>`
                }
            },
            {
                data: "mtr2",
                render: function (data, method, row) {
                    return `<input class="form-control-no-border text-center mt2" value="${data}" type="text" placeholder="0" style="padding: 1px; width: 50px; background-color: #FFFFCC;" name="mtr2" required>`
                }
            },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 1:
                            return `<span class="badge badge-pill badge-info">En Proceso</span>`
                            break;
                        case 9:
                            return `<span class="badge badge-pill badge-success">Disponible</span>`
                            break;
                        case 10:
                            return `<span class="badge badge-pill badge-primary">Vendido</span>`
                            break;
                        case 12:
                            return `<span class="badge badge-pill badge-secondary">Separado</span>`
                            break;
                        case 15:
                            return `<span class="badge badge-pill badge-warning">Inactivo</span>`
                            break;
                    }
                }
            },
            {
                data: "valor",
                render: function (data, method, row) {
                    return `<input class="form-control-no-border text-center valor" type="text" name="valor" value="${Moneda(data)}">`
                }
            },
            {
                data: "inicial",
                render: function (data, method, row) {
                    return `<input class="form-control-no-border text-center inicial" type="text" name="inicial" value="${Moneda(data)}"></input>`
                }
            },
            {
                data: "descripcion",
                render: function (data, method, row) {
                    return `<textarea class="form-control-no-border float-right mr-1 descripcion" placeholder="Estipula aqui los linderos del lote" 
                        name="descripcion" rows="1" autocomplete="off" style="background-color: #FFFFCC; width: 100%;">${data}</textarea>`
                }
            },
            {
                orderable: false,
                data: null,
                defaultContent: `<a class="no float-right"><i class="align-middle mr-2 fas fa-fw fa-trash"></i></i></a>`
            }
        ],
        iDisplayLength: 10,
        stateSave: true,
        stateDuration: -1,
        autoWidth: false,
        deferRender: true,
        paging: true,
        search: {
            regex: true,
            caseInsensitive: false,
        },
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
        initComplete: function (settings, json) {
            if ($('#cuadro3').is(':visible')) {
                $('#ModalEventos').modal('toggle');
                $('#ModalEventos').modal('hide')
                $(`#datatabledit input[name="valor"]`).mask('000.000.000', { reverse: true });
                $(`#datatabledit input[name="inicial"]`).mask('000.000.000', { reverse: true });
            }
        },
        columnDefs: [
            //{ "visible": false, "targets": 1 }
            { responsivePriority: 1, targets: -1 },
            /*{ responsivePriority: 2, targets: 0 },
            { responsivePriority: 3, targets: 2 },
            { responsivePriority: 4, targets: -2 },
            { responsivePriority: 10001, targets: -3 }*/
        ],
        order: [[0, 'asc']],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        `<tr class="group" style="background: #7f8c8d; color: #FFFFCC;">
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
            if (data["estado"] == 10) {
                $(row).css("background-color", "#39E9CC");
            } else if (data["estado"] == 1) {
                $(row).css("background-color", "#FFFFCC");
            }
        }
    });
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
                    tabledit.ajax.reload(function (json) {
                        SMSj('success', 'Subproducto agregado correctamente')
                    })
                }
            }
        })
    })

    $('#Modaledit').on('change', '.mt2', function () {
        var valor = $(this).val() * $('#vmt2').cleanVal();
        var inicial = valor * $('#porcentage').val() / 100;
        var sum = 0;
        $('#Modaledit input[name="valor"]').val(valor);
        $('#Modaledit input[name="inicial"]').val(inicial);
        $('#Modaledit #va').html('$ ' + Moneda(Math.round(valor)));
        $('#Modaledit #in').html('$ ' + Moneda(Math.round(inicial)));
        tabledit
            .column(2)
            .data()
            .filter(function (value, index) {
                //console.log(sum += parseFloat(value), index, value)
                sum += parseFloat(value)
                //return value === "" ? true : false;
            });

        $('#tmt2').val(sum + parseFloat($(this).val()))
        var valor = $('#tmt2').val() * $('#vmt2').cleanVal();
        $('#valproyect').val(valor);
        $('.valproyect').html('$ ' + Moneda(Math.round(valor)));
    });
    /*
        tabledit.row(fila)
            .css('color', 'red')
            .animate({ color: 'black' });
    */
    var Recorre = () => {
        tabledit
            .column(2)
            .data()
            .filter(function (value, index) {
                //console.log(sum += parseFloat(value), index, value)
                sum += parseFloat(value)
                //return value === "" ? true : false;
            });

        $('#tmt2').val(sum + parseFloat($(this).val()))
        var valor = $('#tmt2').val() * $('#vmt2').cleanVal();
        $('#valproyect').val(valor);
        $('.valproyect').html('$ ' + Moneda(Math.round(valor)));
    }
    tabledit.on('click', '.no', function () {
        var fila = $(this).parents('tr');
        var data = tabledit.row(fila).data();
        if (data.estado == 9 || data.estado == 15) {
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
                            $('#ModalEventos').modal('hide')
                            SMSj('error', 'Proyecto eliminado correctamente')
                        })
                    }
                }
            })
        } else {
            SMSj('error', 'El subproducto no se puede eliminar ya que no se encuentra en un estado disponible')
        }
    });
    tabledit.on('change', 'tr input, textarea', function () {
        var fila = $(this).parents('tr');
        var data = tabledit.row(fila).data();
        var d = {
            id: data.id,
            mz: fila.find(`.mz`).val(),
            n: fila.find(`.lt`).val(),
            mtr2: fila.find(`.mt2`).val(),
            valor: fila.find(`.valor`).val(),
            inicial: fila.find(`.inicial`).val(),
            descripcion: fila.find(`.descripcion`).val()
        }
        console.log(d)
        if (data.estado == 9 || data.estado == 15) {
            $.ajax({
                type: 'POST',
                url: '/links/productos/update',
                data: d,
                async: true,
                success: function (data) {
                    if (data) {
                        tabledit.ajax.reload(function (json) {
                            tabledit.columns.adjust().draw();
                            SMSj('success', 'Actualizacion exitosa')
                        })
                    }
                }
            })
        } else {
            SMSj('error', 'El subproducto no se puede eliminar ya que no se encuentra en un estado disponible')
        }
    });
    table2.on('click', '.editar', function () {
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
            url: '/links/productos/editar',
            data: datos,
            async: true,
            success: function (data) {
                if (data) {
                    $('#ideditar').val(data.id)
                    $('#di').val(data.id)
                    $(`select[name="categoria"] option[value='${data.categoria}']`).attr("selected", true);
                    $(`input[name="title"]`).val(data.proyect);
                    $(`.socio option[value='${data.socio}']`).attr("selected", true);
                    $('#tmt2').val(data.totalmtr2)
                    $('#vmt2').val(Moneda(data.valmtr2))
                    $(`input[name="separacion"]`).val(Moneda(data.separacion))
                    $(`input[name="incentivo"]`).val(Moneda(data.incentivo))
                    $('.valproyect').html('$' + Moneda(data.valproyect))
                    $('#valproyect').val(data.valproyect)
                    $('#inicio').val(moment(data.fecha).format('YYYY-MM-DD'))
                    $('#fin').val(moment(data.fechafin).format('YYYY-MM-DD'))
                    $(`#porcentage option[value='${data.porcentage}']`).attr("selected", true);
                    $(`.proveedor option[value='${data.proveedor}']`).attr("selected", true);
                    data.mzs === null ? '' : $('#MANZANAS').prop("checked", true), $('#mzs').val(data.mzs).prop("disabled", false);
                    $('#lts').val(data.cantidad);
                    $('#vmt2').prop('disabled', true)
                    $('.datatabledit').show()
                    $("#cuadro2").hide("slow");
                    $("#cuadro1").hide("slow");
                    $("#cuadro3").show("slow");
                    //Tablaedit(data.id)
                    tabledit.ajax.url("/links/productos/" + data.id).load(function () {
                        tabledit.columns.adjust().draw();
                        $('#ModalEventos').modal('hide')
                    });
                    /*$('#ModalEventos').modal('toggle');
                    $('#ModalEventos').modal('hide')*/
                }
            }
        })
    });
};
/////////////////////////////* ORDEN *////////////////////////////////////////////////////////////
if (window.location.pathname == `/links/orden`) {
    $(document).ready(function () {
        // Datatables clients        
        var groupColumn = 2;
        var fch = new Date();
        $('.val').mask('000.000.000', { reverse: true });
        var fechs = new Date($('#fechs').val());
        var months = fechs.getMonth() - fch.getMonth() + (12 * (fechs.getFullYear() - fch.getFullYear()));
        var h = 1;
        var Meses = (extra) => {
            months += extra
            fechs = new Date(moment(fechs).add(extra, 'month'));
            if (months > 42) {
                $('#ncuotas').html(`
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
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            <option value="36">36 Cuotas</option>
            `)

            } else if (months > 24) {
                $('#ncuotas').html(`
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            <option value="30">30 Cuotas</option>
            `)

            } else if (months > 18) {
                $('#ncuotas').html(`
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            <option value="24">24 Cuotas</option>
            `)

            } else if (months > 12) {
                $('#ncuotas').html(`
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            <option value="18">18 Cuotas</option>
            `)

            } else if (months > 6) {
                $('#ncuotas').html(`
            <option value="6">6 Cuotas</option>
            <option value="12">12 Cuotas</option>
            `)

            } else {
                $('#ncuotas').html(`
            <option value="6">6 Cuotas</option>
            `)

            };
        };
        Meses(0)
        var dic = 0;
        var jun = 0;
        var fcha;
        var Años = (inic, dia, month) => {
            dic = 0;
            jun = 0;
            dia = dia - fch.getDate()
            var t1 = new Date(moment(fch).add(inic, 'month').add(dia, 'days'))
            var t2 = new Date(moment(fch).add(month, 'month').add(dia, 'days'))
            var valfecha1 = t1.valueOf()
            var valfecha2 = t2.valueOf()
            var q = 0;
            var t3
            var data = new Array();

            while (valfecha1 < valfecha2) {
                valfecha1 = new Date(moment(fch).add(inic + q, 'month').add(dia, 'days')).valueOf()
                t3 = new Date(moment(fch).add(inic + q, 'month').add(dia, 'days'))
                data.push(t3)
                q++
            }
            data.filter((r) => {
                return r.getMonth() === 5 || r.getMonth() === 11;
            }).map((r) => {
                r.getMonth() === 5 ? jun++ : dic++;
            });

            if (jun > 0 && dic > 0) {

                if (!$('#Emeses option[value="1"]').length) {
                    $('#Emeses').append(`                        
                        <option value="1">Junio</option>
                        <option value="2">Diciembre</option>
                        <option value="3">Jun & Dic</option>
                    `);
                } else if (!$('#Emeses option[value="2"]').length) {
                    $('#Emeses').append(`
                        <option value="2">Diciembre</option>
                        <option value="3">Jun & Dic</option>
                    `);
                }

            } else if (jun > 0 && dic === 0) {

                if (!$('#Emeses option[value="1"]').length) {
                    $('#Emeses').append(`                        
                        <option value="1">Junio</option>
                    `);
                }
                $('#Emeses option[value="2"]') ? $('#Emeses option[value="2"]').remove() : '';
                $('#Emeses option[value="3"]') ? $('#Emeses option[value="3"]').remove() : '';

            } else if (jun === 0 && dic > 0) {

                if (!$('#Emeses').length) {
                    alert('Debe actualizar la pagina')
                } else if (!$('#Emeses option[value="2"]').length) {
                    $('#Emeses').append(`
                        <option value="2">Diciembre</option>
                    `);
                }
                $('#Emeses option[value="1"]') ? $('#Emeses option[value="1"]').remove() : '';
                $('#Emeses option[value="3"]') ? $('#Emeses option[value="3"]').remove() : '';

            } else {

                $('#Emeses option[value="1"]') ? $('#Emeses option[value="1"]').remove() : '';
                $('#Emeses option[value="2"]') ? $('#Emeses option[value="2"]').remove() : '';
                $('#Emeses option[value="3"]') ? $('#Emeses option[value="3"]').remove() : '';
            }
            fcha = moment(new Date(moment(fch).add(dia, 'days'))).format('YYYY-MM-DD')
        }
        Años(2, 1, 6);
        $('.hoy').text(moment().format('YYYY-MM-DD'))
        var separacion = parseFloat($('#separacion').val());
        var porcentage = parseFloat($('#porcentage').val());
        var precio = parseFloat($('#vrlote').cleanVal());
        $('.totalote').val(Moneda(precio))
        var inicial = parseFloat($('#cuotainicial').cleanVal());
        var cuota = parseFloat(precio) - parseFloat(inicial);
        var cuotaextrao, cut = 0, anos = $('#ncuotas').val() / 6;
        var oficial70 = '', oficial30 = '', bono = '', meses = 0, cuota30 = 0, cuota70 = 0;
        $('#p70').val(Moneda(cuota));
        function Dt() {
            bono = '';
            $('#dto').val('0%');
            $('#ahorro').val('$0');
            precio = parseFloat($('#vrlote').cleanVal());
            inicial = precio * porcentage / 100
            oficial70 = '$' + Moneda((100 - inicial) * precio / 100);
            oficial30 = '$' + Moneda(inicial);
            separacion = parseFloat($('#separacion').val());
        };
        $('#AgregarCliente').click(function () {
            $('.cliente2').show('slow');
        });
        $('.atras').click(function () {
            $('.cliente2').hide('slow');
            $('.cliente2 input').val('');
        });
        $('.edi').on('change', function () {
            if ($(this).attr('id') === 'abono') {
                if (parseFloat($(this).cleanVal()) < parseFloat($('#separacion').val())) {
                    $('#abono').val(Moneda($('#separacion').val()))
                    SMSj('info', 'El abono debe ser mayor o igual a la separacion ya preestablecida por Grupo Elite')
                }
            }
            var abono = parseFloat($('#abono').cleanVal()) || 0, N = parseFloat($('#ncuotas').val()), u = parseFloat($('#diferinicial').val()),
                mesesextra = '', D = parseFloat($('#dia').val()), meses = 0;
            Años(u + 1, D, N)
            if ($(this).hasClass("movil")) {
                var card = $(this).parents('div.row').attr("id")
                $.ajax({
                    url: '/links/cel/' + $(this).cleanVal(),
                    type: 'GET',
                    async: false,
                    success: function (data) {
                        if (data.length > 0) {
                            $(`#${card} .client`).val(data[0].id);
                            $(`#${card} .nombres`).val(data[0].nombre);
                            $(`#${card} .documento`).val(data[0].documento);
                            $(`#${card} .lugarexpedicion`).val(data[0].lugarexpedicion);
                            $(`#${card} .espedida`).val(moment(data[0].fechaexpedicion).format('YYYY-MM-DD'));
                            $(`#${card} .nacido`).val(moment(data[0].fechanacimiento).format('YYYY-MM-DD'));
                            $(`#${card} .estadocivil option[value='${data[0].estadocivil}']`).attr("selected", true);
                            $(`#${card} .email`).val(data[0].email);
                            $(`#${card} .direccion`).val(data[0].direccion);
                            $(`#${card} .parentesco option[value='${data[0].parentesco}']`).attr("selected", true);
                        }
                    }
                });
            }

            if ($(this).attr('id') === 'bono') {
                if ($(this).val() !== bono && $(this).val()) {
                    $.ajax({
                        url: '/links/bono/' + $(this).val(),
                        type: 'GET',
                        async: false,
                        success: function (data) {
                            if (data.length) {
                                var fecha = moment(data[0].fecha).add(59, 'days').endOf("days");
                                if (fecha < new Date()) {
                                    SMSj('error', 'Este cupon de descuento ya ha expirado. Para mas informacion comuniquese con el asesor encargado');
                                    $('#bonoid').val('');
                                    Dt();
                                } else if (data[0].producto != null) {
                                    SMSj('error', 'Este cupon ya le fue asignado a un producto. Para mas informacion comuniquese con el asesor encargado');
                                    $('#bonoid').val('');
                                    Dt();
                                } else {
                                    $('#bonoid').val(data[0].id);
                                    $('#ahorro').val(Moneda(Math.round(precio * data[0].descuento / 100)));
                                    precio = precio - (precio * data[0].descuento / 100);
                                    inicial = precio * porcentage / 100;
                                    oficial30 = Moneda(Math.round(inicial));
                                    oficial70 = Moneda(Math.round(precio - inicial));
                                    $('#dto').val(data[0].descuento + '%');
                                    $('#cuotainicial').val(Moneda(Math.round(inicial)))
                                    $('#p70').val(Moneda(Math.round(precio - inicial)));
                                    $('.totalote').val(Moneda(Math.round(precio)))
                                }
                                bono = data[0].pin;
                            } else {
                                Dt();
                                $('#bonoid').val('');
                                SMSj('error', 'Debe digitar un N° de bono. Comuniquese con uno de nuestros asesores encargado')
                            }
                        }
                    });
                } else {
                    Dt();
                    SMSj('error', 'Cupon de decuento invalido. Comuniquese con uno de nuestros asesores encargado')
                }
            }
            if ($('#ahorro').val() === '$0') {
                Dt()
            }
            if (u > 2) {
                Dt();
                $('#bono').attr('disabled', true);
                SMSj('info', 'Recuerde que si difiere la cuota inicial a mas de 3 partidas no podra ser favorecido con nuestros descuentos. Para mas info comuniquese con el asesor encargado');
            } else {
                $('#bono').attr('disabled', false);
            }
            if (abono !== 0) {
                separacion = abono;
            } else {
                separacion = parseFloat($('#separacion').val());
            }
            var Estra = () => {
                if ($('#cuotaestrao').val() && $('#Emeses').val()) {
                    cuotaextrao = parseFloat($('#cuotaestrao').cleanVal());
                    $('#Emeses').val() == 1 ? cut = cuotaextrao * jun : $('#Emeses').val() == 2 ? cut = cuotaextrao * dic : cut = cuotaextrao * (jun + dic);
                    cuota = cuota - cut;

                    if ($('#Emeses').val() == 1) {
                        mesesextra = 6
                        meses = jun

                    } else if ($('#Emeses').val() == 2) {
                        mesesextra = 12
                        meses = dic

                    } else {
                        mesesextra = 2
                        meses = jun + dic

                    };
                    $('#extran').val(meses)
                }
            }

            if (separacion >= inicial) {
                Años(0, D, N)
                resl = separacion - inicial;
                cuota = Math.round(precio - resl - inicial);
                Estra()
                cuota30 = 0;
                cuota70 = Moneda(Math.round(cuota / (N - meses)));
                $(`#diferinicial option[value='0']`).attr("selected", true);
                $("#diferinicial").prop('disabled', true)

            } else {
                cuota = Math.round(precio - inicial);
                Estra()
                cuota30 = Moneda(Math.round((inicial - separacion) / u))
                cuota70 = Moneda(Math.round(cuota / (N - (meses + u))));
                $("#diferinicial").prop('disabled', false)
            }

            recolecta = {
                separacion: Moneda(separacion),
                cuota70,
                cuota30,
                oficial30,
                oficial70,
                N,
                u,
                fcha,
                fcha2: moment(fch).format('YYYY-MM-DD'),
                mesesextra,
                extra: $('#cuotaestrao').val()
            }
            $.ajax({
                url: '/links/tabla/1',
                type: 'POST',
                data: recolecta,
                async: false,
                success: function (data) {
                    //console.log(data)
                }
            });
            if (h === 1) {
                h = 2;
                var tabla = $("#datatables-clients").DataTable({
                    dom: '<"toolbar">',
                    info: false,
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
                        { "visible": false, "targets": groupColumn }
                    ],
                    order: [[groupColumn, 'asc']],
                    displayLength: 50,
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
            } else {
                $("#datatables-clients").DataTable().ajax.reload(function (json) {
                    //SMSj('info', 'Todo marcha perfecto')
                })
            }
        })
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
            $('#enviarorden').focus();
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
/////////////////////////////* SOLICITUDES *////////////////////////////////////////////////////////////
if (window.location == `${window.location.origin}/links/solicitudes`) {
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

    var table = $('#datatable').DataTable({
        dom: 'Bfrtip',
        lengthMenu: [
            [10, 25, 50, -1],
            ['10 filas', '25 filas', '50 filas', 'Ver todo']
        ],
        buttons: ['pageLength',
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
            caseInsensitive: false,
        },
        responsive: true,
        order: [[0, 'desc']],
        language: {
            "lengthMenu": "Mostrar 10 filas",
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar : ",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        ajax: {
            method: "POST",
            url: "/links/solicitudes",
            dataSrc: "data"
        },
        /*initComplete: function (settings, json, row) {
                                        alert(row);
        },*/
        columns: [
            { data: "id" },
            { data: "fullname" },
            { data: "venefactor" },
            {
                data: "fecha",
                render: function (data, method, row) {
                    return moment.utc(data).format('YYYY-MM-DD HH:mm A') //pone la fecha en un formato entendible
                }
            },
            {
                data: "monto",
                render: function (data, method, row) {
                    return '$' + Moneda(parseFloat(data)) //replaza cualquier caracter y espacio solo deja letras y numeros
                }
            },
            { data: "metodo" },
            { data: "creador" },
            { data: "recibo" },
            {
                data: "estado",
                render: function (data, method, row) {
                    switch (data) {
                        case 'Aprobada':
                            return `<span class="badge badge-pill badge-success">${data}</span>`
                            break;
                        case 'Declinada':
                            return `<span class="badge badge-pill badge-danger">${data}</span>`
                            break;
                        case 'Procesando':
                            return `<span class="badge badge-pill badge-info">${data}</span>`
                            break;
                        case 'Pendiente':
                            return `<span class="badge badge-pill badge-warning">${data}</span>`
                            break;
                        default:
                            return `<span class="badge badge-pill badge-secondary">${data}</span>`
                    }
                }
            },
            {
                defaultContent: `<div class="btn-group btn-group-sm">
                                        <button type="button" class="btn btn-secondary dropdown-toggle btnaprobar" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false">Acción</button>
                                        <div class="dropdown-menu"></div>
                                    </div>`
            }
        ]
    }); //table.buttons().container().appendTo("#datatable_wrapper .col-sm-12 .col-md-6");
    table.on('click', '.btnaprobar', function () {
        var fila = $(this).parents('tr');
        var data = table.row(fila).data();
        if ($('#tu').val() !== data.tu) {
            switch (data.estado) {
                case 'Procesando':
                    $(this).attr('data-toggle', "dropdown")
                    $(this).next().html(`<a class="dropdown-item">Aprobar</a>
                                    <a class="dropdown-item">Declinar</a>
                                    <a class="dropdown-item">Procesando</a>`);
                    break;
                case 'Pendiente':
                    $(this).attr('data-toggle', "dropdown")
                    $(this).next().html(`<a class="dropdown-item">Aprobar</a>
                                    <a class="dropdown-item">Declinar</a>
                                    <a class="dropdown-item">Procesando</a>`);
                    break;
                default:
                    $(this).removeAttr('data-toggle')
                    SMSj('info', 'Despues de aprobada o declinada no se puede editar la solicitud.')
            }
        } else {
            if (data.estado === 'Pendiente') {
                $(this).attr('data-toggle', "dropdown")
                $(this).next().html(`<a class="dropdown-item">Declinar</a>`);
            } else {
                $(this).attr('disabled', true)
                SMSj('warning', 'No tienes permiso para realizar cambios en esta solicitud, solo el Benefactor podra realizar los cambios')
            }
        }
    })
    table.on('click', '.dropdown-item', function () {
        var fila = $(this).parents('tr');
        var data = table.row(fila).data();
        var dts = { id: data.id, mg: data.estado, monto: data.monto }
        switch ($(this).text()) {
            case 'Aprobar':
                dts.estado = 4;
                break;
            case 'Declinar':
                dts.estado = 6;
                break;
            case 'Procesando':
                dts.estado = 1;
                break;
        }
        $.ajax({
            type: 'PUT',
            url: '/links/solicitudes',
            data: dts,
            success: function (data) {
                table.ajax.reload(function (json) {
                    if (data) {
                        SMSj('success', `Solicitud procesada correctamente`);
                    } else {
                        SMSj('error', `Solicitud no pudo ser procesada correctamente, por fondos insuficientes`)
                    }
                });
            }
        })
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