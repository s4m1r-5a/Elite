$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
const placeholder = { id: null, text: 'Slec. parametro', selected: true };
const options = [
  { id: 'Cantidad', text: 'Cantidad' },
  { id: 'Talla', text: 'Talla' },
  { id: 'Color', text: 'Color' },
  { id: 'Marca', text: 'Marca' },
  { id: 'Clase', text: 'Clase' },
  { id: 'Laboratorio', text: 'Laboratorio' },
  { id: 'Modelo', text: 'Modelo' },
  { id: 'Material', text: 'Material' },
  { id: 'Sabor', text: 'Sabor' },
  { id: 'Fragancia', text: 'Fragancia' },
  { id: 'Capacidad', text: 'Capacidad' },
  { id: 'Durabilidad', text: 'Durabilidad' },
  { id: 'Estilo', text: 'Estilo' },
  { id: 'Eficiencia', text: 'Eficiencia' },
  { id: 'Serie', text: 'Serie' },
  { id: 'Tipo', text: 'Tipo' }
];

const fields = ref => {
  const first = $('#referencias .card:first .ref:first').length;
  const id = !!$('#id').val();
  return `<div class='d-flex flex-row align-items-center align-content-center flex-wrap ref' style="display: none;">
    <div class='p-2 col-6 col-md-6'>
      ${
        first || id
          ? `<select class='form-control params' name='key_${ref}' required></select>`
          : `<input type='hidden' name='key_${ref}' value='Cantidad' /> Cantidad`
      }      
    </div>
    <div class='p-2 col-6 col-md-6'>
      <div class='input-group'>
        <input
          class='form-control edi'
          type='text'
          name='value_${ref}'
          placeholder='Valor'
        />
        <div class='input-group-append'>
          <div class='dropdown'>
            <button class='btn btn-primary plus' data-toggle='dropdown' aria-expanded='false'>
              <i class='feather-lg' data-feather='more-vertical'></i>
              <i class='fas fa-fw fa-ellipsis-v' style="font-size: 11px;"></i>
            </button>

            <div class='dropdown-menu'>
              <a class='dropdown-item' href='#' onclick='setProduct(this)'>
                <i class='fas fa-fw fa-plus'></i>
                Nuevo
              </a>
              <a class='dropdown-item ${
                first ? '' : 'disabled'
              }' href='#' onclick='deleteProduct(this)'>
                <i class='fas fa-fw fa-trash-alt'></i>
                Eliminar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

const ref = ref => {
  return `<div class='card shadow-lg mb-2 rounded position-relative overflow-auto referencia' style="display: none;">
    <div
      class='d-flex align-items-center align-content-center flex-wrap'
      type='button'
      data-toggle='collapse'
      data-target='#referencia_${ref}'
      aria-expanded='false'
      aria-controls='referencia_${ref}'
      style='background-color: #FCF3CF !important;'
    >
      <div class='p-2 flex-grow-1 bd-highlight'>---Referencia #${ref}--------------</div>
      <div class='p-2 bd-highlight'>
        <a><i class='fas fa-fw fa-angle-down'></i></a>
      </div>
    </div>

    <div
      id='referencia_${ref}'
      class='collapse show px-2'
      aria-labelledby='headingOne'
      data-parent='#referencias'
    >
      <input type='hidden' name='ref' class="ref_id" value='${ref}' />
      ${fields(ref)}
    </div>
  </div>`;
};

$(document).ready(function () {
  $('#hidelecte, .public, #carga').hide();
  $('input').prop('autocomplete', 'off');
  measuring.map(e => $('.measuring').append(new Option(e.tag, e.val, false, false)));

  $('.params')
    .select2({ allowClear: true, data: options, placeholder })
    .val(null)
    .trigger('change');

  $('#crearproducto').submit(function (e) {
    e.preventDefault();
    var formData = new FormData(document.getElementById('crearproducto'));

    $.ajax({
      url: '/articles',
      data: formData,
      type: 'POST',
      processData: false,
      contentType: false,
      beforeSend: function (xhr) {
        $('#ModalEventos').modal({
          toggle: true,
          backdrop: 'static',
          keyboard: true
        });
      },
      success: function (data) {
        if (data) {
          products.ajax.reload(null, false);
          SMSj('success', 'Producto creado exitosamente');
          $('#crearproducto input, select').val(null);
          $('#ModalEventos').modal('hide');
          $('#addProd').show('slow');
          $('#addProduct').hide('slow');
        }
      }
    });
  });

  $('#cerrarproducto').click(function () {
    $('#addProd').show('slow');
    $('#addProduct').hide('slow');
    $('#crearproducto').trigger('reset');
  });
});

const products = $('#products').DataTable({
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
        listaPrecio();
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
      text: `<i class="align-middle mr-2" data-feather="plus"></i> <span class="align-middle">Crear Medicamento</span>`,
      attr: {
        title: 'Agregar Medicamento',
        id: 'addProd'
      },
      className: 'btn btn-outline-dark',
      action: function () {
        $('#addProd').hide('slow');
        $('#addProduct').show('slow');
        $('#cerrarcompra, #cerrarfactura').trigger('click');
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
    { responsivePriority: 1, targets: [2, 3, 4, -1] }
  ],
  order: [[2, 'asc']],
  language: languag2,
  ajax: {
    method: 'GET',
    url: '/articles/medicamentos',
    dataSrc: 'data'
  },
  columns: [
    {
      data: null,
      defaultContent: ''
    },
    { data: 'id' },
    { data: 'nombre' },
    { data: 'tipo' },
    { data: 'medida' },
    {
      data: 'cantidad',
      defaultContent: '1'
    },
    { data: 'laboratorio' },
    { data: 'clase' },
    { data: 'invima' },
    {
      data: 'creado',
      render: function (data, method, row) {
        return data ? moment(data).format('YYYY-MM-DD') : '';
      }
    },
    {
      data: 'id',
      render: function (data, method, row) {
        return `<a class="eliminar"><i class="fas fa-trash"></i></a>
          <a class="editar"><i class="fas fa-edit"></i></a>`;
      }
    }
  ]
});

products.on('click', 'td .eliminar', function () {
  const fila = $(this).parents('tr');
  const { id } = products.row(fila).data();
  if (confirm('Seguro deseas eliminar este medicamento?')) {
    $.ajax({
      url: '/links/medicamentos/' + id,
      type: 'DELETE',
      success: function (data) {
        if (data) {
          products.ajax.reload(null, false);
          SMSj('success', 'Medicamento eliminado exitosamente');
        } else {
          SMSj('error', 'No es posible eliminar este medicamento.');
        }
      }
    });
  }
});

products.on('click', 'td .editar', function () {
  const fila = $(this).parents('tr');
  const data = products.row(fila).data();
  const editProducto = $('#crearproducto').find('input, select');
  $('#addProd').trigger('click');
  editProducto.each(function (e, i, a) {
    this.value = data[this.name];
  });
});

const articulos = $('#articulos').DataTable({
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
        listaPrecio();
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
      text: `<i class="align-middle mr-2" data-feather="plus"></i> <span class="align-middle">Crear Articulo</span>`,
      attr: {
        'data-toggle': 'modal',
        'data-target': '#AddProduct',
        title: 'Agregar Articulo',
        id: 'addProd'
      },
      className: 'btn btn-outline-dark'
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
    { responsivePriority: 1, targets: [2, 1, -1] }
  ],
  order: [[2, 'asc']],
  language: languag2,
  ajax: {
    method: 'GET',
    url: '/articles/table',
    dataSrc: 'data'
  },
  columns: [
    {
      data: null,
      defaultContent: ''
    },
    { data: 'id' },
    { data: 'nombre' },
    { data: 'estado' },
    {
      data: 'creado',
      render: function (data, method, row) {
        return data ? moment(data).format('YYYY-MM-DD') : '';
      }
    },
    { data: 'descripcion' },
    {
      data: 'id',
      render: function (data, method, row) {
        return `<a class="eliminar"><i class="fas fa-trash"></i></a>
          <a class="editar"><i class="fas fa-edit"></i></a>`;
      }
    }
  ]
});

articulos.on('click', 'td .eliminar', function () {
  const fila = $(this).parents('tr');
  const { id } = products.row(fila).data();
  if (confirm('Seguro deseas eliminar este medicamento?')) {
    $.ajax({
      url: '/links/medicamentos/' + id,
      type: 'DELETE',
      success: function (data) {
        if (data) {
          products.ajax.reload(null, false);
          SMSj('success', 'Medicamento eliminado exitosamente');
        } else {
          SMSj('error', 'No es posible eliminar este medicamento.');
        }
      }
    });
  }
});

articulos.on('click', 'td .editar', async function () {
  const fila = $(this).parents('tr');
  const data = articulos.row(fila).data();
  const articulo = $('#crearproducto .data-basic').find('input, select');
  articulo.each(function () {
    this.value = data[this.name];
  });

  if (data.referencias.length) {
    for (const referencia of data.referencias) {
      const { ref, obj } = referencia;
      let elements = await setRef(ref).find('input, select');
      const arr = await Object.entries(obj).map(e => ({
        ['key_' + ref]: e[0],
        ['value_' + ref]: e[1]
      }));

      for (const [i, e] of arr.entries()) {
        elements = !i ? elements : await setProduct(elements[1], ref).find('input, select');
        await setRows(elements, e);
      }
    }
  }

  if (data.caracteristicas) {
    const krt = Object.entries(data.caracteristicas).map(e => ({ key_krt: e[0], value_krt: e[1] }));
    krt.forEach(e => setRows(setProduct().find('input, select'), e));
  }

  $('#AddProduct').modal({ toggle: true, backdrop: 'static', keyboard: true });
});

$('#AddProduct').on('shown.bs.modal', function (e) {
  if (!$('#id').val()) setRef();
});

$('#AddProduct').on('hidden.bs.modal', function (e) {
  $('#referencias .referencia').remove();
  $('.referencia').find('.ref_id.ref').siblings().remove();

  $('#crearproducto .data-basic')
    .find('input, textarea, select')
    .each(function () {
      return (this.value = null);
    });
});

const setRows = (orders, data) => {
  orders.each(function () {
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

var listaPrecio = () => {
  $.ajax({
    url: '/links/listadeprecio',
    type: 'POST',
    success: function (data) {
      if (data) {
        window.open(data, '_blank');
      }
    }
  });
};

function setRef(id) {
  const code = id ?? ID(5);
  $('#referencias').append(ref(code));
  const newElemnt = $('#referencias').find('.card:last').show('slow');

  newElemnt
    .find('.ref')
    .show('slow')
    .find('.params')
    .select2({ allowClear: true, data: options, placeholder })
    .val(null)
    .trigger('change');

  $('.params')
    .not(newElemnt.find('.params'))
    .each(function () {
      if (this.value)
        newElemnt.find(`.params option[value="${this.value}"]`).prop('disabled', true);
    });

  newElemnt.find('.params').on('change', function () {
    setOptions(this);
  });

  $('.select2-container').css('width', '100%', 'important');

  $('.collapse').not(`#referencia_${code}`).collapse('hide');

  $(`#referencia_${code}`).collapse('show');

  return newElemnt.find('.ref');
}

