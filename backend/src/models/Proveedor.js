const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');

// Tabla `proveedores`
const Proveedor = sequelize.define(
  'Proveedor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    nit: {
      type: DataTypes.CHAR(12),
      allowNull: true
    },
    contacto: {
      type: DataTypes.CHAR(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.CHAR(15),
      allowNull: true
    },
    email: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    direccion: {
      type: DataTypes.CHAR(100),
      allowNull: true
    },
    empresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'empresas',
        key: 'id'
      },
      foreignKey: 'empresa',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  },
  {
    tableName: 'proveedores',
    timestamps: false,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

module.exports = Proveedor;
