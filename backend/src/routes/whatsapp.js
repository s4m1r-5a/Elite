const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');
const axios = require('axios');
const request = require('request');

//ALTER TABLE medicamentos ADD `empresa` INT NULL
router.get('/', isLoggedIn, async (req, res) => {
  res.render('whatsapp');
});

router.get('/qr/:bot', isLoggedIn, async (req, res) => {
  const { bot } = req.params;
  const [Bot] = await pool.query(`SELECT * FROM bots AS b WHERE b.code = ?`, bot);

  if (!Bot) return;

  request(Bot?.qr).pipe(res);
});

router.get('/run/:bot', isLoggedIn, async (req, res) => {
  const { bot } = req.params;
  const [chatBot] = await pool.query(
    `SELECT * FROM chatbots AS c INNER JOIN bots AS b ON c.id = b.chatbot WHERE b.code = ?`,
    bot
  );

  if (!chatBot) return;

  const reqOptions = {
    url: chatBot?.url + '/api/chatbot/run/' + bot,
    method: 'GET',
    headers: {
      token: chatBot?.token
    }
  };
  try {
    const response = await axios.request(reqOptions);
    console.log(response.data);

    res.json({ data: response.data });
  } catch (error) {
    console.log(error.response.data);
    res.json({ data: null });
  }
});

router.get('/table', noExterno, async (req, res) => {
  const [chatBot] = await pool.query(
    `SELECT * FROM chatbots AS c WHERE c.empresa = ?`,
    req.user.empresa
  );

  if (!chatBot) return;

  const reqOptions = {
    url: chatBot?.url + '/api/chatbot/',
    method: 'GET',
    headers: {
      token: chatBot?.token
    }
  };

  const response = await axios.request(reqOptions);
  console.log(response.data);

  res.json({ data: response.data });
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
