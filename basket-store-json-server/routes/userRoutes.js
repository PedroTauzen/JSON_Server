const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Rota para criar um cliente
router.post('/users/client', userController.registerClient);

// Rota para criar um vendedor
router.post('/users/seller', userController.registerSeller);

// Rota para obter informações do próprio utilizador cliente
// Exige autenticação e o papel do utilizador deve ser "client"
router.get('/users/:userId', verifyToken, (req, res, next) => {
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    next();
}, userController.getUserProfile);

// Rota para listar todos os utilizadores
// Apenas vendedores "seller" podem acessar essa rota
router.get('/users', verifyToken, roleMiddleware(['seller']), userController.listUsers);

// Rota para editar informações do utilizador
// Apenas o próprio utilizador pode editar seus dados
router.put('/users/:userId', verifyToken, (req, res, next) => {
    if (req.user.id !== parseInt(req.params.userId)) {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    next();
}, userController.updateUser);

// Rota para excluir um utilizador
// Vendedores podem excluir qualquer conta (administrativo), clientes não podem excluir sua conta
router.delete('/users/:userId', verifyToken, (req, res, next) => {
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    next();
}, userController.deleteUser);

module.exports = router;
