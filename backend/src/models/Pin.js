const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Pines = sequelize.define(
  'Pines',
  {
    id: {
      type: DataTypes.CHAR(20),
      primaryKey: true,
      allowNull: false
    },
    categoria: {
      type: DataTypes.INTEGER,
      defaultValue: null
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
    fecha: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    usuario: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      foreignKey: 'usuario',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    acreedor: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      foreignKey: 'acreedor',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    fechactivacion: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    fechavencimiento: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    celular: {
      type: DataTypes.CHAR(20),
      defaultValue: null
    },
    admin: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    subadmin: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    contador: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    financiero: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    auxicontbl: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    asistente: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    externo: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    sucursal: {
      type: DataTypes.DECIMAL(11, 3),
      defaultValue: null
    },
    empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    mail: {
      type: DataTypes.CHAR(50),
      defaultValue: null
    },
    paths: {
      type: DataTypes.JSON,
      defaultValue: null
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
    tableName: 'pines',
    timestamps: true,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

module.exports = Pines;
