const express = require("express");
const functions = require("firebase-functions");
const sdk = require('api')('@catapultconnect/v6#dgos2allogj3z8');
const axios = require('axios');
const cors = require("cors"); // Import the CORS middleware

const app = express();

app.use(express.json());


app.use(cors({
  origin: ["http://localhost:5173", "https://zaza-ams.web.app"],
}));


app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Zazacito API!" });
});


app.post("/catapult/sessions", async (req, res) => {
  try {
    const { startTime, endTime, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getAllActivities({ start_time: startTime, end_time: endTime })

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session raw data.", error: error });
  }
});


app.post("/catapult/sessionperioddata", async (req, res) => {
  try {
    const { sessionId, parameters, apiKey } = req.body;

    axios
      .post(`https://connect-eu.catapultsports.com/api/v6/stats`,
        {
          "group_by": ["period", "athlete"],
          "filters": [
            {
              "name": "activity_id",
              "comparison": "=",
              "values": [sessionId],
            }
          ],
          "parameters": parameters,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        })
      .then((response) => {
        res.json(response.data);
      })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the period session data.', error: error.message });
  }
});

app.post('/catapult/sessionannotationdata', async (req, res) => {
  try {
    const { sessionId, parameters, apiKey } = req.body;

    axios
      .post(`https://connect-eu.catapultsports.com/api/v6/stats`,
        {
          "group_by": ["annotation", "athlete"],
          "filters": [
            {
              "name": "activity_id",
              "comparison": "=",
              "values": [sessionId],
            }
          ],
          "parameters": parameters,
          "source": "annotation_stats"
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        })
      .then((response) => {
        res.json(response.data);
      })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the annotation session data.', error: error.message });
  }
});



app.post("/catapult/sessionrawdata", async (req, res) => {
  try {
    const { sessionId, athleteId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.get10HzDualStreamSensorDataForAthleteInActivity({
      activity_id: sessionId,
      athlete_id: athleteId,
    });

    if (data.length > 0) {
      res.json(data[0].data);
    } else {
      res.status(404).json({ error: "No session data found for the session ID and athlete ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session raw data.", error: error });
  }
});



exports.api = functions.runWith({ timeoutSeconds: 260 }).https.onRequest(app);
