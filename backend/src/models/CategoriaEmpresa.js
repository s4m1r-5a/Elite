const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const CategoriaEmpresa = sequelize.define(
  'CategoriaEmpresa',
  {
    categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    tableName: 'categoria_empresa',
    timestamps: false,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

module.exports = CategoriaEmpresa;
