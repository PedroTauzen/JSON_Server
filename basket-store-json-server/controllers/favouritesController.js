const { getDb, saveDb } = require('../database/db');
const db = getDb(); // Carrega o banco de dados

// Função para adicionar um produto aos favoritos
exports.addFavourite = (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    // Verifica se o produto já está nos favoritos
    const alreadyFavorited = db.favourites.some(fav => fav.userId === userId && fav.productId === productId);
    if (alreadyFavorited) {
        return res.status(400).json({ message: 'Produto já está nos favoritos!' });
    }

    // Adiciona o novo favorito
    db.favourites.push({ userId, productId });

    saveDb(db);

    res.status(201).json({ message: 'Produto adicionado aos favoritos!' });
};

// Função para listar os favoritos de um cliente
exports.listFavourites = (req, res) => {
    const userId = req.user.id;

    // Filtra os favoritos do cliente
    const userFavourites = db.favourites
        .filter(fav => fav.userId === userId)
        .map(fav => {
            const product = db.products.find(p => p.id === fav.productId);
            return product ? { productId: fav.productId, title: product.title, price: product.price, image: product.image } : null;
        })
        .filter(item => item !== null);

    res.json(userFavourites);
};

// Função para remover um produto dos favoritos
exports.removeFavourite = (req, res) => {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);

    const favIndex = db.favourites.findIndex(fav => fav.userId === userId && fav.productId === productId);
    if (favIndex === -1) {
        return res.status(404).json({ message: 'Produto não encontrado nos favoritos!' });
    }

    db.favourites.splice(favIndex, 1);  // Remove o favorito
    saveDb(db);

    res.json({ message: 'Produto removido dos favoritos!' });
};
