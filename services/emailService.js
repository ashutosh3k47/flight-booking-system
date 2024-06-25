require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(booking, pdfBuffer) {
    const msg = {
        to: booking.email, 
        from: 'ashutosh3k47@gmail.com', 
        subject: 'Booking Confirmation',
        text: `Your booking is confirmed. Details: Flight Number - ${booking.flightNumber}, Passenger Name - ${booking.passengerName}, Departure Date - ${booking.departureDate}, Seat Number - ${booking.seatNumber}`,
        attachments: [
            {
                content: pdfBuffer.toString('base64'),
                filename: 'booking.pdf',
                type: 'application/pdf',
                disposition: 'attachment'
            }
        ]
    };

    await sgMail.send(msg);
}

module.exports = { sendConfirmationEmail };
