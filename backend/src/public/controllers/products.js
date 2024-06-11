$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
const product = $('.select2');
let options = [];
let optionsCombos = [];
let caritems = [];
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
              <div class='dropdown imgref' style='display: none;'>
                <a class='img2' type='button' data-toggle='dropdown' aria-expanded='false'>
                  <i class='fas fa-image'></i>
                </a>
                <input class='imagen' type='file' name='imagen-${
                  $('.select2').length
                }' style='display: none;' />

                <div class='dropdown-menu p-2'>
                  <div class='d-flex align-items-start flex-column'>
                    <a class='r atras deleteImage'>
                      <i class='fas fa-fw fa-trash'></i>
                    </a>
                    <div class=''>
                      <img src='/img/subir.png' class='img-fluid imagen' alt='img' />
                    </div>
                  </div>
                </div>
              </div>             
            </div>
          </div>
          <input class='form-control edi nota' type='text' name='nota' placeholder='Nota del producto' />
          <div class='input-group-append'>
            <button type='button' class='btn btn-outline-danger' onclick='deleteProduct(this)'>
              <i class='fas fa-fw fa-trash'></i>
            </button>
            <button type='button' class='btn btn-outline-primary' onclick='setProduct(this)'>
              <i class='fas fa-fw fa-plus'></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;

$.ajax({
  url: '/articles/list',
  type: 'GET',
  processData: false,
  contentType: false,
  success: function ({ data }) {
    if (data.length) {
      options = data.map(e => ({
        id: e.id,
        text: `${e.nombre} - ${e.categoria} - ${e.ref}`
      }));

      $('.select2')
        .select2({
          allowClear: true,
          data: options,
          placeholder: { id: null, text: 'Slec. producto', selected: true }
        })
        .val(null)
        .trigger('change');

      // $('#crearcompra').trigger('reset');
      // droga.val(null).trigger('change');
    }
  }
});

const selects = element => {
  if (Array.isArray(element))
    return `<select class="linkSelect">
      <option value="" selected>seleccione</option>
      ${element.map(e => `<option value="${e.ref}">${e.value}</option>`)}
    </select>`;
  return element;
};

