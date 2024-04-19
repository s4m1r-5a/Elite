$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
const product = $('.select2');

const mesas = [
  { id: 1, zona: '', name: 'mesa', numero: '1', puestos: '4', estado: 9, mesero: '', orden: '' },
  { id: 2, zona: '', name: 'mesa', numero: '2', puestos: '4', estado: 9, mesero: '', orden: '' },
  { id: 3, zona: '', name: 'mesa', numero: '3', puestos: '4', estado: 9, mesero: '', orden: '23' },
  { id: 4, zona: '', name: 'mesa', numero: '4', puestos: '4', estado: 9, mesero: '', orden: '' },
  { id: 5, zona: '', name: 'mesa', numero: '5', puestos: '4', estado: 9, mesero: '', orden: '2' },
  { id: 6, zona: '', name: 'mesa', numero: '6', puestos: '4', estado: 9, mesero: '', orden: '' }
];
let options = [];
let optionsCombos = [];
let check = null;
const addProduct = `
    <hr class="mt-0 hrs_products" />
    <div class='form-row rows_products'>
      <div class='form-group col-9 col-md-4'>
        <input type="hidden" name="code">
        <select class='form-control select2' placeholder='Slec. producto' name='producto' required>
        </select>
      </div>
      <div class='form-group col-3 col-md-2'>
        <input type='text' id='cantidad' class='form-control' name='cantidad' placeholder='Cant.' required />
      </div>
      <div class='form-group col-12 col-md-6'>
        <div class='input-group'>
          <input id='price' class='form-control valor' type='text' name='nota' placeholder='Nota del producto' />
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
  url: '/products/table/all',
  type: 'GET',
  processData: false,
  contentType: false,
  success: function ({ data }) {
    if (data.length) {
      options = data
        .filter((obj, i, self) => i === self.findIndex(e => e.id === obj.id))
        .map(e => {
          if (e.combo) return { id: e.id, text: `${e.name}` };
          return {
            id: e.id,
            text: `${e.nombre} - ${e.laboratorio} - ${e.clase} - ${e.name} X ${e.cantidad}`
          };
        });

      $('.select2')
        .select2({
          allowClear: true,
          data: options,
          placeholder: { id: null, text: 'Slec. producto', selected: true }
        })
        .val(null)
        .trigger('change');
    }
  }
});

$(document).ready(function () {
  $('#hidelecte, .public, #carga').hide();
  $('input').prop('autocomplete', 'off');

  $('#crearproducto').submit(function (e) {
    e.preventDefault();

    /* $('#recibos1 .montos').each(function () {
          $(this).val(noCifra($(this).val()));
        }); */
    // document.getElementById('crearproducto')
    var formData = new FormData(this);

    $.ajax({
      url: '/products',
      data: formData,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
      beforeSend: function () {
        $('#carga').show('slow');
      },
      success: function (data) {
        prices.ajax.reload(function (json) {
          prices_combo.ajax.reload(null, false);
          SMSj('success', 'Producto creado exitosamente');
          $('#ModalEventos').modal('hide');
          changeOptions();
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

  $('#option2').on('change', function () {
    if (this.checked) {
      $('.mesa').button('toggle');
    }

    $(
      `<div class='form-row mt-3'>` +
        mesas
          .map(
            e => `<div class="col-12 col-md-4 mb-2">
                  <div class="btn-group-toggle mesa" data-toggle="buttons">
                    <label class="btn btn-outline-${e.orden ? 'primary' : 'success'} btn-block">
                      <input type="checkbox" name="mesa" value="${e.id}"> 
                      ${e.name} ${e.numero}
                    </label>
                  </div>
                </div>`
          )
          .join('\n') +
        `</div>`
    ).insertAfter('#sesion');
  });

  $('.form-check-input').on('change', function () {
    setParams(this);
  });

  $('.select2').on('change', function () {
    setOptions(this);
  });

  $('.img').click(() => $('#inputFile').click());

  $('#inputFile').on('change', function (event) {
    var file = event.target.files[0]; // Obtener el primer archivo seleccionado
    var reader = new FileReader();

    reader.onload = function (event) {
      $('#imagen').prop('src', event.target.result);
    };

    reader.readAsDataURL(file); // Leer el contenido del archivo como una URL de datos
  });

  $('#deleteImage').on('click', function () {
    $('#inputFile').val(null);
    $('#imagen').prop('src', '/img/subir.png');
  });
});

const prices = $('#prices').DataTable({
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
      text: `<i class="align-middle mr-2" data-feather="plus"></i> <span class="align-middle">Combo | Producto</span>`,
      attr: {
        'data-toggle': 'modal',
        'data-target': '#AddProduct',
        title: 'Combo | Producto'
      },
      className: 'btn btn-outline-dark'
    }
  ],
  deferRender: true,
  paging: true,
  autoWidth: true,
  search: {
    regex: true
    // caseInsensitive: true
  },
  responsive: {
    details: {
      type: 'column'
    }
  },
  columnDefs: [
    { className: 'control', orderable: true, targets: 0 },
    { responsivePriority: 1, targets: [2, 3, 4, -1] }
  ],
  order: [[2, 'asc']],
  language: languag2,
  ajax: {
    method: 'GET',
    url: '/products/table',
    dataSrc: 'data'
  },
  columns: [
    { data: null, defaultContent: '' },
    { data: 'id' },
    { data: 'nombre' },
    { data: 'laboratorio' },
    { data: 'clase' },
    { data: 'cantidad', defaultContent: '1' },
    { data: 'name' },
    { data: 'precio', render: $.fn.dataTable.render.number('.', '.', 0, '$') },
    {
      data: null,
      render: () => `<a class="eliminar"><i class="fas fa-trash"></i></a>
                         <a class="editar"><i class="fas fa-edit"></i></a>`
    }
  ],
  initComplete: function (settings, { data }) {
    changeOptions();
    /* optionsCombos = data.map(e => ({
          id: e.id,
          text: `${e.nombre} - ${e.laboratorio} - ${e.clase} - ${e.name}`
        })); */
  }
});

const prices_combo = $('#prices_combo').DataTable({
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
      text: `<i class="align-middle mr-2" data-feather="plus"></i> <span class="align-middle">Combo | Producto</span>`,
      attr: {
        'data-toggle': 'modal',
        'data-target': '#AddProduct',
        title: 'Combo | Producto'
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
    { responsivePriority: 1, targets: [4, -1] },
    { visible: false, orderable: true, targets: [1, 2, 3] }
  ],
  fixedColumns: {
    leftColumns: 0
  },
  displayLength: 25,
  order: [[2, 'asc']],
  language: languag2,
  ajax: {
    method: 'GET',
    url: '/products/table/1',
    dataSrc: 'data'
  },
  columns: [
    { data: null, defaultContent: '' },
    { data: 'id' },
    { data: 'name' },
    { data: 'precio', render: $.fn.dataTable.render.number('.', '.', 0, '$') },
    {
      data: 'nombre',
      render: function (data, method, row) {
        return data ?? row.nam;
      }
    },
    {
      data: 'laboratorio',
      render: function (data, method, row) {
        return data ?? row.laboratory;
      }
    },
    {
      data: 'clase',
      render: function (data, method, row) {
        return data ?? row.class;
      }
    },
    { data: 'cantidad', defaultContent: '1' },
    {
      data: 'medida',
      render: function (data, method, row) {
        return measuring.find(e => e.val === data)?.tag ?? row.tipo;
      }
    },
    {
      data: 'valor',
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
      if (last !== row.id) {
        $(line).eq(i).before(`
              <tr class="group">
                <td colspan="6">
                  <div class="d-flex justify-content-between">
                    <div class="p-2">${row.id}</div>
                    <div class="p-2">${row.name}</div>
                    <div class="p-2">$${Cifra(row.precio)}</div>
                    <div class="p-2">
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

        last = row.id;
      }
    });
  }
});

