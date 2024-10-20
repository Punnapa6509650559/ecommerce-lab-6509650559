const express = require('express');
const app = express();
app.use(express.json());
let products = [
    { id: 1, name: 'Laptop', price: 1000, stock: 5 },
    { id: 2, name: 'Smartphone', price: 600, stock: 10 }
];
// GET /products - Get all products
app.get('/products', (req, res) => {
    res.status(200).json(products);
});
// GET /products/:id - Get a product by ID
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});
// POST /products - Add a new product
app.post('/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
// PUT /products/:id - Update a product by ID
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});
// DELETE /products/:id - Delete a product by ID
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.status(200).json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});
module.exports = app;