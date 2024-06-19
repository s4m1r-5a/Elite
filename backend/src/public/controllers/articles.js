$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
const placeholder = { id: null, text: 'Slec. parametro', selected: true };
const options = [
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
  const first = $('#references .card:first .ref:first').length;
  return `<div class='d-flex flex-row align-items-center align-content-center flex-wrap ref' style="display: none;">
    <div class='p-2 col-6 col-md-6'>
      <select class='form-control params' name='key_${ref}' required></select>   
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
};

const ref = (ref, newRef = true) => {
  return `<div class='card shadow-lg mb-2 rounded position-relative overflow-auto referencia'>
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
      data-parent='#references'
    >
      ${
        newRef
          ? `<div class='d-flex flex-row align-items-center align-content-center flex-wrap'>
              <div class='p-2 col-6'>
                <input
                  class='form-control edi text-center num'
                  type='text'
                  name='ctd_${ref}'
                  placeholder='Ctd inicial'
                  required
                />
              </div>
              <div class='p-2 col-6'>
                <input
                  class='form-control edi text-center cifra'
                  type='text'
                  name='cost_${ref}'
                  placeholder='Coste inicial'
                  required
                />
              </div>
            </div>`
          : ''
      }
      
      <input type='hidden' name='ref' class="ref_id" value='${ref}' />
      ${fields(ref)}
    </div>
  </div>`;
};

const cant =
  num => `<a class="toolt" data-toggle="tooltip" data-html="true" title="<em>Doble</em> <u>click</u> para <b>ELIMINAR</b>">
  <input type='hidden' name='cantidades' value='${num}' />
  <span class="badge badge-primary">${num}</span>
</a>`;

$(document).ready(function () {
  $('#loading').hide();
  $('input').prop('autocomplete', 'off');
  measuring.map(e => $('.measuring').append(new Option(e.tag, e.val, false, false)));

  $('.params')
    .select2({ allowClear: true, data: options, placeholder })
    .val(null)
    .trigger('change');

  $('.cantidad')
    .keyup(function () {
      if (isNaN(this.value) || this.value.startsWith('0')) {
        this.value = null;
        $('#cantidad').prop('disabled', true);
        return;
      }
      $('#cantidad').prop('disabled', false);
    })
    .change(function () {
      const value = this.value;
      const isExist = $(`#cantidades input[value="${value}"]`).length;
      if (isExist) this.value = null;

      $(this).prop('required', !$(`#cantidades input`).length);
    });

  $('#cantidad').click(function () {
    $(this).prop('disabled', true);
    const value = $('.cantidad').val();
    const isExist = $(`#cantidades input[value="${value}"]`).length;
    $('input.cantidad').val(null).focus();
    if (!isExist) $('#cantidades').append(cant(value));
    $('.toolt')
      .tooltip({ boundary: 'window' })
      .dblclick(function () {
        $(this).tooltip('hide').remove();
      });
  });

  $('#creararticulo').submit(function (e) {
    e.preventDefault();
    $('#creararticulo .cifra').each(function () {
      this.value = noCifra(this.value);
    });

    const formData = $(this).find('input, select, textarea').serialize();

    $.ajax({
      url: '/articles',
      data: formData,
      type: 'POST',
      beforeSend: function () {
        $('#loading').show('slow');
      },
      success: function () {
        $('#AddProduct').modal('hide');
        articulos.ajax.reload(function () {
          SMSj('success', 'Articulo creado exitosamente');
          $('#creararticulo .data-basic')
            .find('input, textarea, select')
            .each(function () {
              return (this.value = null);
            });
        });
      },
      error: function () {
        SMSj('error', 'A ocurrido un error alintentar enviar el formulario');
      },
      complete: function () {
        $('#loading').hide('slow');
      }
    });
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
  const { id } = articulos.row(fila).data();
  if (confirm('Seguro deseas eliminar este articulo?')) {
    $.ajax({
      url: '/articles/' + id,
      type: 'DELETE',
      beforeSend: function (xhr) {
        $('#ModalEventos').modal({
          toggle: true,
          backdrop: 'static',
          keyboard: true
        });
      },
      success: function () {
        articulos.ajax.reload(function () {
          SMSj('success', 'Articulo eliminado exitosamente');
        });
      },
      error: function () {
        SMSj('error', 'No es posible eliminar el articulo.');
      },
      complete: function () {
        $('#ModalEventos').modal('hide');
      }
    });
  }
});

