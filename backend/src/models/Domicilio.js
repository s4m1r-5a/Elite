const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Orden = require('./Orden');
const User = require('./User');

const Domicilio = sequelize.define(
  'Domicilio',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recibe: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    movil: {
      type: DataTypes.CHAR(15),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    codigo_postal: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    latitud: {
      type: DataTypes.CHAR(15),
      allowNull: true
    },
    longitud: {
      type: DataTypes.CHAR(15),
      allowNull: true
    },
    estatus: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: '3'
    },
    pagar: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '0'
    },
    entregado: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    orden: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ordenes',
        key: 'id'
      },
      foreignKey: 'orden',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      foreignKey: 'user',
      onDelete: 'SET NULL',
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
    tableName: 'domicilios',
    timestamps: true,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

Domicilio.belongsTo(Orden, { foreignKey: 'orden', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Domicilio.belongsTo(User, { foreignKey: 'user', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = Domicilio;
