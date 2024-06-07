module.exports.ajustarInventario = async data => {
  const { articulo, referencia, orden, tipo, umedida, cantidad, coste, total, stock, empresa } =
    data;

  const transaction = await sequelize.transaction();
  try {
    const movimiento = await Movimiento.findOne({
      where: { articulo, referencia },
      order: [['createdAt', 'DESC']],
      lock: true, // Bloquear fila para evitar condiciones de carrera
      transaction
    });

    switch (tipo) {
      case 'VENTA':
        if (movimiento && movimiento.stock >= cantidad) {
          movimiento.stock -= cantidad;

          await movimiento.save({ transaction });
          await transaction.commit();
        } else {
          await transaction.rollback();
          throw new Error('Stock insuficiente');
        }
        break;
      case 'COMPRA' || 'AJUSTE':
        movimiento.stock += cantidad;

        await movimiento.save({ transaction });
        await transaction.commit();
        break;

      default:
        break;
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