const producto = data => {
  const { name, imagen, precio, items, descripcion, type, id } = data;
  const diff = type !== 'UNITARIO';

  const caracteristicas = items.reduce((acc, { ref, obj, caracteristicas }) => {
    Object.entries(obj).map(([key, value]) => {
      if (key === 'Cantidad') return;
      if (!acc[key]) {
        const diff = items.some(e => e.obj[key] !== value);
        acc[key] = diff ? [{ ref, value }] : value;
      } else if (Array.isArray(acc[key])) acc[key].push({ ref, value });
    });
    return { ...caracteristicas, ...acc };
  }, {});

  return `<div class='card m-0 rounded-top'>
    <div class='row no-gutters'>
      <div class='col-md-3 text-center'>
        <img id='img' type='img' src='${
          imagen || '/img/subir.png'
        }' class='img-fluid rounded' width='250' height='250' alt='...' />
      </div>
      <div class='col-md-9'>
        <div class='card-body h-100'>
          <div class='flex-row row h-100'>
            <div class='col-12 col-md-4'>  
              <h5 class='card-title float-right m-0 precio'>
                ${!precio ? '<small class="text-muted">Desde </small>' : ''}
                $${Moneda(precio || Math.min(...items.map(e => e.valor)))}
              </h5>
            </div>
            <div class='col-12 col-md-8 order-md-first'>
              <h4 class='m-0'>${name} ${diff ? '' : items[0].nombre}</h4>
            </div>
            <div class='col-12'>
              <h5 class='mb-2'>
                ${diff ? descripcion : items[0].cantidad} 
                ${diff ? '' : measuring.find(e => e.val === items[0].umedida)?.tag ?? 'Sin info'}
              </h5>
            </div>
            ${diff ? '' : `<div class='col-md-12 float-right'>${descripcion}</div>`}
            <div class="container col-12">
              <div class="row">
                ${
                  diff
                    ? items
                        .filter((_, i) => i < 4)
                        .map(
                          e =>
                            `<div class="col-12 col-md-6">
                              <i class="fa fa-circle fa-xs"></i>                              
                              <span class="text-capitalize">
                                ${e.cantidad} ${e.name} ${e.nombre} ${e.quantity} 
                                ${measuring.find(a => a.val === e.umedida)?.tag ?? 'Sin info'}
                              </span> 
                            </div>`
                        )
                        .join('')
                    : Object.entries(caracteristicas)
                        .filter((e, i) => i < 6)
                        .map(
                          e =>
                            `<div class="col-6 col-md-4">
                              <i class="fa fa-circle fa-xs mr-1"></i>
                              <span class="text-capitalize">
                                ${e[0]}: ${selects(e[1])}
                              </span>                              
                            </div>`
                        )
                        .join('')
                }                      
              </div>
            </div>
             
            <div class='d-flex align-items-end justify-content-between col-12 mt-3'>

              <div>
                <div class='input-group input-group-sm'>
                  <div class='input-group-prepend' title='Disminuir cantidad'>
                    <button ${
                      !precio ? 'disabled' : ''
                    } type="button" class='btn btn-outline-primary minctd'>
                      <i class='fas fa-fw fa-minus'></i>
                    </button>
                  </div>
                  <input ${
                    !precio ? 'disabled' : ''
                  } class='form-control text-center cantidad' type='text' name='cantidad' placeholder='Ctd.' style="width: 50px;" />
                  <div class='input-group-append' title='Aumentar cantidad'>
                    <button ${
                      !precio ? 'disabled' : ''
                    } type="button" class='btn btn-outline-primary maxctd'>
                      <i class='fas fa-fw fa-plus'></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-row">
                <div class="btn-group-toggle" data-toggle="buttons">
                  <label class="btn btn-sm btn-outline-danger">
                    <input type="checkbox"> <i class='fas fa-fw fa-heart'></i>
                  </label>
                </div> 
                <button type="button" class='btn btn-sm btn-outline-primary ml-2 addcar' disabled>
                  <i class='fas fa-fw fa-cart-plus'></i>
                </button>
                <button type="button" class='btn btn-sm btn-outline-danger ml-2 eliminar'>
                  <i class="fas fa-trash"></i>
                </button>  
                <button type="button" class='btn btn-sm btn-outline-primary ml-2 editar'>
                  <i class="fas fa-edit"></i></a>
                </button>               
              </div>  
            </div>       
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

const ref = ref => {
  return `<div class='card shadow-lg mb-2 rounded position-relative overflow-auto referencia'>
    <div
      class='d-flex align-items-center align-content-center flex-wrap'      
      style='background-color: #FCF3CF !important;'
    >
      <div class='p-1 flex-grow-1 w-50'>
        <h4 class='m-0 text-truncate' title='name' style="max-width: 95%;"></h4>
        <span class='badge badge-info' title='ref'></span>
        <span title='precio'></span>        
      </div>
      <div 
        class='p-1'
        type='button'
        data-toggle='collapse'
        data-target='#referencia_${ref}'
        aria-expanded='false'
        aria-controls='referencia_${ref}'
      >
        x <span class='badge badge-info' title='cantidad'></span>
        <a><i class='fas fa-fw fa-angle-down'></i></a>
        <br class='d-block d-md-none'/> 
        <span class='d-block d-md-none' title='total'></span>
      </div>
      <div class='p-1 d-none d-md-block'>
        <span title='total'></span>
      </div>
      <div class='py-1 px-2'>
        <a class="deleteProduct">
          <i class='far fa-times-circle fa-2x'></i>          
        </a>
      </div>      
    </div>

    <div
      id='referencia_${ref}'
      class='collapse show px-2'
      aria-labelledby='headingOne'
      data-parent='#referencias'
    >
      <div class='d-flex align-items-center align-content-center flex-wrap'> 
        <div class='p-1 flex-grow-1 w-50 text-truncate'>Agrega mas al carrito</div>
        <div class='p-2'>
          <div class='input-group input-group-sm'>
            <div class='input-group-prepend' title='Disminuir cantidad'>
              <button type="button" class='btn btn-outline-primary minctd'>
                <i class='fas fa-fw fa-minus'></i>
              </button>
            </div>
            <input class='form-control text-center cantidad' type='text' name='cantidad' placeholder='Ctd.' style="width: 50px;" />
            <div class='input-group-append' title='Aumentar cantidad'>
              <button type="button" class='btn btn-outline-primary maxctd'>
                <i class='fas fa-fw fa-plus'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

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

  $('.form-check-input').on('change', function () {
    setParams(this);
  });

  $('.select2').on('change', function () {
    if (!/COMBO|RECETA/.test(check) && this.value)
      $(this).parents('.form-row').find('.plus').prop('disabled', false);
    else $(this).parents('.form-row').find('.plus').prop('disabled', true);
    setOptions(this);
  });

  $('.img').click(() => $('#inputFile').click());

  $('.img2').click(function () {
    imgenClick(this);
  });

  $('.imagen').on('change', function (event) {
    changeImagen(event, this);
  });

  $('.deleteImage').on('click', function () {
    deleteImagen(this);
  });

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
    { visible: false, targets: [1, 2] },
    { responsivePriority: 1, targets: [0] }
  ],
  order: [[1, 'asc']],
  language: languag2,
  ajax: {
    method: 'GET',
    url: '/products/table2',
    dataSrc: 'data'
  },
  columns: [
    {
      data: 'id',
      className: 'p-0',
      render: (data, method, row) => {
        return producto(row);
      }
    },
    { data: 'name' },
    {
      data: null,
      render: () => `<a class="eliminar"><i class="fas fa-trash"></i></a>
                         <a class="editar"><i class="fas fa-edit"></i></a>`
    }
  ],
  initComplete: function (settings, { data }) {
    changeOptions();
  }
});

