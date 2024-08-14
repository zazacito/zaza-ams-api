const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();

const valdApiBaseUrl = "https://prd-euw-api-extforcedecks.valdperformance.com";

// Function to get Auth Token
async function getAuthToken(clientId, clientSecret) {
  try {
    const tokenUrl = `https://security.valdperformance.com/connect/token`;
    const data = qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    });
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await axios.post(tokenUrl, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error retrieving auth token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to retrieve auth token');
  }
}

// Endpoint to retrieve ForceDecks tests
router.post("/forcedecks/tests", async (req, res) => {
  try {
    const { clientId, clientSecret, teamUid, startDate, endDate } = req.body;

    if (!clientId || !clientSecret || !teamUid || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const token = await getAuthToken(clientId, clientSecret);

    const url = `${valdApiBaseUrl}/v2019q3/teams/${teamUid}/tests/detailed/${startDate}/${endDate}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching ForceDecks tests.", error: error.message });
  }
});

router.post("/forcedecks/testDetail", async (req, res) => {
  try {
    const { clientId, clientSecret, teamUid, testId } = req.body;

    if (!clientId || !clientSecret || !teamUid || !testId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const token = await getAuthToken(clientId, clientSecret);

    const url = `${valdApiBaseUrl}/v2019q3/teams/${teamUid}/tests/${testId}/trials`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching ForceDecks test details.", error: error.message });
  }
});

module.exports = router;
