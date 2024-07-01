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
    await pool.query(
      `SELECT JSON_OBJECT(
          'id', a.id,
          'nombre', a.nombre,
          'categoria', a.categoria,
          'estado', a.estado,
          'umedida', a.umedida,
          'descripcion', a.descripcion,
          'caracteristicas', a.caracteristicas,
          'creado', a.createdAt,
          'cantidades', IFNULL(a.cantidades, JSON_ARRAY()),    
          'opciones', IF(COUNT(r.code) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
          JSON_OBJECT('code', r.code, 'articulo', r.articulo, 'tag', r.tag, 'value', r.value, 'images', r.images)))
        ) AS data

      FROM articulos a LEFT JOIN art_referencias r ON a.id = r.articulo
      WHERE a.empresa = ?   
      GROUP BY a.id`,
      req.user.empresa
    )
  ).map(e => JSON.parse(e.data));

  res.json({ data: articulos });
});

router.get('/table2', isLoggedIn, async (req, res) => {
  const articulos = (
    await pool.query(
      `SELECT JSON_OBJECT(
    'id', a.id,
    'nombre', a.nombre,
    'categoria', a.categoria,
    'estado', a.estado,
    'umedida', a.umedida,
    'descripcion', a.descripcion,
    'caracteristicas', a.caracteristicas,
    'creado', a.createdAt,
    'cantidades', IFNULL(a.cantidades, JSON_ARRAY()),
    'referencias', IF(COUNT(r.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(
        JSON_OBJECT(
          'articulo', r.articulo,
          'ref', r.ref,
          'obj', r.obj
        )
      )
    )
  ) AS data

  FROM articulos a 
  LEFT JOIN articulo_ref r ON r.articulo = a.id
  WHERE a.empresa = ? 
  GROUP BY a.id`,
      req.user.empresa
    )
  ).map(e => JSON.parse(e.data));

  res.json({ data: articulos });
});

router.get('/list', isLoggedIn, async (req, res) => {
  const articulos = await pool.query(
    `SELECT a.id, a.nombre, a.categoria, r.id refId, r.ref, r.obj
  FROM articulos a LEFT JOIN articulo_ref r ON r.articulo = a.id
  WHERE a.empresa = ?`,
    req.user.empresa
  );

  res.json({ data: articulos });
});

