$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
const product = $('.select2');
let options = [];
let optionsCombos = [];
let check = null;
const addProduct = `
    <hr class="mt-0 hrs_products" />
    <div class='form-row rows_products'>
      <div class='form-group col-9 col-md-4'>
        <input type="hidden" name="code">
        <select class='form-control select2' placeholder='Slec. producto' name='articulo' required>
        </select>
      </div>
      <div class='form-group col-3 col-md-2'>
        <input type='text' id='cantidad' class='form-control' name='cantidad' placeholder='Cant.' required />
      </div>
      <div class='form-group col-12 col-md-6'>
        <div class='input-group'>
          <div class='input-group-prepend' title='publicar este item'>
            <div class='input-group-text'>
            <input type='checkbox' class='public' onclick='publicProduct(this)' />
            <input type='hidden' name='visible' value='0' />
            </div>
          </div>
          <input id='price' class='form-control valor' type='text' name='nota' placeholder='Nota del producto' />
          <div class='input-group-append'>
            <button class='btn btn-outline-danger' onclick='deleteProduct(this)'>
              <i class='fas fa-fw fa-trash'></i>
            </button>
            <button class='btn btn-outline-primary' onclick='setProduct(this)'>
              <i class='fas fa-fw fa-plus'></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;

$(document).ready(function () {
  $('#carga, #status_off').hide();
  $('input').prop('autocomplete', 'off');

  $('#crearproducto').submit(function (e) {
    e.preventDefault();

    /* $('#recibos1 .montos').each(function () {
          $(this).val(noCifra($(this).val()));
        }); */
    // document.getElementById('crearproducto')
    var formData = new FormData(this);

    $.ajax({
      url: '/shops',
      data: formData,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
      beforeSend: function () {
        $('#carga').show('slow');
      },
      success: function (data) {
        shops.ajax.reload(function (json) {
          SMSj('success', 'Comercio creado exitosamente');
          $('#AddProduct').modal('hide');
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

  $('.img').click(() => $('#inputFile').click());

  $('#inputFile').on('change', function (event) {
    var file = event.target.files[0]; // Obtener el primer archivo seleccionado
    var reader = new FileReader();

    reader.onload = function (event) {
      $('#imagen').prop('src', event.target.result);
    };

    reader.readAsDataURL(file); // Leer el contenido del archivo como una URL de datos
  });

  $('#estado').on('change', function (event) {
    let on = '#status_';
    let off = on;

    if (this.checked) (on += 'on'), (off += 'off'), (this.value = 1);
    else (on += 'off'), (off += 'on'), (this.value = 0);

    $(on).show('slow');
    $(off).hide('slow');
  });

  $('#deleteImage').on('click', function () {
    $('#inputFile').val(null);
    $('#imagen').prop('src', '/img/subir.png');
  });
});

const shops = $('#shops').DataTable({
  dom: 'Bfrtip',
  lengthMenu: [
    [10, 25, 50, -1],
    ['10 filas', '25 filas', '50 filas', 'Ver todo']
  ],
  buttons: [
    {
      text: `<i class="align-middle mr-2" data-feather="home"></i>`,
      attr: {
        title: 'Buscar comercios cerca'
      },
      className: 'btn btn-outline-dark',
      action: function () {
        $('#ModalEventos').modal('show');
        $('#AddProduct').modal('hide');
        getLocation()
          .then(({ latitude, longitude }) => {
            shops.ajax.url(`/shops/table/${latitude}/${longitude}`).load(function () {
              shops.columns.adjust().responsive.recalc();
              $('#ModalEventos').modal('hide');
            });
          })
          .catch(error => {
            console.error('Error al obtener las coordenadas:', error);
          });
      }
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
    url: '/shops/table',
    dataSrc: 'data'
  },
  columns: [
    { data: null, defaultContent: '' },
    { data: 'id' },
    { data: 'nombre' },
    { data: 'nit', defaultContent: 'Sin registro' },
    { data: 'movil' },
    { data: 'email', defaultContent: 'sininfo@noinfo.com' },
    { data: 'metros', defaultContent: 'Sin calcular' },
    { data: 'direccion' },
    { data: 'fullName', defaultContent: 'No registra' },
    { data: 'fullname' },
    { data: 'creado' },
    { data: 'estado' },
    {
      data: null,
      render: () => `<a class="eliminar"><i class="fas fa-trash"></i></a> |
                         <a class="editar"><i class="fas fa-edit"></i></a> |
                         <a class="compartir"><i class="fas fa-share-alt"></i></a>`
    }
  ]
});

shops.on('click', 'td .eliminar', function () {
  const fila = $(this).parents('tr');
  const { id } = shops.row(fila).data();
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
      url: '/market/precios/' + id,
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

shops.on('click', 'td .editar', function () {
  const fila = $(this).parents('tr');
  const data = shops.row(fila).data();
  const shops = $('#crearproducto').find('input, select, textarea, img');

  shops.each(function (index) {
    switch (this.type) {
      case 'checkbox':
        return $(this)
          .prop('checked', !!(data[this.name] * 1))
          .val(data[this.name]);
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

$('#AddProduct').on('hidden.bs.modal', function (e) {
  $('#imagen').prop('src', '/img/subir.png');

  $('#crearproducto')
    .find('input, textarea')
    .each(function () {
      if (this.type === 'checkbox') return $(this).prop('checked', false);
      else if (this.type === 'radio')
        return $(this).prop({ checked: this.id === 'a', disabled: false });

      this.value = null;
    });
});

function consultarDocu() {
  const num = $('#docNumber').val();
  const type = $('#docType').val() ?? 'CC';
  $.ajax({
    url: '/consults/document/' + type + '/' + num,
    type: 'GET',
    beforeSend: function () {
      $('#carga').show('slow');
    },
    success: function (data) {
      $('#person').val(data?.id || null);
      $('#fullName')
        .prop('readonly', true)
        .val(data?.fullName || null);
    },
    error: function (data) {
      $('#person').val(null);
      $('#fullName').prop('readonly', false).focus();
      SMSj('error', 'No se encontro el documento');
    },
    complete: function () {
      $('#carga').hide('slow');
    }
  });
}

function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, ...rest } = position.coords;
          $('#latitud').val(latitude);
          $('#longitud').val(longitude);
          console.log({ latitude, longitude, rest });
          resolve({ latitude, longitude });
        },
        error => {
          reject(error);
        }
      );
    } else {
      reject('La geolocalización no es soportada por este navegador.');
    }
  });
}

function deleteProduct(elem) {
  const element = $(elem).parents('.form-row');
  element.prev('hr').remove();
  element.remove();
}