prices.on('click', 'td .eliminar', function () {
  const fila = $(this).parents('tr');
  const { id, combo } = prices.row(fila).data();
  let delets = [];

  if (!combo)
    prices
      .rows()
      .data()
      .filter(e => e.combo)
      .each(row => {
        const exist = row.items.some(e => e.receta == id);
        if (exist) delets.push({ grupo: row.id, name: row.name });
      });

  delets.map(e => {
    if (delets.length < 3)
      return alert(
        `El combo ${e.name} tambien seria eliminado, ya que contendra 1 solo articulo, y no esta permitido`
      );

    return alert(`El producto tambien seria eliminado del combo ${e.name}`);
  });

  if (confirm('Seguro deseas eliminar este producto?')) {
    $.ajax({
      url: '/products/' + id,
      type: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify(delets.map(e => e.grupo)),
      success: function (data) {
        if (data) {
          prices.ajax.reload(function (json) {
            SMSj('success', 'Producto eliminado exitosamente');
            changeOptions();
          });
        } else {
          SMSj('error', 'No es posible eliminar este producto.');
        }
      }
    });
  }
});

prices.on('click', 'td .editar', function () {
  const fila = $(this).parents('tr');
  const data = prices.row(fila).data();
  const productos = $('#crearproducto').find('input, select, textarea, img');

  if (data.combo) $('#hidelecte').show();

  data.items.forEach((row, i) => {
    if (!i) {
      setParams({ value: data.type });
      return setRows(productos, { ...row, ...data });
    }
    const elements = setProduct().find('input, select, textarea, img');
    return setRows(elements, row);
  });

  $('#AddProduct').modal({ toggle: true, backdrop: 'static', keyboard: true });
});