router.post('/', isLoggedIn, async (req, res) => {
  let art_ref = [];
  const clar = val => !['undefined', 'NaN', ''].some(e => e == val);
  const toArray = arr => (Array.isArray(arr) ? arr.filter(e => clar(e)) : clar(arr) ? [arr] : []);

  const isEmptyObj = obj => {
    const object = JSON.stringify(obj);
    return object === '{}' ? null : object;
  };

  caracteristicas = (obj, articulo) => {
    const ktr = [];
    for (let prop in obj) {
      const arr = toArray(obj[prop]);
      if (!arr.length) continue;
      const [key, cod] = prop.split('_');
      const tag = obj[prop.replace(key, 'tag')];
      const codes = obj[prop.replace(key, 'code')];
      const isValid = prop.startsWith('value_') || prop.startsWith('values_');
      const existInVal = !isValid ? null : obj['value_' + cod]?.length ?? null;
      const existInVals = !(existInVal && obj['values_' + cod]);

      if (isValid && existInVals && arr.length < 2) ktr.push({ [tag]: arr.join('') });
      else if (isValid && existInVal) {
        art_ref = [
          ...art_ref,
          ...arr.map((e, i) => {
            return { code: key === 'values' ? null : codes[i] ?? null, articulo, tag, value: e };
          })
        ];
      }
    }
    return isEmptyObj(ktr.reduce((a, c) => ({ ...a, ...c }), {}));
  };

  try {
    const { id, nombre, umedida, categoria, descripcion, cantidades, ...rest } = req.body;
    let articulo = id ?? null;

    const data = {
      nombre: nombre.toUpperCase().trim(),
      umedida,
      categoria,
      cantidades: JSON.stringify(toArray(cantidades)),
      descripcion: descripcion ? descripcion : null,
      caracteristicas: caracteristicas(rest, articulo)
    };

    console.log(req.body, 'req.body', { data, art_ref });
    // return res.send({ code: true });

    if (articulo) {
      const codes = art_ref.filter(e => e.code).map(e => e.code);

      await pool.query('UPDATE articulos SET ? WHERE id = ?', [data, articulo]);

      const images = await pool.query(
        `SELECT images FROM art_referencias WHERE images IS NOT NULL AND articulo = ? AND code NOT IN (?)`,
        [articulo, codes]
      );

      if (images.length) {
        for (const u of imgss) {
          await DeleteFile(u.images);
        }
      }

      await pool.query(`DELETE FROM art_referencias WHERE articulo = ? AND code NOT IN (?)`, [
        articulo,
        codes
      ]);
    } else articulo = (await pool.query('INSERT INTO articulos SET ? ', data))?.insertId;

    for (const e of art_ref) {
      const { code, ...data } = e;
      if (code) await pool.query(`UPDATE art_referencias SET ? WHERE code = ?`, [data, code]);
      else {
        await pool.query('INSERT INTO art_referencias SET ? ', { ...data, articulo });
      }
    }

    res.send({ code: true });
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

router.post('/2', isLoggedIn, async (req, res) => {
  const toArray = arr => (Array.isArray(arr) ? arr.filter(e => !!e) : [arr]);
  let art_ref = [];
  caracteristicas = (objeto, articulo) => {
    const ktr = [];
    for (let prop in objeto) {
      const arr = toArray(objeto[prop]);
      if (prop.startsWith('values_') && arr.length < 2) ktr.push({ [prop]: arr.join('') });
      else if (prop.startsWith('values_')) {
        const tag = objeto[prop.replace('values', 'key')];
        art_ref = [...art_ref, ...arr.map(e => ({ articulo, tag, value: e }))];
      }
    }
    console.log(
      ktr.reduce((a, c) => ({ ...a, ...c }), {}),
      'caracteristicas'
    );
    return JSON.stringify(ktr.reduce((a, c) => ({ ...a, ...c }), {}));
  };

  try {
    const { id, nombre, umedida, categoria, descripcion, cantidades, ...rest } = req.body;
    const ref = rest?.ref ?? null;

    const init = ref ? (rest?.[`ctd_${toArray(ref)[0]}`] ?? 0) * 1 : rest.ctd_ini * 1;
    const coste = ref ? (rest?.[`cost_${toArray(ref)[0]}`] ?? 0) * 1 : rest.cost_ini * 1;

    let articulo = id ?? null;
    let idRef = null;

    const data = {
      nombre: nombre.toUpperCase().trim(),
      umedida,
      categoria,
      cantidades: JSON.stringify(toArray(cantidades)),
      descripcion: descripcion ? descripcion : null,
      caracteristicas: caracteristicas(rest, articulo)
      /* rest?.key_krt
        ? JSON.stringify(
            Array.isArray(rest?.key_krt)
              ? rest.key_krt
                  .map((key, i) => ({ [key]: rest.value_krt[i] }))
                  .reduce((e, c) => ({ ...e, ...c }), {})
              : { [rest.key_krt]: rest.value_krt }
          )
        : null */
    };

    console.log(req.body, 'req.body', data);
    // return res.send({ code: true });

    const referencias =
      !Array.isArray(ref) && ref
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
        'UPDATE articulos a LEFT JOIN articulo_ref r ON a.id = r.articulo SET ? WHERE a.id = ?',
        [{ ...data, ...referencias }, id]
      );

      await pool.query(`DELETE FROM articulo_ref WHERE articulo = ? AND ref NOT IN (?)`, [id, ref]);
    } else articulo = (await pool.query('INSERT INTO articulos SET ? ', data))?.insertId;

    if (Array.isArray(ref)) {
      const ar = [id, ref];
      const refs = id
        ? await pool.query(`SELECT id, ref FROM articulo_ref WHERE articulo = ? AND ref IN (?)`, ar)
        : [];

      const referencias = ref.map(item => ({
        code: refs.find(e => e.ref === item)?.id ?? null,
        articulo,
        ref: item,
        obj: JSON.stringify(
          toArray(rest[`key_${item}`])
            .map((key, i) => ({ [key]: toArray(rest[`value_${item}`])[i] }))
            .reduce((e, c) => ({ ...e, ...c }), {})
        ),
        ctd: (rest?.[`ctd_${item}`] ?? 0) * 1,
        cost: (rest?.[`cost_${item}`] ?? 0) * 1
      }));

      referencias.forEach(async (e, i) => {
        const { code, ctd, cost, ...data } = e;
        if (code) await pool.query(`UPDATE articulo_ref SET ? WHERE id = ?`, [data, code]);
        else {
          idRef = (await pool.query('INSERT INTO articulo_ref SET ? ', data))?.insertId;

          if (ctd)
            await createMovement({
              articulo,
              referencia: idRef,
              tipo: 'AJUSTE',
              umedida,
              cantidad: ctd,
              coste: cost,
              total: ctd * cost,
              stock: ctd,
              empresa: req.user.empresa
            });
        }
      });
    } else if (!id) {
      idRef = ref
        ? (await pool.query('INSERT INTO articulo_ref SET ? ', { articulo, ...referencias }))
            ?.insertId
        : null;

      if (init)
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

router.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM articulos WHERE id = ?`, id);
    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
