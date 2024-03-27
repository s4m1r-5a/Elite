const mongoose = require('mongoose');
/* const ArraySchema = new mongoose.Schema({
  name: { type: Number, required: false }
}); */
const botSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      default: null
    },
    user: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    },
    tokens: {
      type: Number,
      required: true,
      default: 0
    },
    profile: {
      type: Object,
      required: false
    },
    options: {
      type: Object,
      required: true,
      default: { provider: 'whatsapp-web', tokens: 0 }
    },
    users: {
      type: [mongoose.Schema.Types.String], // Definir 'users' como un arreglo de objetos String
      required: false
    },
    type: {
      type: String,
      required: true,
      default: 'business'
    },
    status: {
      type: String,
      required: true,
      default: 'disconnected'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bot', botSchema);
