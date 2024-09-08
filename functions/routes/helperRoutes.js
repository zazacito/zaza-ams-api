const express = require('express');
const axios = require('axios');
const router = express.Router();


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
module.exports = router;