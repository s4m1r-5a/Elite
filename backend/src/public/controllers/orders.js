$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
$('#row_domicilio').hide();

const type = $('#type').val() ?? null;
const idType = $('#idType').val() ?? null;
const admin = false;

let size = getScreenSize();
let edit = false;
let mesa = type === 'mesa' ? idType : null;
let domicilio = type === 'domicilio' ? idType : null;
let comercios = [];
let visible = false;
let products = [];
let articles = [];
let mesas = [];
let comercio = [];
let optionsCombos = [];
let check = null;

const addProduct = `<div class='form-row rows_products pedido position-relative' style="display: none;">
    <div class='position-absolute ocu w-100' style='left: 0; top: 0; z-index: 1000; display: none;'>
      <div class='input-group w-100'>
        <input class='form-control nota' type='text' name='nota' placeholder='Nota producto' />
        <div class='input-group-append'>
          <button type='button' class='btn btn-dark extra' onclick='setNote(this, false)'>
            <i class='fas fa-angle-up'></i>
          </button>
        </div>
      </div>
    </div>
    <div class='form-group col-1 d-block d-sm-none'>
      <div class='btn-group'>
        <button
          type='button'
          class='btn btn-light p-1 extra'
          data-toggle='dropdown'
          aria-expanded='false'
        >
          <i class='fas fa-fw fa-ellipsis-v'></i>
        </button>
        <div class='dropdown-menu'>
          <a class='dropdown-item' onclick='setNote(this)'>Nota producto</a>    
          <div class='dropdown-divider emi' style="display: none;"></div>
          <a class='dropdown-item emi delet' style="display: none;" onclick='deleteProduct(this)'>Eliminar</a>        
        </div>
      </div>
    </div>
    <div class='form-group col-7 col-md-4'>
      <input class='name' type='hidden' name='name' value='' />
      <input class='code' type='hidden' name='code' value='' />
      <input type='hidden' name='unitario' class='unitario' />
      <select class='form-control products' placeholder='Slec. producto' name='producto' required>
      </select>
    </div>
    <div class='form-group col-4 col-md-2'>
      <div class='input-group'>
        <input type='text' class='form-control cantidad edi' name='cantidad' placeholder='Cant.' required />
        <div class='input-group-append d-block d-sm-none'>
          <button class='btn btn-outline-primary px-2' type="button" onclick='setProduct(this)'>
            <i class='fas fa-fw fa-plus'></i>
          </button>
        </div>
      </div>
    </div>
    <div class='form-group col-12 col-md-6 d-none d-md-block'>
      <div class='input-group'>
        <input class='form-control edi note' type='text' name='nota' placeholder='Nota del producto' />
        <div class='input-group-append'>
          <button class='btn btn-outline-danger delet' type="button" onclick='deleteProduct(this)'>
            <i class='fas fa-fw fa-trash'></i>
          </button>
          <button class='btn btn-outline-primary add' type="button" onclick='setProduct(this)'>
            <i class='fas fa-fw fa-plus'></i>
          </button>
        </div>
      </div>
    </div>
</div>`;

const addDelivery = `<div id='row_domicilio' class='form-row' style="display: none;">
  <div class='form-group col-12 col-md-4'>
    <input type='hidden' name='latitud' />
    <input type='hidden' name='longitud' />
    <input type='hidden' name='domi' />
    <input type='hidden' name='recibe' />
    <select id='comercio' class='form-control' name='comercio' required></select>
  </div>
  <div class='form-group col-12 col-md-3'>
    <div class='input-group'>
      <div class='input-group-prepend'>
        <span class='input-group-text' id='Movl'>+57</span>
      </div>
      <input type='text' class='form-control edi movil' placeholder='Telefono' name='movil' data-mask='000 000 0000' required/>
    </div>
  </div>
  <div class='form-group col-12 col-md-5'>
    <input type='text' class='form-control' name='direccion' placeholder='Direccion' required/>
  </div>
  <div class='form-group col-12'>
    <input type='text' class='form-control' name='referencia' placeholder='Referencia para llegar al domicilio'/>
  </div>
</div>`;

const list = items => {
  return items
    .map(
      e => `<li class='list-group-item d-flex justify-content-between align-items-center' style="background-color: unset;">
              <div>
                <span class="font-weight-light text-capitalize">${
                  e?.name?.toLowerCase() ?? ''
                }</span>
                </br> 
                <small class="text-muted text-monospace">${currency(e.unitario, true)}</small> 
              </div>
              <div>
                <span class='badge badge-primary badge-pill float-right'>${e.cantidad}</span>
                </br> 
                <small class="text-muted text-monospace">${currency(e.monto, true)}</small> 
              </div>              
            </li>`
    )
    .join('');
};