prices.on('change', 'td .linkSelect', function () {
  const fila = $(this).parents('tr');
  const padre = $(this).parents('.no-gutters');
  const { precio, items } = prices.row(fila).data();

  if (!this.value) {
    padre.find('h5.precio').html(
      `${!precio ? '<small class="text-muted">Desde </small>' : ''}
       $${Moneda(precio || Math.min(...items.map(e => e.valor)))}`
    );
    padre.find('.minctd, .maxctd, .cantidad').prop('disabled', true).val(null);
  } else {
    const price = items.find(e => e.ref === this.value)?.valor;
    padre.find('h5.precio').html(Moneda(price));
    padre.find('.maxctd, .cantidad').prop('disabled', false);
  }
});

prices.on('click', 'td .minctd', function () {
  const input = $(this).parent().siblings('input.cantidad');
  input.val(parseInt(input.val() || 0) - 1).trigger('change');
});

prices.on('click', 'td .maxctd', function () {
  const input = $(this).parent().siblings('input.cantidad');
  input.val(parseInt(input.val() || 0) + 1).trigger('change');
});

prices.on('change', 'td .cantidad', function () {
  const padre = $(this).parents('.no-gutters');
  const elements = padre.find('.minctd, .addcar');
  if (this.value < 1) elements.prop('disabled', true);
  else elements.prop('disabled', false);
});

prices.on('click', 'td .addcar', function () {
  const fila = $(this).parents('tr');
  const padre = $(this).parents('.no-gutters');

  const { id, name, precio, items, ...rest } = prices.row(fila).data();
  const ref = padre.find('.linkSelect').val() ?? null;
  const referencia = items.find(e => e.ref === ref) ?? null;
  const cantidad = parseInt(padre.find('.cantidad').val() ?? 0);

  const price = precio ? precio : referencia?.valor ?? 0;
  const nombre = referencia ? name + ' ' + referencia?.nombre : name;

  let data = {
    id,
    name: nombre,
    precio: price,
    total: price * cantidad,
    cantidad,
    idref: id
  };

  if (referencia) data = { ...data, ref: referencia?.ref, idref: id + referencia?.ref };

  caritems = caritems.filter(e => {
    if (e.idref === data.idref)
      data = { ...data, cantidad: cantidad + e.cantidad, total: price * (cantidad + e.cantidad) };
    return e.idref !== data.idref;
  });
  caritems.push(data);

  padre.find('.cantidad, .linkSelect').val(null).trigger('change');

  console.log({ id, name, precio, items, ...rest, caritems });

  const setRowss = (productos, data) => {
    productos.each(function () {
      if ($(this).is('input')) this.value = data[this.name] ?? null;
      else
        this.innerText = /precio|total/.test(this.title)
          ? Moneda(data[this.title], true)
          : data[this.title] ?? '';
    });
  };

  caritems.forEach(row => {
    const elements = setRef(row?.idref ?? row.id).find('input, span, h4, h5');
    return setRowss(elements, row);
  });

  $('#AddCar').modal({ toggle: true, backdrop: 'static', keyboard: true });
});

$('#AddCar').on('hidden.bs.modal', function (e) {
  $('#referencias .referencia').remove();
});

