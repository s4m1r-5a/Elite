$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
const placeholder = { id: null, text: 'Slec. parametro', selected: true };
let options = [
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
const fields3 = ref => {
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
const fields2 = ref => {
  const first = $('#references .card:first .ref:first').length;
  return `<li class="list-group-item list-group-item-action d-flex align-items-center shadow-lg mb-2 p-1 rounded ref" style="display: none;">
    <div class="flex-grow-1 d-flex align-items-center flex-wrap">
      <div class="p-0 col-10 col-md-5 order-0">
        <select class="form-control params" name="key_${ref}" required></select>   
      </div>    
      <div class="input-group px-0 px-md-2 col-12 col-md-5 w-100 order-2 order-md-1 mt-2 mt-md-0">
        <input
          class='form-control edi values'
          type='text'
          name='value_${ref}'
          placeholder='Valor'
          required
        />
        <div class='input-group-append'>
          <button id='cantidad' type='button' class='btn btn-primary'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
        </div>
      </div>        
      <a class="col-2 text-center w-100 order-1 order-md-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-24 feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>          
      </a>
    </div>   
    <a class="minctd px-2 ml-3 ml-md-0 border-left border-dark">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-24 feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>        
    </a> 
  </li>`;
};
const fields = ref => {
  const first = $('#references .card:first .ref:first').length;
  return `<li class="list-group-item list-group-item-action d-flex align-items-center flex-wrap shadow-lg mb-2 p-1 rounded ref" style="display: none;">
    <div class="p-0 col-5">
      <select class="form-control params" name="tag_${ref}" required></select>   
    </div>    
    <div class="input-group p-0 pl-1 col-7 w-100">
      <input
        class='form-control edi values'
        type='text'
        name='values_${ref}'
        placeholder='Valor'
        required
      />
      <div class='input-group-append'>
        <div class="btn-group">
          <button type="button" class="btn btn-warning newItem" style="z-index: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
          <button type="button" class="btn btn-warning dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false" style="z-index: 0;">
            <span class="sr-only">Toggle Dropdown</span>
          </button>
          <div class="dropdown-menu">
            <a class='dropdown-item' href='#'>
              <i class='fas fa-fw fa-plus'></i> Nuevo item
            </a>
            <a class='dropdown-item' href='#' onclick='setProduct(this)'>
              <i class='fas fa-fw fa-plus'></i> Nuevo atributo
            </a>
            <div class="dropdown-divider"></div>
            <a class='dropdown-item' href='#' onclick='deleteProduct(this)'>
              <i class='fas fa-fw fa-trash-alt'></i>
              Eliminar
            </a>
          </div>
        </div>
      </div>
    </div> 
    <div class="p-0 pt-2 col-12 items" style="display: none;"></div> 
  </li>`;
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

const valuesItems = (code, ref, val) => {
  return `<div class="toolt d-inline-flex mr-1" data-toggle="tooltip" data-html="true" title="<em>Doble</em> <u>click</u> para <b>ELIMINAR</b>">
  <input type="hidden" class="value" name="value_${ref}" value="${val}" />
  <input type="hidden" class="code" name="code_${ref}" value="${code}" />
  <span class="badge badge-primary d-inline-flex align-items-center" style="border-radius: 10rem;">
    <a class="delItem pr-1 border-right mr-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-sm feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
    </a>
    <span class="mr-2">${val}</span>
  </span>
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
    .keypress(function (event) {
      if (event.which == 13) {
        event.preventDefault();
        $(this).trigger('change');
        $('#cantidad').trigger('click');
      }
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
        /* $('#AddProduct').modal('hide');
        articulos.ajax.reload(function () {
          SMSj('success', 'Articulo creado exitosamente');
          $('#creararticulo .data-basic')
            .find('input, textarea, select')
            .each(function () {
              return (this.value = null);
            });
        }); */
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

  // if (data?.referencias?.length) {
  //   for (const referencia of data.referencias) {
  //     const { ref, obj } = referencia;
  //     let elements = await setRef(ref).find('input, select');
  //     const arr = await Object.entries(obj).map(e => ({
  //       ['key_' + ref]: e[0],
  //       ['value_' + ref]: e[1]
  //     }));

  //     for (const [i, e] of arr.entries()) {
  //       elements = !i ? elements : await setProduct(elements[1], ref).find('input, select');
  //       await setRows(elements, e);
  //     }
  //   }
  // }

  if (data.caracteristicas) {
    const obj = data.caracteristicas;
    for (let prop in obj) {
      const ref = ID(5);
      options = [...options.filter(e => e.id !== prop), { id: prop, text: prop }];
      console.log({ options });
      element = setProduct(null, ref);
      setRows(element.find('select, input'), {
        [`tag_${ref}`]: prop,
        [`values_${ref}`]: obj[prop]
      });
    }
  }

  if (data.opciones.length) {
    let element = null;
    let item = null;
    let ref = null;
    data.opciones.forEach(({ code, tag, value }) => {
      if (item !== tag) {
        ref = ID(5);
        options = [...options.filter(e => e.id !== tag), { id: tag, text: tag }];
        console.log({ options });
        element = setProduct(null, ref);
        setRows(element.find('select'), { [`tag_${ref}`]: tag });
      }
      setItems(element, ref, value, code);
      item = tag;
    });
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

function setItems(element, ref, value, code = '') {
  element.find('.items').show('slow').append(valuesItems(code, ref, value));

  element
    .find('.toolt')
    .tooltip({ boundary: 'window' })
    .dblclick(function () {
      $(this).tooltip('hide').remove();
    })
    .find('.delItem')
    .click(function () {
      $(this).parents('.toolt').tooltip('hide').remove();
    })
    .hover(
      function () {
        $(this).css('color', '#000000');
      },
      function () {
        $(this).css('color', 'unset');
      }
    );

  element.find('input.values').prop('required', !element.find('.items input.value').length);
}

function setProduct(elem, ref) {
  ref = ref ?? ID(5);
  const element = !elem ? $(`.krt .ref:last`) : $(elem).parents('.ref');
  const card = element.parents('.referencia');
  const newElement = $(fields(ref)).insertAfter(element).show('slow');

  newElement
    .find('.params')
    .select2({ tags: true, allowClear: true, data: options, placeholder })
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

  newElement
    .find('.values')
    .keyup(function () {
      if (!this.value || this.value == 0) {
        this.value = null;
        return newElement.find('.newItem').prop('disabled', true);
      }
      return newElement.find('.newItem').prop('disabled', false);
    })
    .keypress(function (event) {
      if (event.which == 13) {
        event.preventDefault();
        $(this).trigger('change');
        newElement.find('.newItem').trigger('click');
      }
    })
    .change(function () {
      const value = this.value;
      const isExist = newElement.find(`.items input[value="${value}"].value`).length;
      if (isExist) this.value = null;
    });

  newElement.find('.newItem').on('click', function () {
    $(this).prop('disabled', true);
    const input = $(this).parents('.input-group').find('.values');
    const value = input.val();
    const isExist = newElement.find(`.items input[value="${value}"].value`).length;
    input.val(null).focus();
    if (!isExist) setItems(newElement, ref, value);
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
