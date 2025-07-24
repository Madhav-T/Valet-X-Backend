module.exports = function scoringEngine(sensorData) {
  // Simulated scoring logic
  const { ble, vector, dwell } = sensorData;

  const gates = ['A', 'B', 'C', 'D'];
  const scores = {};

  gates.forEach(gate => {
    const proximity = ble[gate] || 0;
    const direction = vector[gate] || 0;
    const dwellTime = dwell[gate] || 0;

    const score = (0.4 * proximity) + (0.4 * direction) + (0.2 * dwellTime);
    scores[gate] = Math.round(score);
  });

  return scores;
};
