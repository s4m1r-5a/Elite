const { sequelize } = require('../database');
const Movimiento = require('../models/Movimiento');

const getMovements = async (params = {}) => {
  try {
    return await Movimiento.find(params);
  } catch (error) {
    console.log(error.message);
    return [{ error: error.message }];
  }
};

const getMovement = async (params = {}) => {
  try {
    return await Movimiento.findOne(params); // .select('-createdAt -updatedAt -__v');
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

const createMovement = async data => {
  const transaction = await sequelize.transaction();
  try {
    const { articulo, referencia } = data;
    /* const movimiento = await Movimiento.findOne({
      where: { articulo, referencia },
      order: [['createdAt', 'DESC']],
      lock: true, // Bloquear fila para evitar condiciones de carrera
      transaction
    }); */

    // Buscar una fila y si no existe, crearla
    const [movimiento, created] = await Movimiento.findOrCreate({
      where: { articulo, referencia }, // Condiciones para buscar
      order: [['createdAt', 'DESC']],
      lock: true, // Bloquear fila para evitar condiciones de carrera
      defaults: data,
      transaction
    });

    if (created) {
      console.log('Nuevo movimiento creado:', movimiento.toJSON());
    } else {
      console.log('Movimiento encontrado:', movimiento.toJSON());
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.log(error.message, 'error al crear el createMovement');
    //   return error.message;
    throw error;
  }
};

const updateMovements = async (sets, params = {}) => {
  try {
    return await Movimiento.updateMany(params, { $set: sets });
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

const deleteMovement = async (sets, params = {}) => {
  try {
    return await Movimiento.updateMany(params, { $set: sets });
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

module.exports = {
  getMovements,
  getMovement,
  createMovement,
  updateMovements,
  deleteMovement
};
