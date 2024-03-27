require('dotenv').config();
const { createBot, createProvider, createFlow } = require('./bot-whatsapp/index.js');
const BaileysProvider = require('./bot-whatsapp/provider/baileys/index.js');
const { employeesAddon } = require('./bot-whatsapp/provider/openai/index.js');
const giveVoiceNote = require('./bot-whatsapp/smartFlow/giveVoiceNote.js');
const welcome = require('./bot-whatsapp/smartFlow/welcome.js');
const bye = require('./bot-whatsapp/smartFlow/bye.js');
const givePdf = require('./bot-whatsapp/smartFlow/givePdf.js');
const giveMedia = require('./bot-whatsapp/smartFlow/giveMedia.js');
const turnOff = require('./bot-whatsapp/smartFlow/turnOff.js');
const turnOn = require('./bot-whatsapp/smartFlow/turnOn.js');
const thankyou = require('./bot-whatsapp/smartFlow/thankyou.js');
const fallBackEmail = require('./bot-whatsapp/smartFlow/fallBackEmail.js');
const notEmployee = require('./bot-whatsapp/smartFlow/notEmployee.js');
const ventasFlow = require('./bot-whatsapp/smartFlow/ventas.flow.js');
const expertFlow = require('./bot-whatsapp/smartFlow/expert.flow.js');
const linkPayFlow = require('./bot-whatsapp/smartFlow/linkPay.flow.js');
const greetingFlow = require('./bot-whatsapp/smartFlow/greeting.flow.js');
const agentFlow = require('./bot-whatsapp/smartFlow/agent.flow.js');
const MongoAdapter = require('./bot-whatsapp/database/mongo/controller.js');

const mongoAdapter = new MongoAdapter();

/* ESTO SE TIENE QUE REMPLAZAR */
const flowsAgents = [
  ventasFlow,
  expertFlow,
  linkPayFlow,
  greetingFlow,
  agentFlow
];

const flows = [
  welcome,
  giveVoiceNote,
  bye,
  givePdf,
  giveMedia,
  turnOff,
  turnOn,
  thankyou,
  fallBackEmail,
  notEmployee
];
//console.log(JSON.stringify([ventasFlow, greetingFlow, welcome], null, 2));
const employees = async (flows, adapterDB) => {
  let listAgents = await adapterDB.getAgents();
  listAgents = listAgents.map(agent => {
    agent.flow = flows[parseInt(agent.flows)];
    return agent;
  });

  return listAgents;
};

(async () => {
  const listEmployees = await employees(flowsAgents, mongoAdapter);
  employeesAddon.employees(listEmployees);
})();

/**
 * - Como segundo argumento podemos pasar properties como globalState, extensions
 * - Como tercer argumento una funcion que se ejecute internamente como un listener
 */

class Chatbot {
  chat;
  constructor(name) {
    this.name = name;
    this.start();
  }

  async start() {
    this.chat = await createBot(
      {
        name: this.name,
        flow: await createFlow([...flowsAgents, ...flows]),
        provider: await createProvider(BaileysProvider, {
          name: this.name,
          database: mongoAdapter
        }),
        database: mongoAdapter
      },
      {
        globalState: {
          status: true
        },
        extensions: {
          employeesAddon,
          database: mongoAdapter
        }
      }
    );
  }
}

module.exports = Chatbot; // Exporta la clase Chatbot para poder importarla en otros archivos
