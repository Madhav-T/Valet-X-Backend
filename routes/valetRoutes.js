const express = require('express');
const router = express.Router();
const { requestCar, updateSensorData, getDispatchedTickets, updateTicketStatus } = require('../controllers/valetController');

router.post('/request', requestCar);
router.post('/update', updateSensorData);
router.get('/dispatched', getDispatchedTickets);
router.put('/status/:ticketId', updateTicketStatus);

module.exports = router;