const producto = ({ id, total, tipo, items, comercio, meza, domicilio, ...r }) => {
  const mexa = () => (meza.name ? meza.name + '-' + meza.numero : '');

  return `<div class='list-group shadow-lg mb-2'>
    <a class="list-group-item list-group-item-action rounded" role="button" href="javascript:void 0">
      <div class="d-flex w-100 justify-content-between op">
        <h4 class="mb-1" style="font-weight: bold; font-family: cursive; color: unset;">
          Orden #${id} ${mexa()}
        </h4>
        <small>${currency(total, true)}</small>
      </div>
      <p class="mb-1 ml-0 text-left op">
        Orden de ${tipo.toLowerCase()} con 
        ${r.ctd_total} ${tipo === 'VENTA' ? 'productos' : 'articulos'} agregados
      </p>
      <div class="d-flex w-100 justify-content-between">
        <small class="op">Accione requeridas a continuacion.</small>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text mr-3 editar"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-printer"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        </div>
      </div>

      <div
        id='referencia_${id}'
        class='collapse py-2'
        aria-labelledby='heading_${id}'
        data-parent='#productos'
      >   
        <ul class='list-group list-group-flush'>
          ${list(items)}            
          <li class='list-group-item d-flex justify-content-between align-items-center' style="background-color: unset;">
            <div>
              Art. <small class="text-monospace">${r.ctd_total}</small> Total:
            </div>
            <small class="text-muted text-monospace">${currency(total, true)}</small>
          </li>
        </ul>
      </div>
    </a>  
  </div>`;
};

$.ajax({
  url: '/shops/table',
  type: 'GET',
  success: function ({ data }) {
    if (data.length) {
      comercios = data;
      comercio = comercios.map(e => ({ id: e.id, text: `${e.id} - ${e.nombre}` }));
    }
  }
});

$.ajax({
  url: '/orders/mesas',
  type: 'GET',
  async: !type,
  success: function ({ data }) {
    mesas = data;

    $('.mesa')
      .select2({
        allowClear: false, // edit || !mesa,
        placeholder: { id: null, text: 'Sleccione una mesa', selected: true },
        data: mesas.map(e => ({
          text: `${e.name} ${e.numero} ${e.orden ? ' - ocupa' : ' - dispo'}`.toUpperCase(),
          disabled: mesa && e.orden && e.id != mesa,
          selected: e.id == mesa,
          id: e.id
        }))
      })
      .val(null)
      .trigger('change')
      .on('change', changeMesa)
      .on('select2:opening select2:closing', function (e) {
        if (mesa && !edit) e.preventDefault();
      })
      .next('.select2-container')
      .css('width', '100%', 'important')
      .hide();

    /* html = mesas
        .map(
          e => `<div class="col-6 col-md-2 mb-2 ${e.orden ? ' order' : ''}">
            <div 
             class="btn-group-toggle mesas ${!mesa ? '' : 'disabled'}" 
             data-toggle="buttons"
            >
              <label 
               class="btn btn-outline-${e.orden ? 'primary' : 'success'} btn-block 
               ${!mesa || e.id == mesa ? '' : 'disabled'} 
               ${e.id == mesa ? 'active' : ''}"                     
              >
                <input 
                 class="mesa"
                 type="radio" 
                 name="mesa" 
                 value="${e.id}" 
                 ${e.id == mesa ? 'checked' : ''}
                 ${!mesa ? '' : 'disabled'} 
                > 
                ${e.name} ${e.numero}
              </label>
            </div>
          </div>`
        )
        .join('\n'); 
        
        $('.mesa:checked').trigger('change') 

        const pad = $(this).parents('.mesas');
        $('.mesa').off('change');
        $('.mesas').not(pad).button('toggle');
        $('.mesa').on('change', changeMesa);
        */
  }
});

