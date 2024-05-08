$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
$('#row_domicilio').hide();

const product = $('.products');
const type = $('#type').val() ?? null;
const idType = $('#idType').val() ?? null;

let size = getScreenSize();
let edit = false;
let mesa = type === 'mesa' ? idType : null;
let domicilio = type === 'domicilio' ? idType : null;
let comercios = [];
let visible = false;
let products = [];
let mesas = [];
let comercio = [];
let options = [];
let optionsCombos = [];
let check = null;
const addProduct = `
    <div class='form-row rows_products pedido position-relative' style="display: none;">
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
            <a class='dropdown-item emi' style="display: none;" onclick='deleteProduct(this)'>Eliminar</a>        
          </div>
        </div>
      </div>
      <div class='form-group col-7 col-md-4'>
        <input class='code' type='hidden' name='code' />
        <input type='hidden' name='unitario' />
        <input type='hidden' name='monto' />
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
          <input class='form-control edi' type='text' name='nota' placeholder='Nota del producto' />
          <div class='input-group-append'>
            <button class='btn btn-outline-danger' type="button" onclick='deleteProduct(this)'>
              <i class='fas fa-fw fa-trash'></i>
            </button>
            <button class='btn btn-outline-primary' type="button" onclick='setProduct(this)'>
              <i class='fas fa-fw fa-plus'></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;

$.ajax({
  url: '/shops/table',
  type: 'GET',
  processData: false,
  contentType: false,
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
  }
});

$.ajax({
  url: '/products/table/all',
  type: 'GET',
  processData: false,
  contentType: false,
  success: function ({ data }) {
    if (data.length) {
      products = data.filter((obj, i, self) => i === self.findIndex(e => e.id === obj.id));

      options = products.map(e => {
        if (e.combo) return { id: e.id, text: `${e.name}` };
        return {
          id: e.id,
          text: `${e.nombre} - ${e.laboratorio} - ${e.clase} - ${e.name} X ${e.cantidad}`
        };
      });

      product
        .select2({
          allowClear: true,
          data: options,
          placeholder: { id: null, text: 'Slec. producto', selected: true }
        })
        .val(null)
        .trigger('change');

      console.log(products);
    }
  }
});

$(document).ready(function () {
  $('#hidelecte, .public, #carga, #edit').hide();
  $('input').prop('autocomplete', 'off');

  $(window).resize(function (event) {
    size = getScreenSize();
  });

  $('#crearproducto').submit(function (e) {
    e.preventDefault();

    $('#total').val(noCifra($('#total').val()));

    const formData = $(this)
      .find(`input:visible, select:visible${size.tag === 'xs' ? ', .nota:hidden' : ''}`)
      .serialize();

    console.log(formData, 'formData');
    $.ajax({
      url: '/orders',
      data: formData,
      type: 'POST',
      beforeSend: function () {
        $('#carga').show('slow');
      },
      success: function (data) {
        ordenes.ajax.reload(function ({ data }) {
          console.log(data);
          SMSj('success', 'Orden creada exitosamente');
          $('#AddProduct').modal('hide');
          data
            .filter((obj, i, self) => obj.mesa && i === self.findIndex(e => e.id === obj.id))
            .forEach(e => {
              mesas = mesas.map(m => (m.id == e.mesa ? { ...m, orden: e.id } : m));
            });
        });
      },
      error: function (data) {
        SMSj('error', 'A ocurrido un error alintentar enviar el formulario');
      },
      complete: function () {
        $('#carga').hide('slow');
      }
    });
  });

  $('#edit').on('click', function () {
    edit = $('#id').val();
    const m = mesas.find(e => e.orden == edit);
    $('.pedido').find('input').prop('readonly', false);
    $('.pedido').find('button:not(.extra)').show('slow');
    $('.order').not(`:has(input[value="${m?.id}"])`).hide('slow');
    $('.products, .mesa').off('select2:opening select2:closing');
    $('.eli, .emi').show();
    // $('.unico')
    //   .not(':has(select option:selected)')
    //   .hide('slow', function () {
    //     $(this).find('.products, .cantidad').prop('required', false);
    //   });
  });

  $('#domicilio').on('change', function () {
    if (edit) $('#row_mesas').hide();
    else $('#row_mesas').remove();
    if ($('#row_domicilio').length) return $('#row_domicilio').show('slow');

    $(`<div id='row_domicilio' class='form-row' style="display: none;">
        <div class='form-group col-12 col-md-4'>
          <input type='hidden' name='latitud' />
          <input type='hidden' name='longitud' />
          <input type='hidden' name='di' />
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
          <input type='text' class='form-control' name='referencia' placeholder='Referencia para llegar al domicilio' required/>
        </div>
      </div>`)
      .insertAfter('#sesion')
      .show('slow');

    $('#comercio')
      .select2({
        tags: true,
        allowClear: true,
        data: comercio,
        placeholder: { id: null, text: 'Sleccione cliente', selected: true }
      })
      .val(null)
      .css('width', '100%')
      .trigger('change');

    $('.select2-container').css('width', '100%', 'important');
    $('.movil').mask('*** *** ****');

    $('#comercio').on('change', function () {
      const text = $(this).find('option:selected').text();
      $(this).siblings('input[name="recibe"]').val(text);
      const shop = comercios.find(e => e.id == this.value);
      setRows($('#row_domicilio').find('input'), shop);
    });
  });

  $('#mesas').on('change', function () {
    if (edit) $('#row_domicilio').hide();
    else $('#row_domicilio').remove();

    if ($('#row_mesas').length) return $('#row_mesas').show('slow');

    let html = '';

    if (size.tag !== 'xs') {
      html = mesas
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
    } else html = "<select class='form-control mesa' placeholder='Slec. producto' name='mesa' required></select>";

    $(`<div class='form-row mt-3' id='row_mesas' style="display: none;">` + html + `</div>`)
      .insertAfter('#sesion')
      .show('slow');

    $('.mesa').on('change', changeMesa);

    if (size.tag === 'xs') {
      $('.mesa')
        .select2({
          allowClear: edit || !mesa,
          placeholder: { id: null, text: 'Sleccione una mesa', selected: true },
          data: mesas.map(e => ({
            text: `${e.name} ${e.numero} ${e.orden ? ' - ocupa' : ' - dispo'}`.toUpperCase(),
            disabled: mesa && e.orden && e.id != mesa,
            selected: e.id == mesa,
            id: e.id
          }))
        })
        .css('width', '100%')
        .trigger('change')
        .on('select2:opening select2:closing', function (e) {
          if (mesa) e.preventDefault();
        });

      $('.select2-container').css('width', '100%', 'important');
    } else $('.mesa:checked').trigger('change');
  });

  // $('.unico .products, .unico .cantidad').on('change', function () {
  //   if (this.name === 'producto') {
  //     const unitario = products.find(e => e.id == this.value)?.precio ?? 0;
  //     $(this).siblings('input[name="unitario"]').val(unitario);
  //     setOptions(this);
  //   }

  //   console.log(this.name, this.value, 'change2');

  //   calcTotal(this);
  // });
});

const ordenes = $('#ordenes').DataTable({
  dom: 'Bfrtip',
  lengthMenu: [
    [10, 25, 50, -1],
    ['10 filas', '25 filas', '50 filas', 'Ver todo']
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
    { className: 'control', orderable: true, targets: 0 },
    { responsivePriority: 1, targets: [2, 4, 6] },
    { responsivePriority: 2, targets: [5] },
    { visible: false, orderable: true, targets: [1] }
  ],
  fixedColumns: {
    leftColumns: 0
  },
  displayLength: 25,
  order: [[1, 'desc']],
  language: languag2,
  ajax: {
    method: 'GET',
    url: '/orders/table',
    dataSrc: 'data'
  },
  columns: [
    { data: null, defaultContent: '' },
    { data: 'id' },
    {
      data: 'producto',
      render: function (data, method, row) {
        return products.find(e => e.id == data)?.name ?? 'sin nombre';
      }
    },
    { data: 'nota', defaultContent: 'Sin nota' },
    { data: 'cantidad', defaultContent: '1' },
    {
      data: 'unitario',
      defaultContent: '$0',
      render: $.fn.dataTable.render.number('.', '.', 0, '$')
    },
    {
      data: 'monto',
      defaultContent: '$0',
      render: $.fn.dataTable.render.number('.', '.', 0, '$')
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

ordenes.on('click', 'td .editar', function () {
  var fila = $(this).parents('tr').next('tr').index();
  var data = ordenes.row(fila).data();
  console.log(data, 'data');

  if (data?.mesa) mesa = data?.mesa;
  else if (data?.comercio) domicilio = data?.comercio;

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
  setProduct();
  if (mesa) {
    $('#edit').show();
    const element = $('#mesas');
    element.prop('checked', true).parent('label').addClass('active');
    element.trigger('change');
  }
});

$('#AddProduct').on('hidden.bs.modal', function (e) {
  edit = false;
  $('#hidelecte, .eli, #edit').hide();
  $('.mesa').button('toggle');
  $('#row_domicilio, #row_mesas, .rows_products').remove();
  $('.unico').show(function () {
    $(this).find('.products, .cantidad').prop('required', true);
  });

  $('#crearproducto')
    .find('input, textarea')
    .each(function () {
      console.log(this.type, this.id, this.name, this.value, 'input');
      if (this.type === 'radio') return $(this).prop({ checked: this.id === 'a', disabled: false });
      return (this.value = null);
    });

  // $('.products')
  // .val(null)
  // .trigger('change')
  // .find('option')
  // .prop('disabled', false)
  // .data('oldVal', null);
});

const setRows = (orders, data) => {
  orders.not('.mesa').each(function () {
    switch (this.type) {
      case 'select-one':
        return $(this).val(data[this.name]).trigger('change');
      default:
        this.value = data?.[this.name] ?? '';
        if (this.name === 'cantidad') return calcTotal(this);
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

function changeMesa() {
  if (size.tag !== 'xs') {
    const pad = $(this).parents('.mesas');
    $('.mesa').off('change');
    $('.mesas').not(pad).button('toggle');
    $('.mesa').on('change', changeMesa);
  }

  const value = this.value;
  const order = !edit ? mesas.find(e => e.id == value)?.orden ?? null : null;
  // if (!edit) $('input.code[value!=""]').parents('.rows_products').remove();
  $('#id').val(edit || order);
  calcTotal(this);

  if (order)
    ordenes
      .rows()
      .data()
      .filter(e => e.id == order)
      .each((row, i) => {
        const elements = setProduct(false, false, true).find('input, select');
        setRows(elements, row);
      });
}

function calcTotal(elem) {
  const element = $(elem).parents('form').serializeArray();
  console.log(element, elem, $(elem).parents('form').serialize(), 'element');
  let result = element
    .filter(e => /producto|cantidad/.test(e.name))
    .map(e => ({ [e.name]: e.value }))
    .map((e, i, obj) =>
      e?.cantidad
        ? { ...obj.findLast((o, n) => !!o?.producto && n < i && i - n < 2), cantidad: e.cantidad }
        : false
    )
    .filter(e => e?.producto && e?.cantidad)
    .reduce((acc, e) => {
      const product = products.find(o => o.id == e.producto);
      return acc + e.cantidad * product?.precio;
    }, 0);

  // console.log(element, result, 'result');

  $('#total').val(Cifra(result));
}

function setProduct(elem, after = true, read = false) {
  // if (!$('.unico').is(':visible'))
  //   return $('.unico').show('slow', function () {
  //     $(this).find('.products, .cantidad').prop('required', true);
  //   });

  const element = elem ? $(elem).parents('.pedido') : $('.pedido').length ? '.pedido:last' : '.ini';

  console.log(element, 'element');

  const newElemnt = after
    ? $(addProduct).insertAfter(element).show('slow')
    : $(addProduct).insertBefore(element).show('slow');

  if (read)
    newElemnt.each(function () {
      $(this).find('input').prop('readonly', true);
      $(this).find('button:not(.extra)').hide(); //.prop('disabled', true);
    });
  else newElemnt.find('.emi').show();

  newElemnt
    .find('.products')
    .select2({
      allowClear: !read,
      data: options,
      placeholder: { id: null, text: 'Slec. producto', selected: true }
    })
    .val(null)
    .trigger('change')
    .on('select2:opening select2:closing', function (e) {
      if (read) e.preventDefault();
    });

  $('.products')
    .not(newElemnt.find('.products'))
    .each(function () {
      if (this.value && !read)
        newElemnt.find(`.products option[value="${this.value}"]`).prop('disabled', true);
    });

  newElemnt.find('.products, .cantidad').on('change', function () {
    if (this.name === 'producto') {
      const unitario = products.find(e => e.id == this.value)?.precio ?? 0;
      $(this).siblings('input[name="unitario"]').val(unitario);
      if (!read) setOptions(this);
    }

    console.log(this.name, 'change');

    calcTotal(this);
  });

  $('.select2-container').css('width', '100%', 'important');

  return newElemnt;
}

function setOptions(elem) {
  const oldVal = $(elem).data('oldVal') ?? null;

  if (elem.value)
    $('input.code[value=""]')
      .siblings('.products')
      .find(`option[value="${elem.value}"]`)
      .prop('disabled', true);
  // $('.products').not($(elem)).find(`option[value="${elem.value}"]`).prop('disabled', true);

  if (oldVal) $('.products').not($(elem)).find(`option[value="${oldVal}"]`).prop('disabled', false);
  else $(elem).data('oldVal', elem.value);
}

function deleteProduct(elem) {
  const element = $(elem).parents('.form-row');
  if (element.has('unico')) element.hide('slow');
  else
    element.hide('slow', function () {
      $(this).remove();
    });
  calcTotal('.products');
}
