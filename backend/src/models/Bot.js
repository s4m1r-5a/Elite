const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Chatbot = require('./Chatbot');

const Bot = sequelize.define(
  'Bot',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    phone: {
      type: DataTypes.CHAR(13),
      allowNull: false
    },
    code: {
      type: DataTypes.CHAR(5),
      allowNull: false
    },
    category: {
      type: DataTypes.CHAR(15),
      allowNull: false,
      defaultValue: 'SISTEMAS'
    },
    routes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    chatbot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chatbots',
        key: 'id'
      },
      foreignKey: 'chatbot',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    qr: {
      type: DataTypes.CHAR(50),
      allowNull: true
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
    tableName: 'bots',
    timestamps: true,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

Bot.belongsTo(Chatbot, { foreignKey: 'chatbot', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Bot;
