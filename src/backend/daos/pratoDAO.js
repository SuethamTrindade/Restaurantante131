const Prato = require('../models/Prato');

module.exports = {
  list: () => Prato.find(),
  get: (id) => Prato.findById(id),
  create: (data) => Prato.create(data),
  update: (id, data) => Prato.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Prato.findByIdAndDelete(id),
};