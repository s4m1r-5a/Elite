const { Bots } = require('./bot-whatsapp/bots');
const { getBots } = require('./bot-whatsapp/repositories/bot.repository');
const Chatbot = require('./chatsWts.js');

module.exports.initBots = async () => {
  const bots = await getBots();
  if (bots.length) {
    for (var i = 0; i < bots.length; i++) {
      let bot = bots[i];
      Bots[bot.name] = new Chatbot(bot.name);
    }
  }
};
