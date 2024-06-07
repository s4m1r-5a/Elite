const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.CHAR(100),
      primaryKey: true,
      allowNull: false
    },
    pin: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      references: {
        model: 'pines',
        key: 'id'
      },
      foreignKey: 'pin',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },
    fullname: {
      type: DataTypes.CHAR(50),
      defaultValue: null
    },
    document: {
      type: DataTypes.CHAR(50),
      defaultValue: null
    },
    cel: {
      type: DataTypes.CHAR(20),
      defaultValue: null
    },
    username: {
      type: DataTypes.CHAR(50),
      defaultValue: null
    },
    password: {
      type: DataTypes.CHAR(60),
      defaultValue: null
    },
    imagen: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    nrango: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6
    },
    cli: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    sucursal: {
      type: DataTypes.DECIMAL(11, 3),
      defaultValue: null
    },
    rutas: {
      type: DataTypes.JSON,
      allowNull: false
    },
    bonoextra: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0.0
    },
    daterange: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    iva: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: 'responsable de iva'
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
    tableName: 'users',
    timestamps: true,
    charset: 'latin1',    
    collate: 'latin1_swedish_ci',    
    engine: 'InnoDB'
  }
);

module.exports = User;