articulos.on('click', 'td .editar', async function () {
  const fila = $(this).parents('tr');
  const data = articulos.row(fila).data();
  // console.log(data, 'data');
  const articulo = $('#creararticulo .data-basic').find('input, textarea, select');
  articulo.each(function () {
    this.value = data[this.name];
  });

  data.cantidades.forEach(e => (e ? $('#cantidades').append(cant(e)) : ''));
  $('input.cantidad').val(null).prop('required', !data.cantidades.length).trigger('change');
  $('.toolt')
    .tooltip({ boundary: 'window' })
    .dblclick(function () {
      $(this).tooltip('hide').remove();
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
  if ($('#id').val()) $('.ini').hide();
});

$('#AddProduct').on('hidden.bs.modal', function (e) {
  $('#references .referencia, .toolt').remove();
  $('.referencia').find('.ref_id.ref').siblings().remove();

  $('#creararticulo .data-basic')
    .find('input, textarea, select')
    .each(function () {
      return (this.value = null);
    });
});

const setRows = (orders, data) => {
  orders.each(function () {
    switch (this.type) {
      case 'select-one' || 'select':
        $(this).val(data[this.name]).trigger('change');
        return;
      default:
        this.value = data?.[this.name] ?? null;
        return;
    }
  });
};

function setRef(id) {
  const code = id ?? ID(5);
  $('#references').append(ref(code, !id));
  const newElement = $('#references').find('.card:last').show('slow');
  newElement
    .find('.ref')
    .show('slow')
    .find('.params')
    .select2({ allowClear: true, data: options, placeholder })
    .val(null)
    .trigger('change');

  // $('.params')
  //   .not(newElement.find('.params'))
  //   .each(function () {
  //     if (this.value)
  //       newElement.find(`.params option[value="${this.value}"]`).prop('disabled', true);
  //   });

  newElement.find('.params').on('change', function () {
    setOptions(this);
  });

  $('.select2-container').css('width', '100%', 'important');

  $('.collapse').not(`#referencia_${code}`).collapse('hide');

  $(`#referencia_${code}`).collapse('show');

  $('.ini input').prop({ disabled: true, required: false, value: null });

  newElement
    .find('.cifra')
    .keyup(function () {
      this.value = currency(this.value, true);
    })
    .change(function () {
      if (!/[0-9]/.test(this.value)) this.value = null;
    })
    .focus(function () {
      this.select();
    });

  newElement
    .find('.num')
    .keyup(function () {
      if (isNaN(this.value) || this.value.startsWith('0')) {
        this.value = null;
        return;
      }
    })
    .change(function () {
      if (!/[0-9]/.test(this.value)) this.value = null;
    })
    .focus(function () {
      this.select();
    });

  newElement.find('.edi').on({
    focus: function () {
      $(this).css('background-color', '#FFFFCC');
    },
    blur: function () {
      $(this).css('background-color', '');
    }
  });

  return newElement.find('.ref');
}

function setProduct(elem, ref = 'krt') {
  const element = !elem ? $(`.${ref} .ref:last`) : $(elem).parents('.ref');
  const card = element.parents('.referencia');
  const code = card.find('.ref_id').val() ?? 'krt';
  const newElement = $(fields(code)).insertAfter(element).show('slow');

  newElement
    .find('.params')
    .select2({ allowClear: true, data: options, placeholder })
    .val(null)
    .trigger('change');

  card
    .find('.params')
    .not(newElement.find('.params'))
    .each(function () {
      if (this.value)
        newElement.find(`.params option[value="${this.value}"]`).prop('disabled', true);
    });

  newElement.find('.params').on('change', function () {
    setOptions(this);
  });

  newElement.find('.edi').on({
    focus: function () {
      $(this).css('background-color', '#FFFFCC');
    },
    blur: function () {
      $(this).css('background-color', '');
    }
  });

  $('.select2-container').css('width', '100%', 'important');

  return newElement;
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
        if ($('#references .referencia').length < 2)
          $('.ini input').prop({ disabled: false, required: true, value: null });
        $(this).remove();
      })
    : element.hide('slow', function () {
        if (value) card.find(`.params option[value="${value}"]`).prop('disabled', false);
        $(this).remove();
      });
}

const listaPrecios = () => {
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
