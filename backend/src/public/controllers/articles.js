$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');

$(document).ready(function () {
  $('#hidelecte, .public, #carga').hide();
  $('input').prop('autocomplete', 'off');
  measuring.map(e => $('.measuring').append(new Option(e.tag, e.val, false, false)));

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
