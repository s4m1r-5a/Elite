const { SMTP } = require('../keys.js');
const { createTransport } = require('nodemailer');
module.exports.transporter = async auth => {
  try {
    const transporter = createTransport(auth?.user ? { ...SMTP, auth } : SMTP);
    const verify = transporter.verify();
    console.log('listo para el envio de Emails');
    return transporter;
  } catch (error) {
    console.error('Error:', error.message, 'mails.js:transporter');
    return { error: error.message };
  }
};
