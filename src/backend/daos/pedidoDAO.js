const Pedido = require('../models/Pedido');

module.exports = {
  list: () => Pedido.find(),
  get: (id) => Pedido.findById(id),
  create: (data) => Pedido.create(data),
  update: (id, data) => Pedido.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Pedido.findByIdAndDelete(id),
};