let WSS, beholder, exchange;

const notificacion = (broadcastLabel, logs) => {
  //if (!exchange) return new Error(`Exchange Monitor not initialized yet!`);
  if (broadcastLabel && WSS) WSS.broadcast({ [broadcastLabel]: logs });
  //console.log(`notificacion a iniciado ${broadcastLabel}!  ${logs}`);
};

const authNotified = (userId, datObjt) => {
  if (WSS) WSS.direct(userId, { authNotified: datObjt });
};

const init = async (wssInstance, beholderInstance) => {
  WSS = wssInstance;
  beholder = beholderInstance;
  //exchange = require('./utils/exchange')(settings);

  setTimeout(() => {
    notificacion(
      'Notificacion',
      'El servidor se acaba de sincronizar con las notificaciones'
    );
  }, 500);

  console.log('App Exchange Monitor is running!');
};

module.exports = { init, notificacion, authNotified };
