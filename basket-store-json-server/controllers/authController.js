const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');
const { addToBlacklist } = require('../middleware/blacklist');

const JWT_SECRET = process.env.JWT_SECRET || 'secreta';

// Função para login
exports.login = (req, res) => {
    const { email, password } = req.body;

    const db = getDb();

    const user = db.users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Utilizador não encontrado!' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta!' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    });
};

// Função para logout
exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(400).json({ message: 'Token não fornecido!' });
    }

    const token = authHeader.split(' ')[1];

    addToBlacklist(token);

    res.status(200).json({ message: 'Logout bem-sucedido!' });
};

