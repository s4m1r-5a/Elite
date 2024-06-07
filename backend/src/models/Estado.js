const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Estado = sequelize.define(
  'Estado',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    estado: {
      type: DataTypes.CHAR(20),
      allowNull: false
    }
  },
  {
    tableName: 'estados',
    timestamps: false,
    charset: 'latin1',
    collate: 'latin1_general_ci',
    engine: 'InnoDB'
  }
);

module.exports = Estado;
