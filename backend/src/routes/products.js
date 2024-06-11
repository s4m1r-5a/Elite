const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');

//ALTER TABLE medicamentos ADD `empresa` INT NULL
router.get('/', isLoggedIn, async (req, res) => {
  res.render('products');
});

router.get('/table2/:combo?', noExterno, async (req, res) => {
  // const { combo } = req.params;
  const prices = (
    await pool.query(
      `SELECT p.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'code', r.code,
          'articulo', r.articulo,
          'grupo', r.grupo,
          'receta', r.receta,
          'nota', r.nota,
          'visible', r.visible,
          'categorias', r.categorias,
          'cantidad', r.cantidad,                
          'valor', r.valor,                
          'img', r.img,                
          'quantity', r_combo.cantidad, 
          'nombre', IFNULL(a.nombre, a_combo.nombre),
          'caracteristicas', IFNULL(a.caracteristicas, a_combo.caracteristicas), 
          'umedida', IFNULL(a.umedida, a_combo.umedida), 
          'ref', IFNULL(ar.ref, ar_combo.ref), 
          'obj', IFNULL(ar.obj, ar_combo.obj),                
          'name', p_combo.name, 
          'precio', p_combo.precio
        )
      ) AS items
    FROM products AS p 
      INNER JOIN recetas AS r ON p.id = r.grupo 
      LEFT JOIN articulo_ref AS ar ON ar.id = r.articulo 
      LEFT JOIN articulos AS a ON a.id = ar.articulo 
      
      LEFT JOIN products AS p_combo ON p_combo.id = r.receta
      LEFT JOIN recetas AS r_combo ON p_combo.id = r_combo.grupo
      LEFT JOIN articulo_ref AS ar_combo ON ar_combo.id = r_combo.articulo  
      LEFT JOIN articulos AS a_combo ON a_combo.id = ar_combo.articulo   
    GROUP BY p.id
    ORDER BY p.name ASC;`
    )
  ).map(e => ({ ...e, items: JSON.parse(e.items) }));
  // console.log(prices);
  res.json({ data: prices });
});

router.get('/table/:combo?', noExterno, async (req, res) => {
  const { combo } = req.params;
  const prices = await pool.query(
    `SELECT p.*, r.*, a.nombre, a.categoria, a.estado, a.caracteristicas,	
      a.umedida, ar.ref, ar.obj, p_combo.name As nam, p_combo.precio As valor, 
      r_combo.cantidad As quantity, a_combo.nombre As nomb, a_combo.caracteristicas krt, ar_combo.ref referencia,         ar_combo.obj objeto
    FROM products AS p 
        INNER JOIN recetas AS r ON p.id = r.grupo 
        LEFT JOIN articulo_ref AS ar ON ar.id = r.articulo 
        LEFT JOIN articulos AS a ON a.id = ar.articulo 
        LEFT JOIN products AS p_combo ON p_combo.id = r.receta
        LEFT JOIN recetas AS r_combo ON p_combo.id = r_combo.grupo
        LEFT JOIN articulo_ref AS ar_combo ON ar_combo.id = r_combo.articulo  
        LEFT JOIN articulos AS a_combo ON a_combo.id = ar_combo.articulo   
    
    ORDER BY p.name ASC`,
    /* WHERE ${combo !== 'all' ? 'p.combo = ?' : 'p.combo IS NOT NULL'} 
    `SELECT p.*, r.*, m.nombre, m.laboratorio, 
        m.clase, m.medida, p_combo.name As tipo, p_combo.precio As valor, 
        r_combo.cantidad As quantity, m_combo.nombre As nam,
        m_combo.laboratorio As laboratory, m_combo.clase As class
    FROM products AS p 
        INNER JOIN recetas AS r ON p.id = r.grupo 
        LEFT JOIN medicamentos AS m ON m.id = r.articulo 
        LEFT JOIN products AS p_combo ON p_combo.id = r.receta
        LEFT JOIN recetas AS r_combo ON p_combo.id = r_combo.grupo
        LEFT JOIN medicamentos AS m_combo ON m_combo.id = r_combo.articulo   
    WHERE ${combo !== 'all' ? 'p.combo = ?' : 'p.combo IS NOT NULL'} 
    ORDER BY p.name ASC` */
    combo ?? 0
  );
  // console.log(prices);
  res.json({ data: prices });
});

