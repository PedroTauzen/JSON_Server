const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');
const verifyToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Rota para adicionar um produto ao carrinho
// Apenas clientes podem adicionar produtos ao carrinho
router.post('/carts', verifyToken, roleMiddleware(['client']), cartsController.addToCart);

// Rota para listar os itens do carrinho do cliente
// Apenas clientes podem listar os itens do carrinho
router.get('/carts', verifyToken, roleMiddleware(['client']), cartsController.listCartItems);

// Rota para atualizar a quantidade de um produto no carrinho
// Apenas clientes podem atualizar a quantidade de um produto no carrinho
router.put('/carts/:productId', verifyToken, roleMiddleware(['client']), cartsController.updateCartQuantity);

// Rota para remover um produto do carrinho
// Apenas clientes podem remover produtos do carrinho
router.delete('/carts/:productId', verifyToken, roleMiddleware(['client']), cartsController.removeFromCart);

module.exports = router;
