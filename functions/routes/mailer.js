const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure nodemailer
var transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'victor.azalbert@yahoo.fr', // Replace with your email
    pass: 'tztcwchyqqedtmot' // Replace with your email password
  }
});

// Route to send an email
router.post('/sendEmail', async (req, res) => {
  try {
    const { recipient, subject, content } = req.body;

    if (!recipient || !subject || !content) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    // Setup email options
    var mailOptions = {
      from: 'victor.azalbert@yahoo.fr', // Replace with your email
      to: recipient,
      subject: subject,
      text: content
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email.', error: error.toString() });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Email sent successfully!', info: info.response });
      }
    });
  } catch (error) {
    console.error('Error in sendEmail route:', error);
    res.status(500).send('Server error.');
  }
});

module.exports = router;