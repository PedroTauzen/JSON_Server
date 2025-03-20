const { getDb, saveDb } = require('../database/db');
const db = getDb();

// Função para criar uma encomenda
exports.createOrder = (req, res) => {
    const userId = req.user.id;
    const cart = db.carts.find(cart => cart.userId === userId);

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Carrinho vazio! Adicione produtos ao carrinho antes de fazer a encomenda.' });
    }

    let totalPrice = 0;
    const orderItems = [];

    // Calcula o preço total e prepara os itens da encomenda
    cart.items.forEach(item => {
        const product = db.products.find(p => p.id === item.productId);
        totalPrice += product.price * item.quantity;
        orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
        });
    });

    // Cria a nova encomenda
    const newOrder = {
        orderId: db.orders.length + 1,
        userId,
        orderDate: moment().format('DD/MM/YYYY - HH:mm:ss'),
        status: 'pending',
        items: orderItems,
        totalPrice
    };

    db.orders.push(newOrder);
    db.carts = db.carts.filter(cart => cart.userId !== userId); // Limpa o carrinho após a encomenda

    saveDb(db);

    res.status(201).json({ message: 'Encomenda criada com sucesso!', order: newOrder });
};

// Função para listar as encomendas de um cliente
exports.listClientOrders = (req, res) => {
    const userId = req.user.id;

    // Filtra as encomendas do cliente
    const userOrders = db.orders.filter(order => order.userId === userId);

    if (userOrders.length === 0) {
        return res.status(404).json({ message: 'Nenhuma encomenda encontrada!' });
    }

    res.json(userOrders);
};

// Função para listar todas as encomendas (apenas para vendedores)
exports.listAllOrders = (req, res) => {
    // Verifica se o usuário é um vendedor
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Apenas vendedores podem ver todas as encomendas!' });
    }

    res.json(db.orders);
};

// Função para atualizar o status de uma encomenda (apenas para vendedores)
exports.updateOrderStatus = (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const { status } = req.body;

    const order = db.orders.find(order => order.orderId === orderId);
    if (!order) {
        return res.status(404).json({ message: 'Encomenda não encontrada!' });
    }

    // Atualiza o status da encomenda
    order.status = status;

    saveDb(db); // Salva as alterações no banco de dados

    res.json({ message: 'Status da encomenda atualizado!', order });
};
