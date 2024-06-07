const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Pedidos = sequelize.define(
  'Pedidos',
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
    producto: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unitario: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false
    },
    monto: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nota: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    creado: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    actualizado: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    agente: {
      type: DataTypes.CHAR(100),
      charset: 'latin1',
      collate: 'latin1_swedish_ci',
      defaultValue: null
    },
    preparado: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    facturado: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    ref: {
      type: DataTypes.CHAR(10),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'pedidos',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
    engine: 'InnoDB'
  }
);

module.exports = Pedidos;
