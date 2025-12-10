const express = require('express');
const pratoDAO = require('../daos/pratoDAO');
const clienteDAO = require('../daos/clienteDAO');
const pedidoDAO = require('../daos/pedidoDAO');
const controller = require('../controllers/crudController');

const router = express.Router();

// Pratos
router.get('/pratos', controller(pratoDAO).list);
router.get('/pratos/:id', controller(pratoDAO).get);
router.post('/pratos', controller(pratoDAO).create);
router.put('/pratos/:id', controller(pratoDAO).update);
router.delete('/pratos/:id', controller(pratoDAO).remove);

// Clientes
router.get('/clientes', controller(clienteDAO).list);
router.get('/clientes/:id', controller(clienteDAO).get);
router.post('/clientes', controller(clienteDAO).create);
router.put('/clientes/:id', controller(clienteDAO).update);
router.delete('/clientes/:id', controller(clienteDAO).remove);

// Pedidos
router.get('/pedidos', controller(pedidoDAO).list);
router.get('/pedidos/:id', controller(pedidoDAO).get);
router.post('/pedidos', controller(pedidoDAO).create);
router.put('/pedidos/:id', controller(pedidoDAO).update);
router.delete('/pedidos/:id', controller(pedidoDAO).remove);

module.exports = router;