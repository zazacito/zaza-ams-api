const express = require('express');
const axios = require('axios');
const router = express.Router();
const crypto = require('crypto');

router.post('/imageFromBlob/toPng', async (req, res) => {
  try {

    const { blobUrl } = req.body;

    if (!blobUrl) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    // Fetch the image from blob storage
    const response = await axios.get(blobUrl, { responseType: 'arraybuffer' });

    // Set the correct content-type for the image
    res.setHeader('Content-Type', 'image/png'); // Change this if it's a different image type

    // Return the image data to the client
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image from blob storage:', error);
    res.status(500).send('Error fetching image');
  }
});

router.post('/imageFromBlob/toBlob', async (req, res) => {
  try {

    const { blobUrl } = req.body;

    if (!blobUrl) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    // Fetch the image from blob storage as binary data
    const response = await axios.get(blobUrl, { responseType: 'arraybuffer' });

    // Set headers to return it as binary data (Blob-like)
    res.setHeader('Content-Type', response.headers['content-type']); // Use the content type from the blob response
    res.setHeader('Content-Disposition', 'inline'); // Use 'attachment' if you want to force download
    res.setHeader('Content-Length', response.data.length); // Optional: set content length

    // Return the image data to the client
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image from blob storage:', error);
    res.status(500).send('Error fetching image');
  }
});



router.post('/fetchJson', async (req, res) => {
  try {
    const { jsonUrl } = req.body;

    if (!jsonUrl) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    // Fetch the JSON file from Azure Blob Storage
    const response = await axios.get(jsonUrl, {
      responseType: 'json' // Ensure the response is treated as JSON
    });

    // Set the correct content-type for the JSON response
    res.setHeader('Content-Type', 'application/json');

    // Return the JSON data to the client
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching JSON from blob storage:', error);

    // Provide more specific error messages
    if (error.response) {
      res.status(error.response.status).send(`Error fetching JSON: ${error.response.statusText}`);
    } else if (error.request) {
      res.status(500).send('No response from blob storage server.');
    } else {
      res.status(500).send('Error setting up request to fetch JSON.');
    }
  }
});


const secret = 'My name is Maximus Decimus Meridius, Commander of the Armies of the North, General of the Felix Legions, loyal servant to the true emperor, Marcus Aurelius. Father to a murdered son, husband to a murdered wife. And I will have my vengeance, in this life or the next.';
// Webhook handler

router.post('/webhook-handler', express.json(), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const body = JSON.stringify(req.body);

  // Verify the signature using the secret key
  const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (signature !== hash) {
    return res.status(401).send('Invalid signature');
  }

  // Extract data from the webhook payload
  const { system, customer, topic, action, trigger } = req.body;

  // Prepare the email content
  const subject = `Activity Updated: ${trigger.id}`;
  const content = `
    <h2>Activity Update Notification</h2>
    <p><strong>Activity ID:</strong> ${trigger.id}</p>
    <p><strong>Customer:</strong> ${customer.name}</p>
    <p><strong>Action:</strong> ${action}</p>
    <p><strong>Updated Fields:</strong> ${trigger.updated.join(', ')}</p>
    <br/>
    <p>This update was triggered by the system:</p>
    <p><strong>Provider:</strong> ${system.provider}</p>
    <p><strong>Service:</strong> ${system.service}</p>
    <p><strong>Host:</strong> ${system.host.name}</p>
  `;

  // Setup email options
  var mailOptions = {
    from: 'victor.azalbert@yahoo.fr',
    to: 'victor.azalbert@yahoo.fr', // Recipients
    subject: subject,
    text: `
      Activity Update Notification:
      - Activity ID: ${trigger.id}
      - Customer: ${customer.name}
      - Action: ${action}
      - Updated Fields: ${trigger.updated.join(', ')}
      This update was triggered by the system:
      - Provider: ${system.provider}
      - Service: ${system.service}
      - Host: ${system.host.name}
    `,
    html: content // HTML version of the email
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Webhook processed and email sent');
  });
});

module.exports = router;