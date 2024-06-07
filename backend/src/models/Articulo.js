const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Articulo = sequelize.define(
  'Articulo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    categoria: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('En Stock', 'Fuera de Stock'),
      defaultValue: 'En Stock'
    },
    caracteristicas: {
      type: DataTypes.JSON,
      defaultValue: null
    },
    umedida: {
      type: DataTypes.STRING(5),
      allowNull: false
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
    tableName: 'articulos',
    timestamps: true,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

module.exports = Articulo;
