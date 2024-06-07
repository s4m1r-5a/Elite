const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../database');
const Person = require('./Person');
const User = require('./User');
const Empresa = require('./Empresa');

const Comercio = sequelize.define(
  'Comercio',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nit: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    movil: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    person: {
      type: DataTypes.INTEGER,
      references: {
        model: 'persons',
        key: 'id'
      },
      foreignKey: 'person',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    latitud: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    longitud: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    asesor: {
      type: DataTypes.STRING(100),
      references: {
        model: 'users',
        key: 'id'
      },
      foreignKey: 'asesor',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id'
      },
      foreignKey: 'empresa',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    creado: {
      type: DataTypes.TIMESTAMP,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    actualizado: {
      type: DataTypes.TIMESTAMP,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    estado: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    tableName: 'comercios',
    timestamps: false,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

Comercio.belongsTo(Person, { foreignKey: 'person', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Comercio.belongsTo(User, { foreignKey: 'asesor', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Comercio.belongsTo(Empresa, { foreignKey: 'empresa', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Comercio;
