const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Mesa = sequelize.define(
  'Mesa',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    zona: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    name: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    puestos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Disponible', 'Ocupada', 'Reservada'),
      defaultValue: 'Disponible'
    },
    mesero: {
      type: DataTypes.CHAR(50),
      allowNull: true
    }
  },
  {
    tableName: 'mesas',
    timestamps: false,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

module.exports = Mesa;
