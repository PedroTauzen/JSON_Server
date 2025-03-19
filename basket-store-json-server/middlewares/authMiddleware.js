// /middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para verificar se o utilizador está autenticado
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Pega o header

    if (!authHeader) {
        return res.status(403).json({ message: 'Token não fornecido!' });
    }

    const token = authHeader.split(' ')[1]; // Remove "Bearer " e pega apenas o token

    if (!token) {
        return res.status(403).json({ message: 'Formato do token inválido!' });
    }

    jwt.verify(token, 'secreta', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido!' });
        }
        req.user = decoded; // Guarda os dados do token no req.user
        next();
    });
}

module.exports = verifyToken;