prices.on('click', 'td .eliminar', function () {
  const fila = $(this).parents('tr');
  const { id } = prices.row(fila).data();
  let delets = [];
  let ids = [];
  prices_combo
    .rows()
    .data()
    .each((row, i) => {
      const search = delets.findIndex(e => e?.grupo == row.id);
      if (search < 0)
        delets.push({ grupo: row.id, name: row.name, combos: 1, exist: row.receta == id });
      else {
        const exist = delets[search]?.exist;
        delets[search].exist = exist || row.receta == id;
        delets[search].combos += 1;
      }
    });

  delets
    .filter(e => e.exist)
    .map(e => {
      if (e?.combos < 3) {
        ids.push(e.grupo);
        return alert(
          `El combo ${e.name} tambien seria eliminado, ya que contendra ${
            e?.combos - 1
          } solo articulo, y no esta permitido`
        );
      }
      return alert(`El Articulo tambien seria eliminado del combo ${e.name}`);
    });

  if (confirm('Seguro deseas eliminar este medicamento?')) {
    $.ajax({
      url: '/products/' + id,
      type: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify(ids),
      success: function (data) {
        if (data) {
          prices.ajax.reload(function (json) {
            prices_combo.ajax.reload(null, false);
            SMSj('success', 'Medicamento eliminado exitosamente');
            changeOptions();
          });
        } else {
          SMSj('error', 'No es posible eliminar este medicamento.');
        }
      }
    });
  }
});

prices.on('click', 'td .editar', function () {
  const fila = $(this).parents('tr');
  const data = prices.row(fila).data();
  const productos = $('#crearproducto').find('input, select, textarea, img');

  productos.each(function (index) {
    switch (this.type) {
      case 'select-one':
        return $(this).val(data[this.name]).trigger('change');
      case 'checkbox':
        return $(this).prop('checked', !!data[this.name]);
      case 'radio':
        return $(this).prop({
          checked: this.value === data[this.name],
          disabled: this.value !== data[this.name]
        });
      case undefined:
        return $(this).prop('src', data[this.id] ?? '/img/subir.png');
      case 'file':
        return;
      default:
        return (this.value = data[this.name]);
    }
  });

  $('#AddProduct').modal({ toggle: true, backdrop: 'static', keyboard: true });
});

