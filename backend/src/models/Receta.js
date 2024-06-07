const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Recetas = sequelize.define(
  'Recetas',
  {
    code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    articulo: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    ref: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    grupo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receta: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    cantidad: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0.0
    },
    nota: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    visible: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    categorias: {
      type: DataTypes.JSON,
      defaultValue: null
    }
  },
  {
    tableName: 'recetas',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
    engine: 'InnoDB'
  }
);

module.exports = Recetas;
