const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
// const Articulo = require('./Articulo');
// const Orden = require('./Orden');
// const Empresa = require('./Empresa');
// const ArticuloRef = require('./ArticuloRef');

const Movimiento = sequelize.define(
  'Movimiento',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    articulo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      /* references: {
        model: 'articulos',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE' */
    },
    referencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      /* references: {
        model: 'articulo_ref',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE' */
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: true,
      /* references: {
        model: 'ordenes',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE' */
    },
    tipo: {
      type: DataTypes.ENUM('VENTA', 'COMPRA', 'DEVOLUCION', 'AJUSTE', 'TRASLADO', 'PRODUCCION'),
      allowNull: false,
      defaultValue: 'VENTA'
    },
    umedida: {
      type: DataTypes.CHAR(3),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    coste: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0.0
    },
    promedio: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0.0
    },
    precio: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0.0
    },
    total: {
      type: DataTypes.DECIMAL(11, 4),
      allowNull: false,
      defaultValue: 0.0
    },
    stock: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    empresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id'
      },
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
    tableName: 'movimientos',
    timestamps: true,
    charset: 'latin1',
    engine: 'InnoDB'
  }
);

/* Movimiento.belongsTo(Articulo, {
  foreignKey: 'articulo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Movimiento.belongsTo(Empresa, { foreignKey: 'empresa', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Movimiento.belongsTo(Orden, { foreignKey: 'orden', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Movimiento.belongsTo(ArticuloRef, {
  foreignKey: 'referencia',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
}); */

module.exports = Movimiento;
