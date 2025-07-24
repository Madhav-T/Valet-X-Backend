const Ticket = require('../models/Ticket');
const { processSensorUpdate } = require('../services/inferenceService');

// Create a new car request ticket
exports.requestCar = async (req, res) => {
  const { userId, carDetails } = req.body;

  try {
    const ticket = await Ticket.create({
      userId,
      carDetails,
      requestedAt: new Date(),
      confidenceScores: { A: 0, B: 0, C: 0, D: 0 },
      status: 'PENDING'
    });

    const io = req.app.get('io');
    io.emit('new_dispatch', ticket);

    res.status(201).json({ success: true, ticketId: ticket._id });
  } catch (error) {
    console.error('❌ Ticket creation failed:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


// Update sensor data for a ticket (BLE, GPS, IMU, etc.)
// Update sensor data for a ticket (BLE, GPS, IMU, etc.)
exports.updateSensorData = async (req, res) => {
  const { ticketId, sensors } = req.body;

  try {
    const result = await processSensorUpdate(ticketId, sensors, req.app);

    // Auto-dispatch logic when confident gate is predicted
    if (result.topGate && result.status === 'PENDING') {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          status: 'DISPATCHED',
          currentGate: result.topGate,
        },
        { new: true }
      );

      const io = req.app.get('io');
      io.emit('new_dispatch', updatedTicket);
    }

    res.json({
      updated: true,
      scores: result.scores,
      predictedGate: result.topGate,
      status: result.status,
    });
  } catch (error) {
    console.error('❌ Sensor update failed:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get all dispatched or en route tickets (for valet dashboard)
exports.getDispatchedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: { $in: ['DISPATCHED', 'EN_ROUTE'] } });
    res.json(tickets);
  } catch (error) {
    console.error('❌ Failed to fetch dispatched tickets:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update status of a ticket (e.g., mark as EN_ROUTE or DELIVERED)
exports.updateTicketStatus = async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });

    // Emit status update to frontends (optional enhancement)
    const io = req.app.get('io');
    io.emit('status_update', ticket);

    res.json({ updated: true });
  } catch (error) {
    console.error('❌ Failed to update ticket status:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
