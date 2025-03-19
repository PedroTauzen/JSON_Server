const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Rota para adicionar um novo produto
// Apenas vendedores podem adicionar produtos
router.post('/products', verifyToken, roleMiddleware(['seller']), productController.addProduct);

// Rota para editar um produto existente
// Apenas vendedores podem editar produtos
router.put('/products/:productId', verifyToken, roleMiddleware(['seller']), productController.editProduct);

// Rota para remover um produto
// Apenas vendedores podem remover produtos
router.delete('/products/:productId', verifyToken, roleMiddleware(['seller']), productController.deleteProduct);

// Rota para listar todos os produtos
// Todos os utilizadores podem ver a lista de produtos
router.get('/products', productController.listProducts);

// Rota para obter detalhes de um único produto
// Todos os utilizadores podem ver detalhes de um produto
router.get('/products/:productId', productController.getProductDetails);

module.exports = router;
