const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const verifyToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Rota para criar uma nova encomenda
// Apenas clientes podem fazer encomendas
router.post('/orders', verifyToken, roleMiddleware(['client']), ordersController.createOrder);

// Rota para listar as encomendas de um cliente
// Apenas clientes podem listar suas encomendas
router.get('/orders', verifyToken, roleMiddleware(['client']), ordersController.listClientOrders);

// Rota para listar todas as encomendas (apenas para vendedores)
// Apenas vendedores podem ver todas as encomendas
router.get('/orders/all', verifyToken, roleMiddleware(['seller']), ordersController.listAllOrders);

// Rota para atualizar o status da encomenda (apenas para vendedores)
// Apenas vendedores podem atualizar o status da encomenda
router.put('/orders/:orderId', verifyToken, roleMiddleware(['seller']), ordersController.updateOrderStatus);

module.exports = router;