router.post('/', isLoggedIn, async ({ body, files, headers }, res) => {
  const { id, name, descripcion, cantidad, type, code, visible } = body;
  const field = body?.articulo ? 'articulo' : 'receta';
  const notVal = body?.nota ? 'nota' : 'valor';
  const valNot = body?.nota ?? body?.valor;
  const value = body?.articulo ?? body?.receta;
  let inset = null;

  console.log(body, body?.visible, files);
  // return res.send(true);

  const price = {
    name: name.toUpperCase().trim(),
    type,
    precio: body?.precio ?? 0,
    descripcion,
    combo: Array.isArray(value)
  };

  const iimg = files.find(e => e.fieldname === 'image')?.filename ?? null;
  const img1 = files.find(e => e.fieldname === `imagen-0`)?.filename ?? null;

  if (iimg) price.imagen = headers.origin + '/uploads/' + iimg;

  if (id) {
    if (iimg) {
      const [price] = (await pool.query(`SELECT imagen FROM products WHERE id = ?`, id)) ?? [null];
      if (price?.imagen) {
        DeleteFile(price?.imagen);
      }
    }
    const data = Array.isArray(value)
      ? price
      : { ...price, [field]: value, cantidad, [notVal]: valNot };

    if (data?.cantidad && img1) {
      data.img = headers.origin + '/uploads/' + img1;

      let imgss = await pool.query(
        `SELECT img FROM recetas WHERE img IS NOT NULL AND grupo = ? AND (${field} NOT IN (?) OR ${field} IS NULL)`,
        [id, value]
      );
      if (imgss.length) {
        for (const u of imgss) {
          await DeleteFile(u.img);
        }
      }
    }

    await pool.query(
      'UPDATE products p INNER JOIN recetas r ON p.id = r.grupo SET ? WHERE p.id = ?',
      [data, id]
    );

    imgss = await pool.query(
      `SELECT img FROM recetas WHERE img IS NOT NULL AND grupo = ? AND (${field} NOT IN (?) OR ${field} IS NULL)`,
      [id, value]
    );
    if (imgss.length) {
      for (const u of imgss) {
        await DeleteFile(u.img);
      }
    }
    await pool.query(
      `DELETE FROM recetas WHERE grupo = ? AND (${field} NOT IN (?) OR ${field} IS NULL)`,
      [id, value]
    );
  } else inset = (await pool.query('INSERT INTO products SET ? ', price))?.insertId;

  if (Array.isArray(value)) {
    const items = code.map((e, i) => {
      const img = files.find(e => e.fieldname === `imagen-${i}`)?.filename ?? null;
      const obj = {
        [field]: value[i],
        cantidad: cantidad[i],
        [notVal]: valNot[i],
        code: e || null,
        visible: visible[i]
      };

      if (img) obj.img = headers.origin + '/uploads/' + img;

      return obj;
    });

    for (const e of items) {
      const { code, ...rest } = e;
      if (code) {
        if (rest?.img) {
          const imgs = await pool.query(
            `SELECT img FROM recetas WHERE img IS NOT NULL AND code = ?`,
            code
          );
          if (imgs.length) {
            for (const u of imgs) {
              await DeleteFile(u.img);
            }
          }
        }

        await pool.query(`UPDATE recetas SET ? WHERE code = ?`, [rest, code]);
      } else await pool.query('INSERT INTO recetas SET ? ', { ...rest, grupo: id || inset });
    }
  } else if (!id) {
    await pool.query('INSERT INTO recetas SET ? ', {
      [field]: value,
      grupo: inset,
      cantidad,
      [notVal]: valNot,
      img: img1 ? headers.origin + '/uploads/' + img1 : null
    });
  }

  res.send(true);
});

router.delete('/:id', noExterno, async (req, res) => {
  const { id } = req.params;
  const ids = req.body || [];
  console.log({ id, ids }, req.body);
  try {
    await pool.query(`DELETE FROM products WHERE id IN (?)`, [[...ids, id]]);
    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