function setProduct(elem, ref = 'krt') {
  const element = !elem ? $(`.${ref} .ref:last`) : $(elem).parents('.ref');
  const card = element.parents('.referencia');
  const code = card.find('.ref_id').val();
  const newElemnt = $(fields(code)).insertAfter(element).show('slow');

  newElemnt
    .find('.params')
    .select2({ allowClear: true, data: options, placeholder })
    .val(null)
    .trigger('change');

  card
    .find('.params')
    .not(newElemnt.find('.params'))
    .each(function () {
      if (this.value)
        newElemnt.find(`.params option[value="${this.value}"]`).prop('disabled', true);
    });

  newElemnt.find('.params').on('change', function () {
    setOptions(this);
  });

  $('.select2-container').css('width', '100%', 'important');

  return newElemnt;
}

function setOptions(elem) {
  const oldVal = $(elem).data('oldVal') ?? null;
  const card = $(elem).parents('.referencia');

  if (elem.value)
    card.find('.params').not($(elem)).find(`option[value="${elem.value}"]`).prop('disabled', true);
  if (oldVal)
    card.find('.params').not($(elem)).find(`option[value="${oldVal}"]`).prop('disabled', false);
  else $(elem).data('oldVal', elem.value);
}

function deleteProduct(elem) {
  const element = $(elem).parents('.ref');
  const card = element.parents('.referencia');
  const check = card.hasClass('krt');
  const value = element.find('.params').val();

  card.find('.ref').length === 1 && !check
    ? card.hide('slow', function () {
        $(this).remove();
      })
    : element.hide('slow', function () {
        if (value) card.find(`.params option[value="${value}"]`).prop('disabled', false);
        $(this).remove();
      });
}
