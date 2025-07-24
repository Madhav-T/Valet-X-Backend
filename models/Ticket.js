// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: String,
  carDetails: String,
  requestedAt: Date,
  confidenceScores: {
    A: Number,
    B: Number,
    C: Number,
    D: Number,
  },
  currentGate: String, 
  status: {
    type: String,
    enum: ['PENDING', 'DISPATCHED', 'EN_ROUTE', 'COMPLETED'],
    default: 'PENDING',
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
