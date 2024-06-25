const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendConfirmationEmail } = require('../services/emailService');
const { generatePDF } = require('../services/pdfService');

router.post('/', async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        const pdfBuffer = await generatePDF(booking);
        await sendConfirmationEmail(booking, pdfBuffer);

        const io = req.app.get('socketio');
        io.emit('bookingCreated', booking);

        res.status(201).send(booking);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.send(bookings);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!booking) return res.status(404).send();

        const io = req.app.get('socketio');
        io.emit('bookingUpdated', booking);

        res.send(booking);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).send();

        const io = req.app.get('socketio');
        io.emit('bookingDeleted', booking);

        res.send(booking);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
