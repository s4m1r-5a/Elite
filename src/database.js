const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('La coneccion con la base de datos fue perdida.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Coneccion rechazada');
    }
  }

  if (connection) connection.release();
  console.log('Base de Datos conectada');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;
