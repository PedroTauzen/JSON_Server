const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db.json');

// Função para login
exports.login = (req, res) => {
    const { email, password } = req.body;

    const user = db.users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado!' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta!' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, 'secreta', { expiresIn: '1h' });

        res.json({ token });
    });
};

// Função para logout
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logout bem-sucedido!' });
};

