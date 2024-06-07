const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Empresa = require('./Empresa');

const Chatbot = sequelize.define(
  'Chatbot',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    openai: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    codigo: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    credentialsGoogle: {
      type: DataTypes.JSON,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'http://144.126.212.222:6001'
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
    tableName: 'chatbots',
    timestamps: true,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

Chatbot.belongsTo(Empresa, { foreignKey: 'empresa', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Chatbot;