$.ajax({
  url: '/products/table',
  type: 'GET',
  success: function ({ data }) {
    if (data.length) {
      data.forEach(({ id, name, type, items, precio }) => {
        if (type === 'UNITARIO') {
          products = [
            ...products,
            ...items
              .filter(a => a.refId)
              .map(a => ({
                id: `${id}-${a.refId}`,
                text: `${name} ${a.nombre} ${a.ref}`,
                precio: a.valor
              }))
              .reduce(
                (a, e, i) => (!i ? (a = [e]) : (a = [...a, e])),
                [{ id, text: `${name} ${items[0].nombre}`, precio: items[0].valor }]
              )
          ];
        } else products = [...products, { id, text: name, precio }];
      });

      $('.products')
        .select2({
          allowClear: true,
          data: products,
          placeholder: { id: null, text: 'Slec. producto', selected: true }
        })
        .val(null)
        .trigger('change');

      console.log(products, 'productos');
    }
  }
});

$(document).ready(function () {
  $('#hidelecte, .public, #loading, #edit').hide();
  $('input').prop('autocomplete', 'off');

  $('#tipo')
    .select2({ allowClear: admin })
    .on('select2:opening select2:closing', function (e) {
      if (!admin) e.preventDefault();
    });

  $(window).resize(function (event) {
    size = getScreenSize();

    if (size.tag === 'xs') $(`.mesa_uno`).prop('required', false);
    else $(`.mesa_dos`).prop('required', false);
  });

  $('#crearproducto').submit(function (e) {
    e.preventDefault();

    $('#total').val(noCifra($('#total').val()));

    const formData = $(this)
      .find(`input, select:visible`)
      .not(`${size.tag === 'xs' ? '.note' : '.nota'}`)
      .serialize();

    console.log(formData, 'formData');
    $.ajax({
      url: '/orders',
      data: formData,
      type: 'POST',
      beforeSend: function () {
        $('#loading').show('slow');
      },
      success: function (data) {
        ordenes.ajax.reload(function ({ data }) {
          SMSj('success', 'Orden creada exitosamente');
          $('#AddProduct').modal('hide');
          data.forEach(e => {
            mesas = mesas.map(m => (m.id == e.mesa ? { ...m, orden: e.id } : m));
          });
        });
      },
      error: function (data) {
        SMSj('error', 'A ocurrido un error alintentar enviar el formulario');
      },
      complete: function () {
        $('#loading').hide('slow');
      }
    });
  });

  $('#edit').on('click', function () {
    edit = $('#id').val();
    const m = mesas.find(e => e.orden == edit);
    $('.pedido').find('input').prop('readonly', false);
    $('.pedido').find('button:not(.extra)').show('slow');
    $('.order').not(`:has(input[value="${m?.id}"])`).hide('slow');
    $('.eli, .emi').show();
    $('.btn-group-toggle label').show('slow');
    $('#row_domicilio input').prop('readonly', false);
  });

  $('#domicilio').on('change', changeDomicilio);
  $('#mesas').on('change', changeMesas);
});

