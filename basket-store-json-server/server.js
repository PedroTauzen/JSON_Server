const express = require('express');
const cors = require('cors');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Importação dos Middleware
const authMiddleware = require('./middlewares/authMiddleware');
const roleMiddleware = require('./middlewares/roleMiddleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(authMiddleware);
app.use(roleMiddleware);

// Rotas modularizadas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/favourites', favouriteRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
