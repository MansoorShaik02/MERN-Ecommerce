const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');

// POST route to add a product
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const imageUrl = req.file.path;

        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl,
        });

        await newProduct.save();

        // Emit a WebSocket event to notify all clients
        req.io.emit('productUpdated'); // This emits to all connected clients

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET route to fetch all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