$('#AddProduct').on('hidden.bs.modal', function (e) {
  $('#hidelecte').hide();
  $('#imagen, .imagen').prop('src', '/img/subir.png');
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

function setRef(id) {
  const code = id ?? ID(5);

  $('#referencias').append(ref(code));

  const newElemnt = $('#referencias').find('.card:last');

  $('.collapse').not(`#referencia_${code}`).collapse('hide');

  $(`#referencia_${code}`).collapse('show');

  /* newElemnt
    .find('.deleteProduct span')
    .html('<i class="far fa-circle fa-stack-2x"></i>')
    .append('<i class="fas fa-trash fa-stack-1x"></i>'); */

  $('.deleteProduct')
    .hover(
      function () {
        $(this).css('color', '#000000');
      },
      function () {
        $(this).css('color', '#bfbfbf');
      }
    )
    .css('color', '#bfbfbf');

  return newElemnt;
}

function imgenClick(elem) {
  const element = $(elem).parents('.dropdown');
  const file = element.find('input.imagen');
  if (element.find('img.imagen').prop('src').endsWith('/img/subir.png')) file.click();
}

function changeImagen(event, elem) {
  const file = event.target.files[0]; // Obtener el primer archivo seleccionado
  const reader = new FileReader();
  const element = $(elem).parents('.dropdown');

  reader.onload = function (event) {
    element.find('img.imagen').prop('src', event.target.result);
  };

  reader.readAsDataURL(file); // Leer el contenido del archivo como una URL de datos
}

function deleteImagen(elem) {
  const element = $(elem).parents('.dropdown');
  element.find('input.imagen').val(null);
  element.find('img.imagen').prop('src', '/img/subir.png');
}

function setRows(productos, data) {
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
        return $(this).prop('src', data[this.alt] ?? '/img/subir.png');
      case 'file':
        return;
      default:
        return (this.value = data[this.name]);
    }
  });
}

function setProduct(elem) {
  const element = !elem ? '.form-row:last' : $(elem).parents('.form-row');
  const newElemnt = $(addProduct).insertAfter(element);
  let serie = null;

  if (!/COMBO|RECETA/.test(check)) {
    newElemnt.find('.nota').prop({ name: 'valor', placeholder: 'Precio' });
    const valor = $('.select2').first().val() ?? null;

    const option = options.find(e => e.id == valor)?.text.split(' - ') ?? ['8'];
    serie = options.filter(e => e.text.startsWith(option.slice(0, 2).join(' - ')));
  } else newElemnt.find('.nota').prop({ name: 'nota', placeholder: 'Nota producto' });

  if (elem || check) {
    newElemnt
      .find('.select2')
      .prop('name', check === 'COMBO' ? 'receta' : 'articulo')
      .select2({
        allowClear: true,
        data: check === 'COMBO' ? optionsCombos : serie ? serie : options,
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

  newElemnt.find('.img2').click(function () {
    imgenClick(this);
  });

  newElemnt.find('.imagen').on('change', function (event) {
    changeImagen(event, this);
  });

  newElemnt.find('.deleteImage').on('click', function () {
    deleteImagen(this);
  });

  if (check === 'COMBO') {
    $('.imgref').hide();
    $('.public').hide();
  } else if (check === 'RECETA') {
    $('.imgref').hide();
    $('.public').show();
  } else {
    $('.public').hide();
    $('.imgref').show();
  }

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
    $('#precio, .plus').prop('disabled', false);
    $('.imgref').hide('slow');
    $('.nota').prop({ name: 'nota', placeholder: 'Nota producto' });
  } else if (value === 'RECETA') {
    $('.public').show('slow');
    $('#precio, .plus').prop('disabled', false);
    $('.imgref').hide('slow');
    $('.nota').prop({ name: 'nota', placeholder: 'Nota producto' });
  } else {
    $('.public').hide('slow');
    $('.imgref').show('slow');
    $('#precio, .plus').prop('disabled', true);
    $('.nota').prop({ name: 'valor', placeholder: 'Precio' });
    $('.rows_products, .hrs_products').remove();
  }
  let serie = null;
  $('.select2')
    .each(function (i) {
      if (value === 'COMBO') this.name = 'receta';
      else this.name = 'articulo';

      if (!/COMBO|RECETA/.test(value) && !i) {
        const option = options.find(e => e.id == this.value)?.text.split(' - ') ?? [];
        serie = options.filter(e => e.text.startsWith(option.slice(0, 2).join(' - ')));
      }

      $(this)
        .empty()
        .select2({
          dropdownParent: $(this).parent(),
          allowClear: true,
          data: value === 'COMBO' ? optionsCombos : i && value !== 'RECETA' ? serie : options,
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
    .filter(e => !e.combo)
    .each(e => optionsCombos.push({ id: e.id, text: `${e.name} ${e.items[0].nombre}` }));
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