prices_combo.on('click', 'td .editar', function () {
  $('#hidelecte').show();
  const productos = $('#crearproducto').find('input, select, textarea, img');

  const setRows = (productos, data) =>
    productos.each(function (index) {
      switch (this.type) {
        case 'select-one':
          return $(this).val(data[this.name]).trigger('change');
        case 'checkbox':
          return $(this).prop('checked', !!data.visible);
        case 'radio':
          return $(this).prop({
            checked: this.value === data[this.name],
            disabled: this.value !== data[this.name]
          });
        case undefined:
          return $(this).prop('src', data[this.id] ?? '/img/subir.png');
        case 'file':
          return;
        default:
          return (this.value = data[this.name]);
      }
    });

  prices_combo
    .rows()
    .data()
    .filter(e => e.id == this.id)
    .each((row, i) => {
      if (!i) {
        setParams({ value: row.type });
        return setRows(productos, row);
      }
      const elements = setProduct().find('input, select, textarea');
      setRows(elements, row);
    });

  $('#AddProduct').modal({ toggle: true, backdrop: 'static', keyboard: true });
});

prices_combo.on('click', 'td .eliminar', function () {
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
  const type = $('#type').val() ?? null;
  const idType = $('#idType').val() ?? null;

  if (type === 'mesa' && idType) {
    $('#option2').prop('checked', true);
    $('.mesa').button('toggle');
    $(`input[value="${idType}"]`).prop('checked', true);
  
});

$('#AddProduct').on('hidden.bs.modal', function (e) {
  $('#hidelecte').hide();
  $('#imagen').prop('src', '/img/subir.png');
  $('.rows_products, .hrs_products').remove();

  $('#crearproducto')
    .find('input, textarea')
    .each(function () {
      if (this.type === 'checkbox') return $(this).prop('checked', false).hide();
      else if (this.type === 'radio')
        return $(this).prop({ checked: this.id === 'a', disabled: false });

      this.value = null;
    });

  setParams({ value: null });

  $('.select2').find('option').prop('disabled', false).data('oldVal', null);
});

function setProduct(elem) {
  const element = !elem ? '.form-row:last' : $(elem).parents('.form-row');
  const newElemnt = $(addProduct).insertAfter(element);

  if (elem || check) {
    newElemnt
      .find('.select2')
      .prop('name', check === 'COMBO' ? 'receta' : 'articulo')
      .select2({
        allowClear: true,
        data: check === 'COMBO' ? optionsCombos : options,
        placeholder: { id: null, text: 'Slec. producto', selected: true }
      })
      .val(null)
      .trigger('change');

    $('.select2')
      .not(newElemnt.find('.select2'))
      .each(function () {
        if (this.value)
          newElemnt.find(`.select2 option[value="${this.value}"]`).prop('disabled', true);
      });
  }

  if (check === 'RECETA') $('.public').show();
  else $('.public').hide();

  newElemnt.find('.select2').on('change', function () {
    setOptions(this);
  });

  return newElemnt;
}

function setParams(elem) {
  const { value } = elem;
  check = value || null;
  if (value === 'COMBO') {
    $('.public').hide('slow');
    $('.plus').prop('disabled', false);
  } else if (value === 'RECETA') {
    $('.public').show('slow');
    $('.plus').prop('disabled', false);
  } else {
    $('.public').hide('slow');
    $('.plus').prop('disabled', true);
    $('.rows_products, .hrs_products').remove();
  }

  $('.select2')
    .each(function () {
      if (value === 'COMBO') this.name = 'receta';
      else this.name = 'articulo';

      $(this)
        .empty()
        .select2({
          dropdownParent: $(this).parent(),
          allowClear: true,
          data: value === 'COMBO' ? optionsCombos : options,
          placeholder: {
            id: null,
            text: 'SELECCIONE UN PRODUCTO',
            selected: true
          }
        });
    })
    .val(null)
    .trigger('change');
}

function setOptions(elem) {
  const oldVal = $(elem).data('oldVal') ?? null;

  if (elem.value)
    $('.select2').not($(elem)).find(`option[value="${elem.value}"]`).prop('disabled', true);
  if (oldVal) $('.select2').not($(elem)).find(`option[value="${oldVal}"]`).prop('disabled', false);
  else $(elem).data('oldVal', elem.value);
}

function changeOptions() {
  optionsCombos = [];
  prices
    .rows()
    .data()
    .map(e =>
      optionsCombos.push({
        id: e.id,
        text: `${e.nombre} - ${e.laboratorio} - ${e.clase} - ${e.name}`
      })
    );
}

function publicProduct(elem) {
  console.log($(elem).is(':checked'), 'si entro');
  const element = $(elem).next('input');
  element.val($(elem).is(':checked') ? 1 : 0);
}

function deleteProduct(elem) {
  const element = $(elem).parents('.form-row');
  element.prev('hr').remove();
  element.remove();
}
