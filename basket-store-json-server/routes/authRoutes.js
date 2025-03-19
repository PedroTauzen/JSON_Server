const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Rota para login
router.post('/login', authController.login);

// Rota para logout
router.post('/logout', verifyToken, authController.logout);

module.exports = router;