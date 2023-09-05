const express = require("express");
const functions = require("firebase-functions");
const sdk = require('api')('@catapultconnect/v6#1cqn1tlk0fazjq');


const app = express();
// const port = process.env.PORT || 8000;
// Commented out as the 'port' variable is not used

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});


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


app.post("/catapult/sessiondata", async (req, res) => {
  try {
    const { sessionId, parametersList, source, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.postStats({
      group_by: ['period', 'athlete'],
      parameters: parametersList,
      source: source,
      filters: [{ name: 'activity_id', values: [sessionId], comparison: '=' }]
    })

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session data.", error: error });
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



exports.api = functions.https.onRequest(app);
