$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
$('#row_domicilio').hide();

const product = $('.products');
const type = $('#type').val() ?? null;
const idType = $('#idType').val() ?? null;

let comercios = [];
let products = [];
let mesas = [];
let comercio = [];
let options = [];
let optionsCombos = [];
let check = null;
const addProduct = `
    <div class='form-row rows_products pedido'>
      <div class='form-group col-9 col-md-4'>
        <input class='code' type='hidden' name='code' />
        <input type='hidden' name='unitario' />
        <input type='hidden' name='monto' />
        <select class='form-control products' placeholder='Slec. producto' name='producto' required>
        </select>
      </div>
      <div class='form-group col-3 col-md-2'>
        <input type='text' class='form-control cantidad edi' name='cantidad' placeholder='Cant.' required />
      </div>
      <div class='form-group col-12 col-md-6'>
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
  $('#hidelecte, .public, #carga').hide();
  $('input').prop('autocomplete', 'off');
  if (type) $('#AddProduct').modal({ toggle: true, backdrop: 'static', keyboard: true });

  $('#crearproducto').submit(function (e) {
    e.preventDefault();

    $('#total').val(noCifra($('#total').val()));

    // document.getElementById('crearproducto')
    var formData = new FormData(this);

    $.ajax({
      url: '/orders',
      data: formData,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
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

  $('#domicilio').on('change', function () {
    $('#row_mesas').remove();
    if ($('#row_domicilio').length) return $('#row_domicilio').show('slow');

    $(`<div id='row_domicilio' class='form-row' style="display: none;">
        <div class='form-group col-12 col-md-4'>
          <input type='hidden' name='di' />
          <input type='hidden' name='recibe' />
          <select id='comercio' class='form-control' name='comercio' required></select>
        </div>
        <div class='form-group col-12 col-md-3'>
          <div class='input-group'>
            <div class='input-group-prepend'>
              <span class='input-group-text' id='Movl'>+57</span>
            </div>
            <input type='text' class='form-control edi' placeholder='Telefono' name='movil' data-mask='000 000 0000' required/>
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

    $('#comercio').on('change', function () {
      const text = $(this).find('option:selected').text();
      $(this).siblings('input[name="recibe"]').val(text);
    });
  });

  $('#mesas').on('change', function () {
    const id = type === 'mesa' ? idType : null;
    $('#row_domicilio').remove();
    if ($('#row_mesas').length) return $('#row_mesas').show('slow');

    $(
      `<div class='form-row mt-3' id='row_mesas' style="display: none;">` +
        mesas
          .map(
            e => `<div class="col-6 col-md-2 mb-2">
                  <div class="btn-group-toggle mesa" data-toggle="buttons">
                    <label 
                     class="btn btn-outline-${e.orden ? 'primary' : 'success'} btn-block 
                     ${e.id == id ? 'active' : ''}"                     
                    >
                      <input 
                       id="${e.id}"
                       type="radio" 
                       name="mesa" 
                       data-order="${e.orden ?? null}"
                       value="${e.id}" 
                       ${e.id == id ? 'checked' : ''}
                      > 
                      ${e.name} ${e.numero}
                    </label>
                  </div>
                </div>`
          )
          .join('\n') +
        `</div>`
    )
      .insertAfter('#sesion')
      .show('slow');

    $('.mesa').on('click', function () {
      $('.mesa').not(this).button('toggle');
      const order = $(this).find('input').data('order') ?? null;
      $('input.code[value!=""]').parents('.rows_products').remove();
      $('#id').val(order);
      calcTotal(this);

      if (order) {
        ordenes
          .rows()
          .data()
          .filter(e => e.id == order)
          .each((row, i) => {
            const elements = setProduct(false, false, true).find('input, select');
            setRows(elements, row);
          });
      }
    });
  });

  $('.products, .cantidad').on('change', function () {
    if (this.name === 'producto') {
      const unitario = products.find(e => e.id == this.value)?.precio ?? 0;
      $(this).siblings('input[name="unitario"]').val(unitario);
      setOptions(this);
    }
    calcTotal(this);
  });
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
                <td colspan="5" style="background-color: #FCF3CF">
                  <div class="d-flex justify-content-between">
                    <div class="p-1">${row.id}</div>
                    <div class="p-1">
                      ${row.comercio ? row.nombre : row.recibe ?? row.mesa}
                    </div>
                    <div class="p-1">${estado}</div>
                    <div class="p-1">
                      <a class="eliminar" id="${row.id}">
                        <i class="fas fa-trash"></i>
                      </a>
                      <a class="editar mr-3" id="${row.id}">
                        <i class="fas fa-edit"></i>
                      </a>
                    </div>
                  </div>
                </td>
              </tr>`);

        last = row;
      }
    });
  }
});

ordenes.on('click', 'td .editar', function () {
  $('#hidelecte').show();
  const orders = $('#crearproducto').find('input, select');
  ordenes
    .rows()
    .data()
    .filter(e => e.id == this.id)
    .each((row, i) => {
      if (!i) {
        return setRows(orders, row);
      }
      const elements = setProduct().find('input, select');
      setRows(elements, row);
    });

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
  if (type === 'mesa' && idType) {
    const element = $('#mesas');
    element.prop('checked', true).parent('label').addClass('active');
    element.trigger('change');
  }
});

$('#AddProduct').on('hidden.bs.modal', function (e) {
  $('#hidelecte').hide();
  $('.mesa').button('toggle');
  $('.rows_products').remove();

  $('#crearproducto')
    .find('input, textarea')
    .each(function () {
      if (this.type === 'radio') return $(this).prop({ checked: this.id === 'a', disabled: false });

      this.value = null;
    });

  $('.products')
    .val(null)
    .trigger('change')
    .find('option')
    .prop('disabled', false)
    .data('oldVal', null);
});

const setRows = (orders, data) =>
  orders.each(function () {
    switch (this.type) {
      case 'select-one':
        return $(this).val(data[this.name]).trigger('change');
      default:
        this.value = data[this.name];
        if (this.name === 'cantidad') return calcTotal(this);
        return;
    }
  });

function calcTotal(elem) {
  const element = $(elem).parents('form').serializeArray();

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
  const element = !elem ? '.pedido:last' : $(elem).parents('.pedido');
  const newElemnt = after
    ? $(addProduct).insertAfter(element)
    : $(addProduct).insertBefore(element);

  if (read)
    newElemnt.each(function () {
      $(this).find('input').prop('readonly', true);
      $(this).find('button').remove(); //.prop('disabled', true);
    });

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

  $('.products, .cantidad').on('change', function () {
    if (this.name === 'producto') {
      const unitario = products.find(e => e.id == this.value)?.precio ?? 0;
      $(this).siblings('input[name="unitario"]').val(unitario);
      if (!read) setOptions(this);
    }

    calcTotal(this);
  });

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
  element.prev('hr').remove();
  element.remove();
  calcTotal('.products');
}
