const { getDb, saveDb } = require('../database/db');
const moment = require('moment');

// Adicionar um novo produto (apenas vendedores)
exports.addProduct = (req, res) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Apenas vendedores podem adicionar produtos!" });
    }

    const { title, price, description, category, image, stock } = req.body;

    if (!title || !price || !description || !category || !image || stock === undefined) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    if (stock < 0) {
        return res.status(400).json({ message: "O stock não pode ser negativo!" });
    }

    const db = getDb();

    const newProduct = {
        id: db.products.length ? db.products[db.products.length - 1].id + 1 : 1,
        title,
        price,
        description,
        category,
        image,
        stock,
        createdAt: moment().format('DD/MM/YYYY - HH:mm:ss')
    };

    db.products.push(newProduct);
    saveDb(db);

    res.status(201).json({ message: "Produto criado com sucesso!", product: newProduct });
};

// Listar todos os produtos
exports.listProducts = (req, res) => {
    const db = getDb();
    res.json(db.products);
};

// Obter detalhes de um único produto
exports.getProductDetails = (req, res) => {
    const db = getDb();
    const productId = parseInt(req.params.productId);
    const product = db.products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: "Produto não encontrado!" });
    }

    res.json(product);
};

// Editar um produto (apenas vendedores)
exports.editProduct = (req, res) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Apenas vendedores podem editar produtos!" });
    }

    const db = getDb();
    const productId = parseInt(req.params.productId);
    const productIndex = db.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Produto não encontrado!" });
    }

    const { title, price, description, category, image, stock } = req.body;

    db.products[productIndex] = {
        ...db.products[productIndex],
        title: title || db.products[productIndex].title,
        price: price || db.products[productIndex].price,
        description: description || db.products[productIndex].description,
        category: category || db.products[productIndex].category,
        image: image || db.products[productIndex].image,
        stock: stock !== undefined ? stock : db.products[productIndex].stock
    };

    saveDb(db);

    res.json({ message: "Produto atualizado com sucesso!", product: db.products[productIndex] });
};

// Remover um produto (apenas vendedores)
exports.deleteProduct = (req, res) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Apenas vendedores podem remover produtos!" });
    }

    const db = getDb();
    const productId = parseInt(req.params.productId);
    const productIndex = db.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Produto não encontrado!" });
    }

    db.products.splice(productIndex, 1);
    saveDb(db);

    res.json({ message: "Produto removido com sucesso!" });
};
