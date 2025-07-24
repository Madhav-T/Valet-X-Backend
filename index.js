// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const valetRoutes = require('./routes/valetRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP server for Socket.IO
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // update this for production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store io instance in app
app.set('io', io);

// Routes
app.use('/api/valet', valetRoutes);

// Connect DB and start HTTP+Socket server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server with Socket.IO running on port ${PORT}`);
  });
});
