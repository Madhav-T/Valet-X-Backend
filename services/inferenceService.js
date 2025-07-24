const Ticket = require('../models/Ticket');

// Simulated score computation from sensor data (BLE, GPS, etc.)
function computeConfidence(sensorData) {
  // Example logic: Lower distance means higher confidence
  const confidence = {};
  const gates = ['A', 'B', 'C', 'D'];

  gates.forEach(gate => {
    const dist = sensorData[gate];
    confidence[gate] = dist ? 1 / dist : 0; // inverse of distance
  });

  return confidence;
}

exports.processSensorUpdate = async (ticketId, sensors) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Ensure confidenceScores exist
    let scores = ticket.confidenceScores || { A: 0, B: 0, C: 0, D: 0 };

    // Compute new confidence scores from sensor update
    const deltaScores = computeConfidence(sensors);

    // Add to existing scores
    for (const gate in deltaScores) {
      scores[gate] = (scores[gate] || 0) + deltaScores[gate];
    }

    // Find top gate
    const topGate = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    // Update ticket
    ticket.confidenceScores = scores;

    if (scores[topGate] > 5) {
      ticket.status = 'DISPATCHED';
      ticket.assignedGate = topGate;
    }

    await ticket.save();

    return {
      scores,
      topGate,
      status: ticket.status,
    };
  } catch (error) {
    console.error('❌ Inference processing failed:', error.message);
    throw error;
  }
};