const ordenes = $('#ordenes').DataTable({
  dom: 'Bfrtip',
  lengthMenu: [
    [5, 10, 25, 50, -1],
    ['5 filas', '10 filas', '25 filas', '50 filas', 'Ver todo']
  ],
  buttons: [
    {
      text: `<i class="align-middle mr-2" data-feather="file"></i>`,
      attr: {
        title: 'Listas de precios'
      },
      className: 'btn btn-outline-dark',
      action: function () {
        // listaPrecio();
      }
    },
    {
      extend: 'collection',
      text: '<i class="align-middle feather-md" data-feather="menu"></i>',
      orientation: 'landscape',
      buttons: [
        {
          text: '<i class="align-middle feather-md" data-feather="copy"></i> Copiar',
          extend: 'copy'
        }
      ]
    },
    {
      text: `<i class="align-middle mr-2" data-feather="plus"></i> <span class="align-middle">Generar Orden</span>`,
      attr: {
        'data-toggle': 'modal',
        'data-target': '#AddProduct',
        title: 'Crear | Editar'
      },
      className: 'btn btn-outline-dark',
      action: function () {
        /* $('#addProd').hide('slow');
            $('#addProduct').show('slow');
            $('#cerrarcompra, #cerrarfactura').trigger('click'); */
      }
    }
  ],
  deferRender: true,
  paging: true,
  // scrollCollapse: true,
  // scrollY: '60vh',
  autoWidth: true,
  search: {
    regex: true,
    caseInsensitive: true
  },
  responsive: {
    details: {
      type: 'column'
    }
  },
  columnDefs: [
    // { className: 'control', orderable: true, targets: 0 },
    // { responsivePriority: 1, targets: [2, 4, 6] },
    // { responsivePriority: 2, targets: [5] },
    // { visible: false, orderable: true, targets: [1] }
  ],
  fixedColumns: {
    leftColumns: 0
  },
  displayLength: 5,
  order: [[0, 'desc']],
  language: languag2,
  ajax: {
    method: 'GET',
    url: '/orders/table',
    dataSrc: 'data'
  },
  columns: [
    {
      data: 'id',
      render: function (data, method, row) {
        return producto(row);
      }
    }
  ],
  drawCallback: function (settings) {
    const api = this.api();
    const line = api.rows({ page: 'current' }).nodes();
    const rows = api.column(0, { page: 'current' }).data();
    let last = null;
    rows.each(function (row, i) {
      if (last?.id && last?.id != row.id) {
        $(line).eq(i).before(`
              <tr class="group">
                <td colspan="5">
                  <div class="d-flex justify-content-between">
                    <div class="py-0 px-3">${
                      last.comercio || last.recibe ? 'Domicilio' : 'Mesa ' + last.mesa
                    }</div>
                    <div class="py-0 px-3">TOTAL: $${Cifra(last.total)}</div>
                  </div>
                </td>
              </tr>`);
      }

      if (last?.id != row.id) {
        let estado = '';
        switch (row.estado) {
          case 3:
            estado = `<span class="badge badge-pill badge-info">Pendiente</span>`;
            break;
          case 8:
            estado = `<span class="badge badge-pill badge-dark">Tramitando</span>`;
            break;
          case 9:
            estado = `<span class="badge badge-pill badge-success">Disponible</span>`;
            break;
          case 10:
            estado = `<span class="badge badge-pill badge-primary">Separado</span>`;
            break;
          case 12:
            estado = `<span class="badge badge-pill badge-secondary">Apartado</span>`;
            break;
          case 13:
            estado = `<span class="badge badge-pill badge-tertiary">Vendido</span>`;
            break;
          case 14:
            estado = `<span class="badge badge-pill badge-danger">Tramitando</span>`;
            break;
          case 15:
            estado = `<span class="badge badge-pill badge-warning">Inactivo</span>`; //secondary
            break;
          default:
            estado = `<span class="badge badge-pill badge-secondary">Inactivo</span>`;
            break;
        }

        $(line).eq(i).before(`
              <tr class="group">
                <td class="py-0" colspan="5" style="background-color: #FCF3CF">
                  <div class="d-flex justify-content-between">
                    <div class="p-1">${row.id}</div>
                    <div class="p-1">
                      ${row.comercio ? row.nombre : row.recibe ?? row.mesa}
                    </div>
                    <div class="p-1">${estado}</div>
                    <div class="p-1 editar"><i class="fas fa-file-alt"></i></div>
                  </div>
                </td>
              </tr>`);

        last = row;
      }
    });
  },
  initComplete: function (settings, json) {
    if (mesa || domicilio)
      $('#AddProduct').modal({ toggle: true, backdrop: 'static', keyboard: true });
  }
});

ordenes.on('click', 'td .op', function (a, b, c) {
  var fila = $(this).parents('tr');
  var data = ordenes.row(fila).data();
  console.log(data, 'data', { a, b, c });

  const isVisible = $('#myHeader').is(':visible');

  if (isVisible) {
    $('#myHeader .card-title').text(`Orden #${data.id}`);
    $('#myHeader .card-text').text(`Orden de ${data.tipo.toLowerCase()} con 
        ${data.items.length} ${data.tipo === 'VENTA' ? 'productos' : 'articulos'} agregados`);
    $('#myHeader ul').html(`${list(data.items)}
      <li class='list-group-item d-flex justify-content-between align-items-center' style="background-color: unset;">
        <div>
          Art. <small class="text-monospace">${data.ctd_total}</small> Total:
        </div>
        <small class="text-muted text-monospace">${currency(data.total, true)}</small>
      </li>`);
  } else $(`#referencia_${data?.id}`).collapse('toggle');
});

