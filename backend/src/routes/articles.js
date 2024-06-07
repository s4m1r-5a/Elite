const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { createMovement } = require('../repositories/movimientos');

router.get('/', isLoggedIn, async (req, res) => {
  res.render('articles');
});

router.get('/table', isLoggedIn, async (req, res) => {
  const articulos = (
    await pool.query(`SELECT JSON_OBJECT(
    'id', a.id,
    'nombre', a.nombre,
    'categoria', a.categoria,
    'estado', a.estado,
    'umedida', a.umedida,
    'descripcion', a.descripcion,
    'caracteristicas', a.caracteristicas,
    'creado', a.createdAt,
    'referencias', JSON_ARRAYAGG(
      JSON_OBJECT(
        'articulo', r.articulo,
        'ref', r.ref,
        'obj', r.obj
      )
    )
  ) AS data

  FROM articulos a 
  INNER JOIN articulo_ref r ON r.articulo = a.id
  WHERE a.empresa = 1 
  GROUP BY a.id`)
  ).map(e => JSON.parse(e.data));

  res.json({ data: articulos });
});

router.get('/list', isLoggedIn, async (req, res) => {
  const articulos = await pool.query(`SELECT a.nombre, a.categoria, r.id, r.ref, r.obj
  FROM articulos a INNER JOIN articulo_ref r ON r.articulo = a.id
  WHERE a.empresa = 1`);

  res.json({ data: articulos });
});

router.get('/medicamentos', noExterno, async (req, res) => {
  const medicamentos = await pool.query(`SELECT * FROM medicamentos`);
  res.json({ data: medicamentos });
});

router.post('/medicamentos', isLoggedIn, async (req, res) => {
  const { id, nombre, laboratorio, clase, invima, tipo, medida, cantidad } = req.body;
  const data = {
    nombre: nombre.toUpperCase().trim(),
    laboratorio: laboratorio.toUpperCase().trim(),
    clase,
    invima,
    tipo,
    medida,
    cantidad
  };

  if (id) {
    await pool.query('UPDATE medicamentos SET ? WHERE id = ?', [data, id]);
    return res.send({ code: true });
  }

  const newProduct = await pool.query('INSERT INTO medicamentos SET ? ', data);
  res.send({ code: newProduct.insertId });
});

router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { id, nombre, umedida, categoria, descripcion, ref, ...rest } = req.body;
    const init = 10;
    const coste = 100;

    const data = { nombre: nombre.toUpperCase().trim(), umedida, categoria: 1 };
    let articulo = id ?? null;
    let idRef = null;

    console.log(req.body, 'req.body');

    if (descripcion) data.descripcion = descripcion;

    if (rest?.key_krt)
      data.caracteristicas = JSON.stringify(
        Array.isArray(rest?.key_krt)
          ? rest.key_krt
              .map((key, i) => ({ [key]: rest.value_krt[i] }))
              .reduce((e, c) => ({ ...e, ...c }), {})
          : { [rest.key_krt]: rest.value_krt }
      );

    const referencias = !Array.isArray(ref)
      ? {
          ref,
          obj: JSON.stringify(
            Array.isArray(rest[`key_${ref}`])
              ? rest[`key_${ref}`]
                  .map((key, i) => ({ [key]: rest[`value_${ref}`][i] }))
                  .reduce((e, c) => ({ ...e, ...c }), {})
              : { [rest[`key_${ref}`]]: rest[`value_${ref}`] }
          )
        }
      : {};

    if (id) {
      await pool.query(
        'UPDATE articulos a INNER JOIN articulo_ref r ON a.id = r.articulo SET ? WHERE a.id = ?',
        [{ ...data, ...referencias }, id]
      );

      await pool.query(`DELETE FROM articulo_ref WHERE articulo = ? AND ref NOT IN (?)`, [id, ref]);
    } else articulo = (await pool.query('INSERT INTO articulos SET ? ', data))?.insertId;

    if (Array.isArray(ref)) {
      const ar = [id, ref];
      const refs = id
        ? await pool.query(`SELECT id FROM articulo_ref WHERE articulo = ? AND ref IN (?)`, ar)
        : [];

      const referencias = ref.map(item => ({
        code: refs.find(e => e.ref === item)?.id ?? null,
        articulo,
        ref: item,
        obj: JSON.stringify(
          rest[`key_${item}`]
            .map((key, i) => ({ [key]: rest[`value_${item}`][i] }))
            .reduce((e, c) => ({ ...e, ...c }), {})
        )
      }));

      referencias.forEach(async (e, i) => {
        const { code, ...data } = e;
        if (code) await pool.query(`UPDATE articulo_ref SET ? WHERE id = ?`, [data, code]);
        else {
          idRef = (await pool.query('INSERT INTO articulo_ref SET ? ', data))?.insertId;

          await createMovement({
            articulo,
            referencia: idRef,
            tipo: 'AJUSTE',
            umedida,
            cantidad: init,
            coste,
            total: init * coste,
            stock: init,
            empresa: req.user.empresa
          });
        }
      });
    } else if (!id) {
      idRef = (await pool.query('INSERT INTO articulo_ref SET ? ', { articulo, ...referencias }))
        ?.insertId;

      await createMovement({
        articulo,
        referencia: idRef,
        tipo: 'AJUSTE',
        umedida,
        cantidad: init,
        coste,
        total: init * coste,
        stock: init,
        empresa: req.user.empresa
      });
    }

    res.send({ code: true });
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
