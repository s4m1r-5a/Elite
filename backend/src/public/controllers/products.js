$('.sidebar-item').removeClass('active');
$(`a[href='${window.location.pathname}']`).parent().addClass('active');
const product = $('.select2');
let articles = [];
let options = [];
let optionsCombos = [];
let check = null;
const addProduct = `
    <hr class="mt-0 hrs_products" />
    <div class='form-row rows_products'>
      <div class='form-group col-9 col-md-4'>
        <input type="hidden" name="code">
        <select class='form-control select2' placeholder='Slec. producto' name='articulo' required>        
        <input type="hidden" name="refId">
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
      articles = data;
      options = articles.map(e => ({
        id: e.refId ? e.id + '-' + e.refId : e.id,
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

const selects = (items, tex) => {
  const groups = items.reduce((acc, { ref, obj }) => {
    if (ref)
      Object.entries(obj).map(([key, value]) => {
        if (!acc[key]) {
          acc[key] = [{ ref, value }];
        } else acc[key].push({ ref, value });
      });
    return acc;
  }, {});

  if (groups) {
    const $select = $('<select class="linkSelect"></select>');
    $select.append('<option value="" selected>seleccione</option>');
    $.each(groups, function (group, options) {
      const $optgroup = $('<optgroup></optgroup>').attr('label', group);
      options.forEach(item => {
        const $option = $('<option></option>').attr({ value: item.ref }).text(item.value);
        $optgroup.append($option);
      });
      $select.append($optgroup);
    });

    return `<div class='d-flex align-items-end justify-content-between'>
              <span class="text-capitalize">${tex}</span>
              <span class="text-capitalize">
                Opciones: ${$select.prop('outerHTML')}
              </span>                              
            </div>`;
  }
  return '';
};

const producto = ({ name, imagen, precio, items, descripcion, type, id }) => {
  const diff = type !== 'UNITARIO';
  const rcta = type === 'RECETA';
  const car = caritems.find(e => e.id == id) ?? null;

  return `<div class='list-group shadow-lg mb-2'>
    <a class='list-group-item list-group-item-action rounded d-flex align-items-center pl-1' role='button' href='javascript:void 0'>
      <img 
        src='${imagen || '/img/subir.png'}' 
        class='img-thumbnail avatar img-fluid rounded select-none' 
        alt='image' style='width: 90px; height: 90px;'
      />
      <div class='flex-grow-1 pl-2'>
        <div class='d-flex w-100 justify-content-between op'>
          <h4 class='mb-1 d-inline-block text-truncate' style='font-weight: bold; font-family: cursive; color: unset; max-width: 40vw;'>
            ${name} ${diff ? '' : items[0].nombre}
          </h4>
          <small style='font-weight: bold; color: unset;'>
            ${!precio && items.length > 1 ? '+-' : ''}
            ${currency(precio || Math.min(...items.map(e => e.valor)), true)}
          </small>
        </div>
        <p class='d-inline-block text-truncate mb-1 ml-0 text-left op' style='max-width: 60vw;'>
          ${
            diff
              ? descripcion
              : items[0].cantidad + measuring.find(e => e.val === items[0].umedida)?.tag ??
                'Sin info'
          }
        </p>
        <div class='d-flex w-100 justify-content-between align-items-center'>
          <small class='op'>Saber mas aqui</small>
          <div class='d-flex align-items-center'>
            ${
              !precio && items.length > 1
                ? ''
                : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart mr-3"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
            }

            ${
              !precio && items.length > 1
                ? `<button type='button' class='btn btn-outline-primary btn-sm' style='border-radius: 1rem;'>
                      Seleccionar
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-slack"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path></svg>
                    </button>`
                : `<span class='badge badge-primary d-flex justify-content-between' style='border-radius: 10rem;'>
                    <div class='minctd pr-2' style='display: ${car ? 'block' : 'none'};'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                        class="feather feather-20 feather-trash-2" 
                        style='display: ${car?.cantidad < 2 ? 'block' : 'none'};'
                      >
                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                        class="feather feather-20 feather-minus-circle" 
                        style='display: ${car?.cantidad > 1 ? 'block' : 'none'};'
                      >
                        <circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                    <input 
                      class='cantidad invisible-input text-center' type='text' name='cantidad' 
                      value='${car?.cantidad ?? ''}'  style='display: ${car ? 'block' : 'none'};'
                    />
                    <div class='maxctd pl-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-20 feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </div>
                  </span>`
            } 
          </div>
        </div>
      </div>
    </a>
  </div>`;
};

const producto2 = data => {
  const { name, imagen, precio, items, descripcion, type, id } = data;
  const diff = type !== 'UNITARIO';
  const rcta = type === 'RECETA';
  let krctrs = '';

  if (!diff)
    $.each(items[0].caracteristicas, function (group, options) {
      krctrs += `<div class="col-6 col-md-4">
      <i class="fa fa-circle fa-xs mr-1"></i>
      <span class="text-capitalize">
        ${group}: ${options}
      </span>                              
    </div>`;
    });

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
                ${!precio && items.length > 1 ? '<small class="text-muted">Desde </small>' : ''}
                $${Moneda(precio || Math.min(...items.map(e => e.valor)))}
              </h5>
            </div>
            <div class='col-12 col-md-8 order-md-first'>
              <h4 class='m-0'>${name} ${diff ? '' : items[0].nombre}</h4>
            </div>
            <div class='col-12'>
              <h5 class='mb-2'>
                ${
                  diff
                    ? descripcion
                    : selects(
                        items,
                        items[0].cantidad + measuring.find(e => e.val === items[0].umedida)?.tag ??
                          'Sin info'
                      )
                }
              </h5>
            </div>
            ${diff ? '' : `<div class='col-md-12 float-right'>${descripcion}</div>`}
            <div class="container col-12">
              <div class="row">
                ${
                  !diff
                    ? krctrs
                    : rcta
                    ? items
                        .filter(e => e.visible)
                        .filter((_, i) => i < 4)
                        .map(
                          e =>
                            `<div class="col-12 col-md-6">
                                <i class="fa fa-circle fa-xs"></i>                              
                                <span class="text-capitalize">
                                  ${e.ref ? `${e.nombre} ${e.ref}` : e.nombre}
                                </span> *${e.cantidad} 
                                  ${measuring.find(a => a.val === e.umedida)?.val ?? '/n'}
                              </div>`
                        )
                        .join('')
                    : items
                        .filter((_, i) => i < 4)
                        .map(
                          e =>
                            `<div class="col-12 col-md-6">
                              <i class="fa fa-circle fa-xs"></i>                              
                              <span class="text-capitalize">
                                ${e.cantidad} ${e.name} 
                                ${e.ref ? `${e.nombre} ${e.ref}` : e.nombre}
                              </span> *${e.quantity} 
                                ${measuring.find(a => a.val === e.umedida)?.val ?? '/n'}
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
                    <button disabled type="button" class='btn btn-outline-primary minctd'>
                      <i class='fas fa-fw fa-minus'></i>
                    </button>
                  </div>
                  <input ${
                    !precio && items.length > 1 ? 'disabled' : ''
                  } class='form-control text-center cantidad' type='text' name='cantidad' placeholder='Ctd.' style="width: 50px;" />
                  <div class='input-group-append' title='Aumentar cantidad'>
                    <button ${
                      !precio && items.length > 1 ? 'disabled' : ''
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

$(document).ready(function () {
  $('#hidelecte, .public, #loading').hide();
  $('input').prop('autocomplete', 'off');

  $('#crearproducto').submit(function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      url: '/products',
      data: formData,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
      beforeSend: function () {
        $('#loading').show('slow');
      },
      success: function (data) {
        $('#AddProduct').modal('hide');
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
        $('#loading').hide('slow');
      }
    });
  });

  $('.form-check-input').on('change', function () {
    setParams(this);
  });

  $('.select2').on('change', function () {
    if (this.value) $(this).parents('.form-row').find('.plus').prop('disabled', false);
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

  $('#deleteCar').on('click', function () {
    if (confirm('Seguro deseas eliminar el carrito de compras?')) {
      caritems = [];
      addItemsCar();
      $('#referencias .referencia').hide('slow', function () {
        $(this).remove();
      });
    }
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
    url: '/products/table',
    dataSrc: 'data'
  },
  columns: [
    {
      data: 'id',
      className: 'p-0',
      render: (data, method, row) => producto(row)
    },
    { data: 'name' },
    {
      data: null,
      render: () => `<a class="eliminar"><i class="fas fa-trash"></i></a>
                         <a class="editar"><i class="fas fa-edit"></i></a>`
    }
  ],
  initComplete: function (settings, { data }) {
    console.log({ data });
    changeOptions();
    $('.feather-heart').click(function () {
      $(this).toggleClass('filled');
    });
  }
});

prices.on('click', 'td .eliminar', function () {
  const fila = $(this).parents('tr');
  const padre = $(this).parents('.list-group');
  const { id, items, type } = prices.row(fila).data();
  const val = padre.find('.linkSelect').val() || null;
  const ref = items.filter(e => (val ? e.ref === val : e.refId)).map(e => e.refId);
  let delets = [];

  if (type === 'UNITARIO')
    prices
      .rows()
      .data()
      .filter(e => e.type === 'COMBO')
      .each(row => {
        const exist = row.items.filter(
          e => e.receta == id && (ref.length ? ref.some(a => a == e.refId) : !e.refId)
        ).length;
        if (exist) delets.push({ grupo: row.id, name: row.name, exist, ctd: row.items.length });
      });

  delets.map(e => {
    if (e.ctd - e.exist < 2)
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
      data: JSON.stringify({
        ref,
        type,
        indexes: delets.filter(e => e.ctd - e.exist < 2).map(e => e?.grupo)
      }),
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
  const padre = $(this).parents('.list-group');
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
  const padre = $(this).parents('.list-group');
  const input = padre.find('input.cantidad');
  input.val(parseInt(input.val() || 0) - 1).trigger('change');
});

prices.on('click', 'td .maxctd', function () {
  const padre = $(this).parents('.list-group');
  $(this).siblings().show('slow');
  const input = padre.find('input.cantidad');
  input.val(parseInt(input.val() || 0) + 1).trigger('change');
});

prices.on('change', 'td .cantidad', function () {
  const fila = $(this).parents('tr');
  const padre = $(this).parents('.list-group');
  const { id, name, precio, items, type, imagen, ...rest } = prices.row(fila).data();

  if (this.value < 1) padre.find('.maxctd').siblings().hide('slow');
  else if (this.value == 1)
    padre.find('.minctd .feather-trash-2').show().next('.feather-minus-circle').hide();
  else padre.find('.minctd .feather-trash-2').hide().next('.feather-minus-circle').show();

  const ref = null;
  const referencia = type === 'UNITARIO' ? items.find(e => e.ref === ref) ?? items[0] : null;
  const cantidad = parseInt(this.value ?? 0);

  const price = precio ? precio : referencia?.valor ?? 0;
  const nombre = referencia ? name + ' ' + referencia?.nombre : name;

  let data = {
    id: id + (referencia?.refId ? '-' + referencia?.refId : ''),
    product: id,
    ref: referencia?.ref,
    refId: referencia?.refId,
    image: referencia?.img ?? (imagen || '/img/subir.png'),
    name: nombre?.toLowerCase(),
    precio: price,
    total: price * cantidad,
    cantidad
  };

  caritems = caritems.filter(e => e.id !== data.id);
  caritems.push(data);

  return addItemsCar();
});

prices.on('click', 'td .addcar', function () {
  const fila = $(this).parents('tr');
  const padre = $(this).parents('.list-group');

  const { id, name, precio, items, type, imagen, ...rest } = prices.row(fila).data();
  const ref = padre.find('.linkSelect').val() ?? null;
  const referencia = type === 'UNITARIO' ? items.find(e => e.ref === ref) ?? items[0] : null;
  const cantidad = parseInt(padre.find('.cantidad').val() ?? 0);

  const price = precio ? precio : referencia?.valor ?? 0;
  const nombre = referencia ? name + ' ' + referencia?.nombre : name;

  let data = {
    id: id + (referencia?.refId ? '-' + referencia?.refId : ''),
    product: id,
    ref: referencia?.ref,
    refId: referencia?.refId,
    image: referencia?.img ?? (imagen || '/img/subir.png'),
    name: nombre?.toLowerCase(),
    precio: price,
    total: price * cantidad,
    cantidad
  };

  // if (referencia) data = { ...data, ref: referencia?.ref, idref: id + referencia?.ref };

  caritems = caritems.filter(e => {
    if (e.id === data.id)
      data = { ...data, cantidad: cantidad + e.cantidad, total: price * (cantidad + e.cantidad) };
    return e.id !== data.id;
  });
  caritems.push(data);

  padre.find('.cantidad, .linkSelect').val(null).trigger('change');

  // $('#AddCar').modal({ toggle: true, backdrop: 'static', keyboard: true });
  addItemsCar();
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
        if (data?.refId)
          return $(this)
            .val(data[this.name] + '-' + data.refId)
            .trigger('change');
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
    .filter(e => e.type === 'UNITARIO')
    .each(
      e =>
        (optionsCombos = [
          ...optionsCombos,
          ...e.items.map(a => ({
            id: e.id + (a.refId ? `-${a.refId}` : ''),
            text: `${e.name} ${a.nombre} ${a.ref ? a.ref : ''}`
          }))
        ])
    );
}

function publicProduct(elem) {
  const element = $(elem).next('input');
  element.val($(elem).is(':checked') ? 1 : 0);
}

function deleteProduct(elem) {
  const element = $(elem).parents('.form-row');
  element.prev('hr').remove();
  element.remove();
}