ordenes.on('click', 'td .editar', function () {
  var fila = $(this).parents('tr'); //.next('tr').index();
  var data = ordenes.row(fila).data();

  $('#edit').show();

  const productos = $('#crearproducto').find('input, select');
  setRows(productos, data);

  console.log(data, 'data');

  if (data?.comercio || data?.domicilio) {
    domicilio = data?.comercio;
    $('#domicilio').prop('checked', true).parent().addClass('active');
    $('#mesas').prop({ checked: false, disabled: true }).parent().removeClass('active').hide();
    data.items.forEach((row, i) => {
      const elements = setProduct(false, false, true).find('input, select');
      return setRows(elements, row);
    });
    const elements = setDelivery(true).find('input, select');
    setRows(elements, {
      ...data.domicilio,
      comercio: data?.comercio || data.domicilio?.recibe
    });
  } else {
    $('#mesas').prop('checked', true).parent('label').addClass('active');
    $('#domicilio').prop({ checked: false, disabled: true }).parent().removeClass('active').hide();
    const table = $(size.tag === 'xs' ? '.mesa_dos' : '.mesa_uno');
    table.val(data?.mesa).trigger('change').next('.select2-container').show('slow');
    mesa = data?.mesa;
  }

  $('#AddProduct').modal({ toggle: true, backdrop: 'static', keyboard: true });
});

ordenes.on('click', 'td .eliminar', function () {
  console.log($(this).prop('id'));
  if (confirm('Seguro deseas eliminar este medicamento?')) {
    $.ajax({
      url: '/products/' + $(this).prop('id'),
      type: 'DELETE',
      success: function (data) {
        if (data) {
          prices_combo.ajax.reload(null, false);
          SMSj('success', 'Medicamento eliminado exitosamente');
        } else {
          SMSj('error', 'No es posible eliminar este medicamento.');
        }
      }
    });
  }
});

$('#AddProduct').on('shown.bs.modal', function (e) {
  if (!mesa && !domicilio) setProduct();
  /* if (mesa) {
    $('#edit').show();
    const element = $('#mesas');
    element.prop('checked', true).parent('label').addClass('active');
    element.trigger('change');
  } else if (domicilio) {
    $('#edit').show();
    const element = $('#domicilio');
    element.prop('checked', true).parent('label').addClass('active');
    element.trigger('change');
  } */
});

$('#AddProduct').on('hidden.bs.modal', function (e) {
  domicilio = null;
  mesa = null;
  edit = false;
  $('#hidelecte, .eli, #edit, #loading').hide();
  $('.mesa').val(null).trigger('change').next('.select2-container').hide('slow');
  $('#row_domicilio, .rows_products').remove();
  $('.btn-group-toggle label')
    .show('slow')
    .removeClass('active')
    .find('input')
    .prop({ checked: false, disabled: false });

  $('#crearproducto')
    .find('input, textarea')
    .each(function () {
      console.log(this.type, this.id, this.name, this.value, 'input');
      if (this.type === 'radio') return $(this).prop({ checked: false, disabled: false });
      return (this.value = null);
    });
});

const setRows = (orders, data) => {
  orders.not('.mesa').each(function () {
    switch (this.type) {
      case 'select-one':
        return $(this).val(data[this.name]).trigger('change');
      default:
        this.value = data?.[this.name] ?? '';
        if (this.name === 'cantidad') return calcTotal();
        if (this.name === 'movil') return $(this).mask('### ### ####');
        return;
    }
  });
};

const setNote = (elem, rt = true) => {
  const element = $(elem).parents('.form-row');
  visible = rt;
  if (rt) element.find('.ocu').show('slow');
  else element.find('.ocu').hide('slow');
};

function changeDomicilio() {
  if (!edit) {
    $('input.code[value!=""]')
      .parents('.rows_products')
      .hide('slow', function () {
        $(this).remove();
        calcTotal();
      });
  }

  console.log(this, 'cambio');

  $('.mesa')
    .val(null)
    .trigger('change')
    .prop('required', false)
    .next('.select2-container')
    .hide('slow');

  if ($('#row_domicilio').length) return $('#row_domicilio').show('slow');

  setDelivery();
}

function changeMesas() {
  $('#row_domicilio').hide('slow', function () {
    if (!edit) $(this).remove();
  });

  if (size.tag === 'xs')
    $(`.mesa_dos`).prop('required', true).next('.select2-container').show('slow');
  else $(`.mesa_uno`).prop('required', true).next('.select2-container').show('slow');
}

function changeMesa() {
  const value = this.value;
  const order = !edit ? mesas.find(e => e.id == value)?.orden ?? null : null;
  if (!edit) {
    $('input.code[value!=""]')
      .parents('.rows_products')
      .hide('slow', function () {
        $(this).remove();
        calcTotal();
      });
  }
  $('#id').val(edit || order);

  if (order)
    ordenes
      .rows()
      .data()
      .filter(e => e.id == order)
      .each(row => {
        row.items.forEach(data => {
          const elements = setProduct(false, false, true).find('input, select');
          setRows(elements, data);
        });
      });

  return calcTotal();
}

