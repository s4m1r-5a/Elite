const express = require('express');
const router = express.Router();
const pool = require('../database');
const axios = require('axios');
const moment = require('moment');
const { isLoggedIn, noExterno } = require('../lib/auth');
const { DeleteFile } = require('../utils/common');
const { consultPerson } = require('../services/consults');

//ALTER TABLE medicamentos ADD `empresa` INT NULL

router.get('/document/:docType/:docNumber', noExterno, async (req, res) => {
  const { docType, docNumber } = req.params;

  const [data] = await pool.query(
    `SELECT * FROM persons WHERE docType = ? AND docNumber = ? ORDER BY id DESC LIMIT 1`,
    [docType, docNumber]
  );

  if (data) return res.json(data);

  if (docType === 'CC') {
    const person = await consultPerson(docNumber);
    if (person) {
      const newPerson = await pool.query('INSERT INTO persons SET ?', person);
      return res.json({ ...person, id: newPerson?.insertId });
    }
  }

  return res.status(404).json({ message: 'No se encontraron datos' });
});

module.exports = router;
