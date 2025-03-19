const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const orderController = require('../controllers/orderController');

// Rota para criar uma nova encomenda
// Apenas clientes podem fazer encomendas
router.post('/orders', verifyToken, roleMiddleware(['client']), orderController.createOrder);

// Rota para listar as encomendas de um cliente
// Apenas clientes podem listar suas encomendas
router.get('/orders', verifyToken, roleMiddleware(['client']), orderController.listClientOrders);

// Rota para listar todas as encomendas (apenas para vendedores)
// Apenas vendedores podem ver todas as encomendas
router.get('/orders/all', verifyToken, roleMiddleware(['seller']), orderController.listAllOrders);

// Rota para atualizar o status da encomenda (apenas para vendedores)
// Apenas vendedores podem atualizar o status da encomenda
router.put('/orders/:orderId', verifyToken, roleMiddleware(['seller']), orderController.updateOrderStatus);

module.exports = router;