function calcTotal() {
  let sum = 0;
  $('.pedido').each(function () {
    const calc = { unitario: 0, cantidad: 0 };
    $(this)
      .find('.unitario, .cantidad')
      .each(function () {
        calc[this.name] = parseFloat(this.value || 0);
      });

    sum += calc.unitario * calc.cantidad;
  });

  $('#total').val(currency(sum, true));
}

function setDelivery(read = false) {
  const element = $(addDelivery).insertAfter('#sesion').show('slow');

  if (read) element.find('input').prop('readonly', true);

  $('#comercio')
    .select2({
      tags: true,
      allowClear: !read,
      data: comercio,
      placeholder: { id: null, text: 'Sleccione cliente', selected: true }
    })
    .val(null)
    .css('width', '100%')
    .trigger('change')
    .on('select2:opening select2:closing', function (e) {
      if (read && !edit) e.preventDefault();
    });

  $('.select2-container').css('width', '100%', 'important');
  $('.movil').mask('*** *******');

  $('#comercio').on('change', function () {
    const text = $(this).find('option:selected').text();
    $(this).siblings('input[name="recibe"]').val(text);
    const shop = comercios.find(e => e.id == this.value);
    setRows($('#row_domicilio').find('input'), shop);
  });

  return element;
}

function setProduct(elem, after = true, read = false) {
  const element = elem
    ? $(elem).parents('.pedido')
    : !$('.pedido').length
    ? '.ini'
    : after
    ? '.pedido:last'
    : '.pedido:first';

  console.log(element, 'element');

  const newElemnt = after
    ? $(addProduct).insertAfter(element).show('slow')
    : $(addProduct).insertBefore(element).show('slow');

  if (read)
    newElemnt.each(function () {
      $(this).find('input').prop('readonly', true);
      $(this).find('button:not(.extra), .emi').hide(); //.prop('disabled', true);
    });
  else newElemnt.find('.emi').show();

  newElemnt
    .find('.products')
    .select2({
      allowClear: !read,
      data: products,
      placeholder: { id: null, text: 'Slec. producto', selected: true }
    })
    .val(null)
    .trigger('change')
    .on('select2:opening select2:closing', function (e) {
      if (read && !edit) e.preventDefault();
    });

  $('.products')
    .not(newElemnt.find('.products'))
    .each(function () {
      if (this.value && !read)
        newElemnt.find(`.products option[value="${this.value}"]`).prop('disabled', true);
    });

  newElemnt.find('.products, .cantidad').on('change', function () {
    if (this.name === 'producto') {
      const prod = products.find(e => e.id == this.value);
      $(this)
        .siblings('input.unitario')
        .val(prod?.precio ?? 0)
        .siblings('input.name')
        .val(prod?.text ?? '');

      if (!read) setOptions(this);
    }

    console.log(this.name, 'change');

    calcTotal();
  });

  $('.select2-container').css('width', '100%', 'important');

  const elements = edit
    ? $('.pedido')
    : $('.pedido input.code[value=""]')
        .parents('.pedido')
        .not(read ? newElemnt : '');

  if (elements.length < 2) elements.find('.delet').prop('disabled', true).hide();
  else elements.find('.delet').prop('disabled', false).show();

  // $('.pedido:last').find('.add').prop('disabled', false).show()

  return newElemnt;
}

function setOptions(elem) {
  const oldVal = $(elem).data('oldVal') ?? null;

  if (elem.value)
    $('input.code[value=""]')
      .siblings('.products')
      .not($(elem))
      .find(`option[value="${elem.value}"]`)
      .prop('disabled', true);
  // $('.products').not($(elem)).find(`option[value="${elem.value}"]`).prop('disabled', true);

  if (oldVal) $('.products').find(`option[value="${oldVal}"]`).prop('disabled', false);
  $(elem).data('oldVal', elem.value);
}

function deleteProduct(elem) {
  const element = $(elem).parents('.form-row');
  const cod = element.find('input.code').val();
  const elements = cod ? $('.pedido input.code[value!=""]') : $('.pedido input.code[value=""]');

  if (elements.length < 3)
    elements.parents('.form-row').find('.delet').prop('disabled', true).hide();

  return element.hide('slow', function () {
    $(this).remove();
    calcTotal();
  });
}
