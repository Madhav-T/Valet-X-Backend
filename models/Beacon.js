// backend/models/Beacon.js

const mongoose = require('mongoose');

const beaconSchema = new mongoose.Schema({
  beaconId: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    x: Number, // optional simulated coordinates
    y: Number,
  },
  zone: {
    type: String, // optional grouping: 'GateA_Corridor', 'FoodCourt', etc.
  }
});

module.exports = mongoose.model('Beacon', beaconSchema);
