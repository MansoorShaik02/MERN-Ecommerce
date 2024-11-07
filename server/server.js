const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const productRoutes = require('./routes/product');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Notify the client when a product is added or updated
    socket.on('productUpdated', () => {
        io.emit('productUpdated'); // Emit event to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
