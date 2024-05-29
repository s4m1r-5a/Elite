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

const fields = `<div class='d-flex flex-row align-items-center align-content-center flex-wrap ref' style="display: none;">
<div class='p-2 col-6 col-md-6'>
  <input type='hidden' name='code' />
  <select class='form-control params' name='ref.key' required></select>
</div>
<div class='p-2 col-6 col-md-6'>
  <div class='input-group'>
    <input
      class='form-control edi'
      type='text'
      name='ref.value'
      placeholder='Nota producto'
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
          <a class='dropdown-item' href='#' onclick='deleteProduct(this)'>
            <i class='fas fa-fw fa-trash-alt'></i>
            Eliminar
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
</div>`;

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
    ${fields}
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
      url: '/articles/medicamentos',
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
      text: `<i class="align-middle mr-2" data-feather="plus"></i> <span class="align-middle">Crear Articulo</span>`,
      attr: {
        'data-toggle': 'modal',
        'data-target': '#AddProduct',
        title: 'Agregar Articulo',
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

$('#AddProduct').on('shown.bs.modal', function (e) {
  if (!$('#id').val()) $('.title').text(`---Referencia #${ID(5)}--------------`);
});

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

function setRef(elem) {
  const code = ID(5);
  const element = !elem ? '.card:last' : $(elem).parents('#referencias').find('.card:last');
  const newElemnt = $(ref(code)).insertAfter(element).show('slow');

  if (elem || check) {
    newElemnt
      .find('.ref')
      .show('slow')
      .find('.params')
      .select2({ allowClear: true, data: options, placeholder })
      .val(null)
      .trigger('change');

    $('.params')
      .not(newElemnt.find('.params'))
      .each(() => {
        if (this.value)
          newElemnt.find(`.params option[value="${this.value}"]`).prop('disabled', true);
      });
  }

  newElemnt.find('.params').on('change', function () {
    setOptions(this);
  });

  $('.select2-container').css('width', '100%', 'important');

  $('.collapse').not(`#referencia_${code}`).collapse('hide');

  $(`#referencia_${code}`).collapse('show');

  return newElemnt;
}

function setProduct(elem, ref = 'krt') {
  const element = !elem ? $(`.${ref} .ref:last`) : $(elem).parents('.ref');
  const newElemnt = $(fields).insertAfter(element).show('slow');
  const card = element.parents('.referencia');

  if (elem || check) {
    newElemnt
      .find('.params')
      .select2({ allowClear: true, data: options, placeholder })
      .val(null)
      .trigger('change');

    card
      .find('.params')
      .not(newElemnt.find('.params'))
      .each(function () {
        console.log(this.value, this.name, this.type);
        if (this.value)
          newElemnt.find(`.params option[value="${this.value}"]`).prop('disabled', true);
      });
  }

  newElemnt.find('.params').on('change', function () {
    setOptions(this);
  });

  $('.select2-container').css('width', '100%', 'important');

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
  const card = $(elem).parents('.referencia');

  if (elem.value)
    card.find('.params').not($(elem)).find(`option[value="${elem.value}"]`).prop('disabled', true);
  if (oldVal)
    card.find('.params').not($(elem)).find(`option[value="${oldVal}"]`).prop('disabled', false);
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
