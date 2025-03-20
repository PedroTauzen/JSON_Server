const { getDb, saveDb } = require('../database/db');
const db = getDb();

// Função para adicionar um produto ao carrinho
exports.addToCart = (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Verifica se o produto existe
    const product = db.products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado!' });
    }

    // Encontra o carrinho do cliente ou cria um novo
    let cart = db.carts.find(cart => cart.userId === userId);
    if (!cart) {
        cart = { userId, items: [] };
        db.carts.push(cart);
    }

    // Verifica se o produto já está no carrinho
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;  // Atualiza a quantidade
    } else {
        cart.items.push({ productId, quantity });  // Adiciona novo produto
    }

    saveDb(db);

    res.status(201).json({ message: 'Produto adicionado ao carrinho!' });
};

// Função para listar os itens do carrinho de um cliente
exports.listCartItems = (req, res) => {
    const userId = req.user.id;

    // Encontra o carrinho do cliente
    const cart = db.carts.find(cart => cart.userId === userId);
    if (!cart) {
        return res.status(404).json({ message: 'Carrinho vazio ou não encontrado!' });
    }

    // Mapeia os itens do carrinho para incluir as informações dos produtos
    const cartItems = cart.items.map(item => {
        const product = db.products.find(p => p.id === item.productId);
        return {
            productId: item.productId,
            title: product.title,
            price: product.price,
            quantity: item.quantity,
            total: product.price * item.quantity
        };
    });

    res.json(cartItems);
};

// Função para atualizar a quantidade de um produto no carrinho
exports.updateCartQuantity = (req, res) => {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;

    const cart = db.carts.find(cart => cart.userId === userId);
    if (!cart) {
        return res.status(404).json({ message: 'Carrinho não encontrado!' });
    }

    const item = cart.items.find(i => i.productId === productId);
    if (!item) {
        return res.status(404).json({ message: 'Produto não encontrado no carrinho!' });
    }

    // Atualiza a quantidade do produto
    item.quantity = quantity;

    saveDb(db);

    res.json({ message: 'Quantidade do produto atualizada no carrinho!' });
};

// Função para remover um produto do carrinho
exports.removeFromCart = (req, res) => {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);

    const cart = db.carts.find(cart => cart.userId === userId);
    if (!cart) {
        return res.status(404).json({ message: 'Carrinho não encontrado!' });
    }

    const productIndex = cart.items.findIndex(i => i.productId === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Produto não encontrado no carrinho!' });
    }

    // Remove o produto do carrinho
    cart.items.splice(productIndex, 1);

    saveDb(db);

    res.json({ message: 'Produto removido do carrinho!' });
};
