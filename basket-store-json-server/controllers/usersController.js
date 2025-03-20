const { getDb, saveDb } = require('../database/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');

// Função para registrar um cliente
exports.registerClient = async (req, res) => {
    const { name, surname, email, password, deliveryAddress, phoneNumber } = req.body;

    const db = getDb();

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!name || !surname || !email || !password || !deliveryAddress || !phoneNumber) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // Verifica se o email já existe no sistema
    const userExist = db.users.find(user => user.email === email);
    if (userExist) {
        return res.status(400).json({ message: 'Este email já está registado!' });
    }

    // Hash da senha antes de armazenar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;

    const newUser = {
        id: newId,
        name,
        surname,
        email,
        password: hashedPassword,
        role: "client",
        createdAt: moment().format('DD/MM/YYYY - HH:mm:ss'),
        deliveryAddress,
        phoneNumber
    };

    db.users.push(newUser);
    saveDb(db);

    res.status(201).json({ message: 'Cliente criado com sucesso!', user: { ...newUser, password: undefined } });
};

// Função para registrar um vendedor
exports.registerSeller = async (req, res) => {
    const { name, surname, email, password, storeName, storeDescription, contactPhone, address } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!name || !surname || !email || !password || !storeName || !storeDescription || !contactPhone || !address) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    const db = getDb();

    // Verifica se o email já existe no sistema
    const userExist = db.users.find(user => user.email === email);
    if (userExist) {
        return res.status(400).json({ message: 'Este email já está registado!' });
    }

    // Hash da senha antes de armazenar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;

    const newSeller = {
        id: newId,
        name,
        surname,
        email,
        password: hashedPassword,
        role: "seller",
        createdAt: moment().format('DD/MM/YYYY - HH:mm:ss'),
        storeName,
        storeDescription,
        contactPhone,
        address
    };

    db.users.push(newSeller);

    saveDb(db);

    res.status(201).json({ message: 'Vendedor criado com sucesso!', user: { ...newSeller, password: undefined } });
};

// Função para obter o perfil de um cliente
exports.getUserProfile = (req, res) => {

    const db = getDb();

    if (!req.user) {
        return res.status(401).json({ message: "Acesso não autorizado!" });
    }

    const user = db.users.find(user => user.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Utilizador não encontrado!' });
    }

    const { password, ...userData } = user;
    res.json(userData);
};

// Função para listar todos os utilizadores
exports.listUsers = (req, res) => {
    const db = getDb();

    const usersWithoutPasswords = db.users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
};

// Função para atualizar dados de um cliente
exports.updateUser = async (req, res) => {
    const db = getDb();

    if (!req.user) {
        return res.status(401).json({ message: "Acesso não autorizado!" });
    }

    const user = db.users.find(user => user.id === parseInt(req.params.userId));

    if (!user) {
        return res.status(404).json({ message: 'Utilizador não encontrado!' });
    }

    // Verifica se o utilizador tem permissão para editar
    if (req.user.id !== user.id) {
        return res.status(403).json({ message: 'Não pode modificar este utilizador!' });
    }

    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    Object.assign(user, req.body);
    saveDb(db);

    const { password, ...updatedUser } = user;
    res.json({ message: 'Dados atualizados com sucesso!', user: updatedUser });
};

// Função para deletar um utilizador
exports.deleteUser = (req, res) => {
    const db = getDb();

    if (!req.user) {
        return res.status(401).json({ message: "Acesso não autorizado!" });
    }

    const index = db.users.findIndex(user => user.id === parseInt(req.params.userId));

    if (index === -1) {
        return res.status(404).json({ message: 'Utilizador não encontrado!' });
    }

    const user = db.users[index];

    // Verifica se o utilizador tem permissão para deletar
    if (req.user.id !== user.id && req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }

    db.users.splice(index, 1);
    saveDb(db);

    res.json({ message: 'Utilizador removido com sucesso!' });
};
