const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Orden = sequelize.define(
  'Orden',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    mesa: {
      type: DataTypes.INTEGER,
      references: {
        model: 'mesas',
        key: 'id'
      },
      foreignKey: 'mesa',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    comercio: {
      type: DataTypes.INTEGER,
      references: {
        model: 'comercios',
        key: 'id'
      },
      foreignKey: 'comercio',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    proveedor: {
      type: DataTypes.INTEGER,
      references: {
        model: 'proveedores',
        key: 'id'
      },
      foreignKey: 'proveedor',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    caja: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo: {
      type: DataTypes.ENUM('VENTA', 'COMPRA', 'DEVOLUCION', 'AJUSTE', 'TRASLADO', 'PRODUCCION'),
      allowNull: false,
      defaultValue: 'VENTA'
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      references: {
        model: 'estados',
        key: 'id'
      },
      foreignKey: 'estado',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    historial: {
      type: DataTypes.JSON,
      allowNull: true
    },
    total: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0.0
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      foreignKey: 'user',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'empresas',
        key: 'id'
      },
      foreignKey: 'empresa',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
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
    tableName: 'ordenes',
    timestamps: true,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

module.exports = Orden;
