const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Articulo = require('./Articulo');
const Proveedor = require('./Proveedor');

// Tabla `articulo_proveedor`
const ArticuloProveedor = sequelize.define(
  'ArticuloProveedor',
  {
    articulo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'articulos',
        key: 'id'
      },
      foreignKey: 'articulo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    proveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proveedores',
        key: 'id'
      },
      foreignKey: 'proveedor',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    inventario: {
      type: DataTypes.ENUM('En Stock', 'Fuera de Stock'),
      allowNull: false,
      defaultValue: 'En Stock'
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    condicion: {
      type: DataTypes.ENUM('Nuevo', 'Usado', 'Reacondicionado'),
      allowNull: false,
      defaultValue: 'Nuevo'
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    popularidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    fecha_creacion: {
      type: DataTypes.TIMESTAMP,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    fecha_actualizacion: {
      type: DataTypes.TIMESTAMP,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'articulo_proveedor',
    timestamps: false,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

ArticuloProveedor.belongsTo(Articulo, {
  foreignKey: 'articulo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
ArticuloProveedor.belongsTo(Proveedor, {
  foreignKey: 'proveedor',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = ArticuloProveedor;
