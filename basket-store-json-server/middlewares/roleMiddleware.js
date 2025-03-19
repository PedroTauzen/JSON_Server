// /middlewares/roleMiddleware.js
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Se o papel do usuário não estiver nos papéis permitidos, retorna erro
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
        }
        // Se o papel for permitido, passa para o próximo middleware ou rota
        next();
    };
};

module.exports = roleMiddleware;
