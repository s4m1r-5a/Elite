const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Person = sequelize.define(
  'Person',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    docType: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    docNumber: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(255),
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
      defaultValue: null
    },
    lastName: {
      type: DataTypes.STRING(255),
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
      defaultValue: null
    },
    arrayName: {
      type: DataTypes.JSON,
      defaultValue: null
    },
    createdAt: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      onUpdate: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    Antecedentes: {
      type: DataTypes.TEXT,
      defaultValue: null
    }
  },
  {
    tableName: 'persons',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
    engine: 'InnoDB'
  }
);

module.exports = Person;
