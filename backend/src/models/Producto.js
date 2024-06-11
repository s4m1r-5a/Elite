const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Producto = sequelize.define(
  'Producto',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    category: {
      type: DataTypes.CHAR(50),
      defaultValue: null
    },
    precio: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0
    },
    descripcion: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    combo: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: DataTypes.CHAR(8),
      allowNull: false,
      defaultValue: 'UNITARIO',
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    imagen: {
      type: DataTypes.CHAR(100),
      defaultValue: null
    },
    empresa: {
      type: DataTypes.INTEGER,
      defaultValue: null
    }
  },
  {
    tableName: 'products',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
    engine: 'InnoDB'
  }
);

module.exports = Producto;
