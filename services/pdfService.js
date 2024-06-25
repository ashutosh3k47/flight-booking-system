const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');
const fs = require('fs');

async function generatePDF(booking) {
    try {
        // Render the EJS template to HTML string
        const html = await ejs.renderFile(path.join(__dirname, '../templates/booking.ejs'), { booking });

        // Define PDF options
        const options = {
            format: 'Letter',  // or 'A4' etc.
            border: {
                top: '0.5in',  // default is 0, units: mm, cm, in, px
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            paginationOffset: 1, // Override the initial pagination number
            header: {
                height: '45mm',
                contents: '<div style="text-align: center;">Booking Details</div>'
            }
        };

        // Generate PDF from HTML string
        return new Promise((resolve, reject) => {
            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });
    } catch (err) {
        console.error('Error generating PDF:', err);
        throw err; // Propagate the error
    }
}

module.exports = { generatePDF };
