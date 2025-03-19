const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Rota para adicionar um produto aos favoritos
// Apenas clientes podem adicionar aos favoritos
router.post('/favourites', verifyToken, roleMiddleware(['client']), favouriteController.addFavourite);

// Rota para listar os favoritos de um cliente
// Apenas clientes podem listar seus favoritos
router.get('/favourites', verifyToken, roleMiddleware(['client']), favouriteController.listFavourites);

// Rota para remover um produto dos favoritos
// Apenas clientes podem remover produtos dos favoritos
router.delete('/favourites/:productId', verifyToken, roleMiddleware(['client']), favouriteController.removeFavourite);

module.exports = router;
