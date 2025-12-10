const mongoose = require('mongoose');

const PratoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true, min: 0 },
  categoria: { type: String, required: true },
  ingredientes: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Prato', PratoSchema);