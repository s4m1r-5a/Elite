const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const User = require('./User');

// Tabla `empresas`
const Empresa = sequelize.define(
  'Empresa',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.CHAR(100),
      allowNull: true
    },
    pais: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      defaultValue: 'COL'
    },
    tipodoc: {
      type: DataTypes.ENUM('NIT', 'CC', 'TI'),
      allowNull: false,
      defaultValue: 'NIT'
    },
    numdoc: {
      type: DataTypes.CHAR(12),
      allowNull: false,
      defaultValue: 'COL'
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
      type: DataTypes.CHAR(70),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    metodos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    subdominio: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    dominio: {
      type: DataTypes.CHAR(50),
      allowNull: true
    },
    rutas: {
      type: DataTypes.JSON,
      allowNull: true
    },
    valoracion_inv: {
      type: DataTypes.ENUM('PEPS', 'UEPS', 'PROMEDIO'),
      allowNull: false,
      defaultValue: 'PROMEDIO'
    },
    admin: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      foreignKey: 'admin',
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
    tableName: 'empresas',
    timestamps: true,
    charset: 'latin1', 
    collate: 'latin1_swedish_ci',   
    engine: 'InnoDB'
  }
);

// Empresa.belongsTo(User, { foreignKey: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Empresa;
