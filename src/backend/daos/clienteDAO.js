const Cliente = require('../models/Cliente');

module.exports = {
  list: () => Cliente.find(),
  get: (id) => Cliente.findById(id),
  create: (data) => Cliente.create(data),
  update: (id, data) => Cliente.findByIdAndUpdate(id, data, { new: true }),
  remove: (id) => Cliente.findByIdAndDelete(id),
};