const mongoose = require('mongoose');

const ItemPedidoSchema = new mongoose.Schema({
  pratoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prato', required: true },
  quantidade: { type: Number, required: true, min: 1 },
  precoUnitario: { type: Number, required: true, min: 0 },
});

const PedidoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  itens: { type: [ItemPedidoSchema], required: true },
  data: { type: Date, default: () => new Date() },
  valorTotal: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Pedido', PedidoSchema);