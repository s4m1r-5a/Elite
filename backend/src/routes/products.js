const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');

//ALTER TABLE medicamentos ADD `empresa` INT NULL
router.get('/', isLoggedIn, async (req, res) => {
  res.render('products');
});

router.get('/table', isLoggedIn, async (req, res) => {
  const prices = (
    await pool.query(
      `SELECT p.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'refId', r.ref,
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
        LEFT JOIN articulos AS a ON a.id = r.articulo
        LEFT JOIN articulo_ref AS ar ON ar.id = r.ref  
        
        LEFT JOIN products AS p_combo ON p_combo.id = r.receta
        LEFT JOIN recetas AS r_combo ON p_combo.id = r_combo.grupo && (r_combo.ref = r.ref || r_combo.ref IS NULL)  
        LEFT JOIN articulos AS a_combo ON a_combo.id = r_combo.articulo 
        LEFT JOIN articulo_ref AS ar_combo ON ar_combo.id = r_combo.ref  
      GROUP BY p.id
      ORDER BY p.name ASC;`
    )
  ).map(e => ({ ...e, items: JSON.parse(e.items) }));
  // console.log(prices);
  res.json({ data: prices });
});

router.post('/', isLoggedIn, async ({ body, files, headers }, res) => {
  let ref = [];
  const setRef = arr => {
    if (Array.isArray(arr))
      return arr.map(e => {
        if (e.indexOf('-')) {
          const ids = e.split('-');
          ref.push({ id: ids[0], ref: ids[1] });
          return ids[0];
        }
        return e;
      });
    else if (arr.indexOf('-')) {
      const ids = arr.split('-');
      ref = [{ id: ids[0], ref: ids[1] }];
      return ids[0];
    }

    return arr;
  };

  const diff = val => {
    let index = null;
    const reff =
      ref.find((e, i) => {
        if (e.id == val) index = i;
        return e.id == val;
      })?.ref ?? null;

    if (/[0-9]/.test(index)) ref.splice(index, 1);

    return reff;
  };

  const { id, name, descripcion, cantidad, type, code, visible } = body;
  const field = body?.articulo ? 'articulo' : 'receta';
  const notVal = body?.nota ? 'nota' : 'valor';
  const valNot = body?.nota ?? body?.valor;
  const value = setRef(body?.articulo ?? body?.receta);
  const refOrigin = ref.map(e => e.ref)
  let inset = null;

  console.log({ body, ref, field, value, refOrigin });
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
      : { ...price, ref: diff(value), [field]: value, cantidad, [notVal]: valNot };

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
      'UPDATE products p INNER JOIN recetas r ON p.id = r.grupo SET ? WHERE p.id = ? AND r.code = ?',
      [data, id, code[0] ?? code]
    );

    imgss =
      type === 'UNITARIO'
        ? await pool.query(
            `SELECT img, grupo, ref FROM recetas WHERE img IS NOT NULL AND grupo = ? AND (${
              refOrigin.length ? `ref NOT IN (?) OR ${field}` : field
            } NOT IN (?) OR ${field} IS NULL)`,
            [id, refOrigin.length ? refOrigin : value, value]
          )
        : [];

    if (imgss.length) {
      for (const u of imgss) {
        if (u.img) await DeleteFile(u.img);
      }

      await pool.query(`DELETE FROM recetas WHERE receta IN (?) AND (ref IN (?) OR ref IS NULL)`, [
        imgss.map(e => e.grupo),
        imgss.map(e => e.ref)
      ]);
    }

    await pool.query(
      `DELETE FROM recetas WHERE grupo = ? AND (${
        refOrigin.length ? `ref NOT IN (?) OR ${field}` : field
      } NOT IN (?) OR ${field} IS NULL)`,
      [id, refOrigin.length ? refOrigin : value, value]
    );
  } else inset = (await pool.query('INSERT INTO products SET ? ', price))?.insertId;

  if (Array.isArray(value)) {
    const items = code.map((e, i) => {
      const img = files.find(e => e.fieldname === `imagen-${i}`)?.filename ?? null;
      const obj = {
        ref: diff(value[i]),
        [field]: value[i],
        cantidad: cantidad[i],
        [notVal]: valNot[i],
        code: e || null,
        visible: visible[i] || 0
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
      ref: diff(value),
      [field]: value,
      grupo: inset,
      cantidad,
      [notVal]: valNot,
      img: img1 ? headers.origin + '/uploads/' + img1 : null
    });
  }

  res.send(true);
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { ref, type, indexes } = req.body;
  console.log({ id, ref, type, indexes }, req.body);
  // return res.send(true);
  try {
    await pool.query(`DELETE FROM products WHERE id IN(?)`, [[...indexes, id]]);

    if (type === 'UNITARIO')
      await pool.query(`DELETE FROM recetas WHERE receta = ? AND (ref IN(?) OR ref IS NULL)`, [
        id,
        ref
      ]);

    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
