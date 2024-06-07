const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Articulo = require('./Articulo');

const ArticuloRef = sequelize.define(
  'ArticuloRef',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
    ref: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    obj: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'articulo_ref',
    timestamps: false,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

ArticuloRef.belongsTo(Articulo, {
  foreignKey: 'articulo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = ArticuloRef;
