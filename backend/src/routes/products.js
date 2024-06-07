const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');

//ALTER TABLE medicamentos ADD `empresa` INT NULL
router.get('/', isLoggedIn, async (req, res) => {
  res.render('products');
});

router.get('/table/:combo?', noExterno, async (req, res) => {
  const { combo } = req.params;
  const prices = await pool.query(
    `SELECT p.*, r.*, a.nombre, a.categoria, a.estado, a.caracteristicas,	
      a.umedida, ar.ref, ar.obj, p_combo.name As tipo, p_combo.precio As valor, 
      r_combo.cantidad As quantity, a_combo.nombre As nam, a_combo.caracteristicas krt, ar_combo.ref referencia,         ar_combo.obj objeto
    FROM products AS p 
        INNER JOIN recetas AS r ON p.id = r.grupo 
        LEFT JOIN articulo_ref AS ar ON ar.id = r.articulo 
        LEFT JOIN articulos AS a ON a.id = ar.articulo 
        LEFT JOIN products AS p_combo ON p_combo.id = r.receta
        LEFT JOIN recetas AS r_combo ON p_combo.id = r_combo.grupo
        LEFT JOIN articulo_ref AS ar_combo ON ar_combo.id = r_combo.articulo  
        LEFT JOIN articulos AS a_combo ON a_combo.id = ar_combo.articulo   
    WHERE ${combo !== 'all' ? 'p.combo = ?' : 'p.combo IS NOT NULL'} 
    ORDER BY p.name ASC`,
    /* `SELECT p.*, r.*, m.nombre, m.laboratorio, 
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
  const { id, name, precio, descripcion, cantidad, nota, type, code, visible } = body;
  const field = body?.articulo ? 'articulo' : 'receta';
  const value = body?.articulo ?? body?.receta;
  let inset = null;

  console.log(body, body?.visible, files);
  // return res.send(true);

  const price = {
    name: name.toUpperCase().trim(),
    type,
    precio,
    descripcion,
    combo: Array.isArray(value)
  };

  if (files.length) price.imagen = headers.origin + '/uploads/' + files[0]?.filename;

  if (id) {
    if (files.length) {
      const [price] = (await pool.query(`SELECT imagen FROM products WHERE id = ?`, id)) ?? [null];
      if (price?.imagen) {
        DeleteFile(price?.imagen);
      }
    }
    const data = Array.isArray(value) ? price : { ...price, [field]: value, cantidad, nota };

    await pool.query(
      'UPDATE products p INNER JOIN recetas r ON p.id = r.grupo SET ? WHERE p.id = ?',
      [data, id]
    );

    await pool.query(
      `DELETE FROM recetas WHERE grupo = ? AND (${field} NOT IN (?) OR ${field} IS NULL)`,
      [id, value]
    );
  } else inset = (await pool.query('INSERT INTO products SET ? ', price))?.insertId;

  if (Array.isArray(value)) {
    const items = code.map((e, i) => ({
      [field]: value[i],
      cantidad: cantidad[i],
      nota: nota[i],
      code: e || null,
      visible: visible[i]
    }));

    items.forEach(async (e, i) => {
      if (e.code) await pool.query(`UPDATE recetas SET ? WHERE code = ?`, [e, e.code]);
      else await pool.query('INSERT INTO recetas SET ? ', { ...e, grupo: id || inset });
    });
  } else if (!id)
    await pool.query('INSERT INTO recetas SET ? ', {
      [field]: value,
      grupo: inset,
      cantidad,
      nota
    });

  res.send(true);
});

router.delete('/:id', noExterno, async (req, res) => {
  const { id } = req.params;
  const ids = req.body || [];
  console.log({ id, ids }, req.body)
  try {
    await pool.query(`DELETE FROM products WHERE id IN (?)`, [[...ids, id]]);
    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
